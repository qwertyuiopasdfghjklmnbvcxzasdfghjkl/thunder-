<!--我的当前订单-->
<template>
    <div class="page">
        <cp-top-back>
        </cp-top-back>

        <div class="box">
            <div class="inner">
                <section class="coin_content">
                    <div class="item">
                        <div class="inner">
                            <ul class="list">
                                <li class="font-size-30">
                                    <section>
                                        <span :class="[isBuyer ? 'green_color' : 'red_color']">{{isBuyer ? $t('otc_exchange.otc_exchange_buy') : $t('otc_exchange.otc_exchange_sell')}} {{orderInfo.symbol}}<!--购买||出售--></span>
                                    </section>
                                    <section></section>
                                    <section class="right">
                                        <span :class="['green_color']">{{orderState.title}}</span>
                                    </section>
                                </li>
                                <li>
                                    <section>
                                        <span>{{$t('otc_exchange.otc_exchange_ask')}}：<!--单价--></span>
                                        <span class="gray-color">{{orderInfo.cur_price}} {{orderInfo.currency}}</span>
                                        <span></span>
                                    </section>
                                    <section>{{$t('otc_ad.otc_ad_payment_amount')}}<!--付款金额--></section>
                                </li>
                                <li>
                                    <section>
                                        <span>{{$t('exchange.exchange_amount')}}：<!--数量--></span>
                                        <span class="gray-color">{{orderInfo.symbol_count}} {{orderInfo.symbol}}</span>
                                    </section>
                                    <section class="font-size-32 white-color">{{orderInfo.total_price}} {{orderInfo.currency}}</section>
                                </li>
                                <li>
                                    <section>
                                        <section>
                                            <span>{{$t('exchange.exchange_date')}}：<!--时间--></span>
                                            <span class="gray-color">{{orderInfo.created_at}}</span>
                                        </section>
                                    </section>
                                    <section>
                                    </section>
                                </li>
                                <li>
                                    <section>
                                        <section>
                                            <span>{{$t('otc_exchange.otc_exchange_order_number')}}：<!--订单编号--></span>
                                            <span class="gray-color">{{orderInfo.order_number}}</span>
                                        </section>
                                    </section>
                                    <section>
                                    </section>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
                <section class="coin_content">
                    <div class="item">
                        <div class="inner">
                            <my-component :is="getPayTemplate" :adPayment="adPayment" :orderInfo="orderInfo" :userInfo="getUserInfo" @changePaymentType="changePaymentType"></my-component>
                        </div>
                    </div>
                </section>
                <section class="coin_content">
                    <div class="item" v-if="orderInfo.state === 1">
                        <div class="inner">
                            <p class="state-group">
                                <span class="time fl" v-if="orderInfo.pay_state === 0">{{orderInfo.surplus_Time}}</span>
                                <span class="state fr">{{orderInfo.pay_state === 0 ? $t('public0.public150') : $t('public0.public145')}}<!--等待付款||等待放币--></span>
                            </p>
                        </div>
                    </div>
                    <div class="item">
                        <div class="inner">
                            <p class="button-group">
                                <span class="cancelOrder fl" v-if="orderInfo.pay_state === 0 && orderInfo.from_user_name !== getUserInfo.username" @click="cancelOrder">{{$t('otc_ad.otc_ad_cancel_order')}}<!--取消订单--></span>
                                <template v-if="orderInfo.pay_state === 1">
                                    <span class="appeal fl" v-if="orderInfo.appeal_state !== 0" @click="goAppealPage">{{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉--></span>
                                    <span class="cancelAppeal fl" v-if="orderInfo.appeal_state === 0" @click="cancelApeal(orderInfo.appeal_manage_id)">{{$t('public0.public208')}}<!--取消申诉--></span>
                                </template>
                                <template v-if="orderInfo.state === 1">
                                    <span class="paid fr" :class="{disabled: orderInfo.pay_state === 1}" v-if="orderInfo.from_user_name !== getUserInfo.username" @click="payFinish">{{$t('public0.public154')}}<!--已支付--></span>
                                    <span class="release fr" :class="{disabled: orderInfo.pay_state === 0}" v-if="orderInfo.from_user_name === getUserInfo.username" @click="finishOrder">{{$t('otc_ad.otc_ad_prompt8')}}<!--释放货币--></span>
                                </template>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox, Indicator } from 'mint-ui'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import otcApi from '@/api/otc'
import buyer from '@/pages/otc/orderdetail/buyer'
import seller from '@/pages/otc/orderdetail/seller'
export default {
  name: 'otc-orderdetail',
  data () {
    return {
      prop: {
        orderId: this.$route.params.orderId || null
      },
      adPayment: null,
      orderInfo: {},
      currentPayment: null
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo']),
    isBuyer () {
      return this.orderInfo.to_user_name === this.getUserInfo.username
    },
    getPayTemplate () {
      return this.isBuyer ? buyer : seller
    },
    orderState () {
      if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 0) {
        return {
          state: 1,
          title: this.$t('public0.public152') // 未付款(待付款)
        }
      } else if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 1) {
        return {
          state: 2,
          title: this.$t('public0.public154') // 已付款(已支付)
        }
      } else if (this.orderInfo.state === 2) {
        return {
          state: 3,
          title: this.$t('otc_ad.otc_ad_completed') // 已放币，交易完成(已完成)
        }
      } else {
        return {
          state: 0,
          title: this.$t('public0.public25') // 已取消
        }
      }
    }
  },
  created () {
    this.getOrderDetail()
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy () {
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent']),
    getOrderDetail () { // 获取订单详情
      Indicator.open()
      otcApi.ordersDetail(this.prop.orderId, (data) => {
        this.adPayment = data.adInfo.pay_type
        let orderInfo = data.orderInfo || {}
        orderInfo.total_price = utils.removeEndZero(numUtils.BN(orderInfo.currency_count).toFixed(2)).toMoney()
        orderInfo.cur_price = utils.removeEndZero(numUtils.BN(orderInfo.cur_price).toFixed(2)).toMoney()
        orderInfo.symbol_count = utils.removeEndZero(numUtils.BN(orderInfo.symbol_count).toFixed(8)).toMoney()
        orderInfo.surplus_Time = '00:00'
        let date = utils.formatDate(orderInfo.apply_time).getTime()
        let ndate = utils.formatDate(data.cur_time).getTime()
        let diffTime = Math.floor((ndate - date) / 1000)
        let surplusTime = orderInfo.pay_apply_time * 60 - diffTime
        let interval = utils.countDown(surplusTime, (time) => {
          if (time === '00:00') {
            orderInfo.isExpire = true
          } else if (time === '05:00' && orderInfo.to_user_name === this.getUserInfo.username && orderInfo.pay_state === 0) {
            // 您的付款确认时间还剩5分钟，5分钟后系统将自动取消订单！请付款并标记确认付款！
            // 添加系统消息
            this.$emit('addSystemMessage', orderInfo.order_number, 'PAYMENT_TIMEOUT_REMIND')
          }
          orderInfo.surplus_Time = time
        })
        orderInfo.isExpire = surplusTime <= 0
        this.orderInfo = orderInfo
        this.currentPayment = this.adPayment.split(',')[0]
        Indicator.close()
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        this.$router.go(-1)
      })
    },
    changePaymentType (type) {
      this.currentPayment = type
    },
    payFinish () { // 确认支付
      if (this.orderInfo.pay_state === 0) {
        otcApi.payFinish(this.orderInfo.order_id, {
          pay_type: this.currentPayment
        }, (msg) => {
          this.orderInfo.pay_state = 1
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    },
    finishOrder (item) { // 释放货币
      if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 1) {
        MessageBox({
          title: this.$t('public0.public242'),
          message: this.$t('error_code.RELEASE_CURRENCY_WARN') + '<br>' + this.$t('error_code.RELEASE_CURRENCY_CONFIRM'),
          confirmButtonText: this.$t('otc_legal.otc_legal_confirm'),
          showCancelButton: true,
          cancelButtonText: this.$t('otc_legal.otc_legal_cancel')
        }).then(action => {
          if (action === 'confirm') {
            otcApi.finishOrder(this.orderInfo.order_id, (msg) => {
              this.orderInfo.state = 2
              Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
            }, (msg) => {
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            })
          }
        })
      }
    },
    cancelOrder () { // 取消订单
      MessageBox({
        title: this.$t('public0.public242'),
        message: this.$t('error_code.CANCEL_ORDER_CONFIRM'), // 您正在取消交易订单，如果24小时内取消3笔，将被禁止OTC交易24小时！是否继续取消？
        confirmButtonText: this.$t('otc_legal.otc_legal_confirm'),
        showCancelButton: true,
        cancelButtonText: this.$t('otc_legal.otc_legal_cancel')
      }).then(action => {
        if (action === 'confirm') {
          otcApi.cancelOrder(this.prop.orderId, {
            system_cancel: false
          }, (msg) => {
            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
            this.$router.push({name: 'page-otc'})
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        }
      })
    },
    goAppealPage () { // 前往申诉页面
      this.$router.push({name: 'otc-appeal', params: {orderNumber: this.orderInfo.order_number}})
    },
    cancelApeal (appealManageId) { // 取消申诉
      otcApi.cancelAppeal(appealManageId, (msg) => {
        this.orderInfo.appeal_state = 2
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    systemEvent (data) {
      let optType = parseInt(data.operate_type)
      let childType = parseInt(data.child_type)
      if (optType === 1) { // 系统消息
        switch (childType) {
          case 31: // 新建订单消息
          case 32: // 取消订单消息
          case 33: // 系统自动取消订单消息
          case 34: // 买家付款消息
          case 35: // 正常放币消息
          case 36: // 强制放币买家消息
          case 37: // 强制放币卖家消息
          case 38: // 解除锁币消息
            let orderNumber = JSON.parse(data.link).order_number
            if (childType === 34) {
              if (orderNumber === this.orderInfo.order_number) {
                this.getOrderDetail()
              }
              // 买方已经标记确认付款，请查收！
              MessageBox.alert(this.$t('error_code.CONFIRM_PAYMENT')).then((action) => {}, (cancel) => {})
            } else if (childType === 35) {
              if (orderNumber === this.orderInfo.order_number) {
                this.orderInfo.state = 2
              }
              // 卖家已确认收款，并释放代币，请注意查收！
              MessageBox.alert(this.$t('error_code.SELLER_RELEASE_CURRENCY_WARN')).then((action) => {
                this.orderInfo.pay_state = 1
              }, (cancel) => {})
            }
            break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .box{background-color:#161f2f;font-size:0.3rem;height:calc(100% - 8rem);overflow:auto;}
  .box > .inner{padding:0.3rem;color:#8089a3;}
  .coin_content{font-size:0.24rem;overflow: auto;}
  .coin_content /deep/ .green_color{color:#00CC99;}
  .coin_content /deep/ .red_color{color:#E76D42;}
  .coin_content /deep/ .blue_color{color:#0072fd;}
  .coin_content /deep/ section{display:flex;align-items:center;}
  .coin_content /deep/ section.flex-column{flex-direction:column;align-items:flex-start;}
  .coin_content /deep/ .flex-all-center{align-items:center;justify-content:center;}
  .coin_content /deep/ ul{padding:0.2rem;background-color:#0c151d;border-radius:4px;box-shadow:0px 3px 30px 0px rgba(14, 14, 14, 0.35);}
  .coin_content /deep/ li{display:flex;justify-content:space-between;}
  .coin_content /deep/ ul.list li{margin-top: .1rem;}
  .coin_content /deep/ ul.list li:first-of-type{margin-top: 0;}
  .coin_content /deep/ li span{line-height:0.4rem;}
  .coin_content /deep/ li i{height:0.4rem;}
  .coin_content /deep/ .font-size-20{font-size:0.2rem;}
  .coin_content /deep/ .font-size-30{font-size:0.3rem;}
  .coin_content /deep/ .font-size-32{font-size:0.32rem;}
  .coin_content /deep/ .margin-top-29{margin-top:0.29rem;}
  .coin_content /deep/ .margin-top-30{margin-top:0.3rem;}
  .coin_content /deep/ .margin-top-37{margin-top:0.37rem;}
  .coin_content /deep/ .margin-top-20{margin-top:0.2rem;}
  .coin_content /deep/ .margin-bottom-20{margin-bottom:0.2rem;}
  .coin_content /deep/ .padding-top-0{padding-top:0;}
  .coin_content /deep/ .padding-bottom-0{padding-bottom:0;}
  .coin_content /deep/ .padding-lr-14{padding:0 0.14rem;}
  .coin_content /deep/ .white-color{color:#ffffff;}
  .coin_content /deep/ .gray-color{color:#cbd4ec;}
  .coin_content /deep/ .item{position:relative;}
  .coin_content /deep/ .header{height:0.8rem;line-height:0.8rem;}
  .coin_content /deep/ .header-line::after{content:"";width:100%;height:2px;background-color:#0d0d0d;position:absolute;left:0;top:.8rem;}
  .coin_content /deep/ .message-icon{display:flex;width:0.44rem;height:0.40rem;background:url(../../assets/img/message-icon.png) no-repeat center;background-size:100%;}
  .coin_content /deep/ .right{display:flex;align-items:center;}
  .coin_content /deep/ .pay-icon{display:inline-block;width:0.28rem;height:0.28rem;margin-right:0.2rem;background: none no-repeat center center / contain}
  .coin_content /deep/ .icon-bank{background-image:url('../../assets/img/icon-bank.png');}
  .coin_content /deep/ .icon-wechat{background-image:url('../../assets/img/icon-wechat.png');}
  .coin_content /deep/ .icon-alipay{color: #409CF2;vertical-align: middle;}
  .coin_content /deep/ .icon-paypal{background-image:url('../../assets/img/icon-paypal.png');}
  .coin_content /deep/ .qrcode-image{width:2.36rem;height:2.36rem;}
  .coin_content /deep/ .payment-wrap{position: relative;}
  .coin_content /deep/ .payment-wrap a{position: relative;z-index: 1;margin-right: .48rem;background-color: #0c151d;pointer-events: none;}
  .coin_content /deep/ .payment-wrap select{position: absolute;top: auto;left: auto;width: 100%;}
  .coin_content .item{margin-top: .3rem;}
  .coin_content:first-of-type .item{margin-top: 0;}
  .coin_content .item .inner p{overflow: auto;}
  .coin_content /deep/ .payment-wrap a{position: relative;z-index: 1;margin-right: .48rem;background-color: #0c151d;pointer-events: none;}
  .coin_content /deep/ .payment-wrap a{position: relative;z-index: 1;margin-right: .48rem;background-color: #0c151d;pointer-events: none;}
  .coin_content /deep/ .payment-wrap a{position: relative;z-index: 1;margin-right: .48rem;background-color: #0c151d;pointer-events: none;}
  .coin_content /deep/ .payment-wrap a{position: relative;z-index: 1;margin-right: .48rem;background-color: #0c151d;pointer-events: none;}
  .coin_content .item .inner p.state-group{padding-left: .2rem;padding-right: .2rem;background-color: #;border-radius: 4px;}
  .coin_content .item .inner p.state-group span{height: .6rem;line-height: .6rem;color: #0072fd;}
  .coin_content .item .inner p.button-group span{width: 45%;height: .6rem;padding-left: .2rem;padding-right: .2rem;font-size: .3rem;line-height: .6rem;text-align: center;white-space: nowrap;text-overflow: ellipsis;border-radius: 4px;overflow: hidden;}
  .coin_content .item .inner p.button-group span.fl{color: #0072fd;border: 1px solid #0072fd;}
  .coin_content .item .inner p.button-group span.fr{color: #fff;background-color: #0072fd;}
  .coin_content .item .inner p.button-group span.disabled{background-color: #999;cursor: pointer;}
  .cancel{width:1.88rem;font-size:0.3rem;color:#409CF2;}
  .appeal{width:1.88rem;font-size:0.3rem;color:#409CF2;}
  .sure{width:4.12rem;background-color:#409CF2;color:#fff;}
  .disabled{background-color:#8089A3;border-color:#8089A3 !important;}
  .sure span{display:flex;height:100%;align-items:center;}
  .sure span:first-child{font-size:0.36rem;}
  .sure span:last-child{font-size:0.24rem;}
  .sure.width100{width:100%;}
</style>
