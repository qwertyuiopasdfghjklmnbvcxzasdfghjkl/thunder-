<template>
    <div class="page">
        <top-back>{{$t(ad_id ? 'otc_ad.otc_edit_title' : 'otc_ad.otc_post_title').format(tradeParams.title1, formData.symbol)}}<!--发布广告||修改广告--></top-back>
        <div class="page-main bg-c-white mt20 pt20">
            <div class="cont-item currency">
              <div class="row">
                <label>{{$t('otc_ad.otc_current_currency')}}：<!--当前法币--></label>
                <div class="value">
                  <select v-model="formData.currency">
                    <option v-for="item in currencyList" :key="item.id" :value="item.currency">{{$t(`otc_exchange.otc_exchange_${item.currency}`)}}</option>
                  </select>
                </div>
              </div>
              <div class="prompt"></div>
            </div>
            <div class="cont-item exchange">
                <div class="row">
                    <label>{{$t('otc_exchange.otc_exchange_Bid')}}：<!--对标交易所--></label>
                    <div class="value">
                        <select v-model="formData.bench_marking_id">
                            <option v-for="item in benchDatas" :key="item.bench_marking_id" :value="item.bench_marking_id">{{item.marking_name}}</option>
                        </select>
                    </div>
                </div>
                <div class="prompt"></div>
            </div>
            <div class="cont-item currentprice">
                <div class="row">
                    <label>{{$t('otc_ad.otc_ad_prompt1')}}({{formData.currency}})：<!--交易所价格--></label>
                    <div class="value">
                        <span>{{benchItem.lowestPrice}}</span>
                    </div>
                </div>
                <div class="prompt"></div>
            </div>
            <div class="cont-item premium" v-if="!isATN">
                <div class="row">
                    <label class="label-tips">
                      <span>{{$t('otc_ad.otc_ad_Premium')}}：<!--溢价--></span>
                      <div class="tips">
                        <span class="tips-container">
                          <i class="tips-icon" @click="tip1">?</i>
                          <!--对交易所价格的浮动比例-->
                          
                          <!-- <em class="tips-text">{{$t('otc_exchange.otc_exchange_price_float_rate')}}</em> -->
                          
                        </span>
                      </div>
                    </label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('price_rate')}" v-model="formData.price_rate" :size="6" :accuracy="2" v-validate="'premiumPriceValid'" data-vv-name="price_rate"/>
                        <em>%</em>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('price_rate')}}</div>
            </div>
            <div class="cont-item price" v-if="!isATN">
                <div class="row">
                    <label>{{$t('otc_exchange.otc_exchange_price')}}<!--溢价后单价-->({{formData.currency}})：</label>
                    <div class="value">
                        <span>{{curPrice}}</span>
                    </div>
                </div>
                <div class="prompt"></div>
            </div>
            <div class="cont-item acceptable" v-if="!isATN">
                <div class="row">
                    <label>{{tradeParams.title2}}<!--可接受的最低单价||可接受的最高单价-->({{formData.currency}})：</label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('lowest_price')}" v-model="formData.lowest_price" :size="13" :accuracy="2" v-validate="'intOrDecimal|maxInputValue:9999999999'" data-vv-name="lowest_price"/>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('lowest_price')}}</div>
            </div>
            <div class="cont-item quantity">
                <div class="row">
                    <label>{{tradeParams.title3}}<!--我要出售多少||我要购买多少-->({{formData.symbol}})：<em class="asterisk">&nbsp;*</em></label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('symbol_count')}" v-model="formData.symbol_count" :size="15" :accuracy="4" v-validate="'required|intOrDecimal|buyAmountLimitValid|maxInputValue:9999999999'" data-vv-name="symbol_count"/>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('symbol_count')}}<!--请输入币种数量--></div>
            </div>
            <div class="cont-item tradelimit">
                <label>{{$t('otc_ad.otc_ad_Trading_restrictions')}}<!--交易限额-->({{formData.ad_type === 1 ? formData.symbol : formData.currency}})：<em class="asterisk">&nbsp;*</em></label>
                <div class="value">
                    <numberbox id="ads_min_amount" :class="{error: errors.has('min_amount')}" v-model="formData.min_amount" :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy" v-validate="'required|intOrDecimal|minAmountValid|minamount|maxInputValue:9999999999,public0.public258'" data-vv-name="min_amount"/>
                    <em>{{$t('public0.public114')}}<!--最小限额--></em>
                </div>
                <div class="prompt">{{getErrorMsg('min_amount')}}</div>
                <div class="value">
                    <numberbox id="ads_max_amount" :class="{error: errors.has('max_amount')}" v-model="formData.max_amount" :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy" v-validate="'required|intOrDecimal|maxamount|maxInputValue:9999999999,public0.public259'" data-vv-name="max_amount"/>
                    <em>{{$t('public0.public115')}}<!--最大限额--></em>
                </div>
                <div class="prompt">{{getErrorMsg('max_amount')}}</div>
            </div>
            <div class="cont-item tradetype">
                <label>{{$t('otc_exchange.otc_exchange_transaction_method')}}：<!--交易方式--><em class="asterisk">&nbsp;*</em></label>
                <div class="value">
                    <input :class="{error: errors.has('pay_type')}" type="hidden" v-validate="'required'" data-vv-name="pay_type" v-model="formData.pay_type"/>
                    <span v-for="item in payments" :key="item.id" @click="setPayment(item)" v-if="myPayType.indexOf(item.id) !== -1">
                        <i :class="[item.checked ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i>{{$t(item.key)}}
                    </span>
                </div>
                <div class="prompt">{{getErrorMsg('pay_type')}}</div>
            </div>
            <div class="cont-item dispose">
                <div class="row">
                    <label class="label-tips">
                      <span>{{$t('otc_ad.otc_ad_maximum_orders')}}：<!--最大处理订单数--><em class="asterisk">&nbsp;*</em></span>
                      <div class="tips">
                        <span class="tips-container">
                          <i class="tips-icon" @click="tip2">?</i>
                          <!--单个广告可同时存在的未完成订单最大数量-->
                          
                          <!-- <em class="tips-text">{{$t('otc_ad.otc_ad_max_uncompleted_orders')}}</em> -->
                          
                        </span>
                      </div>
                    </label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('max_process_num')}" v-model="formData.max_process_num" :size="maxOrderProcessing.toString().length" v-validate="`required|pInteger|otcProcessNumValid:${1},${maxOrderProcessing}`" data-vv-name="max_process_num"/>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('max_process_num')}}</div>
            </div>
            <div class="cont-item good">
                <div class="row">
                    <label class="label-tips">
                      <span>{{$t('otc_exchange.otc_exchange_Good_rating')}}：<!--好评率--><em class="asterisk">&nbsp;*</em></span>
                      <div class="tips">
                        <span class="tips-container">
                          <i class="tips-icon" @click="tip3">?</i>
                          <!--要求对手方好评率必须大于此设定值-->
                          
                          <!-- <em class="tips-text">{{$t('otc_exchange.otc_exchange_good_rating')}}</em> -->
                          
                        </span>
                      </div>
                    </label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('praise_rate')}" v-model="formData.praise_rate" :size="4" :accuracy="1" v-validate="'required|ratingValid'" data-vv-name="praise_rate"/>
                        <em>%</em>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('praise_rate')}}</div>
            </div>
            <div class="cont-item timelimit">
              <div class="row">
                <label>{{$t('otc_ad.otc_ad_expiration_pay')}}：<!--付款期限--><em class="asterisk">&nbsp;*</em></label>
                <div class="value">
                  <select v-model="formData.pay_limit_time" v-validate="'required'" data-vv-name="pay_limit_time">
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                  <em>{{$t('otc_ad.otc_ad_minute')}}<!--分钟--></em>
                </div>
              </div>
              <div class="prompt">{{getErrorMsg('pay_limit_time')}}<!--请输入付款期限--></div>
            </div>
        </div>
        <div class="buttons">
            <mt-button type="default" class="ui-flex-1" @click="closeDalg">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></mt-button>
            <mt-button type="primary" class="ui-flex-1" :disabled="locked" @click="adConfirm">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></mt-button>
        </div>

        <Dialog :show="showAdconfirm" :title="$t(ad_id ? 'public0.public253' : 'public0.public254')" :modal="true" :hide="hideDialog" :submit="saveAds">
            <adconfirm :item="params"></adconfirm>
        </Dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Validator } from 'vee-validate'
