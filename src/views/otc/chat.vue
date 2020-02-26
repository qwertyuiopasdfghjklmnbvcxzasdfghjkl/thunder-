<template>
    <div class="page">
        <cp-top-back>
          <h1>{{fromUserName}}</h1>
        </cp-top-back>
        <div class="box one">
            <div class="inner" ref="content">
                <section class="coin_content">
                    <div class="header">
                        <div class="title">
                            <span>{{$t('otc_ad.otc_ad_payment_amount')}}<!--付款金额--></span>
                            <span>{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
                        </div>
                        <div class="content">
                            <span>{{orderDetail.total_price}} {{orderDetail.currency}}</span>
                            <span :class="[orderState.state===2||orderState.state===3?'green_color':'red_color']">{{orderState.title}}</span>
                        </div>
                    </div>
                    <ul class="chat-list">
                        <mycomponent v-for="(data, index) in messages" :is="getTemplate(data)" :fromUserName="fromUserName"
                          :data="data" :key="index" :formatSystemMessage="formatSystemMessage"></mycomponent>
                    </ul>
                </section>
            </div>
            <div class="send">
                <input type="text" v-model="message" :disabled="disabled" @keyup.enter="sendMessage" :placeholder="$t('public0.public250')"/>
                <button :disabled="disabled" @click="sendMessage">{{$t('public0.public161')}}<!--发送--></button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Indicator } from 'mint-ui'
