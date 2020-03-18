<template>
  <div class="page">
    <top-back>{{$t('发布广告')}}<!--发布广告--></top-back>
    <div class="pl30 pr30">
      <div class="mint-navbar mt100">
        <a class="mint-tab-item" :class="{'is-selected':formData.ad_type==1}">
          <div class="mint-tab-item-label" v-tap="{methods:setAdType, type:1}">购买</div>
        </a>
        <a class="mint-tab-item" :class="{'is-selected':formData.ad_type==2}">
          <div class="mint-tab-item-label" v-tap="{methods:setAdType, type:2}">出售</div>
        </a>
      </div>
    </div>
    <div class="page-main">
      <div class="f30 mt40">币种</div>
      <div class="kuan">
        <select v-model="formData.symbol">
          <option v-for="(item,index) in tokens" :value="item.symbol">{{item.symbol}}</option>
        </select>
      </div>
      <div class="f30 mt40">价格</div>
      <div class="ui-flex ui-flex-justify">
        <div class="kuan ui-flex-3">
          <select v-model="formData.price_type">
            <option :value="2" v-if="false">固定价格</option>
            <option :value="1">溢价价格</option>
          </select>
        </div>
        <div class="kuan ui-flex ui-flex-5 ui-flex-justify ml20" :class="{error: errors.has('lowest_price')}">
          <numberbox v-model="formData.lowest_price"  :size="13" :accuracy="2" v-validate="'required|intOrDecimal'" data-vv-name="lowest_price" :placeholder="formData.price_type==2?'交易价格':'可接受的最低单价'"/>
          <span class="grey">{{formData.currency}}</span>
        </div>
      </div>
      <div class="kuan ui-flex ui-flex-justify" :class="{error: errors.has('price_rate')}" v-show="formData.price_type==1">
        <numberbox v-model="formData.price_rate" :size="6" :accuracy="2" v-validate="'required|premiumPriceValid'" data-vv-name="price_rate" placeholder="溢价率(正负值)"/>
        <span class="grey">%</span>
      </div>
      <p class="grey f26 mt10" v-show="formData.price_type==1">交易所溢价后单价： {{ratePrice}}{{formData.currency}}</p>
      <p class="grey f26 mt10">市场参加价： {{refPrice}}{{formData.currency}}</p>
      <div class="f30 mt40">数量</div>
      <div class="kuan ui-flex ui-flex-justify" :class="{error: errors.has('symbol_count')}" >
        <numberbox v-model="formData.symbol_count" :size="15" :accuracy="4" v-validate="'required|intOrDecimal|buyAmountLimitValid|maxInputValue:9999999999'" data-vv-name="symbol_count" placeholder="请输入交易数量"/>
        <span class="grey">{{formData.symbol}}</span>
      </div>
      <p class="grey f26 mt10">账户余额： {{balance}} {{formData.symbol}}</p>
      <div class="f30 mt40">付款期限</div>
      <div class="kuan">
        <select v-model="formData.pay_limit_time" v-validate="'required'" data-vv-name="pay_limit_time">
          <option value="15">15 {{$t('otc_ad.otc_ad_minute')}}<!--分钟--></option>
          <option value="20">20 {{$t('otc_ad.otc_ad_minute')}}<!--分钟--></option>
          <option value="30">30 {{$t('otc_ad.otc_ad_minute')}}<!--分钟--></option>
        </select>
      </div>
      <div class="f30 mt40">单笔限额({{formData.ad_type==1?formData.symbol:formData.currency}})</div>
      <div class="ui-flex ui-flex-justify">
        <div class="kuan ui-flex-1"  :class="{error: errors.has('min_amount')}" >
          <numberbox id="ads_min_amount" v-model="formData.min_amount" :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy" v-validate="'required|intOrDecimal|minAmountValid|minamount|maxInputValue:9999999999,public0.public258'" data-vv-name="min_amount" placeholder="最小单笔限额"/>
        </div>
        <span class="f30 grey mt10 ml20 mr20" style="line-height: 0.9rem;"> ~ </span>
        <div class="kuan ui-flex-1"  :class="{error: errors.has('max_amount')}">
          <numberbox id="ads_max_amount" v-model="formData.max_amount" :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy" v-validate="'required|intOrDecimal|maxamount|maxInputValue:9999999999,public0.public259'" data-vv-name="max_amount" placeholder="最大单笔限额"/>
        </div>
      </div>
      <div class="f30 mt40">{{formData.ad_type==1?'付款方式':'收款方式'}}</div>
      <input type="hidden" v-validate="'required'" data-vv-name="pay_type" v-model="formData.pay_type"/>
      <ul class="mt10 payments">
        <li v-tap="{methods:setPayment, type:1}" :class="{active:isPayChecked(1)}" v-if="payments.card_number">
          <i :class="[isPayChecked(1) ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i> {{$t(payTrans[1])}}<!--银行卡-->
        </li>
        <li v-tap="{methods:setPayment, type:2}" :class="{active:isPayChecked(2)}" v-if="payments.alipay_number">
          <i :class="[isPayChecked(2) ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i> {{$t(payTrans[2])}}<!--支付宝-->
        </li>
        <li v-tap="{methods:setPayment, type:3}" :class="{active:isPayChecked(3)}" v-if="payments.wechat_number">
          <i :class="[isPayChecked(3) ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i> {{$t(payTrans[3])}}<!--微信-->
        </li>
        <li v-tap="{methods:setPayment, type:4}" :class="{active:isPayChecked(4)}" v-if="payments.paypal_number">
          <i :class="[isPayChecked(4) ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i> {{$t(payTrans[4])}}<!--PayPal-->
        </li>

        <router-link v-if="hasAllPays" :to="{name:'set-payway'}" class="active" tag="li">{{formData.ad_type==1?'添加付款方式':'添加收款方式'}}</router-link>
      </ul>
      <div class="f26 mt60 grey agreement" :class="{active:agree}" v-tap="{methods:()=>{agree = !agree}}">
        <i class="icon_"></i> 我已阅读并同意<a href="#" class="blue">《交易规则》</a>
      </div>
      <div class="mt40 pb90">
        <mt-button type="primary" size="large" v-tap="{methods:saveAds}">{{ad_id?'更新':'发布'}}</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'
