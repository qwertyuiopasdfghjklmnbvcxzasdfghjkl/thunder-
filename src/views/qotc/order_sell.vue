<template>
  <div>
    <div class="mt50 ui-flex ui-flex-justify">
      <span class="grey"><i class="icon_ orderid"></i> {{$t('business.ORDER_NUM')}}<!-- 订单号 -->：{{orderInfo.order_id}}</span>
      <span class="blue" v-tap="{methods:()=>{dialShow = true}}"><i class="icon_ phone"></i> {{$t('qotc.contact_buyer')}}<!-- 联系买家 --></span>
    </div>
    <div class="mt30 bgblock">
      <div class="tc f36"><i class="icon_ status" :class="getStatusIcon"></i> {{orderState.title}}</div>
      <div class="tc f24 grey mt15" v-if="orderState.state==0 || orderState.state==41">
        <template v-if="orderInfo.appeal_state==3"><!-- {{'放置有申述或被申诉，但交易失败的审批原因'}} --></template>
        <span v-else-if="orderInfo.cancelType==1" v-html="$t('qotc.system_cancel_desc').format(`<span class='blue'>${orderInfo.pay_apply_time}</span>`)"><!-- 超出 {0} 分钟未付款，订单已被系统自动取消 --></span>
        <template v-else>{{$t('qotc.order_cancelled_by_merchant')}}<!-- 商家已取消订单 --></template>
      </div>
      <div class="tc f24 grey mt15 lh17" v-if="orderState.state==1">
        <p v-html="$t('qotc.payment_in_progress').format(`<span class='blue'>${surplusTime}</span>`)"><!-- 对方正在付款，剩余 <span class="blue">{{surplusTime}}</span> 分钟 --></p>
        <p>{{$t('qotc.not_pay_to_cancel')}}<!-- 对方在上述时间内超时未付款，系统将自动取消该订单 --></p>
      </div>
      <div class="tc f24 grey mt15 lh17" v-if="orderState.state==2">
        <p>{{$t('qotc.opposite_payment_completed')}}<!-- 对方付款完成 --></p>
        <p v-html="$t('qotc.check_to_release_symbol').format(`<span class='blue'>${surplusTime}</span>`)"><!-- 请务必登录收款账户，并确认收到该笔款项后的 <span class="blue">{{surplusTime}}</span> 分钟内进行放币 --></p>
      </div>
      <div class="tc f24 grey mt15" v-if="orderState.state==21">{{$t('qotc.appeal_wait_tip')}}<!-- 平台方将根据双方提供的资料进行核实，请耐心等待结果。 --></div>
      <div class="tc f24 grey mt15" v-if="orderState.state==22">{{$t('qotc.appealed_by_merchant')}}<!-- 该订单已被商家申诉，请尽快联系买方或平台客服处理 --></div>
      <div class="tc f24 grey mt15" v-if="orderState.state==3" v-html="$t('qotc.success_to_sell').format(`<span class='blue'>${orderInfo.symbol_count}</span>`, orderInfo.symbol)"><!-- 成功卖出了 <span class="blue">{{orderInfo.symbol_count}} </span>{{orderInfo.symbol}} --></div>
      <div class="tc f24 grey mt15" v-if="orderState.state==31"><!-- {{'放置有申述或被申诉，但交易成功的审批原因'}} --></div>
      <div class="price_info ui-flex ui-flex-justify f24 mt40 grey">
        <div>{{$t('public0.public17')}}<!-- 交易金额 -->({{orderInfo.currency}})
          <p class="white f32 tc mt30">{{orderInfo.currency_count|toFixed(2)}}</p>
        </div>
        <div>{{$t('gcox_otc.buy_number')}}<!-- 购买数量 -->({{orderInfo.symbol}})
          <p class="white f32 tc mt30">{{orderInfo.symbol_count}}</p>
        </div>
        <div>{{$t('business.UNIT_PRICE')}}<!-- 单价 -->({{orderInfo.currency}}/{{orderInfo.symbol}})
          <p class="white f32 tc mt30">{{orderInfo.cur_price}}</p>
        </div>
      </div>
      <div class="user_info grey f32">
        <div class="ui-flex ui-flex-justify">
          <span>{{$t('public0.public65')}}<!-- 收款人 --></span>
          <span class="white">{{currentPayInfo.name}}</span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>{{$t('gcox_otc.currency_way')}}<!-- 收款方式 --></span>
          <span class="white">
            <i class="icon_payment" :class="[payTrans[orderInfo.pay_type]]"></i>
            &nbsp;&nbsp;{{currentPayInfo.number}}
          </span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>{{$t('public0.public148')}}<!-- 买家 --></span>
          <span class="white">{{orderInfo.to_real_name}}</span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>{{$t('qotc.order_time')}}<!-- 订单时间 --></span>
          <span class="white">{{orderInfo.created_at}}</span>
        </div>
      </div>

      <div class="ui-flex ui-flex-justify btns" v-if="orderState.state==2">
        <mt-button type="cancel" size="large" :disabled="canAppeal" v-tap="{methods:$root.routeTo, to:'qotcAppeal', params:{orderNumber:orderInfo.order_number}}">{{canAppeal?`${$t('qotc.appeal')}${appealTime}`:$t('qotc.appeal')}}<!-- 申诉 --></mt-button>
        <mt-button type="primary" size="large" class="ml30" v-tap="{methods:()=>{$refs.confirm.openConfirm()}}">{{$t('qotc.release_symbol')}}<!-- 放币 --></mt-button>
      </div>
      <div class="btns" v-if="orderState.state==21">
        <mt-button type="cancel" size="large" disabled>{{$t('qotc.appealed')}}<!-- '已申诉' --></mt-button>
      </div>

      <div class="btns" v-if="orderState.state==3||orderState.state==31">
        <mt-button type="primary" size="large" v-tap="{methods:$root.routeTo, to:'trading', replace:true}">{{$t('usercontent.user58')}}<!-- '我的资产' --></mt-button>
        <p class="grey f24 tc mt25">-{{$t('qotc.check_balance_in_wallet')}}<!-- 请到资产中核对您的资产金额 -->-</p>
      </div>

    </div>
    <Dialog :show="dialShow" :title="$t('qotc.contact_buyer')" :showBtns="false" :showClose="true" :hide="hidedDialDialog"><!-- 联系买家 -->
        <p class="ft-c-default f32 tc">{{$t('qotc.phone_number_to_call').format(sellerPhone)}}<!-- 使用手机号{0}拨打 --></p>
        <p class="ft-c-default f48 mt20 tc">{{orderInfo.toUserMobile}}&nbsp;</p>
        <a class="mint-button mt40 mint-button--primary mint-button--large" style="line-height: 0.9rem;" :href="`tel:${orderInfo.toUserMobile}`">{{$t('qotc.call_right_now')}}<!-- 立即呼叫 --></a>
    </Dialog>

    <!-- 二次确认 -->
    <confirm
      ref="confirm"
      :title="$t('qotc.confirm_release_symbol')"
      :desc="$t('qotc.release_symbol_tip')"
      @callBack="finishOrder"
    ></confirm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import otcApi from '@/api/otc'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import Dialog from '@/components/common/dialog'
