<!--我的订单-->
<template>
    <section class="coin_content">
        <div class="item" v-for="(item, index) in datas" :key="index">
            <div class="inner">
                <ul class="item">
                    <li>
                        <section>
                            <span :class="[!isBuyType(item) ? 'red_color' : 'green_color']">{{getTradeType(item)}} {{item.symbol}}</span>
                        </section>
                        <section></section>
                        <section class="right">
                            <span :class="[isGreenType ? 'green_color' : '']">{{getOrderState(item.state)}}</span>
                        </section>
                    </li>
                    <li>
                        <section>
                            <span>{{$t('otc_exchange.otc_exchange_ask')}}：<!--单价--></span>
                            <span>{{item.cur_price.toString().toMoney()}} {{item.currency}}</span>
                            <span></span>
                        </section>
                        <section>{{$t('otc_ad.otc_ad_payment_amount')}}<!--付款金额--></section>
                    </li>
                    <li>
                        <section>
                            <span>{{$t('exchange.exchange_amount')}}：<!--数量--></span>
                            <span>{{item.symbol_count}} {{item.symbol}}</span>
                        </section>
                        <section>{{item.total_price.toString().toMoney()}} {{item.currency}}</section>
                    </li>
                    <li>
                        <section>
                            <section>
                                <span>{{$t('exchange.exchange_date')}}：<!--时间--></span>
                                <span>{{item.created_at}}</span>
                            </section>
                            <section>
                                <span>{{$t('otc_exchange.otc_exchange_order_number')}}：<!--订单编号--></span>
                                <span>{{item.order_number}}</span>
                            </section>
                        </section>
                        <section v-if="params.state !== 3">
                            <button class="c-button c-button-normal c-button-blue" @click="goOrderDetail(item)">
                                {{$t('otc_ad.otc_ad_view_details')}}<!--查看详情-->
                                {{item.pay_state === 0 ? `（${item.surplus_Time}）` : ''}}
                            </button>
                        </section>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import otcApi from '@/api/otc'
