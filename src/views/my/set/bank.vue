<template>
  <div class="page">
    <top-back>{{$t('otc_legal.otc_legal_Bank_Transfer')}}<!--银行转账--></top-back>

    <div class="page-main">
      <form class="block mt20 bankform" ref="bankForm" >
        <div class="item-section">
          <p class="line">
            <input name="card_name" :placeholder="$t('otc_legal.otc_legal_Name')" readonly v-model="bankData.card_name">
          </p>
        </div>
        <div class="item-section">
          <p class="line">
            <input name="card_bank" :placeholder="$t('otc_legal.otc_legal_Bank')" v-model="bankData.card_bank"  maxlength="32" autocomplete="off">
          </p>
        </div>
        <div class="item-section">
          <p class="line">
            <input name="card_number" :placeholder="$t('otc_legal.otc_legal_Bank_number')" v-model="bankData.card_number" maxlength="32" autocomplete="off">
          </p>
        </div>
      </form>
      <mt-button type="primary" size="large" class="mt50" @click="saveSettings(1)">{{$t('otc_legal.otc_legal_save')}}</mt-button>
    </div>
  </div>
</template>

<script>
import otcApi from '@/api/otc'
export default {
  name: 'page-bankset',
  data () {
    return {
      bankData: { // 银行卡信息
        card_name: '',
        card_bank: '',
        card_number: '',
      },
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      otcApi.getPaySettings((res) => {
        console.log(res)
        // 银行卡
        this.bankData = {
          card_name: res.real_name,
          card_bank: res.data.card_bank,
          card_number: res.data.card_number,
        }
      }, (res) => {
        if (res.msg === 'NO_PAY_TYPE') {
          // 银行卡
          this.bankData.card_name = res.real_name
        } else {
          console.error(res.msg)
        }
      })
    },
    saveSettings (type) {
      if (!this.$root.trim(this.bankData.card_bank, 1)) {
        Tip({type: 'danger', message: this.$t('otc_legal.otc_legal_input_bank')}) // 请输入开户行
        $('.bankform input[name=card_bank]').focus()
        return
      } else if (!this.$root.trim(this.bankData.card_number, 1)) {
        Tip({type: 'danger', message: this.$t('otc_legal.otc_legal_input_bank_number')}) // 请输入银行卡号
        $('.bankform input[name=card_number]').focus()
        return
      } else if (!this.$root.bankCardValid(this.bankData.card_number)) {
        Tip({type: 'danger', message: this.$t('public0.public135')}) // 请输入有效的银行卡号
        $('.bankform input[name=card_number]').focus()
        return
      } else {
        let formData = new FormData(this.$refs.bankForm)
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
