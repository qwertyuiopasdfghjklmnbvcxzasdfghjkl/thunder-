<template>
  <font>{{getCoinSign}}{{curPrice}}</font>
</template>

<script>
import { mapGetters } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import otc from '../api/otc'
export default {
  props: ['lastPrice', 'symbol', 'curCNYPrice', 'unitPrice'],
  data(){
    return {
      noMore: null,
    }
  },
  computed: {
    ...mapGetters(['getCoinSign']),
    curPrice(){
      let i = this.curCNYPrice
      console.log(this.lastPrice)
      if(this.lastPrice){
        i = numUtils.mul(this.lastPrice,this.curCNYPrice).toFixed(2)
      }
      // console.log(this.lastPrice, this.unitPrice)
      return i || '--'
    }
  },
  watch:{

  }
}
</script>
<style>
  font{
    display: inline-block;
    height: 0.32rem;
  }
</style>