import walletApi from '@/api/wallet'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import numberbox from '@/components/numberInput'
import Dialog from '@/components/common/dialog'
import { Validator } from 'vee-validate'
import { MessageBox } from 'mint-ui'
import store from '@/store'
import otcConfig from '@/assets/js/otcconfig'


export default {
  components: {
    numberbox,
    Dialog
  },
  data(){
    return {
      ad_id:null,
      tokens:[],
      currencyList: [],
      payments:{},
      refPrice: 0, // 参考价格
      agree:true,
      formData:{
        ad_type: 1,
        symbol: 'USDT',
        currency: 'CNY',
        bench_marking_id: otcConfig.benchMarkingId,
        price_rate: '',
        price_type: 1, //price_type: 1 浮动价格； 2 固定价格；
        lowest_price: '',
        symbol_count: '',
        min_amount: '',
        max_amount: '',
        pay_type:'', //pay_type: "1" 银行卡； "2" 支付宝； "3"微信支付； "4" Paypal；
        max_process_num: 999,
        praise_rate: 1,
        pay_limit_time: 15
      },
      locked:false
    }
  },
  computed:{
    ...mapGetters(['getUserWallets', 'getUserInfo']),
    msgs () {
      return {
        lowest_price: {required: this.$t('请输入交易单价')}, // 请输入交易单价
        price_rate: {required: this.$t('请输入溢价率')}, // 请输入溢价率
        min_amount: {required: this.$t('otc_ad.otc_ad_minimum_amount')}, // 请输入最小限额
        max_amount: {required: this.$t('otc_ad.otc_ad_maximum_amount')}, // 请输入最大限额
        symbol_count: {required: this.$t('请输入交易数量')}, // 请输入交易数量
        pay_type: {required: this.hasPay?this.$t(this.formData.ad_type==1?'请选择付款方式':'请选择收款方式'):'请添加支付方式'}, // 请选择付款\收款方式：请添加支付方式
      }
    },
    payTrans(){
      let _payTrans = {}
      for(let item of otcConfig.payments){
        _payTrans[item.id] = item.key
      }
      return _payTrans
    },
    ratePrice(){
      if (this.refPrice && this.formData.price_rate) {
        return numUtils.mul(this.refPrice, numUtils.div(100 + this.formData.price_rate * 1, 100)).toFixed(2)
      } else {
        return this.refPrice
      }
    },
    hasAllPays(){
      return !this.payments.card_number || !this.payments.alipay_number || !this.payments.wechat_number || !this.payments.paypal_number
    },
    hasPay(){
      return this.payments.card_number || this.payments.alipay_number || this.payments.wechat_number || this.payments.paypal_number
    },
    balance(){
      let _balance = 0
      for(let item of this.getUserWallets){
        if(item.symbol==this.formData.symbol && item.type==1){
          _balance = item.availableBalance
          break;
        }
      }
      return _balance
    },
    benchSymbolParams () {
      return {
        ad_type: this.formData.ad_type,
        symbol: this.formData.symbol,
        currency: this.formData.currency
      }
    },
    tradeLimitAccuracy () {
      return this.formData.ad_type == 1 ? {size: 15, accuracy: 4} : {size: 13, accuracy: 2}
    },
    coinMinLimit(){
      let _coinMinLimit = 0
      for(let item of this.tokens){
        if (item.symbol == this.formData.symbol) {
          _coinMinLimit = item.minLimit
          if(!this.ad_id && this.formData.ad_type == 1) {
            this.formData.min_amount = item.minLimit
          }
          break
        }
      }
      return _coinMinLimit
    },
    currencyMinLimit(){
      let _currencyMinLimit = 0
      for(let item of this.currencyList){
        if (item.currency == this.formData.currency) {
          _currencyMinLimit = item.minLimit
          if (!this.ad_id && this.formData.ad_type == 2) {
            this.formData.min_amount = item.minLimit
          }
          break
        }
      }
      return _currencyMinLimit
    }
  },
  watch:{
    currencyMinLimit(){},
    coinMinLimit(){},
    benchSymbolParams() {
      this.getReferencePrice()
    },
    'formData.price_type'(){
      this.formData.lowest_price = ''
      this.formData.price_rate = ''
    }
  },
  beforeRouteEnter (to, from, next) {
    if(process.env.NODE_ENV === 'development'){ //开发环境下跳过检测
      next()
      return
    }
    otcApi.getAdPermission((res) => { //检测是否商家用户，否则无权限进入此页面
      let _isMerchant = res.otcMerchantsPermission?true:false
      if(_isMerchant){
        if(store.getters.getUserInfo.mobileAuthEnable!=1){
          MessageBox.confirm(window.vm.$t('未绑定手机号，是否立即前往？'),window.vm.$t('确认'),{
            cancelButtonText:window.vm.$t('取消'),
            confirmButtonText:window.vm.$t('确认'),
          }).then(action => {
            window.vm.$router.push({name:'phoneVerify'})
          })
        } else {
          next()
        }
      } else {
        Tip({type:'danger', message:'抱歉，非商家用户无法进入此页面！'})
      }
    })
  },
  created(){
    /*if('没有权限发布广告'){
      this.$router.back()
    }*/
    this.ad_id = this.$route.params.orderId || null
    this.setValidate()
    this.getOtcTokens()
    this.getOtcCurrency()
    this.getPaySettings().then(()=>{
      this.fnGetAdvertisementDetail()
    })
    this.getReferencePrice()
    
  },
  methods:{
    ...mapActions(['setUserWallets']),
    setValidate(){
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
    },
    isPayChecked(_type){
      return this.formData.pay_type.includes(_type)
    },
    setPayment (args) {
      let _type = args.type
      let arr = this.formData.pay_type?this.formData.pay_type.split(',') : []
      if(this.isPayChecked(_type)){
        arr.splice(arr.indexOf(''+_type),1)
      } else {
        arr.push(''+_type)
      }
      this.formData.pay_type = arr.join(',')
    },
    saveAds () {
      let _formData = JSON.parse(JSON.stringify(this.formData))
      if(this.formData.price_type==2){
        delete _formData['price_rate']
      } else {
        delete _formData['lowest_price']
      }
      this.$validator.validateAll(_formData).then((validResult) => {
        if (!validResult) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type:'danger', message: msg})
          }
          return
        }
        if(numUtils.BN(this.formData.symbol_count).gt(this.balance)){
          Tip({type:'danger', message: `${this.formData.symbol}余额不足`})
          return
        }
        this.locked = true
        Indicator.open('Loading...')
        if (this.ad_id) {
          this.updateAds()
        } else {
          this.createAds()
        }
      })
    },
    createAds () {
      var formData = JSON.parse(JSON.stringify(this.formData))
      otcApi.createAdvertisement(formData, (msg) => {
        this.locked = false
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        this.$router.replace({name:'adManage'})
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
        this.$router.replace({name:'adManage'})
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
            }
            this.formData[i] = res[i]
          }
          this.formData.ad_type = res.ad_type
          this.formData.bench_marking_id = parseInt(res.bench_marking_id)
          this.formData.symbol_count = utils.removeEndZero(numUtils.BN(res.symbol_count).toFixed(5))
          this.formData.min_amount = utils.removeEndZero(numUtils.BN(res.min_amount).toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
          this.formData.max_amount = utils.removeEndZero(numUtils.BN(res.max_amount).toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
          this.formData.price_type = 1
        }, (msg) => {
          console.error(msg)
        })
      }
    },
    getOtcCurrency () {
      otcApi.getCurrencys((data) => { // 获取法币信息
        this.currencyList = data
      }, (msg) => {
        console.error(msg)
      })
    },
    getOtcTokens(){
      otcApi.getCoinsList((data) => { // 获取币种信息
        this.tokens = data
        if(data.length){
          this.formData.symbol = this.tokens[0]['symbol']
        }
      }, (msg) => {
        console.error(msg)
      })
    },
    getPaySettings(){ //获取用户支付方式
      return new Promise((resove, reject)=>{
        otcApi.getPaySettings(res=>{
          this.payments = res.data
          if(!this.ad_id && this.payments.alipay_number){
            this.formData.pay_type = '2'
          }
          resove()
        })
      })
    },
    getReferencePrice () { // 获取对标交易所币种价格
      otcApi.getReferencePrice(this.benchSymbolParams, (res) => {
        this.refPrice = numUtils.BN(res || 0).toFixed(2)
      })
    },
    getAssets() {
        walletApi.myAssets({}, (res) => {
            res = res.filter(item => {
                return item.type === 1
            })
            res.forEach((item) => {
                item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
            })
            this.setUserWallets(res)
        })
    },
    setAdType(args){
      if(!this.ad_id){
        this.formData.ad_type = args.type
      }
    },
  }
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;
@error:#ef4f4f;

