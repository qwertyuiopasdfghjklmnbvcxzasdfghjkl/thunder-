<template>
  <div class="page">
    <top-back>{{$t('订单详情')}}<!--订单详情-->
      <i class="icon_service" slot="right" v-tap="{methods:goOnlineService}"></i>
    </top-back>
    <div class="page-main">
      <component :is="order"></component>
    </div>
  </div>
</template>

<script>
import OrderBuy from './order_buy'


export default {
  components: {
    OrderBuy,
  },
  data(){
    return {
      orderType:1,  //订单类型1是买，2是卖
    }
  },
  computed:{
    order(){
      return this.orderType==1?OrderBuy:OrderBuy
    }
  },
  created(){
    this.orderType = Number(this.$route.query.type || 1)
  },
  methods:{
    goOnlineService(){
      
    }
  }
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;

.grey {color: @grey;}
.blue {color: @blue;}

.icon_service {width: 0.38rem; height: 0.36rem; background-image: url('../../assets/img/icon_service_min.png');}
</style>
