<template>
  <div class="page">
    <top-back>{{$t('订单详情')}}<!--订单详情-->
      <i class="icon_service" slot="right" v-tap="{methods:goOnlineService}"></i>
    </top-back>
    <div class="page-main">
      <component :is="isBuyer" :adInfo="adInfo" :orderInfo="orderInfo" :adPay="adPay"></component>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OrderBuy from './order_buy'
import OrderSell from './order_sell'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'


export default {
  components: {
    OrderBuy,
    OrderSell
  },
  data(){
    return {
      data:{}
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
    isBuyer () {
      return this.data.orderInfo.to_user_name == this.getUserInfo.username ? OrderBuy:OrderSell
    },
    adInfo(){
      return this.data.adInfo || {}
    },
    adPay(){
      return this.adInfo.pay_type && this.adInfo.pay_type.split(',') || []
    },
    orderInfo(){
      let orderInfo = this.data.orderInfo || {}
      orderInfo.total_price = utils.removeEndZero(utils.toFixed(orderInfo.currency_count,2)).toMoney()
      orderInfo.cur_price = utils.removeEndZero(utils.toFixed(orderInfo.cur_price,2)).toMoney()
      orderInfo.symbol_count = utils.removeEndZero(utils.toFixed(orderInfo.symbol_count,8)).toMoney()
      orderInfo.surplus_Time = '00:00'
      let date = utils.formatDate(orderInfo.apply_time).getTime()
      let ndate = utils.formatDate(this.data.cur_time).getTime()
      let diffTime = Math.floor((ndate - date) / 1000)
      let surplusTime = orderInfo.pay_apply_time * 60 - diffTime
      let interval = utils.countDown(surplusTime, (time) => {
        if (time === '00:00') {
          orderInfo.isExpire = true
        } else if (time === '05:00' && orderInfo.to_user_name === this.getUserInfo.username && orderInfo.pay_state === 0) {
          // 您的付款确认时间还剩5分钟，5分钟后系统将自动取消订单！请付款并标记确认付款！
          // 添加系统消息
          this.$emit('addSystemMessage', orderInfo.order_number, 'PAYMENT_TIMEOUT_REMIND')
        }
        orderInfo.surplus_Time = time
      })
      orderInfo.isExpire = surplusTime <= 0
      return orderInfo
    }
  },
  beforeRouteEnter (to, from, next) {
    Indicator.open()
    otcApi.ordersDetail(to.params.orderId, (data) => {
      to.params.data = data
      Indicator.close()
      next()
    }, (msg) => {
      Indicator.close()
      Tip({type: 'danger', message: vm.$t(`error_code.${msg}`)})
    })
  },
  created(){
    this.data = this.$route.params.data
  },
  methods:{
    goOnlineService(){
      
    },
  }
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;

.grey {color: @grey;}
.blue {color: @blue;}

.icon_service {width: 0.38rem; height: 0.9rem; background-image: url('../../assets/img/icon_service_min.png'); background-position: center;}
</style>
