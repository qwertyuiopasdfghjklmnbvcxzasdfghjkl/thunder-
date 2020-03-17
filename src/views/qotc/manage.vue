<template>
  <div class="page">
    <top-back style="background-color: transparent;"></top-back>
    <div class="page-main">
      <p class="mt20 f44">OTC管理</p>
      <div class="bgblock mt40">
        <div class="capitalize">{{getUserInfo.userRealName}}</div>
        <div class="ui-flex classify">
          <div class="ui-flex-1" v-tap="{methods:$root.routeTo, to:'qotcOrders', query:{state:2}}">
            <h2>总完成单</h2>
            <h1>{{succeed}}</h1>
          </div>
          <div class="ui-flex-1" v-tap="{methods:$root.routeTo, to:'qotcOrders', query:{state:1}}">
            <h2>未完成单</h2>
            <h1>{{inprocess}}</h1>
          </div>
        </div>
      </div>
      <ul class="bgblock mt20 list">
        <router-link :to="{name:'adManage'}" tag="li" >
          我的广告
          <i class="allow-right"></i>
        </router-link>
        <router-link :to="{name:'qotcOrders'}" tag="li">
          我的订单
          <i class="allow-right"></i>
        </router-link>
        <router-link :to="{name:'set-payway'}" tag="li">
          支付管理
          <i class="allow-right"></i>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'


export default {
  data(){
    return {
      succeed:0,
      inprocess:0
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
    
  },
  created(){
    this.getSuccessOrders()
    this.getInProcessOrders()
  },
  
  methods:{
    ...mapActions([]),
    getSuccessOrders(){
      otcApi.getOrdersList({page:1 ,show:1, state:2}, (res, serverTime, total) => {
        this.succeed = total
      })
    },
    getInProcessOrders(){
      otcApi.getOrdersList({page:1 ,show:1, state:1}, (res, serverTime, total) => {
        this.inprocess = total
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  background-image: url('../../assets/img/otc_manage_bg.png');
  background-repeat:no-repeat;
  background-position: top center;
  background-size: cover;
}
.bgblock {
  background-color: #151C2C;
  border-radius: 0.1rem;
}
.capitalize {
  padding: 0.4rem 0.3rem 0.35rem;
  text-transform: capitalize;
  font-size: 0.36rem;
}
.classify {
  border-top: 1px solid #273246;
  > div {
    padding: 0.3rem;
    &:last-of-type {
      border-left: 1px solid #273246;
    }
    h2 {color: #4C5A74; font-size: 0.26rem;}
    h1 {font-size: 0.36rem; margin-top: 0.2rem;}
  }
}
.list li {
  line-height: 1rem;
  border-bottom: 1px solid #273246;
  padding:0 0.3rem;
  position:relative;
  font-size: 0.32rem;
  .allow-right::after {border-color: #6F7F8F;}
  &:last-of-type {
    border-bottom: none;
  }
}
</style>
