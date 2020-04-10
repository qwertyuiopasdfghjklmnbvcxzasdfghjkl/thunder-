<template>
  <div class="page">
    <top-back>{{$t('otc_ad.otc_order_details')}}<!--订单详情-->
      <i class="icon_service" slot="right" v-tap="{methods:goOnlineService}"></i>
    </top-back>
    <div class="page-main">
      <component
        :is="isBuyer"
        :adInfo="adInfo"
        :orderInfo="orderInfo"
        :serveTime="serveTime"
        :pay_type="pay_type"
      ></component>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OrderBuy from './order_buy'
import OrderSell from './order_sell'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import { MessageBox } from 'mint-ui'


export default {
  components: {
    OrderBuy,
    OrderSell
  },
  data(){
    return {
      data:{},
      pay_type: null // 广告收款方式
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
    isBuyer () {
      return this.data.orderInfo.to_user_name == this.getUserInfo.username ? OrderBuy:OrderSell
    },
    serveTime(){
      return utils.formatDate(this.data.cur_time).getTime()
    },
    adInfo(){
      return this.data.adInfo || {}
    },
    orderInfo(){
      let orderInfo = this.data.orderInfo || {}
      this.pay_type = this.data.adInfo.pay_type.split(',')

      orderInfo.total_price = utils.removeEndZero(utils.toFixed(orderInfo.currency_count,2)).toMoney()
      orderInfo.cur_price = utils.removeEndZero(utils.toFixed(orderInfo.cur_price,2)).toMoney()
      orderInfo.symbol_count = utils.removeEndZero(utils.toFixed(orderInfo.symbol_count,8)).toMoney()
      let date = utils.formatDate(orderInfo.updated_at).getTime()
      let ndate = utils.formatDate(this.data.cur_time).getTime()
      let diffTime = Math.floor((ndate - date) / 1000)
      let surplusTime = orderInfo.pay_apply_time * 60 - diffTime
      orderInfo.surplus_Time = surplusTime>0?surplusTime:0
      orderInfo.isExpire = surplusTime <= 0
      return orderInfo
    }
  },
  watch:{
    data(){
      if(this.data.orderInfo.state==1){
        setTimeout(this.getOrdersDetail, 10000)
      }
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
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy () {
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods:{
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent']),
    goOnlineService(){
      this.$router.push({name:'online'})
    },
    getOrdersDetail(){
      otcApi.ordersDetail(this.$route.params.orderId, (data) => {
        this.data = data
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    cancelApeal (appealManageId) { // 取消申诉
      otcApi.cancelAppeal(appealManageId, (msg) => {
        this.orderInfo.appeal_state = 2
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    systemEvent (data) {
      let optType = parseInt(data.operate_type)
      let childType = parseInt(data.child_type)
      if (optType === 1) { // 系统消息
        switch (childType) {
          case 31: // 新建订单消息
          case 32: // 取消订单消息
          case 33: // 系统自动取消订单消息
          case 34: // 买家付款消息
          case 35: // 正常放币消息
          case 36: // 强制放币买家消息
          case 37: // 强制放币卖家消息
          case 38: // 解除锁币消息
            let orderNumber = JSON.parse(data.link).order_number
            if (childType === 34) {
              if (orderNumber === this.orderInfo.order_number) {
                this.getOrderDetail()
              }
              // 买方已经标记确认付款，请查收！
              MessageBox.alert(this.$t('error_code.CONFIRM_PAYMENT')).then((action) => {}, (cancel) => {})
            } else if (childType === 35) {
              if (orderNumber === this.orderInfo.order_number) {
                this.orderInfo.state = 2
              }
              // 卖家已确认收款，并释放代币，请注意查收！
              MessageBox.alert(this.$t('error_code.SELLER_RELEASE_CURRENCY_WARN')).then((action) => {
                this.orderInfo.pay_state = 1
              }, (cancel) => {})
            }
            break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;

.grey {color: @grey;}
.blue {color: @blue;}

.icon_service {width: 100%; height: 0.9rem; background-image: url('../../assets/img/icon_service_min.png'); background-position: center; background-size: 0.38rem auto;}
</style>
