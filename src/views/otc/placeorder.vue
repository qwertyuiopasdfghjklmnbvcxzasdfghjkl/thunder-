<!--下单-->
<template>
    <section class="place_order">
        <section class="header">
            <span>{{tradeParams.tradeTxt}} {{detailData.symbol}}</span>
            <span>{{tradeParams.price}} {{(detailData.cur_price || 0).toString().toMoney()}} {{detailData.currency}}</span>
        </section>
        <section class="form">
            <section class="form-show">
                <section class="form-text">
                    <span>{{$t('otc_exchange.otc_exchange_Trading_limits')}}：<!--交易限额--></span>
                    <span>{{$t('message.msg_surplus')}}：<!--剩余量--></span>
                </section>
                <section class="form-label">
                    <span>{{detailData.min_amount}} - {{detailData.max_amount}} {{tradeParams.limit}}</span>
                    <span>{{detailData.remain_count}} {{detailData.symbol}}</span>
                </section>
            </section>
            <section class="form-row">
                <section class="form-row-title">
                    <span>{{$t('exchange.exchange_amount')}}<!--数量--></span>
                    <span @click="buyAll">{{$t('otc_exchange.otc_exchange_Buy_all')}}<!--一键扫货--></span>
                </section>
                <section class="form-row-input">
                    <numberbox v-model="symbol_count" :placeholder="$t('public0.public12')" v-validate="`required|intOrDecimal|buyOrSellNotLargeRemainCount${sellType ? '|minTradeLimit:1|maxTradeLimit:1' : ''}`" data-vv-name="symbol_count" :accuracy="5"/>
                    <em>{{params.symbol}}</em>
                </section>
            </section>
            <section class="form-row">
                <section class="form-row-title">
                    <span>{{$t('exchange.exchange_total')}}<!--金额--></span>
                    <span></span>
                </section>
                <section class="form-row-input">
                    <numberbox v-model="currency_count" :placeholder="$t('public0.public13')" v-validate="`required|intOrDecimal${buyType ? '|minTradeLimit:2|maxTradeLimit:2' : ''}`" data-vv-name="currency_count" :accuracy="2"/>
                    <em>{{params.currency}}</em>
                </section>
            </section>
            <section class="form-buttons">
                <mt-button type="default" @click="cancel">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></mt-button>
                <mt-button type="primary" :disabled="locked" @click="createOrder">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></mt-button>
            </section>
        </section>
    </section>
</template>

