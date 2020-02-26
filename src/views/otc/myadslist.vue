<!--我的当前订单-->
<template>
    <section class="coin_content ft-c-lightGray">
        <div class="item" v-for="(item, index) in datas" :key="index">
            <ul>
                <li class="f28">
                    <section>
                        <span :class="[!isBuyType(item) ? 'red_color' : 'green_color']">{{getTradeType(item)}} {{item.symbol}}</span>
                    </section>
                    <section></section>
                    <section class="right">
                        <span :class="[item.status?'green_color':'red_color']">{{item.status?$t('public0.public51'):$t('public0.public52')}}<!--已上架--></span>
                    </section>
                </li>
                <li>
                    <section>
                        <span>{{$t('otc_exchange.otc_exchange_Trading_limits')}}：<!--交易限额--></span>
                        <span>{{item.min_amount}}-{{item.max_amount}} {{Number(item.ad_type) === 2 ? item.currency : item.symbol}}</span>
                        <span></span>
                    </section>
                    <section>{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></section>
                </li>
                <li>
                    <section>
                        <span>{{$t('message.msg_surplus')}}：<!--剩余--></span>
                        <span>{{item.remain_count}} {{item.symbol}}</span>
                    </section>
                    <section class="f32" :class="item.ad_type===1?'ft-c-success':'ft-c-main'">{{item.cur_price.toString().toMoney()}} {{item.currency}}</section>
                </li>
                <li>
                    <section>
                    </section>
                    <section>
                        <mt-button :type="'primary'" class="mini btn" @click="deleteAd(item.ad_id)" v-if="item.status">
                            {{$t('otc_ad.otc_cancel_ad')}}<!--下架广告-->
                        </mt-button>
                        <mt-button :type="'default'" class="mini btn"  @click="modifyAd(item.ad_id,item.symbol)" v-else>
                            {{$t('otc_ad.otc_edit_ad')}}<!--下架广告-->
                        </mt-button>
                    </section>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import otcApi from '@/api/otc'
export default {
  props:['params'],
  data () {
    return {
      datas: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken'])
  },
  watch: {
    getApiToken () {
      this.getMyCurAdsList()
    }
  },
  created () {
    this.getMyCurAdsList()
  },
  methods: {
    isBuyType (data) {
      let adsType = Number(data.ad_type)
      return adsType === 1
    },
    getTradeType (data) { // 交易类型
      let adsType = Number(data.ad_type)
      if (adsType === 1) {
        return this.$t('otc_exchange.otc_exchange_buy')
      }
      return this.$t('otc_exchange.otc_exchange_sell')
    },
    isGreenType (state) {
      state = Number(state)
      return state === 1 || state === 2
    },
    getAdsState (state) { // 获取订单状态
      state = Number(state)
      if (state === 1) {
        return this.$t('public0.public14') // 交易中
      } else if (state === 2) {
        return this.$t('otc_ad.otc_ad_completed') // 已完成
      } else if (state === 3) {
        return this.$t('public0.public25') // 已取消
      } else {
        return ''
      }
    },
    getMyCurAdsList () { // 获取我的当前广告
      if (!this.getApiToken) {
        this.datas = []
        return
      }
      this.datas = []
      otcApi.getMyAdvertisementList({
        ad_type: 0,
        symbol: null,
        page: 1,
        show: 10000
      }, (res) => {
        let dData = []
        res.forEach((item) => {
          // 类型转换
          item.status = parseInt(item.status)
          item.ad_type = parseInt(item.ad_type)
          item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
          if (item.ad_type === 2) {
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
          } else {
            item.min_amount = utils.removeEndZero(numUtils.BN(item.min_amount).toFixed(8))
            item.max_amount = utils.removeEndZero(numUtils.BN(item.max_amount).toFixed(8))
          }
          item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
          dData.push(item);
        })
        let compare = function(property){ return function(obj1,obj2){ var value1 = obj1[property]; var value2 = obj2[property]; return value2 - value1;} }
        dData = dData.sort(compare("status"))
        this.datas = dData
      }, (msg) => {
        console.error(msg)
      })
    },
    deleteAd (id) { // 下架广告
      otcApi.deleteAdvertisement(id, (msg) => {
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        this.getMyCurAdsList()
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    modifyAd (id,symbol) { // 修改广告
      otcApi.getPaySettings((res) => {
        this.$router.push({name:'otcAddOrUpdate', params:{orderId:id, symbol:symbol, myPayType: res.data.pay_type}})
      })
    },
  }
}
</script>

<style lang="less" scoped>
.green_color{color:#01C89F;}
.red_color{color:#3B48C8;}
.coin_content{
  font-size: .24rem;
  background-color: #fff;
  .item + .item {border-top:1px solid #eee;}
  ul{
    padding: .2rem 0.3rem;
    li{
      display: flex;
      justify-content: space-between;
      span {vertical-align: middle;}
    }
    li + li {
        margin-top: 0.1rem;
    }
  }
}

.btn {min-width: 2rem;}
</style>
