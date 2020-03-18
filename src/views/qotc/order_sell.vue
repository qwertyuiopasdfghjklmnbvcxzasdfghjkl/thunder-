<template>
  <div>
    <div class="mt50 ui-flex ui-flex-justify">
      <span class="grey"><i class="icon_ orderid"></i> 订单号：{{orderInfo.order_id}}</span>
      <span class="blue" v-tap="{methods:()=>{dialShow = true}}"><i class="icon_ phone"></i> 联系买家</span>
    </div>
    <div class="mt30 bgblock">
      <div class="tc f36"><i class="icon_ status" :class="getStatusIcon"></i> {{orderState.title}}</div>      
      <div class="tc f24 grey mt15" v-if="orderState.state==0 || orderState.state==41">
        <template v-if="orderInfo.appeal_state==3"><!-- {{'放置有申述或被申诉，但交易失败的审批原因'}} --></template>
        <template v-else-if="orderInfo.cancelType==1">超出 <span class="blue">{{orderInfo.pay_apply_time}}</span> 分钟未付款，订单已被系统自动取消</template>
        <template v-else>商家已取消订单</template>
      </div>
      <div class="tc f24 grey mt15 lh17" v-if="orderState.state==1">
        <p>对方正在付款，剩余 <span class="blue">{{surplusTime}}</span> 分钟</p>
        <p>对方在上述时间内超时未付款，系统将自动取消该订单</p>
      </div>
      <div class="tc f24 grey mt15 lh17" v-if="orderState.state==2">
        <p>对方付款完成</p>
        <p>请务必登录收款账户，并确认收到该笔款项后的 <span class="blue">{{surplusTime}}</span> 分钟内进行放币</p>
      </div>
      <div class="tc f24 grey mt15" v-if="orderState.state==21">平台方将根据双方提供的资料进行核实，请耐心等待结果。</div>
      <div class="tc f24 grey mt15" v-if="orderState.state==22">该订单已被商家申诉，请尽快联系买方或平台客服处理</div>
      <div class="tc f24 grey mt15" v-if="orderState.state==3">成功卖出了 <span class="blue">{{orderInfo.symbol_count}} </span>{{orderInfo.symbol}}</div>
      <div class="tc f24 grey mt15" v-if="orderState.state==31"><!-- {{'放置有申述或被申诉，但交易成功的审批原因'}} --></div>
      <div class="price_info ui-flex ui-flex-justify f24 mt40 grey">
        <div>交易金额({{orderInfo.currency}})
          <p class="white f32 tc mt30">{{orderInfo.currency_count}}</p>
        </div>
        <div>购买数量({{orderInfo.symbol}})
          <p class="white f32 tc mt30">{{orderInfo.symbol_count}}</p>
        </div>
        <div>单价({{orderInfo.currency}}/{{orderInfo.symbol}})
          <p class="white f32 tc mt30">{{orderInfo.cur_price}}</p>
        </div>
      </div>
      <div class="user_info grey f32">
        <div class="ui-flex ui-flex-justify">
          <span>收款方式</span>
          <span class="white">
            <i class="icon_payment" :class="[payTrans[orderInfo.pay_type]]"></i>
            {{currentPayInfo.name}}
            &nbsp;&nbsp;{{currentPayInfo.number}}
          </span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>买家</span>
          <span class="white">{{orderInfo.to_real_name}}</span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>订单时间</span>
          <span class="white">{{orderInfo.created_at}}</span>
        </div>
      </div>

      <div class="ui-flex ui-flex-justify btns" v-if="orderState.state==2">
        <mt-button type="cancel" size="large" :disabled="canAppeal" v-tap="{methods:$root.routeTo, to:'qotcAppeal', params:{orderNumber:orderInfo.order_number}}">{{canAppeal?'申诉{0}'.format(appealTime):'申诉'}}</mt-button>
        <mt-button type="primary" size="large" class="ml30" v-tap="{methods:()=>{fbShow = true}}">放币</mt-button>
      </div>
      <div class="btns" v-if="orderState.state==21">
        <mt-button type="cancel" size="large" disabled>{{'已申诉'}}</mt-button>
      </div>

      <div class="btns" v-if="orderState.state==3||orderState.state==31">
        <mt-button type="primary" size="large" v-tap="{methods:$root.routeTo, to:'trading', replace:true}">{{'我的资产'}}</mt-button>
        <p class="grey f24 tc mt25">-请到资产中核对您的资产金额-</p>
      </div>

    </div>
    <Dialog :show="dialShow" :title="$t('联系买家')" :showBtns="false" :showClose="true" :hide="hidedDialDialog">
        <p class="ft-c-default f32 tc">{{'使用手机号{0}拨打'.format(sellerPhone)}}</p>
        <p class="ft-c-default f48 mt20 tc">{{orderInfo.toUserMobile}}&nbsp;</p>
        <a class="mint-button mt40 mint-button--primary mint-button--large" style="line-height: 0.9rem;" :href="`tel:${orderInfo.toUserMobile}`" v-tap="{methods:hidedDialDialog}">立即呼叫</a>
    </Dialog>
    <mt-popup class="verify_popup" v-model="fbShow" position="bottom">
      <vertify ref="vertify" :params="params" :mobileState="getUserInfo.mobileAuthEnable" :googleState="getUserInfo.googleAuthEnable" @removeDialog="hideFBDialog" @okCallback="finishOrder"></vertify>
    </mt-popup>
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
import vertify from './vertify'



export default {
  components: {
    Dialog,
    vertify,
  },
  props: {
    adInfo: {
      type: Object,
      default: {}
    },
    orderInfo: {
      type: Object,
      default: {}
    },
    serveTime:{
      type: Number
    }
  },
  data(){
    return {
      fbShow:false,
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
    params () {
      return {
        title:'放币确认',
        desc:'请务必登录网上银行或第三方支付账号，确认收到该笔款项后，再进行放币。',
        phoneNumber: this.getUserInfo.mobile,
        countryCode: this.getUserInfo.countryCode || '+86',
        email: this.getUserInfo.email || this.getUserInfo.username
      }
    },
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
          title: this.$t('待收款') // 未付款(待收款)
        }
      } else if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 1) {
        if(this.orderInfo.appeal_manage_id){
          if(this.isAppellant){
            return {
              state: 21,
              title: this.$t('订单申诉中') // 已付款(订单申诉中)
            }
          } else {
            return {
              state: 22,
              title: this.$t('订单已被申诉') // 已付款(订单已被申诉)
            }
          }
        } else {
          return {
            state: 2,
            title: this.$t('请放币') // 已付款(请放币)
          }
        }
        
      } else if (this.orderInfo.state === 2) {
        if(this.orderInfo.appeal_state==3){
          return {
            state: 31,
            title: this.isAppellant?this.$t('申诉失败，平台已强制放币'):this.$t('被申诉成功，平台已强制放币') // 已放币，交易完成(申诉失败，平台已强制放币:被申诉成功，平台已强制放币)
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
            title: this.isAppellant?this.$t('申诉成功，订单已取消'):this.$t('被申诉失败，订单已被取消') // 申诉成功，订单已取消:被申诉失败，订单已被取消

          }
        } else {
          return {
            state: 0,
            title: this.orderInfo.cancelType==1?this.$t('订单已被自动取消'):this.$t('已取消') // 订单已被自动取消:已取消
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
          this.fbShow = false
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    },
    hideFBDialog(){
      this.fbShow = false
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
    height: 0.95rem;
    line-height: 0.95rem;
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
