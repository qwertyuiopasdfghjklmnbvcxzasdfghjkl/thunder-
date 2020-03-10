<template>
  <div class="page">
    <top-back>{{$t('public0.public218')}}<!--PayPal收款--></top-back>

    <div class="page-main">
      <form class="paypalform block mt20" ref="paypalform">
        <div class="item-section">
          <p class="line">
            <input name="paypal_name" :placeholder="$t('otc_legal.otc_legal_Payee_Name')" readonly v-model="paypalData.paypal_name">
          </p>
        </div>
        <div class="item-section">
          <p class="line">
            <input name="paypal_number" :placeholder="$t('public0.public221')" v-model="paypalData.paypal_number" maxlength="32" autocomplete="off">
          </p>
        </div>
      </form>
      <mt-button type="primary" size="large" class="mt50" @click="saveSettings(4)">{{$t('otc_legal.otc_legal_save')}}</mt-button>
    </div>
  </div>
</template>

<script>
import otcApi from '@/api/otc'
import { mapGetters } from 'vuex'
export default {
  name: 'paypal',
  data () {
    return {
      paypalData: { // PayPal信息
        paypal_name: '',
        paypal_number: ''
      }
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      otcApi.getPaySettings((res) => {
        // PayPal
        this.paypalData = {
          paypal_name: this.getUserInfo.userRealName,
          paypal_number: res.data.paypal_number
        }
      }, (res) => {
        if (res.msg === 'NO_PAY_TYPE') {
          // PayPal
          this.paypalData.paypal_name = res.real_name
        } else {
          console.error(res.msg)
        }
      })
    },
    saveSettings (type) {
      if (!this.$root.trim(this.paypalData.paypal_number, 1)) {
        Tip({type: 'danger', message: this.$t('public0.public222')}) // 请输入PayPal账号
        $('.input[name=paypal_number]').focus()
        return
      } else {
        let formData = new FormData(this.$refs.paypalform)
        Indicator.open('Loading...')
        otcApi.savePaySettings(type, formData, (msg) => {
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          this.$router.replace({name: 'set-payway'})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item-section{
  &+.item-section {margin-top: 0.3rem;}
    input{
      background: transparent;
      border: 0;
      height: .8rem;
      width: 100%;
    }
    p.line{
      border-bottom: .01rem solid #ddd;
  }
}
</style>
