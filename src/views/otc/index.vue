<template>
  <div class="page">
    <top-back>快捷买卖<!--快捷买卖--></top-back>
    <div class="tabs">
      <mt-navbar v-model="active">
        <mt-tab-item id="buys"><span>{{$t('exchange.exchange_buys')}}<!--买币--></span></mt-tab-item>
        <mt-tab-item id="sells"><span>{{$t('exchange.exchange_sells')}}<!--卖币--></span></mt-tab-item>
        <mt-tab-item id="incomplete"><span>{{$t('public0.public140')}}<!--未完成订单--></span></mt-tab-item>
        <mt-tab-item id="completed"><span>{{$t('otc_ad.otc_ad_Order_completed')}}<!--已完成订单--></span></mt-tab-item>
        <mt-tab-item id="current"><span>{{$t('public0.public155')}}<!--当前广告--></span></mt-tab-item>
      </mt-navbar>
    </div>

    <div class="full bg-c-white" v-show="active!=='incomplete'">
      <section class="coin_header">
        <template v-if="active === 'buys' || active === 'sells' || active === 'current'">
          <select class="symbol" v-model="globalParams.symbol">
            <option v-for="(item, index) in symbolList" :value="item.symbol">{{item.symbol}}</option>
          </select>
          <span>/</span>
          <select class="currency" v-model="globalParams.currency">
            <option v-for="(item, index) in currencyList" :value="item.value">{{$t(item.text)}}</option>
          </select>
        </template>
        <select class="state" v-if="active === 'completed'" v-model="globalParams.state">
          <option :value="2">{{$t('otc_ad.otc_ad_Order_completed')}}<!--已完成订单--></option>
          <option :value="3">{{$t('otc_ad.otc_ad_cancelled_order')}}<!--已取消订单--></option>
        </select>
        <template  v-if="active === 'current'" >
          <span>/</span>
          <select class="adType" v-model="globalParams.ad_type">
            <option :value="1">{{$t('otc_exchange.otc_exchange_buys')}}</option>
            <option :value="2">{{$t('otc_exchange.otc_exchange_sell')}}</option>
          </select>
        </template>
        <button type="button" class="pub-ad" v-if="active === 'current'" @click="createorder">{{$t('otc_ad.otc_post_ad')}}</button>
      </section>
    </div>

    <div class="page-main" :class="{nobar:active==='incomplete'}">
      <mt-tab-container v-model="active" :swipeable="true">
        <mt-tab-container-item id="buys">
          <adslist :params="globalParams" @placeOrderClick="placeOrderClick"></adslist>
        </mt-tab-container-item>

        <mt-tab-container-item id="sells">
          <adslist :params="globalParams" @placeOrderClick="placeOrderClick"></adslist>
        </mt-tab-container-item>

        <mt-tab-container-item id="incomplete">
          <orderlist ref="curOrderList" :params="globalParams" iscroll="curOrderList"></orderlist>
        </mt-tab-container-item>

        <mt-tab-container-item id="completed" iscroll="finishedOrderList">
          <orderlist ref="finishedOrderList" :params="globalParams"></orderlist>
        </mt-tab-container-item>

        <mt-tab-container-item id="current">
          <myadslist :params="globalParams"></myadslist>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
      <placeorder :params="globalParams" :ad_id="adsId" @hidePlaceOrderDialog="hidePlaceOrderDialog"></placeorder>
    </mt-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import otcConfig from '@/assets/js/otcconfig'
import otcApi from '@/api/otc'
import adslist from '@/views/otc/adslist'
import orderlist from '@/views/otc/orderlist'
import placeorder from '@/views/otc/placeorder'
import myadslist from '@/views/otc/myadslist'

