<template>
  <div class="">
    <!--<top-back>快捷买卖&lt;!&ndash;快捷买卖&ndash;&gt;</top-back>-->
    <div class="tab">
      <!--<mt-navbar v-model="active">-->
        <!--<mt-tab-item id="buys"><span>{{$t('exchange.exchange_buys')}}&lt;!&ndash;买币&ndash;&gt;</span></mt-tab-item>-->
        <!--<mt-tab-item id="sells"><span>{{$t('exchange.exchange_sells')}}&lt;!&ndash;卖币&ndash;&gt;</span></mt-tab-item>-->
        <!--&lt;!&ndash;<mt-tab-item id="incomplete"><span>{{$t('public0.public140')}}&lt;!&ndash;未完成订单&ndash;&gt;</span></mt-tab-item>&ndash;&gt;-->
        <!--&lt;!&ndash;<mt-tab-item id="completed"><span>{{$t('otc_ad.otc_ad_Order_completed')}}&lt;!&ndash;已完成订单&ndash;&gt;</span></mt-tab-item>&ndash;&gt;-->
        <!--&lt;!&ndash;<mt-tab-item id="current"><span>{{$t('public0.public155')}}&lt;!&ndash;当前广告&ndash;&gt;</span></mt-tab-item>&ndash;&gt;-->
      <!--</mt-navbar>-->

      <div class="ui-flex ui-flex-justify f32">
        <div class="tabs">
          <span :class="{active:active === 'buys'}"
                v-tap="{methods:()=>{active = 'buys'}}">{{$t('otc_exchange.otc_exchange_want_buy')}}<!-- 我要买币 --></span>
          <span :class="{active:active === 'sells'}"
                v-tap="{methods:()=>{active = 'sells'}}">{{$t('otc_exchange.otc_exchange_want_sell')}}<!-- 我要卖币 --></span>
        </div>
        <div><router-link :to="{name:'qotcManage'}" tag="span">{{$t('qotc.otc_manage')}}<!-- OTC管理 --></router-link></div>
      </div>

      <swiper :options="swiperOption" class="tokens mt30">
        <!-- 幻灯内容 -->
        <swiper-slide li v-for="(item, index) in symbolList" :key="index">
          <div class="token" :class="{active:symbol===item.symbol}"
               v-tap="{methods:()=>{symbol = item.symbol}}">
            <i class="icon_ checked"></i> {{item.symbol}}
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

    </div>

    <div class="full bg-c-white" v-show="false">
      <section class="coin_header">
        <!--<template v-if="active === 'buys' || active === 'sells' || active === 'current'">-->
          <!--<select class="symbol" v-model="globalParams.symbol">-->
            <!--<option v-for="(item, index) in symbolList" :value="item.symbol">{{item.symbol}}</option>-->
          <!--</select>-->
          <!--<p>-->
            <!--<span  v-for="(item, index) in symbolList">{{item.symbol}}</span>-->
          <!--</p>-->

          <!--&lt;!&ndash;<select class="currency" v-model="globalParams.currency">&ndash;&gt;-->
            <!--&lt;!&ndash;<option v-for="(item, index) in currencyList" :value="item.value">{{$t(item.text)}}</option>&ndash;&gt;-->
          <!--&lt;!&ndash;</select>&ndash;&gt;-->
        <!--</template>-->
        <!--<select class="state" v-if="active === 'completed'" v-model="globalParams.state">-->
          <!--<option :value="2">{{$t('otc_ad.otc_ad_Order_completed')}}&lt;!&ndash;已完成订单&ndash;&gt;</option>-->
          <!--<option :value="3">{{$t('otc_ad.otc_ad_cancelled_order')}}&lt;!&ndash;已取消订单&ndash;&gt;</option>-->
        <!--</select>-->
        <!--<template  v-if="active === 'current'" >-->
          <!--<span>/</span>-->
          <!--<select class="adType" v-model="globalParams.ad_type">-->
            <!--<option :value="1">{{$t('otc_exchange.otc_exchange_buys')}}</option>-->
            <!--<option :value="2">{{$t('otc_exchange.otc_exchange_sell')}}</option>-->
          <!--</select>-->
        <!--</template>-->
        <!--<button type="button" class="pub-ad" v-if="active === 'current'" @click="createorder">{{$t('otc_ad.otc_post_ad')}}</button>-->
      </section>
    </div>

    <div class="page-main" :class="{nobar:active==='incomplete'}">
      <adslist v-show="active === 'buys'"
               :hasPay="pay" :params="buyParams"
               @placeOrderClick="placeOrderClick"></adslist>
      <adslist v-show="active === 'sells'"
               :params="sellParams"
               @placeOrderClick="placeOrderClick"></adslist>
      <!--<mt-tab-container v-model="active" :swipeable="true">-->
        <!--<mt-tab-container-item id="buys">-->
         <!---->
        <!--</mt-tab-container-item>-->

        <!--<mt-tab-container-item id="sells">-->
          <!---->
        <!--</mt-tab-container-item>-->

        <!--&lt;!&ndash;<mt-tab-container-item id="incomplete">&ndash;&gt;-->
          <!--&lt;!&ndash;<orderlist ref="curOrderList" :params="globalParams" iscroll="curOrderList"></orderlist>&ndash;&gt;-->
        <!--&lt;!&ndash;</mt-tab-container-item>&ndash;&gt;-->

        <!--&lt;!&ndash;<mt-tab-container-item id="completed" iscroll="finishedOrderList">&ndash;&gt;-->
          <!--&lt;!&ndash;<orderlist ref="finishedOrderList" :params="globalParams"></orderlist>&ndash;&gt;-->
        <!--&lt;!&ndash;</mt-tab-container-item>&ndash;&gt;-->

        <!--&lt;!&ndash;<mt-tab-container-item id="current">&ndash;&gt;-->
          <!--&lt;!&ndash;<myadslist :params="globalParams"></myadslist>&ndash;&gt;-->
        <!--&lt;!&ndash;</mt-tab-container-item>&ndash;&gt;-->
      <!--</mt-tab-container>-->
    </div>

    <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
      <placeorder :params="active === 'buys'? buyParams: sellParams" :ad_id="adsId" @hidePlaceOrderDialog="hidePlaceOrderDialog"></placeorder>
    </mt-popup>
    <mt-popup class="place_order_popup" v-model="payTypeShow" position="bottom">
        <pay-type @hidePay="hidePay"/>
    </mt-popup>

    <!-- 二次确认 -->
    <confirm
      ref="confirm"
      @callBack="createOrders"
    ></confirm>
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
import PayType from "./payType";
import confirm from '@/views/qotc/components/confirm'