.page-main {top: 1.6rem;}
.grey {color: @grey;}
.blue {color: @blue;}
.kuan {
  margin-top: 0.1rem;
  border: 1px solid @grey;
  border-radius:4px;
  height: 0.9rem;
  line-height: 0.7rem;
  padding: 0.1rem 0.2rem;
  font-size: 0.3rem;
  color: #fff;
  &.error {border-color: @error;}
}
select, input {
  border: none;
  width: 100%;
  height: 100%;
  font-size: inherit;
  background-color: transparent;
  color: inherit;
  option {
    color: @blue;
  }
}
.payments {
  display: flex;
  flex-wrap: wrap;
  li{width: 33.3%;}
  li {
    line-height: 0.6rem;
    i {margin-right: 0.1rem;}
    &.active {
      color: @blue;
    }
  }
}
.agreement i {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_unchecked.png');}
.agreement.active {
  i {background-image: url('../../assets/img/icon_checked.png');}
}
/deep/ .mint-navbar {
  background-color: transparent;
  .mint-tab-item {
      height: 0.64rem;
      color: @grey;
      padding: 0;
      border:1px solid @grey;
      border-radius:4px;
      &:first-of-type {border-right: none; border-top-right-radius: 0; border-bottom-right-radius: 0; }
      &:last-of-type {border-left: none; border-top-left-radius: 0; border-bottom-left-radius: 0; }

      &.is-selected {
          color: #FFF;
          margin-bottom: 0;
          background-color:@blue;
          border-color:@blue;

          .mint-tab-item-label span {
              border-bottom: 2px solid #3B48C8;
              margin-bottom: -2px;
          }
      }

      .mint-tab-item-label {
          font-size: 0.3rem;
          line-height: 0.64rem;

          span {
              display: inline-block;
              height: 100%;
          }
      }
  }
}
</style>