export default {
  name: 'otc',
  components: {
    adslist,
    orderlist,
    placeorder,
    myadslist
  },
  data () {
    return {
      placeOrderVisible: false,
      scroll: false,
      active: 'buys',
      adsId: null,
      symbolList: otcConfig.coins,
      currencyList: otcConfig.currencys,
      globalParams: {
        ad_type: 2,
        symbol: 'ETH',
        currency: 'CNY',
        state: 1, // 1未完成订单 2已完成订单 3已取消订单
        type: 0, // 0当前广告 1历史广告
        pay_type: null,
        sort_mode: 1, // 1价格升序 2信用降序 3价格降序
        page: 1,
        show: 10
      }
    }
  },
  watch: {
    placeOrderVisible (bool) {
      if (!bool) {
        this.adsId = null
      }
    },
    'globalParams.symbol'(_new){
      this.$router.replace({name:'otc', query:{tab:this.active,symbol:_new}})
    },
    active(_new){
      if(_new==='buys'){
        this.globalParams.ad_type = 2
        this.globalParams.sort_mode = 1
      } 
      if(_new==='sells'){
        this.globalParams.ad_type = 1
        this.globalParams.sort_mode = 3
      } 
      if(_new==='incomplete'){
        this.globalParams.state = 1
      }
      if(_new==='completed'){
        if(this.globalParams.state===1){
          this.globalParams.state = 2
        }
      } 
      if(_new==='current'){
        this.globalParams.state = 2
      } 
      this.$router.replace({name:'otc', query:{tab:_new,symbol:this.globalParams.symbol}})
    }
  },
  created(){
    this.globalParams.symbol = this.$route.query.symbol || 'ETH'
    if(this.$route.query.tab){
      this.active = this.$route.query.tab
      if(this.active==='buys'){
        this.globalParams.ad_type = 2
        this.globalParams.sort_mode = 1
      } 
      if(this.active==='sells'){
        this.globalParams.ad_type = 1
        this.globalParams.sort_mode = 3
      } 
      if(this.active==='incomplete'){
        this.globalParams.state = 1
      }
      if(this.active==='completed'){
        this.globalParams.state = 2
      } 
      if(this.active==='current'){
        this.globalParams.state = 2
      } 
    }
  },
  mounted(){
    let self = this
    $('[iscroll]').scroll(function(){
      if(($(this)[0].scrollTop + $(this).height() + window.innerHeight/1.5) >= $(this)[0].scrollHeight) {
        self.$refs[$(this).attr('iscroll')].loadMore()
      }
    })
  },
  computed: {
    ...mapGetters(['getApiToken','getLang']),
  },
  methods: {
    goToMyCenter () {
      this.$router.push('/realname')
    },
    goToSettings () {
      this.$router.push('/payway')
    },
    checkSetState (successCallback, message, isCheckPaySet, isCheckPayType, id) {
      if (!this.getApiToken) {
        Tip({type: 'danger', message: this.$t(message)}) // 请登录后再发布广告||请登录后再交易
        return
      }
      otcApi.getVerifyState((msg) => {
        if (isCheckPaySet) {
          otcApi.getPaySettings((res) => {
            if (isCheckPayType) {
              otcApi.matchPayTypes(id, (data2) => {
                this.matchPayType = data2
                successCallback && successCallback()
              }, (msg3) => {
                if (msg3 === 'PAY_TYPE_UNMATCH') {
                  Vue.$confirmDialog({
                    id: 'PAY_TYPE_UNMATCH',
                    content: this.$t('error_code.PAY_TYPE_UNMATCH'), // 支付方式不匹配，请设置对应的支付方式
                    okCallback: () => {
                      this.goToSettings()
                    }
                  })
                } else {
                  Tip({type: 'danger', message: this.$t(`error_code.${msg3}`)})
                }
              })
            } else {
              successCallback && successCallback(res.data.pay_type)
            }
          }, (res) => {
            if (res.msg === 'NO_PAY_TYPE') {
              Vue.$confirmDialog({
                id: 'NO_PAY_TYPE',
                content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                okCallback: () => {
                  this.goToSettings()
                }
              })
            } else {
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            }
          })
        } else {
          successCallback && successCallback()
        }
      }, (msg) => {
        if (msg === 'KYC_AUTH_FIRST') {
          Vue.$confirmDialog({
            id: 'KYC_AUTH_FIRST',
            content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            okCallback: () => {
              this.goToMyCenter()
            }
          })
        } else {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    createorder () { // 添加广告
      this.checkSetState((myPayType) => {
        this.$router.push({name:'otcAddOrUpdate', params:{
          ad_type: this.globalParams.ad_type,
          currency: this.globalParams.currency,
          symbol:this.globalParams.symbol,
          myPayType: myPayType
        }})
      }, 'public0.public109', true, false)
    },
    hidePlaceOrderDialog (bool) {
      this.placeOrderVisible = false
      if (bool) {
        this.active = 'incomplete'
        this.$refs.curOrderList.getOrderList()
      }
    },
    placeOrderClick (item) {
      this.placeOrderVisible = true
      this.adsId = item.ad_id
    },
  }
}
</script>

<style lang="less" scoped>
.page-main {top: 2.8rem; padding-left:0; padding-right: 0; &.nobar {top: 2rem;}}
.tabs {
  margin-top: 0.9rem;
  .mint-navbar {justify-content: space-around; border-bottom: 1px solid #eee;}
  /deep/ .mint-tab-item {
    flex: none;
    height: 0.9rem;
    color: #999;
    padding: 0;
    &.is-selected {
        color: #3B48C8; border-bottom: none; margin-bottom: 0;
        .mint-tab-item-label span{
            border-bottom: 2px solid #3B48C8;
            margin-bottom: -2px;
        }
    }
    &.is-selected:last-of-type .mint-tab-item-label span {border-bottom: none;}
    .mint-tab-item-label {
        font-size: 0.3rem;
        line-height: 0.9rem;
        span {display: inline-block; height: 100%; position: relative; z-index: 1;}
    }
  }
}

.coin_header {
  height: .8rem;
  position: relative;
  padding: 0 0.3rem;
  border-bottom: 1px solid #eee;
  select {
    height: .8rem;
    vertical-align: middle;
    background-color:transparent;
    border: none;
  }
  span {
    display: inline-block;
    width: .48rem;
    height: .75rem;
    font-size: .3rem;
    line-height: .75rem;
    text-align: center;
    vertical-align: middle;
  }
}

.mint-tab-container{height:100%;}
.mint-tab-container /deep/ .mint-tab-container-wrap{height:100%;}
.mint-tab-container /deep/ .mint-tab-container-item{overflow:auto;}
.place_order_popup{width:100%;}

.pub-ad {
  position: absolute;
  right: -0.1rem;
  min-width: 2rem;
  height: 100%;
  color: #fff;
  font-size: 0.24rem;
  background-color: #3B48C8;
  cursor: pointer;
  border: 1px solid #3B48C8;
}
</style>
