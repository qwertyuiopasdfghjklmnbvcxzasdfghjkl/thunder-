<template>
  <div>
    <p class="grey mt20">{{$t('qotc.order_title_tip').format($t(payTrans[orderInfo.pay_type]))}}</p>
    <div class="mt50 ui-flex ui-flex-justify">
      <span class="grey"><i class="icon_ orderid"></i> {{$t('business.ORDER_NUM')}}<!-- 订单号 -->：{{orderInfo.order_id}}</span>
      <span class="blue" v-tap="{methods:()=>{dialShow = true}}"><i class="icon_ phone"></i> {{$t('qotc.contact_seller')}}<!-- 联系卖家 --></span>
    </div>
    <div class="mt30 bgblock">
      <div class="tc f36"><i class="icon_ status" :class="getStatusIcon"></i> {{orderState.title}}</div>
      <div class="tc f24 grey mt15" v-if="orderState.state==0">
        <template v-if="orderInfo.appeal_state==3"><!-- {{'放置有申述或被申诉，但交易失败的审批原因'}} --></template>
        <span v-else-if="orderInfo.cancelType==1" v-html="$t('qotc.system_cancel_desc').format(`<span class='blue'>${orderInfo.pay_apply_time}</span>`)"><!-- 超出 {0} 分钟未付款，订单已被系统自动取消 --></span>
        <template v-else>{{$t('qotc.no_pay_tip')}}<!-- 订单已取消，请勿再次付款 --></template>
      </div>
      <div class="tc f24 grey mt15" v-if="orderState.state==1" v-html="$t('qotc.pay_limit_tip').format(`<span class='blue'>${surplusTime}</span>`)"><!-- 请于 <span class="blue">{{surplusTime}}</span> 分钟内付款给卖家 --></div>
      <div class="tc f24 grey mt15" v-if="orderState.state==2" v-html="$t('qotc.release_limit_tip').format(`<span class='blue'>${surplusTime}</span>`)"><!-- 卖家将于 <span class="blue">{{surplusTime}}</span>  分钟内完成放币 --></div>
      <div class="tc f24 grey mt15" v-if="orderState.state==21">{{$t('qotc.appeal_wait_tip')}}<!-- 平台方将根据双方提供的资料进行核实，请耐心等待结果。 --></div>
      <div class="tc f24 grey mt15" v-if="orderState.state==22">{{$t('qotc.appealed_tip')}}<!-- 该订单已被商家申诉，请尽快联系卖方或平台客服处理 --></div>
      <div class="tc f24 grey mt15" v-if="orderState.state==3" v-html="$t('qotc.released_tip').format(`<span class='blue'>${orderInfo.symbol_count}</span>`, orderInfo.symbol)"><!-- 卖家已放币，成功购买了 <span class="blue">{{orderInfo.symbol_count}} </span>{{orderInfo.symbol}} --></div>
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

      <!-- 广告收款方式 -->
      <div class="user_info grey f32" v-if="orderInfo.cancelType!=2">
        <div class="ui-flex ui-flex-justify">
          <span>
            <i class="icon_ icon-left i_bank" v-if="(currentPayType[0].type||'').indexOf('1') !== -1"></i>
            <i class="icon_ icon-left i_alipay" v-if="(currentPayType[0].type||'').indexOf('2') !== -1"></i>
            <i class="icon_ icon-left i_wechat" v-if="(currentPayType[0].type||'').indexOf('3') !== -1"></i>
            <i class="icon_ icon-left i_paypal" v-if="(currentPayType[0].type||'').indexOf('4') !== -1"></i>

            {{currentPayType[0].title}}
          </span>
          <span v-tap="{methods: handleSelectTypeClick}">
            <span v-if="!currentPayType[0].type">{{$t('otc_exchange.otc_exchange_Payment_Method')}}</span>
            <i class="icon_ icon-right"></i>
          </span>

        </div>
        <div class="ui-flex ui-flex-justify">
          <span>{{$t('user.name')}}<!-- 姓名 --></span>

          <span class="white">{{getRealName}} <i class="icon_ copy"
            v-clipboard:copy="getRealName"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"></i></span>
        </div>

        <template v-for="(item, index) of currentPayType" v-if="pay_type.includes(item.type)">
          <div class="ui-flex ui-flex-justify">
            <span>{{item.label}}</span>
            <span class="white">{{item.number}} <i class="icon_ copy"
              v-clipboard:copy="item.number"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"></i></span>
          </div>

           <!-- 开户行 -->
          <div class="ui-flex ui-flex-justify" v-if="pay_type.includes(item.type) && item.type === '1'">
            <span>{{$t('otc_legal.otc_legal_Bank')}}</span>
            <span class="white">{{item.bank}}</span>
          </div>

          <!-- 收款二维码 -->
          <div class="ui-flex ui-flex-justify" v-if="pay_type.includes(item.type) && ['2', '3'].includes(item.type)">
            <span>{{$t('qotc.collection_qrcode')}}</span>
            <span class="white"><i class="icon_ qrcode" v-tap="{methods: handleClickQRCode, index: index}"></i></span>
          </div>
        </template>

        <!-- 收款二维码 -->
       <!--  <div class="ui-flex ui-flex-justify" v-if="pay_type.includes('2') || pay_type.includes('3')">
          <span>{{$t('qotc.collection_qrcode')}}</span>
          <span class="white"><i class="icon_ qrcode" v-tap="{methods:()=>{qrShow = true}}"></i></span>
        </div> -->

        <div class="ui-flex ui-flex-justify">
          <span>{{$t('usercontent.user90')}}<!-- 备注 --></span>
          <span class="white">{{$t('qotc.pay_note_tip')}}<!-- 转账时请勿备注任何信息 --></span>
        </div>
      </div>

      <div class="ui-flex ui-flex-justify btns" v-if="orderState.state==1">
        <mt-button type="cancel" size="large" v-tap="{methods:()=>{ccShow = true}}">{{$t('qotc.cancel_order')}}<!-- 取消交易 --></mt-button>
        <mt-button type="primary" size="large" class="ml30" v-tap="{methods:()=>{zfShow = true}}">{{$t('public0.public154')}}<!-- 已付款 --></mt-button>
      </div>

      <div class="btns" v-if="orderState.state==2">
        <mt-button type="cancel" size="large" class="blue" :disabled="canAppeal" v-tap="{methods:$root.routeTo, to:'qotcAppeal', params:{orderNumber:orderInfo.order_number}}">{{canAppeal?$t('qotc.problem_to_appeal').format(appealTime):$t('otc_exchange.otc_exchange_complaint')}}<!--（遇到问题)${0}后发起申诉 || 发起申诉--></mt-button>
      </div>
      <div class="btns" v-if="orderState.state==21">
        <mt-button type="cancel" size="large" disabled>{{$t('qotc.appealed')}}<!-- '已申诉' --></mt-button>
      </div>

      <div class="btns" v-if="orderState.state==3||orderState.state==31">
        <mt-button type="primary" size="large" v-tap="{methods:$root.routeTo, to:'trading', replace:true}">{{$t('usercontent.user58')}}<!-- 我的资产 --></mt-button>
        <p class="grey f24 tc mt25">- {{$t('qotc.to_view_balance_tip')}}<!-- 请到资产中查看到账的数字货币 --> -</p>
      </div>

      <div class="btns" v-if="orderState.state==0 && orderInfo.cancelType==2">
        <mt-button type="primary" size="large" v-tap="{methods:$root.routeTo, to:'qotc', replace:true}">{{$t('qotc.re_order')}}<!-- 重新下单 --></mt-button>
      </div>

    </div>
    <Dialog :show="qrShow" :title="$t('qotc.collection_qrcode')" :hide="hideQRDialog" :showCancel="false" :submit="hideQRDialog"><!-- 收款二维码 -->
        <div class="tc"><img :src="QRcodeUrl"></div>
        <p class="ft-c-note mt25 f28 tc">{{$t('qotc.press_to_save_qrcode')}}<!-- 长按二维码保存到手机 --></p>
    </Dialog>
    <Dialog :show="ccShow" :title="$t('qotc.confirm_order_cancel')" :cancelText="$t('qotc.think_again')" :hide="hideCCDialog" :submit="cancelOrder"> <!-- 确认取消订单;我再想想 -->
        <p class="ft-c-default f32">{{$t('qotc.cancel_order_tip1')}}<!-- 取消订单后不会退款，如您已付款，请勿取消订单！ --></p>
        <p class="ft-c-red f28 mt40">{{$t('qotc.cancel_order_tip2')}}<!-- 提示：每天累计取消3次，当天无法再使用极速购买功能。 --></p>
    </Dialog>
    <Dialog :show="zfShow" :title="$t('qotc.confirm_payment_order')" :cancelText="$t('qotc.not_yet_paid')" :showClose="true" :showBtns="false" :hide="hideZFDialog"><!-- 确认支付订单;还未付款 -->
        <div class="ft-c-default f32 tc lh17">{{$t('qotc.payment_confirm_tip1')}}<!-- 请确认您已经向卖家付款，无需备注任何信息! --></div>
        <div class="ft-c-note f24 mt25 tc">{{$t('qotc.payment_confirm_tip2')}}<!-- 提示：恶意点击将冻结你的账户 --></div>
        <div class="payinfo rp mt40">
          <i class="dotmask left"></i><i class="dotmask right"></i>
          <div class="inner">
            <table>
              <tr>
                <td>{{$t('qotc.payment_amount')}}<!-- 支付金额 --></td><td>： <strong class="f40 bold">{{orderInfo.currency_count}} {{orderInfo.currency}}</strong></td>
              </tr>
              <tr>
                <td>{{$t('user.name')}}<!-- 姓名 --></td><td>： {{getRealName}}</td>
              </tr>
              <tr>
                <td>{{currentPayType[0].label}}</td><td>： {{currentPayType[0].number}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="action ui-flex ui-flex-justify">
          <mt-button type="grey" size="large" v-tap="{methods:hideZFDialog}">{{$t('qotc.not_yet_paid')}}<!-- 还未付款 --></mt-button>
          <mt-button type="primary" size="large" class="ml30" v-tap="{methods:payFinish}">{{$t('otc_ad.otc_ad_confirm')}}<!-- 确认 --></mt-button>
        </div>
    </Dialog>
    <Dialog :show="dialShow" :title="$t('qotc.contact_seller')" :showBtns="false" :showClose="true" :hide="hidedDialDialog"><!-- 联系卖家 -->
        <p class="ft-c-default f32 tc">{{$t('qotc.phone_number_to_call').format(buyerPhone)}}<!-- 使用手机号{0}拨打 --></p>
        <p class="ft-c-default f48 mt20 tc">{{orderInfo.fromUserMobile}}&nbsp;</p>
        <a class="mint-button mt40 mint-button--primary mint-button--large" style="line-height: 0.9rem;" :href="`tel:${orderInfo.fromUserMobile}`">{{$t('qotc.call_right_now')}}<!-- 立即呼叫 --></a>
    </Dialog>

    <!-- payList所有收款方式，payType 广告收款方式   -->
    <pay-type
      ref="payType"
      :payType="pay_type"
      :payList="currentPayInfo"
      @hidePay="hidePay"
    />
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
import PayType from "./components/pay_type.vue"

export default {
  components: {
    Dialog,
    PayType
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
    pay_type: {
      type: Array,
      default: []
    }
  },
  data(){
    return {
      payTypeShow: true,
      qrShow:false,
      ccShow:false,
      zfShow:false,
      dialShow:false,
      payInfo: null,
      canAppeal:false,
      appealTime:'00:00',
      surplusTime: '00:00',
      interval:null,
      payList: [],
      QRcodeUrl: '',
      currentPayType: [{}]
    }
  },
  watch:{
    // orderInfo(){
    //   console.log('orderInfo', this.orderInfo)
    // },
    // currentPayType: {
    //   immediate: true,
    //   handler: function() {
    //     console.log('this.currentPayType' ,this.currentPayType)
    //   }
    // }
  },
  mounted() {
  },
  computed:{
    ...mapGetters(['getUserInfo']),
    getRealName() {
      return this.payInfo && this.payInfo.real_name
    },
    payTrans(){
      let _payTrans = {}
      for(let item of otcConfig.payments){
        _payTrans[item.id] = item.key
      }
      return _payTrans
    },
    buyerPhone(){
      return utils.encryptStr(this.orderInfo.toUserMobile, 3, 4)
    },
    isAppellant(){ //判断当前用户是否是申述发起者
      return this.getUserInfo.userId==this.orderInfo.applyUserId
    },
    orderState () {
      if (this.orderInfo.state === 1 && this.orderInfo.pay_state === 0) {
        return {
          state: 1,
          title: this.$t('public0.public152') // 未付款(待付款)
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
            title: this.$t('qotc.wait_collect_symbol') // 已付款(待收币)
          }
        }

      } else if (this.orderInfo.state === 2) {
        if(this.orderInfo.appeal_state==3){
          return {
            state: 31,
            title: this.isAppellant?this.$t('qotc.appeal_success_with_symbol'):this.$t('qotc.appealed_fail_with_symbol') // 已放币，交易完成(申诉成功，平台已强制放币:被申诉失败，平台已强制放币)
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
            state: 0,
            title: this.isAppellant?this.$t('qotc.appeal_fail_with_cancel'):this.$t('qotc.appealed_success_with_cancel') // 申诉失败，订单已取消:被申诉成功，订单已被取消

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
        case 31:
          _icon = 'appealSuccess'
          break
      }
      return _icon
    },
    currentPayInfo () {
      if (this.payInfo) {
         this.payList = [{
            type: '1',
            title: this.$t('otc_legal.oyc_legal_Bank_card'),
            label: this.$t(this.payTrans[1]), // 银行卡号
            bank: this.payInfo.data.card_bank,
            number: this.payInfo.data.card_number,
            icon: 'bank'
          }, {
            type: '2',
            title: this.$t('public0.public199'),//'支付宝',
            label: this.$t(this.payTrans[2]), // 支付宝账号
            number: this.payInfo.data.alipay_number,
            url: this.payInfo.data.alipay_image_path,
            icon: 'alipay'
          }, {
            type: '3',
            title: this.$t('otc_ad.otc_ad_WeChatPay'),//'微信支付',
            label: this.$t(this.payTrans[3]), // 微信账号
            number: this.payInfo.data.wechat_number,
            url: this.payInfo.data.wechat_image_path,
            icon: 'wechat'
          }, {
            type: '4',
            title: 'Paypal',
            label: this.$t(this.payTrans[4]), // PayPal账号
            number: this.payInfo.data.paypal_number,
            icon: 'paypay'
        }]


        if (this.pay_type.length === 1) {
          this.payList.forEach(item => {
            if (item.type == this.pay_type[0]) {
              this.currentPayType = [{...item}]
              console.log('this.currentPayType', this.currentPayType)
            }
          })
        }

        return this.payList
        // switch (type) {
        //   case '1': // 银行卡
        //     return {
        //       label: this.$t(this.payTrans[1]), // 银行卡号
        //       name: this.payInfo.real_name,
        //       bank: this.payInfo.data.card_bank,
        //       number: this.payInfo.data.card_number
        //     }
        //   case '2': // 支付宝
        //     return {
        //       label: this.$t(this.payTrans[2]), // 支付宝账号
        //       name: this.payInfo.real_name,
        //       number: this.payInfo.data.alipay_number,
        //       url: this.payInfo.data.alipay_image_path
        //     }
        //   case '3': // 微信
        //     return {
        //       label: this.$t(this.payTrans[3]), // 微信账号
        //       name: this.payInfo.real_name,
        //       number: this.payInfo.data.wechat_number,
        //       url: this.payInfo.data.wechat_image_path
        //     }
        //   case '4': // paypal
        //     return {
        //       label: this.$t(this.payTrans[4]), // PayPal账号
        //       name: this.payInfo.real_name,
        //       number: this.payInfo.data.paypal_number
        //     }
        //   default:
        //     return {
        //       label: null,
        //       name: null,
        //       bank: null,
        //       number: null,
        //       url: null
        //     }
        // }
        // }
      } else {
        this.payList = []
        // return {
        //   label: null,
        //   name: null,
        //   bank: null,
        //   number: null,
        //   url: null
        // }
      }
    },
  },
  created(){
    this.getAppealTime()
    this.getSurplusTime()
    this.getSellerPayInfo(this.orderInfo.from_user_id)
  },
  mounted(){
    this.interval = null
  },
  methods:{
    // 显示收款二维码
    handleClickQRCode(params) {
      this.QRcodeUrl = this.currentPayInfo[params.index].url
      this.qrShow = true
    },

    handleSelectTypeClick() {
      if (this.orderState.state == 1) {
        this.$refs.payType.open()
      }
    },

    hidePay(currentPayType) {
      this.currentPayType = [{...currentPayType}]
      this.$refs.payType.close()
    },

    getSurplusTime(){
      this.interval = utils.countDown(this.orderInfo.surplus_Time, (time) => {

      console.log(time)
        if (time === '00:00') {
          this.orderInfo.isExpire = true
        }
        this.surplusTime = time
      })
    },
    getAppealTime(){ //缓存付款时间，判断申述按钮2分钟内是否可用
      let _duration = 120000, _time = Number(localStorage.getItem('otcOrderPayTime')||'')
      let _diff = _time?(new Date().getTime() - new Date(_time).getTime()):_duration
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
    payFinish () { // 确认支付
      this.zfShow = false
      if (this.orderInfo.pay_state == 0) {
        otcApi.payFinish(this.orderInfo.order_id, {
          pay_type: this.currentPayType[0].type
        }, (msg) => {
          this.orderInfo.pay_state = 1
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          localStorage.setItem('otcOrderPayTime', new Date().getTime())
          this.getAppealTime()
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    },
    hideQRDialog(){
      this.qrShow = false
    },
    hideCCDialog(){
      this.ccShow = false
    },
    hideZFDialog(){
      this.zfShow = false
    },
    hidedDialDialog(){
      this.dialShow = false
    },
    onCopy: function (e) {
      Toast(this.$t('public0.public33')) //'复制成功'
    },
    onError: function (e) {
      Toast(this.$t('usercontent.copy-error')) //'复制失败'
    }
  }
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;

.grey {color: @grey;}
/deep/ .blue {color: @blue;}
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
    &.icon-right {
      width: .2rem;
      height: .32rem;
      background-image: url('../../assets/img/icon_arrow_right.png');
    }

    &.icon-left {
      width: .35rem;
      height: .35rem;
      margin-right: .05rem;
    }

    &.i_bank {
        background-image: url('../../assets/img/icon-bank-big.png');
    }

    &.i_alipay {
        background-image: url('../../assets/img/icon-alipay-big.png');
    }

    &.i_wechat {
        background-image: url('../../assets/img/icon-wechat-big.png');
    }

    &.i_paypal {
        background-image: url('../../assets/img/icon-paypal-big.png');
    }
    &.icon-pay-type {
      // background-color
      // icon-paypal-big.png
      // #0C6AC9
    }
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
.place_order_popup{width:100%;}
</style>
