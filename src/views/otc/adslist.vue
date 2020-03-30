<!--广告列表-->
<template>
    <section class="coin_content ft-c-lightGray">
        <mt-loadmore
                :top-method="loadTop"
                :bottom-method="loadBottom"
                :bottom-all-loaded="allLoaded"
                :top-pull-text="$t('home.top-pull-text')"
                :top-drop-text="$t('home.drop-text')"
                :top-loading-text="$t('home.loading-text')"
                :bottom-pull-text="$t('home.bottom-pull-text')"
                :bottom-drop-text="$t('home.drop-text')"
                :bottom-loading-text="$t('home.loading-text')"
                :autoFill="false"
                ref="loadmore">

                <ul class="item" v-for="(data, index) in datas" :key="index">
                    <li>
                        <section>
                            <img class="avatar" :src="setHeader(data.from_user_id, index)"
                                 :class="'pos'+index" @error="setDefaultIcon($event)">
                            <span class="ft-c-white f28">{{data.nickname||data.username}}</span>
                        </section>
                        <section></section>
                        <section class="right">
                            <span>{{$t('otc_ad.otc_ad_Praise')}}<!--好评率--> {{Math.floor(data.user_level||0)}}%</span>
                        </section>
                    </li>
                    <li>
                        <section>
                            <span>{{$t('message.msg_surplus')}}<!--剩余量--></span>
                            <span>{{data.remain_count||0}} {{data.symbol}}</span>
                        </section>
                        <section>{{tradeParams.price}}<!--单价--></section>
                    </li>
                    <li>
                        <section>
                            <span>{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
                            <span>{{data.min_amount}} - {{data.max_amount}}</span>
                            <span>{{tradeParams.limit}}</span>
                        </section>
                        <section class="f32" :class="params.ad_type===1?'ft-c-main':'ft-c-success'">{{(data.cur_price||0).toString().toMoney()}} {{data.currency}}</section>
                    </li>
                    <li>
                        <section>
                            <i class="i_bank" v-if="(data.pay_type||'').indexOf('1') !== -1"></i>
                            <i class="i_alipay" v-if="(data.pay_type||'').indexOf('2') !== -1"></i>
                            <i class="i_wechat" v-if="(data.pay_type||'').indexOf('3') !== -1"></i>
                            <i class="i_paypal" v-if="(data.pay_type||'').indexOf('4') !== -1"></i>
                        </section>
                        <section>
                            <mt-button
                                    :class="{'sell':paramsChange.ad_type === 1}"
                                    class="mini btn"
                                    :disabled="getUserInfo.username === data.username"
                                    @click="placeOrderClick(data)">{{tradeParams.tradeTxt}}</mt-button>
                        </section>
                    </li>
                </ul>
            <noMoreData v-if="noMoreData"/>
            <noData v-if="!datas.length"/>
        </mt-loadmore>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { MessageBox, Indicator } from 'mint-ui'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import otcApi from '@/api/otc'
import userUtils from '@/api/individual'
import avatar from '@/assets/img/user_img@2x.png'
import noMoreData from '@/components/common/noMoreData'
export default {
  name: 'adslist',
    components: { noMoreData},
  props: ['params'],
  data () {
    return {
      datas: [],
        allLoaded: false,
        noMoreData: false,
        sport: '',
        page: 1
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo']),
    paramsChange () {
      return {
        ad_type: this.params.ad_type,
        symbol: this.params.symbol,
        currency: this.params.currency,
        pay_type: this.params.pay_type,
        sort_mode: this.params.sort_mode,
        page: this.page,
        show: this.params.show
      }
    },
    tradeParams () {
      if (this.paramsChange.ad_type === 2) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_buy'), // 购买
          price: this.$t('otc_exchange.otc_exchange_ask'), // 单价
          limit: this.params.currency // 交易限额
        }
      } else {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_sell'), // 出售
          price: this.$t('otc_exchange.otc_exchange_bid'), // 单价
          limit: this.params.symbol // 交易限额
        }
      }
    }
  },
  watch: {
    paramsChange () {
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async setHeader(id,idx){
      let res = await this.getHeader(id)
      $('.avatar.pos'+idx).attr('src',res)
    },
    getHeader (id) {
      // 下载当前用户头像
      return new Promise((resolve, reject)=>{
        userUtils.downloadHeaderOther(id,(url) => {
          resolve(url)
        }, msg=>{
          resolve('')
        })
      })
    },
    setDefaultIcon(e){
      let tar = e.currentTarget
      tar.src = avatar
    },
    getList () { // 获取广告列表
      Indicator.open()
      otcApi.getAdvertisementList(this.paramsChange, (res) => {
        Indicator.close()
        res.data.forEach((item) => { // 广告列表数据格式化处理
          item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
          if (this.params.ad_type === 2) {
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
          } else {
            item.min_amount = utils.removeEndZero(numUtils.BN(item.min_amount).toFixed(8))
            item.max_amount = utils.removeEndZero(numUtils.BN(item.max_amount).toFixed(8))
          }
          item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
        })
        // this.datas = res.data

          if (this.sport === 'bottom') { // 加载更多数据
              this.allLoaded = false
              res.data.forEach(res=>{
                  this.datas.push(res)
              })
              console.log(this.datas)
              this.$refs.loadmore.onBottomLoaded();
          } else if (this.sport === 'top') { // 下拉刷新
              this.datas = res.data
              this.noMoreData = false
              this.allLoaded = false
              this.$refs.loadmore.onTopLoaded();
          } else {
              this.datas = []
              this.datas = res.data
          }
          if (this.datas.length >= res.total) { // 没有更多数据
              this.noMoreData = Boolean(res.total)
              this.allLoaded = true
          }

      }, (msg) => {
        Indicator.close()
        console.error(msg)
      })
    },
      loadTop() { // 刷新
          this.sport = 'top';
          this.page = 1;
          this.getList()
      },
      loadBottom() { // 获取下一页
          this.sport = 'bottom'
          this.page++;
          this.allLoaded = true
      },
    checkSetState (successCallback, message, isCheckPaySet, isCheckPayType, id) {
      if (!this.getApiToken) {
        Tip({type: 'danger', message: this.$t(message)})
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
                  // 支付方式不匹配，请设置对应的支付方式
                  MessageBox.confirm(this.$t('error_code.PAY_TYPE_UNMATCH')).then((action) => {
                    this.$router.push({name: 'page-payway'})
                  }, (cancel) => {})
                } else {
                  Tip({type: 'danger', message: this.$t(`error_code.${msg3}`)})
                }
              })
            } else {
              successCallback && successCallback(res.data.pay_type)
            }
          }, (res) => {
            if (res.msg === 'NO_PAY_TYPE') {
              // 请先设置支付方式
              MessageBox.confirm(this.$t('error_code.SET_PAY_TYPE_FIRST')).then((action) => {
                this.$router.push({name: 'page-payway'})
              }, (cancel) => {})
            } else {
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            }
          })
        } else {
          successCallback && successCallback()
        }
      }, (msg) => {
        if (msg === 'KYC_AUTH_FIRST') {
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm')
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'page-realname'})
            }
          })
        } else {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    placeOrderClick (item) {
      if (this.getUserInfo.username === item.username) {
        return
      }
      let isCheckPaySet = parseInt(item.ad_type) === 1
      this.matchPayType = parseInt(item.ad_type) === 1 ? void 0 : item.pay_type
      this.checkSetState(() => {
        this.$emit('placeOrderClick', item)
      }, 'public0.public15', isCheckPaySet, true, item.ad_id)
    }
  }
}
</script>

<style lang="less" scoped>
  .coin_content{
    font-size: .24rem;
    background-color: #151C2C;
    ul{
      padding: .2rem 0.3rem;
      &+ul {border-top:0.02rem solid #273246;}
      li{
        display: flex;
        justify-content: space-between;
        span {
            vertical-align: middle;
        }
        .avatar{
          width: .4rem;
          height: 0.4rem;
          object-fit: contain;
          margin-right: 0.15rem;
          vertical-align: middle;
        }
      }
      li + li {margin-top: 0.15rem;}
      i{
        display: inline-block;
        width: .5rem;
        height: .4rem;
        margin-top: .15rem;
        margin-right: .2rem;
        vertical-align: middle;
        background-size:contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      i.i_bank{
        background-image: url('../../assets/img/icon-bank-big.png');
      }
      i.i_alipay{
        background-image: url('../../assets/img/icon-alipay-big.png');
      }
      i.i_wechat{
        background-image: url('../../assets/img/icon-wechat-big.png');
      }
      i.i_paypal{
        background-image: url('../../assets/img/icon-paypal-big.png');
      }
    }
  }
  .btn {
      min-width: 1.7rem;
      min-height: 0.7rem;
  }
    .sell{
        background-color: #D14B64 !important;
    }
</style>