import Tip from '@/assets/js/tip'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import otcApi from '@/api/otc'
Vue.component('selfTemplate', {
  template: `<li class="chat-item">
    <div class="chat-time">{{data.created_at || data.msg_time}}</div>
      <div class="chat-container chat-right">
      <span class="right">
          <div class="content">{{data.message}}</div>
      </span>
    </div>
  </li>`,
  props: {
    data: {}
  }
})
Vue.component('fromTempalte', {
  template: `<li class="chat-item">
    <div class="chat-time">{{data.created_at || data.msg_time}}</div>
    <div class="chat-container">
      <span class="left">
          <em>{{fromUserName.substring(0,1)}}</em>
      </span>
      <span class="right">
          <div class="name">{{fromUserName}}</div>
          <div class="content">{{data.message}}</div>
      </span>
    </div>
  </li>`,
  props: {
    fromUserName: '',
    data: {}
  }
})
Vue.component('sytemTempalte', {
  template: `<li class="chat-item chat-system">
        <div class="system-time">{{data.created_at || data.msg_time}}</div>
    <div class="system-content">[{{$t('public0.public251')}}]：{{formatSystemMessage(data.message)}}</div>
  </li>`,
  props: {
    data: {},
    formatSystemMessage: null
  }
})
export default {
  name: 'otc-chat',
  data () {
    return {
      adInfo: {},
      orderDetail: {},
      messages: [],
      message: '',
      opposite_real_name: null,
      opposite_user_name: null
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    disabled () {
      return !(this.orderState.state === 1 || this.orderState.state === 2)
    },
    orderState () {
      if (this.orderDetail.state === 1 && this.orderDetail.pay_state === 0) {
        return {
          state: 1,
          title: this.$t('public0.public152') // 未付款(待付款)
        }
      } else if (this.orderDetail.state === 1 && this.orderDetail.pay_state === 1) {
        return {
          state: 2,
          title: this.$t('public0.public154') // 已付款(已支付)
        }
      } else if (this.orderDetail.state === 2) {
        return {
          state: 3,
          title: this.$t('otc_ad.otc_ad_completed') // 已放币，交易完成(已完成)
        }
      } else {
        return {
          state: 0,
          title: this.$t('exchange.exchange_cancelled') // 已撤销
        }
      }
    },
    fromUserName () {
      return this.opposite_real_name || this.opposite_user_name || ''
    }
  },
  watch: {
    messages () {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = this.$refs.content.scrollHeight
      })
    },
    $route () {
      this.getOrderDetail()
    }
  },
  created () {
    this.getOrderDetail()
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy () {
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent']),
    formatSystemMessage: utils.formatSystemMessage,
    getOrderDetail () { // 获取订单详情
      let orderId = this.$route.params.orderId
      Indicator.open()
      otcApi.ordersDetail(orderId, (res) => {
        this.adInfo = res.adInfo || {}
        let item = res.orderInfo || {};
        item.total_price = utils.removeEndZero(numUtils.BN(item.currency_count).toFixed(2)).toMoney()
        item.cur_price = utils.removeEndZero(numUtils.BN(item.cur_price).toFixed(2)).toMoney()
        item.symbol_count = utils.removeEndZero(numUtils.BN(item.symbol_count).toFixed(8)).toMoney()
        this.orderDetail = item
        this.getMessages(item.order_number)
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        Indicator.close()
      })
    },
    getMessages (orderNumber) { // 获取聊天信息
      // 根据订单编号获取对应的聊天信息
      otcApi.getMessagesByOrderNumber({
        order_number: orderNumber
      }, (res) => {
        Indicator.close()
        this.opposite_real_name = res.opposite_real_name
        this.opposite_user_name = res.opposite_user_name
        res.chat_info.forEach((item) => {
          this.messages.push({
            created_at: item.created_at,
            user_id: item.user_id,
            is_system: item.is_system,
            message: item.message
          })
        })
      })
    },
    getTemplate (item) { // 获取模板
      if (item.is_system && parseInt(item.is_system) === 1) {
        if (String(item.user_id) === String(this.getUserInfo.userId)) {
          return `sytemTempalte`
        } else {
          return null
        }
      }
      if (String(item.user_id) === String(this.getUserInfo.userId)) {
        return `selfTemplate`
      } else {
        return `fromTempalte`
      }
    },
    sendMessage () { // 发送信息
      if (!this.message) {
        // 请输入内容
        Tip({type: 'danger', message: this.$t('public0.public250')})
        return
      }
      let data = {
        created_at: (new Date()).format(),
        user_id: this.getUserInfo.userId,
        message: this.message
      }
      this.messages.push(data)
      otcApi.sendMessage({
        order_number: this.orderDetail.order_number,
        message: this.message
      })
      this.message = ''
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
              if (orderNumber === this.orderDetail.order_number) {
                this.orderDetail.pay_state = 1
              }
              this.messages.push({
                is_system: 1,
                created_at: data.msg_time,
                message: data.title
              })
            } else if (childType === 35) {
              if (orderNumber === this.orderDetail.order_number) {
                this.orderDetail.state = 2
              }
              this.messages.push({
                is_system: 1,
                created_at: data.msg_time,
                message: data.title
              })
            }
            break
        }
      } else if (optType === 2) { // 聊天消息
        this.messages.push({
          created_at: data.msg_time,
          user_id: data.user_id,
          message: data.message
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page{background-color: #161f2f;}
.box{font-size:0.3rem;position:absolute;left:0;right:0;top:0.8rem;bottom:0;}
.box > .inner{padding:0.3rem;color:#8089a3;overflow:auto;position:absolute;left:0;right:0;top:0;bottom:1rem;}
.box > .send{height:1rem;background-color:#0c151d;position:absolute;left:0;right:0;bottom:0;}
.coin_content{font-size:0.24rem;}
.coin_content /deep/ .green_color{color:#00CC99;}
.coin_content /deep/ .red_color{color:#E76D42;}
.coin_content /deep/ .blue_color{color:#0072fd;}
.coin_content /deep/ .header{height:1.6rem;background-color:#0c151d;}
.coin_content /deep/ .header .title{padding:0.36rem 0.35rem 0.14rem 0.35rem;color:#8089A3;display:flex;justify-content:space-between;}
.coin_content /deep/ .header .content{padding:0 0.35rem;display:flex;justify-content:space-between;align-items:flex-end;}
.coin_content /deep/ .header .content span:first-child{font-size:0.48rem;color:#fff;}
.coin_content /deep/ .header .content span:last-child{font-size:0.36rem;}
.chat-list /deep/ .chat-item{display:flex;margin-top:0.36rem;flex-direction:column;}
/* 对方的消息 */
.chat-list /deep/ .chat-item .chat-time{text-align:center;padding:0.04rem 0;}
.chat-list /deep/ .chat-item .chat-container{display:flex;}
.chat-list /deep/ .chat-item .chat-container .left{display:flex;width:0.56rem;margin-right:0.11rem;}
.chat-list /deep/ .chat-item .chat-container .left em{width:0.56rem;height:0.56rem;border-radius:50%;background:#0072fd;text-align:center;line-height:0.56rem;color:#292929;font-size:0.36rem;font-style:normal;}
.chat-list /deep/ .chat-item .chat-container .right .name{color:#8089A3;}
.chat-list /deep/ .chat-item .chat-container .right .content{background-color:#0c151d;color:#CBD4EC;padding:0.14rem;margin-top:0.12rem;position:relative;line-height:0.4rem;margin-left:0.1rem;border-radius:0 0.04rem 0.04rem 0.04rem;}
.chat-list /deep/ .chat-item .chat-container .right .content::before{content:"";width:0px;height:0px;border-color:#292929 transparent;border-style:solid;border-width:0.14rem 0 0 0.14rem;left:-0.14rem;top:0;position:absolute;}
/* 自己的消息 */
.chat-list /deep/ .chat-item .chat-container.chat-right{justify-content:flex-end;}
.chat-list /deep/ .chat-item .chat-container.chat-right .right .content{background-color:#0072fd;margin-left:0;margin-right:0.1rem;color:#fff;border-radius:0.04rem 0 0.04rem 0.04rem;}
.chat-list /deep/ .chat-item .chat-container.chat-right .right .content::before{border-color:transparent #0072fd;border-width:0 0 0.14rem 0.14rem;left:initial;right:-0.14rem;}
/* 系统消息 */
.chat-list /deep/ .chat-item.chat-system{justify-content:center;flex-direction:column;}
.chat-list /deep/ .chat-item.chat-system .system-time{font-size:0.2rem;text-align:center;margin-bottom:0.15rem;}
.chat-list /deep/ .chat-item.chat-system .system-content{background-color:#0c151d;font-size:0.2rem;padding:0.2rem 0.4rem;color:#FFFEFE;margin:0 0.2rem;text-align:center;}
/* 发送消息 */
.send{display:flex;}
.send input{flex:1;border:none;background:transparent;color:#8089A3;padding:0 0.2rem;font-size:0.24rem;}
.send button{width:1.7rem;border:none;background:#0072fd;color:#fff;font-size:0.36rem;}
.send button[disabled]{background:#8089A3;}
</style>