export default {
  props: ['params'],
  data () {
    return {
      datas: [],
      intervals: [],
      localParams: {
        page: 1,
        show: this.params.show,
        state: this.params.state,
      },
      totalPage:1,
      loadLock:false,
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo']),
  },
  watch: {
    getApiToken () {
      this.getOrderList()
    },
    "params.state" (_new) {
      this.datas = []
      this.localParams.state = _new
      this.getOrderList()
    }
  },
  created () {
    this.getOrderList()
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy() {
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent']),
    loadMore(){ //加载更多交易记录
      //当时滚动条离底部60px时开始加载下一页的内容
      if (this.totalPage>1 && !this.loadLock) {
        this.localParams.show += 10
        this.loadLock = true
        this.getOrderList()
      }
    },
    goOrderDetail (item) {
      this.$router.push({
        name: 'otc-orderdetail',
        params: {orderId: item.order_id}
      })
    },
    isBuyType (data) {
      return data.to_user_name === this.getUserInfo.username
    },
    getTradeType (data) { // 交易类型
      if (data.to_user_name === this.getUserInfo.username) {
        return this.$t('otc_exchange.otc_exchange_buy')
      }
      return this.$t('otc_exchange.otc_exchange_sell')
    },
    isGreenType (state) {
      state = Number(state)
      return state === 1 || state === 2
    },
    getOrderState (state) { // 获取订单状态
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
    getOrderList () { // 获取订单列表
      if (!this.getApiToken) {
        this.datas = []
        return
      }
      otcApi.getOrdersList(this.localParams, (res, serverTime, total) => {
        this.loadLock = false
        this.totalPage = Math.ceil(total/this.localParams.show)
        let old_ids = this.datas.map(item=>{return item.order_id})
        res = res.filter(item=>{return !old_ids.includes(item.order_id)})
        res.forEach((item) => {
          // 类型转换
          item.state = parseInt(item.state)
          item.pay_state = parseInt(item.pay_state)
          item.to_user_apply = parseInt(item.to_user_apply)
          item.trade_type = parseInt(item.trade_type)
          item.from_user_comment = parseInt(item.from_user_comment)
          item.to_user_comment = parseInt(item.to_user_comment)

          item.pay_type = `${item.pay_type || ''}`
          item.cur_price = utils.removeEndZero(numUtils.BN(item.cur_price).toFixed(2))
          item.symbol_count = utils.removeEndZero(numUtils.BN(item.symbol_count).toFixed(8))
          item.total_price = utils.removeEndZero(numUtils.BN(item.currency_count).toFixed(2))
          item.surplus_Time = '00:00'
          let date = utils.formatDate(item.apply_time).getTime()
          let ndate = utils.formatDate(serverTime).getTime()
          let diffTime = Math.floor((ndate - date) / 1000)
          let surplusTime = item.pay_apply_time * 60 - diffTime
          let interval = utils.countDown(surplusTime, (time) => {
            if (time === '00:00') {
              item.isExpire = true
            } else if (time === '05:00' && item.to_user_name === this.getUserInfo.username && item.pay_state === 0) {
              // 您的付款确认时间还剩5分钟，5分钟后系统将自动取消订单！请付款并标记确认付款！
              /*Vue.$confirmDialog({
                id: 'count_down_tip',
                showCancel: false,
                content: this.$t('error_code.PAYMENT_TIMEOUT_REMIND')
              })*/
              // 添加系统消息
              this.$emit('addSystemMessage', item.order_number, 'PAYMENT_TIMEOUT_REMIND')
            }
            item.surplus_Time = time
          })
          this.intervals.push(interval)
          item.isExpire = surplusTime <= 0
        })
        this.datas = this.datas.concat(res)
      }, (res) => {
        this.datas = []
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
    }
  }
}
</script>

<style lang="less" scoped>
  .green_color{color:#00CC99;}
  .red_color{color:#E76D42;}
  .coin_content{
    .item{
      margin-top: 0;
    }
    font-size: .24rem;
    ul{
      border-top:1px solid #f2f3f8;
      padding: .2rem;
      background-color: #fff;
      border-radius:.05rem;
      // box-shadow: 0px 3px 30px 0px rgba(14, 14, 14, 0.35);
      li{
        display: flex;
        justify-content: space-between;
        margin-top: .1rem;
        span{
          line-height: .4rem;
        }
        i{
          height: .4rem;
        }
        i.i_eth{
          display: inline-block;
          width: .4rem;
          left: 0.3rem;
          // background: url('../../assets/img/icon-otc.png') no-repeat center;
          background-size: contain;
          text-align: center;
          padding-top: .08rem;
          color: white;
          font-style: normal;
        }
      }
      li:nth-child(1){
        margin-top: 0;
        font-size: .3rem;
        section:first-child{
          color: #333;
        }
        section:last-child{
          color: #999;
        }
      }
      li:nth-child(2){
        section:first-child{
          span:nth-child(n+2){
            color: #7586a3;
          }
        }
      }
      li:nth-child(3){
        section:first-child{
          span:nth-child(n+2){
            color: #7586a3;
          }
        }
        section:last-child{
          font-size: .32rem;
          color: #0072fd;
        }
      }
      li:nth-child(4){
        section:first-child{
          width: calc(~"100% - 2.2rem");
          section:first-child{
            width: auto;
          }
          section:last-child{
            margin-top: .1rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          span:nth-child(n+2){
            color: #cbd4ec;
          }
        }
      }
    }
  }
  .c-button{
    height: .8rem;
    font-size: .24rem;
    border-width: 0;
    border-radius: 4px;
  }
  .c-button-normal{
    display: inline-block;
    width: 2rem;
    padding-left: .2rem;
    padding-right: .2rem;
    margin-top: .05rem;
  }
  .c-button-green{
    color: #fff;
    background-color: #00cc99;
  }
  .c-button-orange{
    color: #fff;
    background-color: #e76d42;
  }
  .c-button-blue{
    color: #fff;
    background-color: #0072fd;
  }
</style>
