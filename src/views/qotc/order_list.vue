<template>
  <div class="page">
    <top-back>
      {{$t('usercontent.user60')}}<!--我的订单-->
      <i slot="right" class="icon_ filter" v-tap="{methods:showFilter}"></i>
    </top-back>

    <div class="page-main">
      <div class="full">
        <mt-loadmore
        :top-method="loadTop"
        :top-pull-text="$t('home.top-pull-text')"
        :top-drop-text="$t('home.drop-text')"
        :top-loading-text="$t('home.loading-text')"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :bottom-pull-text="$t('public0.loadmore')+'...'"
        :bottom-drop-text="$t('home.drop-text')"
        :bottom-loading-text="$t('home.loading-text')"
        :autoFill="false"
          ref="loadmore">
          <ul class="list mt20">
            <li v-for="item in datas" v-tap="{methods:$root.routeTo, to:'orderDetail',params:{orderId:item.order_id}}">
              <div class="header ui-flex ui-flex-justify">
                <span class="f32">
                  <font :class="[!isBuyType(item) ? 'red_color' : 'green_color']">{{getTradeType(item)}}</font> {{item.symbol}}
                  <font class="f24 grey">&nbsp;&nbsp;{{item.created_at}}</font>
                </span>
                <span class="f24 grey">
                  {{getOrderState(item.state)}}&nbsp;
                  <template v-if="item.state == 1">({{item.surplus_Time}})&nbsp;</template>
                  <img class="arrow" src="../../assets/img/icon_arrow_right.png">
                </span>
              </div>
              <div class="info">
                <div class="ui-flex ui-flex-justify">
                  <span class="grey f30">{{$t('business.QUANTITY')}}<!-- 数量 --></span>
                  <span>{{item.symbol_count}} {{item.symbol}}</span>
                </div>
                <div class="ui-flex ui-flex-justify">
                  <span class="grey f30">{{$t('qotc.total_price')}}<!-- 总价 --></span>
                  <span>{{item.total_price}} {{item.currency}}</span>
                </div>
                <div class="ui-flex ui-flex-justify">
                  <span class="grey f30">{{$t('qotc.trans_object')}}<!-- 交易对象 --></span>
                  <span>{{getName(item)}}</span>
                </div>
                <div class="ui-flex ui-flex-justify">
                  <span class="grey f30">{{$t('otc_ad.otc_ad_Payment_method')}}<!-- 支付方式 --></span>
                  <span><i class="icon_payment" :class="[payTrans[item.pay_type]]"></i></span>
                </div>
              </div>
            </li>
          </ul>
          <noMoreData v-if="allLoaded"/>
          <noData v-if="!datas.length"/>
        </mt-loadmore>
      </div>
    </div>
    <mt-popup class="filter-popup" v-model="isShow" position="right">
      <p class="ft-c-default f36">{{$t('qotc.otc_manage')}}<!-- OTC管理 --></p>
      <p class="mt60 ft-c-note f26">{{$t('otc_ad.otc_ad_status')}}<!-- 状态 --></p>
      <ul class="mt30 options">
        <li :class="{active:state === null}" v-tap="{methods:setState, state: null}">{{$t('user.all')}}<!-- 全部 --></li>
        <li :class="{active:state === 1}" v-tap="{methods:setState, state: 1}">{{$t('otc_ad.otc_ad_uncompleted')}}<!-- 未完成 --></li>
        <li :class="{active:state === 2}" v-tap="{methods:setState, state: 2}">{{$t('otc_ad.otc_ad_completed')}}<!-- 已完成 --></li>
        <li :class="{active:state === 3}" v-tap="{methods:setState, state: 3}">{{$t('public0.public25')}}<!-- 已取消 --></li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import otcConfig from '@/assets/js/otcconfig'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import { MessageBox } from 'mint-ui'
import noMoreData from '@/components/common/noMoreData'