import otcApi from '@/api/otc'
import otcConfig from '@/assets/js/otcconfig'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import numberbox from '@/components/numberInput'
import adconfirm from '@/views/otc/adconfirm'
import { Toast } from 'mint-ui'
import Dialog from '@/components/common/dialog'

let additional = []
otcConfig.additional.forEach(function (item) {
  additional.push(item.symbol)
})
export default {
  name:'otc-update',
  components: {
    numberbox,
    adconfirm,
    Dialog
  },
  data () {
    return {
      showAdconfirm:false,
      ad_id:'',
      symbol:otcConfig.symbol,
      myPayType:'',
      coinMinLimit: 0,
      currencyMinLimit: 0,
      maxOrderProcessing: 0,
      locked: false,
      payments: JSON.parse(JSON.stringify(otcConfig.payments)),
      isClickPayments: false,
      formData: {
        ad_type: 1,
        symbol: otcConfig.symbol,
        currency: 'CNY',
        bench_marking_id: null,
        price_rate: null,
        price_type: 1,
        lowest_price: null,
        symbol_count: null,
        min_amount: null,
        max_amount: null,
        pay_type: null,
        max_process_num: 2,
        praise_rate: 50,
        pay_limit_time: 15
      },
      currencyList: [],
      benchItem: {
        price: null,
        lowestPrice: null
      },
      benchDatas: [], // 对标交易所
      isATN: false,
      params:{}
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        lowest_price: {required: this.$t('public0.public113')}, // 请输入单价
        min_amount: {required: this.$t('otc_ad.otc_ad_minimum_amount')}, // 请输入最小限额
        max_amount: {required: this.$t('otc_ad.otc_ad_maximum_amount')}, // 请输入最大限额
        pay_limit_time: {required: this.$t('otc_ad.otc_ad_payment_period')}, // 请输入付款期限
        symbol_count: {required: this.$t('public0.public112')}, // 请输入币种数量
        praise_rate: {required: this.$t('public0.public186')}, // 请输入好评率
        pay_type: {required: this.$t('public0.public118')}, // 请选择交易方式
        max_process_num: {required: this.$t('public0.public163').format(1, this.maxOrderProcessing)} // 请输入整数{0}~{1}
      }
    },
    benchSymbolParams () {
      return {
        ad_type: this.formData.ad_type,
        symbol: this.formData.symbol,
        currency: this.formData.currency,
        bench_marking_id: this.formData.bench_marking_id
      }
    },
    tradeParams () {
      if (this.formData.ad_type === 2) {
        return {
          title1: this.$t('otc_exchange.otc_exchange_sell'), // 出售
          title2: this.$t('public0.public137'), // 可接受的最低单价
          title3: this.$t('public0.public117') // 我要出售多少
        }
      } else if (this.formData.ad_type === 1) {
        return {
          title1: this.$t('otc_exchange.otc_exchange_buy'), // 购买
          title2: this.$t('public0.public136'), // 可接受的最高单价
          title3: this.$t('public0.public116') // 我要购买多少
        }
      }
    },
    curPrice () {
      if (this.benchItem.lowestPrice && this.formData.price_rate) {
        return numUtils.mul(this.benchItem.lowestPrice, numUtils.div(100 + this.formData.price_rate * 1, 100)).toFixed(2)
      } else {
        return this.benchItem.lowestPrice
      }
    },
    tradeLimitAccuracy () {
      return this.formData.ad_type === 1 ? {size: 15, accuracy: 4} : {size: 13, accuracy: 2}
    }
  },
  watch: {
    'formData.pay_type' () {
      if (this.isClickPayments) {
        this.isClickPayments = false
      } else {
        this.payments.forEach((item) => {
          if (this.formData.pay_type.indexOf(item.id) !== -1) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
      }
    },
    'formData.symbol_count' (newVal) {
      if (this.formData.ad_type === 1) {
        this.formData.max_amount = newVal
      }
    },
    benchSymbolParams () {
      this.getBenchSymbolInfo()
    }
  },
  created () {
    this.ad_id = this.$route.params.orderId
    this.symbol = this.$route.params.symbol || otcConfig.symbol
    this.formData.symbol = this.symbol
    this.formData.ad_type = this.$route.params.ad_type || 1
    this.formData.currency = this.$route.params.currency || 'CNY'
    this.myPayType = this.$route.params.myPayType
    this.formData.max_amount = Number(this.formData.ad_type) === 1 ? null : 20000,
    this.isATN = additional.includes(this.symbol)

    Validator.extend('minAmountValid', {
      getMessage: (field, args) => {
        if (this.formData.ad_type === 1) {
          return this.$t('public0.public110').format(this.coinMinLimit) // 最小限额必须大于等于{0}
        } else {
          return this.$t('public0.public110').format(this.currencyMinLimit) // 最小限额必须大于等于{0}
        }
      },
      validate: (value, args) => {
        value = parseFloat(value)
        if (this.formData.ad_type === 1) {
          return value >= this.coinMinLimit
        } else {
          return value >= this.currencyMinLimit
        }
      }
    })
    Validator.extend('buyAmountLimitValid', {
      getMessage: (field, args) => {
        return this.$t('public0.public119').format(this.coinMinLimit) // 购买数量必须大于等于{0}
      },
      validate: (value, args) => {
        value = parseFloat(value)
        if (this.formData.ad_type === 1) {
          return value >= this.coinMinLimit
        } else {
          return true
        }
      }
    })
    this.$nextTick(() => {
      this.fnGetBenchExchange()
      this.fnGetAdvertisementDetail()
      this.fnGetBaseInfo()
    })
  },
  methods: {
    hideDialog(){
        this.showAdconfirm = false
    },
    tip1(){
      Toast(this.$t('otc_exchange.otc_exchange_price_float_rate'))
    },
    tip2(){
      Toast(this.$t('otc_ad.otc_ad_max_uncompleted_orders'))
    },
    tip3(){
      Toast(this.$t('otc_exchange.otc_exchange_good_rating'))
    },
    fnGetBenchExchange () { // 获取对标交易所
      otcApi.getBenchExchange((res) => {
        this.benchDatas = res
        if (res.length) {
          this.formData.bench_marking_id = res[0].bench_marking_id
        }
      })
    },
    getBenchSymbolInfo () { // 获取对标交易所币种价格
      otcApi.getBenchSymbolInfo(this.benchSymbolParams, (res) => {
        this.benchItem.price = numUtils.BN(res.cur_price || 0).toFixed(2)
        this.benchItem.lowestPrice = numUtils.BN(res.market_price || 0).toFixed(2)
        if (this.isATN) {
          this.formData.lowest_price = this.benchItem.lowestPrice
        }
      })
    },
    fnGetAdvertisementDetail () { // 修改广告 - 获取广告详情
      if (this.ad_id) {
        otcApi.getAdvertisementDetail(this.ad_id, (res) => {
          // 数据格式化
          for (var i in this.formData) {
            if (i === 'price_rate' && utils.removeEndZero(res[i] || '0') === '0') {
              continue
            } else if (i === 'lowest_price' && numUtils.BN(0).equals(res[i])) {
              res[i] = null
            } else if (i === 'min_amount' || i === 'max_amount' || i === 'lowest_price') {
              res[i] = utils.removeEndZero(res[i])
            } else if (i === 'pay_type') {
              let tempArray = []
              res[i].split(',').forEach((item) => {
                if (this.myPayType.indexOf(item) !== -1) {
                  tempArray.push(item)
                }
              })
              res[i] = tempArray.join(',')
            }
            this.formData[i] = res[i]
          }
          this.formData.ad_type = res.ad_type
          this.formData.bench_marking_id = parseInt(res.bench_marking_id)
          this.formData.symbol_count = utils.removeEndZero(numUtils.BN(res.symbol_count).toFixed(5))
          this.formData.min_amount = utils.removeEndZero(numUtils.BN(res.min_amount).toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
          this.formData.max_amount = utils.removeEndZero(numUtils.BN(res.max_amount).toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
          this.formData.price_type = 1
          // 获取Symbol或Currency的最小交易限额
          this.fnGetSymbolAndCurrency(false, res.ad_type)
        }, (msg) => {
          console.error(msg)
        })
      } else {
        this.formData.pay_type = this.myPayType
        // 获取Symbol或Currency的最小交易限额
        this.fnGetSymbolAndCurrency(true, this.formData.ad_type)
      }
    },
    fnGetSymbolAndCurrency (isNew, adType) {
      otcApi.getCoinsList((data) => { // 获取币种信息
        data.forEach((item) => {
          if (item.symbol === this.formData.symbol) {
            this.coinMinLimit = item.minLimit
            if (isNew) {
              this.formData.min_amount = item.minLimit
            }
          }
        })
        otcApi.getCurrencys((data2) => { // 获取法币信息
          data2.forEach((item2) => {
            if (item2.currency === this.formData.currency) {
              this.currencyMinLimit = item2.minLimit
              if (isNew && adType === 2) {
                this.formData.min_amount = item2.minLimit
              }
            }
          })
          this.currencyList = data2
        }, (msg2) => {
          console.error(msg2)
        })
      }, (msg) => {
        console.error(msg)
      })
    },
    fnGetBaseInfo () { // 获取最大处理订单数
      otcApi.getBaseInfo(this.formData.symbol, (data) => {
        this.maxOrderProcessing = data.adMaxConcurrency
      }, (msg) => {
        console.error(msg)
      })
    },
    setPayment (item) {
      this.isClickPayments = true
      item.checked = !item.checked
      var arr = []
      this.payments.forEach((item) => {
        item.checked && arr.push(item.id)
      })
      this.formData.pay_type = arr.join(',')
    },
    getErrorMsg (name) {
      return this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
    },
    closeDalg () {
      this.$router.back()
    },
    adConfirm(){
      this.$validator.validateAll(this.formData).then((validResult) => {
        if (!validResult) {
          return
        }
        var formData = JSON.parse(JSON.stringify(this.formData))
        formData.lowestPrice = this.benchItem.lowestPrice
        formData.isATN = this.isATN
        this.params = formData
        if (this.locked) {
          return
        }
        this.showAdconfirm = true
      })
    },
    saveAds () {
      this.locked = true
      this.hideDialog()
      Indicator.open('Loading...')
      if (this.ad_id) {
        this.updateAds()
      } else {
        this.createAds()
      }
    },
    createAds () {
      var formData = JSON.parse(JSON.stringify(this.formData))
      otcApi.createAdvertisement(formData, (msg) => {
        this.locked = false
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        this.$router.replace({name:'otc',query:{tab:'current',symbol:this.symbol}})
      }, (msg) => {
        this.locked = false
        let errMsg = typeof msg === 'string' ? msg : msg[0]
        let errArr = errMsg.split(' ')
        errMsg = errArr.length === 1 ? this.$t(`error_code.${errArr[0]}`) : this.$t(`error_code.${errArr[0]}`) + this.$t('public0.public260') + this.$t(`error_code.${errArr[1]}`)
        if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_SUM_TIP') {
          errMsg += '\u0020' + this.formData.currency
        } else if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_COUNT_TIP') {
          errMsg += '\u0020' + this.formData.symbol
        }
        Tip({type: 'error', message: errMsg})
      })
    },
    updateAds () {
      var formData = JSON.parse(JSON.stringify(this.formData))
      otcApi.updateAdvertisement(this.ad_id, formData, (msg) => {
        this.locked = false
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        this.$router.push({name:'page-otc',params:{tab:'tab-container5'}})
      }, (msg) => {
        this.locked = false
        let errMsg = typeof msg === 'string' ? msg : msg[0]
        let errArr = errMsg.split(' ')
        errMsg = errArr.length === 1 ? this.$t(`error_code.${errArr[0]}`) : this.$t(`error_code.${errArr[0]}`) + this.$t('public0.public260') + this.$t(`error_code.${errArr[1]}`)
        if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_SUM_TIP') {
          errMsg += '\u0020' + this.formData.currency
        } else if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_COUNT_TIP') {
          errMsg += '\u0020' + this.formData.symbol
        }
        Tip({type: 'error', message: errMsg})
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-main {bottom: 1.3rem;}
.cont-item .row{display: flex;justify-content: space-between;align-items: center;}
.cont-item label{display: block;line-height: 0.5rem;color: #999;}
.cont-item label em.asterisk{position: relative;top: 0.1rem;line-height: 0;font-size: 0.36rem;color: #3B48C8;}
.cont-item label.label-tips{font-size: 0;}
.cont-item label.label-tips > span{font-size: 0.24rem;}
.cont-item label.label-tips .tips{display: inline-block;margin-top: 0.1rem;margin-left: 0.1rem;vertical-align: top;}
.cont-item label.label-tips .tips-container{display: flex;justify-content: center;position: relative;z-index: 1;width: 0.3rem;height: 0.3rem;}
.cont-item label.label-tips .tips-icon{width: 100%;height: 100%;font-weight: bold;font-size: 0.24rem;line-height: 0.3rem;color: #666;text-align: center;background-color: #ddd;border-radius: 50%;cursor: help; font-style: normal;}
.cont-item .value{position: relative;}
.cont-item.tradetype .value{display: flex; justify-content: space-between;align-items: center;height: 24px;}
.cont-item .value select{height: 0.6rem;padding-left: 0.15rem;padding-right: 0.15rem; font-size: 0.26rem; border: 1px solid #ddd;background-color: transparent;cursor: pointer;}
.cont-item.currency .value select{width: 1.6rem;}
.cont-item.exchange .value select{width: 2.5rem;}
.cont-item.timelimit .value select{position: relative; z-index: 1;width: 1.6rem;}
.cont-item .value span{color: #333;}
.cont-item.tradetype .value span{cursor: pointer;}
.cont-item.tradetype .value span i{padding-right: 4px;color: #3B48C8;}
.cont-item .value input{box-sizing: border-box;width: 100%;height: 0.6rem;padding-left: 0.15rem;padding-right: 0.15rem;font-size: 0.26rem; border: 1px solid #ddd;background-color: transparent;}
.cont-item .value input.error{border-color: #3B48C8;}
.cont-item.premium .value input,
.cont-item.dispose .value input,
.cont-item.timelimit .value input,
.cont-item.good .value input{width: 1.6rem;}
.cont-item.acceptable .value input,
.cont-item.quantity .value input{width: 2.5rem;}
.cont-item .value em{position: absolute;top: 0;right: 0.2rem;line-height: 0.6rem; font-size: 0.26rem;}
.cont-item.timelimit .value em{right: 0.4rem;line-height: 0.6rem;}
.cont-item .prompt{height: 0.4rem;line-height: 0.4rem;font-size: 0.24rem;color: #3B48C8;white-space: nowrap;}
.buttons {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.3rem;
  padding: 0.2rem 0.3rem;
  background-color: #fff;
  display: flex;
  z-index: 1;
  justify-content: space-between;
  border-top: 1px solid #eee;
  /deep/ button:last-of-type {
    margin-left: 0.3rem;
  }
}
</style>