export default {
  name: 'otc',
  components: {
    PayType,
    adslist,
    orderlist,
    placeorder,
    myadslist,
    confirm
  },
    props:['pay'],
  data () {
    return {
      placeOrderVisible: false,
      scroll: false,
      active: 'buys',
      adsId: null,
      symbolList: otcConfig.coins,
      currencyList: otcConfig.currencys,
      swiperOption: {
        // 所有配置均为可选（同Swiper配置）
        observer: true,
        resistanceRatio:0,
        slidesPerView: 'auto',
        spaceBetween: 15,
        freeMode: true
      },
        payTypeShow:false,
        params: {},
        symbol: "USDT",
        currency: 'CNY',
        submitData: ''
    }
  },
    computed: {
        ...mapGetters(['getApiToken','getLang']),
        hasPay(){
            return this.pay
        },
        buyParams(){
            return {
                ad_type: 2,
                symbol: this.symbol,
                currency: this.currency,
                state: 1, // 1未完成订单 2已完成订单 3已取消订单
                type: 0, // 0当前广告 1历史广告
                pay_type: null,
                sort_mode: 1, // 1价格升序 2信用降序 3价格降序
                show: 10
            }
        },
        sellParams(){
            return {
                ad_type: 1,
                symbol: this.symbol,
                currency: this.currency,
                state: 1, // 1未完成订单 2已完成订单 3已取消订单
                type: 0, // 0当前广告 1历史广告
                pay_type: null,
                sort_mode: 3, // 1价格升序 2信用降序 3价格降序
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
    // 'globalParams.symbol'(_new){
    //   this.$router.replace({name:'otc', query:{tab:this.active,symbol:_new}})
    // },
    // active(_new){
    //   if(_new==='buys'){
    //     this.globalParams.ad_type = 2
    //     this.globalParams.sort_mode = 1
    //   }
    //   if(_new==='sells'){
    //     this.globalParams.ad_type = 1
    //     this.globalParams.sort_mode = 3
    //   }
    //   if(_new==='incomplete'){
    //     this.globalParams.state = 1
    //   }
    //   if(_new==='completed'){
    //     if(this.globalParams.state===1){
    //       this.globalParams.state = 2
    //     }
    //   }
    //   if(_new==='current'){
    //     this.globalParams.state = 2
    //   }
    //   // this.$router.replace({name:'otc', query:{tab:_new,symbol:this.globalParams.symbol}})
    // }
  },
  created(){
    // this.globalParams.symbol = this.$route.query.symbol || 'ETH'
    // if(this.$route.query.tab){
    //   this.active = this.$route.query.tab
    //   if(this.active==='buys'){
    //     this.globalParams.ad_type = 2
    //     this.globalParams.sort_mode = 1
    //   }
    //   if(this.active==='sells'){
    //     this.globalParams.ad_type = 1
    //     this.globalParams.sort_mode = 3
    //   }
    //   if(this.active==='incomplete'){
    //     this.globalParams.state = 1
    //   }
    //   if(this.active==='completed'){
    //     this.globalParams.state = 2
    //   }
    //   if(this.active==='current'){
    //     this.globalParams.state = 2
    //   }
    // }
  },
  mounted(){
    let self = this
    $('[iscroll]').scroll(function(){
      if(($(this)[0].scrollTop + $(this).height() + window.innerHeight/1.5) >= $(this)[0].scrollHeight) {
        self.$refs[$(this).attr('iscroll')].loadMore()
      }
    })
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
    hidePlaceOrderDialog (bool, data) {
      this.placeOrderVisible = false
      if (bool) {
          console.log(data)
          this.params = data
          if(data.trade_type === 1){
              this.subOrder(data)
          }else{
              this.payTypeShow = true
          }
      }
    },
      hidePay(data){
        console.log(data)
          this.payTypeShow = false
          if(data){
              this.params.payType = data.payType
              this.subOrder(this.params)
          }
      },
      subOrder(data){
          this.submitData = data
          if(data.trade_type === 2){
            this.$refs.confirm.openConfirm()
          } else {
            this.createOrders({})
          }
      },
      createOrders(data) {
        const _data = {
          ...this.submitData,
          orderFinishDto: data
        }
        otcApi.createOrders(_data, (id, msg) => {
            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
            this.$router.replace({name:'orderDetail', params:{orderId:id}})
        }, (msg) => {
            console.log(msg)
            let errMsg = typeof msg === 'string' ? msg : msg[0]
            Tip({type: 'danger', message: this.$t(`error_code.${errMsg}`)})
        })
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
/*.tabs {*/
  /*margin-top: 0.9rem;*/
  /*.mint-navbar {justify-content: space-around; border-bottom: 1px solid #eee;}*/
  /*/deep/ .mint-tab-item {*/
    /*flex: none;*/
    /*height: 0.9rem;*/
    /*color: #999;*/
    /*padding: 0;*/
    /*&.is-selected {*/
        /*color: #3B48C8; border-bottom: none; margin-bottom: 0;*/
        /*.mint-tab-item-label span{*/
            /*border-bottom: 2px solid #3B48C8;*/
            /*margin-bottom: -2px;*/
        /*}*/
    /*}*/
    /*&.is-selected:last-of-type .mint-tab-item-label span {border-bottom: none;}*/
    /*.mint-tab-item-label {*/
        /*font-size: 0.3rem;*/
        /*line-height: 0.9rem;*/
        /*span {display: inline-block; height: 100%; position: relative; z-index: 1;}*/
    /*}*/
  /*}*/
/*}*/

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
@grey:#4B5875;
@blue:#0C6AC9;
/*.page-main {padding-bottom: 0.3rem;}*/

.grey {color: @grey;}
.blue {color: @blue;}
.tabs {
  color: @grey;
  font-weight: 600;
  span {
    display: inline-block;
    &.active {color: #FFFFFF; font-size: 0.44rem;}
  }
  span + span {margin-left: 0.3rem;}
}
.tokens {
  /deep/ .swiper-slide {width: auto;}
  .token {height: 0.6rem; padding-left: 0.24rem; padding-right: 0.24rem; line-height: 0.6rem; background-color: #212A40; color: @grey; border-radius: 0.28rem;}
  .token.active {color: @blue;}
  .icon_ {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_unchecked.png');}
  .token.active .icon_ {background-image: url('../../assets/img/icon_checked.png');}
}
.amount-container {
  position: relative;
  height: 0.7rem;
  padding-bottom: 0.2rem;
  border-bottom:1px solid #273246;
  line-height: 0.5rem;
  > div {position: absolute; left: 0; right: 0;}
  input {color: #fff; border: none; background-color: transparent; font-size: 0.48rem; vertical-align: middle;}
}
.icon_exchange {width: 0.32rem; height: 0.34rem; background-image: url('../../assets/img/icon_exchange.png');}
.bgblock { background-color: #151C2C; padding: 0.3rem; }
.payments {
  li {
    line-height: 0.8rem;
    i {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_unchecked.png');}
    &.active {
      color: @blue;
      i {background-image: url('../../assets/img/icon_checked.png');}
    }
  }
}
.bottom-layer {
  position:absolute;
  left: 0.3rem;
  right: 0.3rem;
  bottom:0.6rem;
}
.online-service {
  position: absolute;
  bottom:2.16rem;
  right: 0.3rem;
  width: 0.9rem;
  height: 0.9rem;
  z-index: 9999;
  background-image: url('../../assets/img/icon_service.png');
}
.add-advertisement {
  position: absolute;
  bottom:3.36rem;
  right: 0.3rem;
  width: 0.9rem;
  height: 0.9rem;
  z-index: 9999;
  background-image: url('../../assets/img/icon_add_advertisement.png');
}
  .tab{
    margin-top: 0.9rem;
    padding: 0.3rem;
  }

</style>