export default {
  components: {
    noMoreData
  },
  data () {
    return {
      allLoaded:false,
      datas:[],
      page:1,
      state: null,
      size:4,
      totalPage:1,
      intervals: [],
      isShow:false
    }
  },
  computed: {
    ...mapGetters(['getApiToken','getLang','getUserInfo']),
    payTrans(){
      let _payTrans = {}
      for(let item of otcConfig.payments){
        _payTrans[item.id] = item.className
      }
      return _payTrans
    },
    params(){
      return {
        page:1,
        show:this.page*this.size,
        state:this.state
      }
    }
  },
  watch: {
    state(){
      this.page = 1
      this.allLoaded = false
      this.getOrderList()
    }
  },
  created () {
    // this.state = this.$route.query.state || 2
    this.getOrderList()
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy() {
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent']),
    setState(args){
      this.state = args.state === 0 ? null : args.state
    },
    clearIntervals(){
      for(let item of this.intervals){
        clearInterval(item)
      }
      this.intervals = []
    },
    async loadTop() {
      // load more data
      await this.getOrderList()
      this.$refs.loadmore.onTopLoaded();
    },
    async loadBottom() {
      // load more data
      if(this.totalPage == 1){
        this.allLoaded = true
        setTimeout(()=>{
          this.$refs.loadmore.onBottomLoaded()
        },1000)
        return
      }
      this.page += 1
      await this.getOrderList()
      if(this.totalPage == 1){
        this.allLoaded = true // if all data are loaded
      }
      this.$refs.loadmore.onBottomLoaded()
    },
    isBuyType (data) {
      let b = data.to_user_name === this.getUserInfo.username
      // console.log(b)
      return b
    },
    getTradeType (data) { // 交易类型
      if (data.to_user_name === this.getUserInfo.username) {
        return this.$t('otc_exchange.otc_exchange_buy')
      }
      return this.$t('otc_exchange.otc_exchange_sell')
    },
    getOrderState (state) { // 获取订单状态
      if (state == 1) {
        return this.$t('public0.public14') // 交易中
      } else if (state == 2) {
        return this.$t('otc_ad.otc_ad_completed') // 已完成
      } else if (state == 3) {
        return this.$t('public0.public25') // 已取消
      } else {
        return ''
      }
    },
    getOrderList () { // 获取订单列表
      return new Promise((resolve, reject)=>{
        Indicator.open()
        otcApi.getOrdersList(this.params, (res, serverTime, total) => {
          this.clearIntervals()
          this.totalPage = Math.ceil(total/this.params.show)
          res.forEach((item) => {
            // 类型转换
            item.cur_price = utils.removeEndZero(numUtils.BN(item.cur_price).toFixed(2)).toMoney()
            item.symbol_count = utils.removeEndZero(numUtils.BN(item.symbol_count).toFixed(8)).toMoney()
            item.total_price = utils.removeEndZero(numUtils.BN(item.currency_count).toFixed(2)).toMoney()
            item.surplus_Time = '00:00'
            let date = utils.formatDate(item.updated_at).getTime()
            let ndate = utils.formatDate(serverTime).getTime()
            let diffTime = Math.floor((ndate - date) / 1000)
            let surplusTime = item.pay_apply_time * 60 - diffTime
             surplusTime = surplusTime>0?surplusTime:0
            let interval = utils.countDown(surplusTime, (time) => {
              if (time === '00:00') {
                item.isExpire = true
              }
              item.surplus_Time = time
            })
            this.intervals.push(interval)
            item.isExpire = surplusTime <= 0
          })
          this.datas = res
          resolve()
          Indicator.close()
        }, (msg) => {
          Tip({type: 'danger', message: vm.$t(`error_code.${msg}`)})
          resolve()
          Indicator.close()
        })
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
            if (childType === 34 && this.state === 1) {
              this.datas.forEach((item) => {
                if (orderNumber === item.order_number) {
                  item.pay_state = 1
                }
              })
              // 买方已经标记确认付款，请查收！
              MessageBox.alert(this.$t('error_code.CONFIRM_PAYMENT')).then((action) => {}, (cancel) => {})
            } else if (childType === 35 && this.state === 1) {
              this.datas.forEach((item) => {
                if (orderNumber === item.order_number) {
                  item.state = 2
                }
              })
              // 卖家已确认收款，并释放代币，请注意查收！
              MessageBox.alert(this.$t('error_code.SELLER_RELEASE_CURRENCY_WARN')).then((action) => {}, (cancel) => {})
            } else {
              this.getOrderList()
            }
            break
        }
      }
    },
    showFilter(){
      this.isShow = true
    },
    hideFilter(){
      this.isShow = false
    },
    getName(data){
      if (data.to_user_name === this.getUserInfo.username) {
        return data.from_real_name
      }
      return data.to_real_name
    }
  }
}
</script>

<style lang="less" scoped>
@grey:#4E5B73;
@redColor:#D74E5A;
@greenColor:#0EB574;

.grey {color: @grey;}
.red_color {color: @redColor;}
.green_color {color: @greenColor;}

.filter {width: 100%; height: 0.9rem; background-image: url('../../assets/img/icon_filter.png'); background-position: center; background-size: 0.38rem auto;}
.list li {
  margin-bottom: 0.2rem;
  background-color: #151C2C;
  .header {
    line-height: 0.9rem;
    padding: 0 0.3rem;
    border-bottom: 1px solid #273246;
    .arrow {
      width: 0.24rem;
      height: 0.26rem;
      object-fit: contain;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .info {
    padding: 0.15rem 0.3rem;
    > div {padding: 0.15rem 0;}
  }
}
.icon_payment {
  width: .4rem;
  height: .4rem;
  margin-right: .2rem;
  &.paypal {
    background-image:url('../../assets/img/icon-paypal-big.png');
  }
  &.alipay {
    background-image:url('../../assets/img/icon-alipay-big.png');
  }
  &.bank {
    background-image:url('../../assets/img/icon-bank-big.png');
  }
  &.wechat {
    background-image:url('../../assets/img/icon-wechat-big.png');
  }
}
.filter-popup {width: 81vw; height: 100vh; padding: 0.6rem 0.3rem;}
.options {
  margin-left: -0.15rem;
  margin-right: -0.15rem;
  display: flex;
  li {margin-left: 0.15rem; margin-right: 0.15rem; width: 33.3%; height: 0.72rem; padding: 0 0.1rem; margin-bottom: 0.2rem; background-color: #F5F8F9; color: #333; line-height: 0.72rem; text-align: center; border-radius: 0.1rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; position: relative;}
  li.active {border: 1px solid #0B69C8;}
  li.active::before {
    content: '';
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    background-color: #0B69C8;
    border-radius: 100%;
    bottom: -0.25rem;
    right: -0.2rem;
    z-index: 1;
  }
  li.active::after {
    content: '';
    position: absolute;
    width: 0.1rem;
    height: 0.16rem;
    border-bottom:0.04rem solid #fff;
    border-right:0.04rem solid #fff;
    bottom: 0.04rem;
    right: 0.06rem;
    z-index: 2;
    transform: rotate(45deg);
  }
}
</style>
