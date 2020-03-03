<template>
  <div class="page">
    <top-back>{{$t('otc_ad.otc_ad_view_details')}}<!--查看详情--></top-back>

    <div class="page-main">
      <h1 class="title">
        <strong><template v-if="item.direction===1">{{item.toSymbol}}/{{item.fromSymbol}}</template><template v-else>{{item.fromSymbol}}/{{item.toSymbol}}</template></strong>
        <span v-if="item.direction===1">{{$t('exchange.exchange_buys')}}</span><span class="sell" v-else>{{$t('exchange.exchange_sells')}}</span>
      </h1>
      <ul class="detail">
        <li><span>{{$t('exchange.exchange_date')}}</span><span>{{new Date(Number(item.createdAt)).format()}}</span></li>
        <li><span>{{$t('exchange.exchange_Transaction_price')}}</span><span>{{getPrice(item.averagePrice)}} <template v-if="item.direction===1">{{item.fromSymbol}}</template><template v-else>{{item.toSymbol}}</template></span></li>
        <li><span>{{$t('exchange.exchange_Transaction_volume')}}</span><span>{{toFixed(item.finishedAmount)}} <template v-if="item.direction===1">{{item.toSymbol}}</template><template v-else>{{item.fromSymbol}}</template></span></li>
        <li><span>{{$t('exchange.exchange_Transaction_amount')}}</span><span>{{toFixed(item.dealCurrency)}} {{item.direction === 1 ? item.fromSymbol : item.toSymbol}}</span></li>
        <li><span>{{$t('exchange.advanced_fee')}}</span><span v-html="fee(item)"></span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import numUtils from '@/assets/js/numberUtils'
import market from '@/api/market'
import Utils from '@/assets/js/utils'
export default {
  name: 'trans-detail',
  data(){
    return {
      item:{},
      fixedNumber: 8,
      symbolDeduction:''
    }
  },
  created(){
    this.item = this.$route.params.detail || {}
    this.getgetSysparams()
  },
  methods:{
    getgetSysparams () {
      market.getSysparams((res) => {
        res.forEach((item) => {
          if (item.code === 'symbolDeduction') {
            this.symbolDeduction = item.value
          }
        })
      })
    },
    fee(item){
      if(Number(item.deductionFee)){
        return `${this.toFixed(item.fee)} ${item.toSymbol}<br />${this.toFixed(item.deductionFee)} ${this.symbolDeduction}`
      } else {
        return `${this.toFixed(item.fee)} ${item.toSymbol}`
      }
    },
    getPrice (price) { // 价格
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return Utils.removeEndZero(this.toFixed(price))
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  text-align: center;
  margin-top: 0.3rem;
  font-size: 0.4rem;
  line-height: 0.6rem;
  span {
    color: #0EB574;
    display: block;
  }
  span.sell {
    color: #CD3F46;
  }
}
.detail {padding: 0.5rem; margin-top: 0.3rem;}
.detail li{
  text-align: right;
  display: flex;
  justify-content: space-between;
  line-height: 0.6rem;
  span:first-of-type {color: #4B5875;}
}
</style>
