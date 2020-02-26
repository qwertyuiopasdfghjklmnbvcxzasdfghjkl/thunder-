<template>
  <ul class="item margin-top-30 padding-top-0" :class="orderInfo.state === 1 ? 'header-line' : 'padding-bottom-0'">
    <li class="header">
      <section>
        <span>{{$t('public0.public149')}}：<!--卖家--></span>
        <span class="gray-color">{{orderInfo.from_user_name === userInfo.username ? orderInfo.to_user_name : orderInfo.from_user_name}}</span>
      </section>
      <section class="right" @click="goToChatPage">
        <em class="message-icon"></em>
      </section>
    </li>

    <template v-if="orderInfo.state === 1">
      <li class="margin-top-30">
        <section>
          <span class="pay-icon" :class="currentPayment && currentPayment.className"></span>
          <span class="gray-color font-size-30">{{currentPayment && $t(currentPayment.key)}}</span>
        </section>
        <section class="payment-wrap" v-if="orderInfo.pay_state === 0">
          <a href="javascript:;">{{$t('otc_ad.otc_ad_change_payment')}}<!--切换支付方式--></a>
          <select v-model="currentPaymentId">
            <option v-for="(item, index) in matchPayment" :key="index" :value="item.id">{{$t(item.key)}}</option>
          </select>
        </section>
      </li>
      <li class="margin-top-30">
        <section>
          <span>{{$t('public0.public65')}}：<!--收款人--></span>
          <span class="gray-color">{{currentPayInfo.name}}</span>
        </section>
      </li>
      <li v-if="currentPaymentId === 1">
        <section>
          <span>{{$t('otc_legal.otc_legal_Bank')}}：<!--开户行--></span>
          <span class="gray-color">{{currentPayInfo.bank}}</span>
        </section>
      </li>
      <li>
        <section>
          <span>{{currentPayInfo.label}}：<!--银行卡号、支付宝账号、微信账号、PayPal账号--></span>
          <span class="gray-color">{{currentPayInfo.number}}</span>
        </section>
      </li>

      <template v-if="currentPaymentId === 2 || currentPaymentId === 3">
        <li class="flex-all-center margin-top-30">
          <section>
            <img class="qrcode-image" :src="currentPayInfo.url"/>
          </section>
        </li>
        <li class="flex-all-center margin-top-20 margin-bottom-20">
          <section>
            <span class="blue_color">{{$t('account.user_save_QRcode')}}<!--保存二维码到相册--></span>
          </section>
        </li>
      </template>

      <li :class="{'margin-top-30': currentPaymentId === 1 || currentPaymentId === 4}">
        <section class="flex-column white-color font-size-20">
          <span v-if="currentPaymentId === 2 || currentPaymentId === 3">{{$t('public0.public230').format('1.', currentPayment && $t(currentPayment.key))}}<!--{0}请保存二维码到手机相册，然后使用{1}扫一扫识别二维码进行付款。--></span>
          <span>{{$t('public0.public231').format(currentPaymentId === 2 || currentPaymentId === 3 ? '2.' : '1.')}}<!--{0}请核对收款账号姓名是否和卖家姓名一致，如不一致，请勿付款。--></span>
          <span>{{$t('public0.public232').format(currentPaymentId === 2 || currentPaymentId === 3 ? '3.' : '2.')}}<!--{0}请勿备注任何消息，以免付款被拦截。--></span>
          <span>{{$t('public0.public233').format(currentPaymentId === 2 || currentPaymentId === 3 ? '4.' : '3.')}}<!--{0}如果你已向对方付款，请务必点击下方“已支付”按钮，否则可能造成资金损失。--></span>
        </section>
      </li>
    </template>
  </ul>
</template>

<script>
import otcConfig from '@/assets/js/otcconfig'
import otcApi from '@/api/otc'
export default {
  props: {
    adPayment: {
      type: String,
      default: null
    },
    orderInfo: {
      type: Object,
      default: {}
    },
    userInfo: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      allPayment: otcConfig.payments,
      currentPaymentId: parseInt(this.adPayment[0]),
      payInfo: null,
    }
  },
  computed: {
    matchPayment () {
      let tempMatchPayment = []
      this.allPayment.forEach((item) => {
        if (this.adPayment.indexOf(item.id) !== -1) {
          tempMatchPayment.push(item)
        }
      })
      return tempMatchPayment
    },
    currentPayment () {
      let tempCurrentPayment = null
      this.matchPayment.forEach((item) => {
        if (this.currentPaymentId === item.id) {
          tempCurrentPayment = item
        }
      })
      return tempCurrentPayment
    },
    currentPayInfo () {
      if (this.payInfo) {
        switch (this.currentPaymentId) {
          case 1: // 银行卡
            return {
              label: this.$t('otc_legal.otc_legal_Bank_number'), // 银行卡号
              name: this.payInfo.real_name,
              bank: this.payInfo.data.card_bank,
              number: this.payInfo.data.card_number
            }
          case 2: // 支付宝
            return {
              label: this.$t('otc_legal.otc_legal_Alipay_number'), // 支付宝账号
              name: this.payInfo.real_name,
              number: this.payInfo.data.alipay_number,
              url: this.payInfo.data.alipay_image_path
            }
          case 3: // 微信
            return {
              label: this.$t('otc_legal.otc_legal_Wechat_number'), // 微信账号
              name: this.payInfo.real_name,
              number: this.payInfo.data.wechat_number,
              url: this.payInfo.data.wechat_image_path
            }
          case 4: // paypal
            return {
              label: this.$t('public0.public221'), // PayPal账号
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
    }
  },
  watch: {
    currentPaymentId (val) {
      this.$emit('changePaymentType', val)
    }
  },
  created () {
    this.getSellerPayInfo(this.orderInfo.from_user_id)
  },
  methods: {
    getSellerPayInfo (id) { // 获取卖家支付方式
      otcApi.getPaySettingsNoToken({
        user_id: id
      }, (res) => {
        this.payInfo = res
      }, (msg) => {
        console.error(msg)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    goToChatPage () {
      this.$router.push({name: 'otc-chat', params: {orderId: this.orderInfo.order_id}})
    }
  }
}
</script>

<style scoped>
.payment_popup{width:100%;}
</style>
