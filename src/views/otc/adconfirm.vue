<template>
  <div class="ad-confirm">
      <div class="title">{{$t(item.ad_type === 1 ? 'otc_exchange.otc_exchange_buy' : 'otc_exchange.otc_exchange_sell')}} {{item.symbol}}</div>
      <ul class="ad-detail mt10">
          <li class="ad-row">
            <span class="ad-price">{{$t('public0.public256')}}<!--当前价格--></span> <span>{{item.isATN ? item.lowest_price : item.lowestPrice}} {{item.currency}}</span>
          </li>
          <li class="ad-row" v-if="!item.isATN">
            <span class="ad-amount">{{$t('otc_ad.otc_ad_Premium')}}<!--溢价--></span> <span>{{item.price_rate || '--'}}%</span>
          </li>
          <li class="ad-row" v-if="!item.isATN">
            <span class="ad-money">{{tradeParams.title}}<!--可接受的最高单价||可接受的最低单价--></span> <span>{{item.lowest_price || '--'}} {{item.currency}}</span>
          </li>
          <li class="ad-row">
            <span class="ad-pay">{{$t('otc_ad.otc_ad_Payment_method')}}<!--支付方式--></span> <span><em v-for="item in paylist" :key="item.id" :class="item.className"></em></span>
          </li>
      </ul>
  </div>
</template>

<script>
import otcConfig from '@/assets/js/otcconfig'
export default {
  props: ['item'],
  computed: {
    paylist () {
      let datas = []
      let payType = this.item.pay_type || ''
      otcConfig.payments.forEach((item) => {
        if (payType.indexOf(item.id) !== -1) {
          datas.push(item)
        }
      })
      return datas
    },
    tradeParams () {
      if (this.item.ad_type === 2) {
        return {
          title: this.$t('public0.public137') // 可接受的最高单价
        }
      } else if (this.item.ad_type === 1) {
        return {
          title: this.$t('public0.public136') // 可接受的最低单价
        }
      }
    }
  }
}
</script>

<style scoped>
.title{font-weight: bold;font-size: 0.32rem;line-height: 0.7rem;color: #3B48C8;border-bottom: 1px solid #3B48C8;}
.ad-row{display: flex; justify-content: space-between;}
.ad-row span{line-height: 0.55rem;}
.ad-row span:first-of-type{color: #999;}
.ad-pay em{margin-left: 4px;}
</style>