import { Toast } from 'mint-ui'
import otcConfig from '@/assets/js/otcconfig'
import confirm from './components/confirm'

export default {
  components: {
    Dialog,
    confirm,
  },
  props: {
    adInfo: {
      type: Object,
      default: {}
    },
    _orderInfo: {
      type: Object,
      default: {}
    },
    serveTime:{
      type: Number
    }
  },
  data(){
    return {
      orderInfo: this._orderInfo,
      fbShow: false,
      dialShow:false,
      payInfo:null,
      canAppeal:false,
      appealTime:'00:00',
      surplusTime: '00:00'
    }
  },
  watch:{
    orderInfo(){
      console.log('orderInfo')
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
    payTrans(){
      let _payTrans = {}
      for(let item of otcConfig.payments){
        _payTrans[item.id] = item.className
      }
      return _payTrans
    },
    sellerPhone(){
      return utils.encryptStr(this.orderInfo.fromUserMobile, 3, 4)
    },
    isAppellant(){ //判断当前用户是否是申述发起者
      return this.getUserInfo.userId==this.orderInfo.applyUserId
    },
    orderState () {
      if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 0) {
        return {
          state: 1,
          title: this.$t('qotc.wait_collection') // 未付款(待收款)
        }
      } else if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 1) {
        if(this.orderInfo.appeal_manage_id){
          if(this.isAppellant){
            return {
              state: 21,
              title: this.$t('qotc.order_in_appeal') // 已付款(订单申诉中)
            }
          } else {
            return {
              state: 22,
              title: this.$t('qotc.order_be_appealed') // 已付款(订单已被申诉)
            }
          }
        } else {
          return {
            state: 2,
            title: this.$t('qotc.to_release_symbol') // 已付款(请放币)
          }
        }

      } else if (this.orderInfo.state === 2) {
        if(this.orderInfo.appeal_state==3){
          return {
            state: 31,
            title: this.isAppellant?this.$t('qotc.appeal_fail_with_symbol'):this.$t('qotc.appealed_success_with_symbol') // 已放币，交易完成(申诉失败，平台已强制放币:被申诉成功，平台已强制放币)
          }
        } else {
          return {
            state: 3,
            title: this.$t('otc_ad.otc_ad_completed') // 已完成(已完成)
          }
        }
      } else {
        if(this.orderInfo.appeal_state==3){
          return {
            state: 41,
            title: this.isAppellant?this.$t('qotc.appeal_success_with_cancel'):this.$t('qotc.appealed_fail_with_cancel') // 申诉成功，订单已取消:被申诉失败，订单已被取消

          }
        } else {
          return {
            state: 0,
            title: this.orderInfo.cancelType==1?this.$t('qotc.canceled_order_by_system'):this.$t('public0.public25') // 订单已被自动取消:已取消
          }
        }
      }
    },
    getStatusIcon(){
      let _icon = 'pending'
      switch(this.orderState.state){
        case 0:
        case 31:
          _icon = 'cancel'
          break
        case 1:
          _icon = 'pending'
          break
        case 2:
          _icon = 'haspay'
          break
        case 21:
          _icon = 'appealing'
          break
        case 22:
          _icon = 'info'
          break
        case 3:
          _icon = 'finished'
          break
        case 41:
          _icon = 'appealSuccess'
          break
      }
      return _icon
    },
    currentPayInfo () {
      if (this.payInfo) {
        switch (this.orderInfo.pay_type) {
          case '1': // 银行卡
            return {
              label: this.$t(this.payTrans[1]), // 银行卡号
              name: this.payInfo.real_name,
              bank: this.payInfo.data.card_bank,
              number: this.payInfo.data.card_number
            }
          case '2': // 支付宝
            return {
              label: this.$t(this.payTrans[2]), // 支付宝账号
              name: this.payInfo.real_name,
              number: this.payInfo.data.alipay_number,
              url: this.payInfo.data.alipay_image_path
            }
          case '3': // 微信
            return {
              label: this.$t(this.payTrans[3]), // 微信账号
              name: this.payInfo.real_name,
              number: this.payInfo.data.wechat_number,
              url: this.payInfo.data.wechat_image_path
            }
          case '4': // paypal
            return {
              label: this.$t(this.payTrans[4]), // PayPal账号
              name: this.payInfo.real_name,
              number: this.payInfo.data.paypal_number
            }
          default:
            return {
              label: null,
              name: null,
              bank: null,
              number: null,
              url: null
            }
        }
      } else {
        return {
          label: null,
          name: null,
          bank: null,
          number: null,
          url: null
        }
      }
    },
  },
  created(){
    this.getAppealTime()
    this.getSurplusTime()
    this.getSellerPayInfo(this.orderInfo.from_user_id)
  },
  methods:{
    getSurplusTime(){
      let interval = utils.countDown(this.orderInfo.surplus_Time, (time) => {
        if (time === '00:00') {
          this.orderInfo.isExpire = true
        }
        this.surplusTime = time
      })
    },
    getAppealTime(){ //缓存付款时间，判断申述按钮2分钟内是否可用
      let _duration = 120000, _time = utils.formatDate(this.orderInfo.updated_at)
      let _diff = this.serveTime - _time
      _diff = (_diff-_duration) >= 0 ? 0 : Math.abs(_diff-_duration)
      if(_diff){
        this.canAppeal = true
      }
      utils.countDown(_diff/1000, (time) => {
        this.appealTime = time
        if (time === '00:00') {
          this.canAppeal = false
        }
      })
    },
    getSellerPayInfo (id) { // 获取卖家支付方式
      otcApi.getPaySettingsNoToken({user_id: id }, (res) => {
        this.payInfo = res
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    cancelOrder () { // 取消订单
      this.ccShow = false
      otcApi.cancelOrder(this.orderInfo.order_id, {
        system_cancel: false
      }, (msg) => {
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        this.$router.replace({name: 'qotc'})
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    finishOrder (data) { // 释放货币
      if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 1) {
        data.id = this.orderInfo.order_id

        otcApi.finishOrder(data, (msg) => {
          this.orderInfo.state = 2
          this.$refs.confirm.closeConfirm()
          // this.fbShow = false
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    },

    hidedDialDialog(){
      this.dialShow = false
    },
  }
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;

.grey {color: @grey;}
.blue {color: @blue;}
.white {color: #fff;}

.orderid {width: 0.22rem; height: 0.25rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_order.png');}
.phone {width: 0.24rem; height: 0.24rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_phone.png');}
.bgblock {background-color: #151C2C; padding: 0.4rem 0.25rem 0.7rem; margin-bottom: 0.3rem;}
.status {
  width: 0.44rem; height: 0.44rem; margin-right: 0.1rem;
  &.pending {background-image: url('../../assets/img/icon_status_pending.png');}
  &.cancel {background-image: url('../../assets/img/icon_status_fail.png');}
  &.haspay {background-image: url('../../assets/img/icon_status_release_token.png');}
  &.finished {background-image: url('../../assets/img/icon_status_finished.png');}
  &.appealing {background-image: url('../../assets/img/icon_status_in.png');}
  &.info {background-image: url('../../assets/img/icon_status_info.png');}
  &.appealSuccess {background-image: url('../../assets/img/icon_status_success_representations.png');}
}
.price_info {padding-top: 0.3rem; padding-bottom: 0.3rem; border-top: 1px solid #1D273C; border-bottom: 1px dashed rgba(12, 106, 201, .8); }
.user_info {
  > div {
    border-bottom: 1px solid #1D273C;
    min-height: 0.95rem;
    line-height: 0.45rem;
    span{
      padding: 0.25rem 0;
      &:first-child{
        padding-right: 0.2rem;
      }
    }
  }
  .icon_ {
    width: 0.3rem; height: 0.3rem; margin-left: 0.15rem;
    &.copy {background-image: url('../../assets/img/icon_copy.png');}
    &.qrcode {background-image: url('../../assets/img/icon_qrcode.png');}
  }
}
.payinfo {
  background-color: #0EB574;
  margin-left: -20px;
  margin-right: -20px;
  .dotmask {
    position: absolute;
    width: 0.36rem;
    height: 0.36rem;
    background-color:#0F141F;
    border-radius: 100%;
    &.left {left: -0.2rem; top: -0.18rem;}
    &.right {right: -0.2rem; top: -0.18rem;}
  }
  .inner {
    border-top: 1px dotted #FFF;
    border-bottom: 1px dotted #FFF;
    padding:0.55rem 0 0.35rem;
    display: flex;
    justify-content: center;
    td {
      line-height: .9;
      &:after {
        display: inline-block;
        width: 100%;
        content: '';
        height: 0;
        line-height: .1;
      }
    }
    td:first-of-type {
      text-align: justify;
    }
  }
}
.action {
  padding: 0.25rem 0 0;
}
.btns {margin-top: 2.5rem;}
.icon_payment {
  width: .4rem;
  height: .4rem;
  margin-right: .2rem;
  &.paypal {
    background-image:url('../../assets/img/icon-paypal-big.png');
  }
  &.alipay {
    background-image:url('../../assets/img/icon-alipay-big.png');
  }
  &.bank {
    background-image:url('../../assets/img/icon-bank-big.png');
  }
  &.wechat {
    background-image:url('../../assets/img/icon-wechat-big.png');
  }
}
.verify_popup{
  width: 100%;
  border-top-left-radius: 0.32rem;
  border-top-right-radius: 0.32rem;
  overflow: hidden;
}
</style>