<script>
import { Validator } from 'vee-validate'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import otcApi from '@/api/otc'
import numberbox from '@/components/numberInput'
export default {
  props: ['params', 'ad_id'],
  components: {
    numberbox
  },
  data () {
    return {
      detailData: {},
      symbol_count: '',
      currency_count: '',
      changeInput: '',
      autoCloseTime: 30,
      locked: false
    }
  },
  computed: {
    msgs () {
      return {
        symbol_count: {required: this.$t('public0.public12')}, // 请输入数量
        currency_count: {required: this.$t('public0.public13')} // 请输入金额
      }
    },
    buyType () { // 卖的广告是买
      return this.params.ad_type === 2
    },
    sellType () { // 买的广告是卖
      return this.params.ad_type === 1
    },
    tradeParams () {
      if (this.buyType) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_buy'), // 购买
          price: this.$t('otc_exchange.otc_exchange_ask'), // 单价
          limit: this.params.currency // 交易限额
        }
      } else if (this.sellType) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_sell'), // 出售
          price: this.$t('otc_exchange.otc_exchange_bid'), // 单价
          limit: this.params.symbol // 交易限额
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    currency_count (val, oldVal) {
      if (val === '') {
        this.symbol_count = ''
      }
      if (val === '' || this.changeInput === 'symbol') {
        this.changeInput = ''
        return
      }
      this.changeInput = 'currency'
      this.symbol_count = val ? utils.removeEndZero(numUtils.div(val, this.detailData.cur_price).toFixed(5)) : ''
    },
    symbol_count (val, oldVal) {
      if (val === '') {
        this.currency_count = ''
      }
      if (val === '' || this.changeInput === 'currency') {
        this.changeInput = ''
        return
      }
      this.changeInput = 'symbol'
      this.currency_count = val ? utils.removeEndZero(numUtils.mul(val, this.detailData.cur_price).toFixed(2)) : ''
    },
    ad_id (newVal) {
      this.currency_count = ''
      this.symbol_count = ''
      if (!newVal) {
        this.detailData = {}
      } else {
        this.getAdvertisementDetail()
      }
    }
  },
  created() {
    Validator.extend('minTradeLimit', {
      getMessage: (field, args) => 'error_code.ORDER_TRADE_LT_COUNT',
      validate: (value, args) => {
        return numUtils.BN(value).gte(this.detailData.min_amount)
      }
    })
    Validator.extend('maxTradeLimit', {
      getMessage: (field, args) => 'error_code.ORDER_TRADE_GT_COUNT',
      validate: (value, args) => {
        return numUtils.BN(value).lte(this.detailData.max_amount)
      }
    })
    Validator.extend('buyOrSellNotLargeRemainCount', {
      getMessage: (field, args) => 'error_code.SYMBOL_AD_REMAIN_LACK',
      validate: (value, args) => {
        return numUtils.BN(value).lte(this.detailData.remain_count)
      }
    })
    this.getAdvertisementDetail()
  },
  methods: {
    getAdvertisementDetail () {
      if (!this.ad_id) {
        return
      }
      otcApi.getAdvertisementDetail(this.ad_id, (res) => {
        this.detailData = res || {}
        this.detailData.cur_price = utils.removeEndZero(numUtils.BN(this.detailData.cur_price).toFixed(2))
        this.detailData.min_amount = utils.removeEndZero(numUtils.BN(this.detailData.min_amount).toFixed(8))
        this.detailData.max_amount = utils.removeEndZero(numUtils.BN(this.detailData.max_amount).toFixed(8))
        this.detailData.remain_count = utils.removeEndZero(numUtils.BN(this.detailData.remain_count).toFixed(8))
      })
    },
    buyAll () {
      if (this.buyType) {
        if (numUtils.mul(this.detailData.remain_count, this.detailData.cur_price).gt(numUtils.BN(this.detailData.max_amount))) {
          this.currency_count = this.detailData.max_amount
        } else {
          this.symbol_count = this.detailData ? this.detailData.remain_count : 0
        }
      } else if (this.sellType) {
        if (numUtils.BN(this.detailData.remain_count).gt(numUtils.BN(this.detailData.max_amount))) {
          this.symbol_count = this.detailData.max_amount
        } else {
          this.symbol_count = this.detailData ? this.detailData.remain_count : 0
        }
      }
    },
    cancel () {
      this.$validator.reset()
      this.$emit('hidePlaceOrderDialog')
    },
    createOrder () {
      if (this.locked) {
        return
      }
      this.$validator.validateAll().then((valid) => {
        if (!valid) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        this.locked = true
        otcApi.createOrders({
          ad_id: this.ad_id,
          trade_type: this.params.ad_type === 1 ? 2 : 1,
          symbol: this.detailData.symbol,
          currency: this.detailData.currency,
          symbol_count: this.symbol_count,
          currency_count: this.currency_count
        }, (id, msg) => {
          this.locked = false
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          this.$emit('hidePlaceOrderDialog', true)
        }, (msg) => {
            console.log(msg)
          this.locked = false
          let errMsg = typeof msg === 'string' ? msg : msg[0]
          Tip({type: 'danger', message: this.$t(`error_code.${errMsg}`)})
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@white_color:#333;
@blue_color:#3B48C8;
.place_order{width:100%;height:7.34rem;display:flex;flex-direction:column;background-color:#fff;}
.header{display:flex;height:1rem;border-bottom: 1px solid #ddd;align-items:center;justify-content:space-between;}
.header span{font-size:0.36rem;color:@white_color;}
.header span:first-child{padding-left:0.3rem;font-weight:bold;}
.header span:last-child{padding-right:0.3rem;}
.form{display:flex;flex-direction:column;flex:1;height:6.34rem;color:@white_color;padding:0 0.32rem;}
.form-show{display:flex;height:0.66rem;margin:0.31rem 0;font-size:0.24rem;}
.form-text,.form-label{display:flex;flex-direction:column;justify-content:space-between;}
.form-text span,.form-label span{height:0.25rem;line-height:0.25rem;}
.form-text span{text-align:right;}
.form-label span{padding-left:0.1rem;}
.form-row{display:flex;flex-direction:column;margin-bottom:0.29rem;}
.form-row-title{display:flex;height:0.23rem;line-height:0.23rem;justify-content:space-between;margin-bottom:0.18rem;}
.form-row-title span:last-child{color:@blue_color;}
.form-row-input{display:flex;position: relative;}
.form-row-input input{border-radius: 0.05rem;display:flex;flex:1;height:1rem;background-color:transparent;border:0.01rem solid #ddd;color:#333;padding:0 0.34rem;font-size:0.28rem;}
.form-row-input input:focus{border-color:@blue_color;}
.form-row-input em{display:block;font-style:normal;font-size:0.3rem;color:#999;position:absolute;right:0.32rem;top:0.3rem;line-height:0.44rem;}
.form-buttons {display: flex;}
.form-buttons /deep/ button:first-of-type {width: 2.4rem;}
.form-buttons /deep/ button:last-of-type {margin-left: 0.3rem; flex: 1;}
</style>
