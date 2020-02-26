<template>
  <ul class="item margin-top-30 padding-top-0" :class="orderInfo.state === 1 ? 'header-line' : 'padding-bottom-0'">
    <li class="header">
      <section>
        <span>{{$t('public0.public148')}}：<!--买家--></span>
        <span class="gray-color">{{orderInfo.from_user_name === userInfo.username ? orderInfo.to_user_name : orderInfo.from_user_name}}</span>
      </section>
      <section class="right" @click="goToChatPage">
        <em class="message-icon"></em>
      </section>
    </li>

    <template v-if="orderInfo.state === 1">
      <li style="display: block;">
        <p style="height:.4rem;margin-top:.3rem;line-height:.4rem;">{{$t('public0.public28')}}<!--耐心等待买家付款--></p>
        <p style="height:.4rem;line-height:.4rem;">{{$t('public0.public29')}}<!--确认付款后，请尽快放币--></p>
      </li>
      <li>
        <section class="flex-column white-color font-size-20 margin-top-30">
          <span>{{$t('public0.public234')}}<!--1.请核对付款账号姓名是否和买家姓名一致。如不一致，请勿释放代币。--></span>
          <span>{{$t('public0.public235')}}<!--2.请及时查看账户，并确保对方付款到账后再释放代币。否则可能会造成不可挽回的损失。--></span>
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
      payments: otcConfig.payments,
      payTypes: {},
      pay_type: null
    }
  },
  computed: {
    payInfo () {
      if (!this.payTypes.data) {
        return {}
      }
      if (this.pay_type === 1) {
        return {
          name: this.payTypes.real_name,
          bank: this.payTypes.data.card_bank,
          number: this.payTypes.data.card_number,
          title: this.$t('otc_legal.otc_legal_Bank_number') // 银行卡号
        }
      } else if (this.pay_type === 2) {
        return {
          name: this.payTypes.real_name,
          number: this.payTypes.data.alipay_number,
          title: this.$t('otc_legal.otc_legal_Alipay_number') // 支付宝账号
        }
      } else if (this.pay_type === 3) {
        return {
          name: this.payTypes.real_name,
          number: this.payTypes.data.wechat_number,
          title: this.$t('otc_legal.otc_legal_Wechat_number') // 微信账号
        }
      } else {
        return {}
      }
    },
    curPayment () {
      for (let i = 0; i < this.payments.length; i++) {
        let item = this.payments[i]
        if (item.id === this.pay_type) {
          return {
            css: item.css1,
            name: this.$t(item.key)
          }
        }
      }
      return {}
    }
  },
  watch: {
    orderInfo () {
      this.pay_type = Number(this.orderInfo.pay_type)
    }
  },
  created () {
    this.pay_type = Number(this.orderInfo.pay_type)
    this.getPays(this.orderInfo)
  },
  methods: {
    getPays (item) { // 获取卖家支付方式
      otcApi.getPaySettingsNoToken({
        user_id: item.from_user_id
      }, (res) => {
        this.payTypes = {
          real_name: res.real_name,
          data: res.data
        }
      })
    },
    goToChatPage () {
      this.$router.push({name: 'otc-chat', params: {orderId: this.orderInfo.order_id}})
    }
  }
}
</script>

<style>

</style>
