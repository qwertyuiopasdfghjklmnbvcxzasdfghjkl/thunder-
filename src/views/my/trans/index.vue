<template>
    <div class="page">
        <top-back showMenu="false">{{$t('trade_record.my_trade_record')}}<!--交易记录--></top-back>
        <div class="record-box header">
            <ul>
                <li>
                    <span class="market">{{$t('trade_record.trade_record_type')}}/{{$t('trade_record.trade_record_market')}}
                        <!--方向/市场--></span>
                    <span class="price">{{$t('exchange.exchange_Transaction_price')}}<!--成交均价--></span>
                    <span class="vol">{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--></span>
                </li>
            </ul>
        </div>
        <div class="page-main">
            <div class="full record-box">
                <mt-loadmore
                        :bottom-method="loadMore"
                        :bottom-all-loaded="allLoaded"
                        :bottom-pull-text="$t('public0.loadmore')+'...'"
                        :bottom-drop-text="$t('home.drop-text')"
                        :bottom-loading-text="$t('home.loading-text')"
                        :autoFill="false"
                        ref="recordLoadmore">
                    <template v-if="record.length > 0">
                        <ul ref="recordList">
                            <li class="item" v-for="(item, index) in record" @click="goDetail(item)">
                <span class="market">
                 <strong><span v-if="item.direction===1">{{$t('exchange.exchange_buys')}}</span><span class="sell"
                                                                                                      v-else>{{$t('exchange.exchange_sells')}}</span> <template
                         v-if="item.direction===1">{{item.toSymbol}}/{{item.fromSymbol}}</template><template v-else>{{item.fromSymbol}}/{{item.toSymbol}}</template></strong>
                  <p class="ft-c-lightGray f24">{{new Date(Number(item.createdAt)).format()}}</p>
                </span>
                                <span class="price">
                  {{getPrice(item.averagePrice)}}
                  <p class="ft-c-lightGray f24"><template v-if="item.direction===1">{{item.fromSymbol}}</template><template
                          v-else>{{item.toSymbol}}</template></p>
                </span>
                                <span class="vol ellipsis">
                  {{toFixed(item.finishedAmount) | removeEndZero}}
                  <p class="ft-c-lightGray f24"><template v-if="item.direction===1">{{item.toSymbol}}</template><template
                          v-else>{{item.fromSymbol}}</template></p>
                </span>
                                <i class="allow-right"></i>
                            </li>
                        </ul>
                        <noMoreData v-if="!recordBottomLoading && noMoreRecordHistory" :bgColor="'#101722'"/>
                    </template>
                    <no-data v-show="!record.length"></no-data>
                </mt-loadmore>
            </div>
        </div>
    </div>
</template>

<script>
    import loading from '@/components/common/loading'
    import noMoreData from '@/components/common/noMoreData'
    import market from '@/api/market'
    import numUtils from '@/assets/js/numberUtils'
    import Utils from '@/assets/js/utils'

    export default {
        name: 'trans-record',
        components: {
            loading,
            noMoreData
        },
        data() {
            return {
                fixedNumber: 8,
                record: [], // 交易记录
                allLoaded: false,

                paramRecord: {
                    history: '1', // 0 当前，1 历史
                    start: '', // 开始时间
                    end: '', // 结束时间
                    market: '', // 市场
                    direction: '', // 0 全部 1买 2卖
                    hideCancelled: 0, // 1是, 0否显示
                    tp: 1, // 0 委托记录 1 币币成交记录
                    current: 1, // 当前第几页 默认为"" 为第一页
                    limit: 20 // limit每页记录数，“”默认20条
                },
            }
        },
        watch: {
            'paramRecord.current'(val) {
                if (val !== 1 && !this.noMoreRecordHistory) {
                    this.recordBottomDisabled = true
                    this.recordBottomLoading = true
                    this.getCoinsHistory()
                }
            }
        },
        created() {
            this.getCoinsHistory()
        },
        methods: {
            goDetail(data) {
                this.$router.push({name: 'transDetail', params: {id: data.orderBookId, detail: data}})
            },
            loadMore() { // 向下滚动获取更多消息
                this.paramRecord.current++
                this.allLoaded = true
            },
            getCoinsHistory() { // 委托当前记录
                market.getCurrentEntrustByParams(this.paramRecord, (res) => {
                    this.allLoaded = false
                    this.record = this.record.concat(res.data)
                    if (this.record.length >= res.total) {
                        this.allLoaded = true
                    }
                    this.$refs.recordLoadmore.onBottomLoaded()
                }, (msg) => {
                    this.allLoaded = false
                    this.$refs.recordLoadmore.onBottomLoaded()
                    console.error(msg)
                })
            },
            getPrice(price) { // 价格
                if (numUtils.BN(price).equals(numUtils.BN(-1))) {
                    return this.$t('exchange.exchange_market_price') // 市价
                }
                return Utils.removeEndZero(this.toFixed(price))
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-main {
        top: 1.9rem;
    }

    .record-box.header{
        margin-top: 0.9rem;
        background: #151C2C;
    }
    .record-box.header ul li {
        color: #4B5875;
        line-height: 0.5rem;
    }
    .full.record-box{
        background: #151C2C;
    }
    .record-box ul li {
        padding: 0.15rem 0.3rem;
        line-height: 0.4rem;
        display: flex;
        position: relative;
    }

    .record-box ul li span {
        word-break: break-all;

        & + span {
            margin-left: 0.15rem;
        }
    }

    .record-box ul li span.market {
        width: 40%;
    }

    .record-box ul li span.price {
        width: 27%;
    }

    .record-box ul li span.vol {
        flex: 1;
        text-align: right;
        margin-right: 0.3rem;
    }

    .record-box ul li span.market span {
        color: #0EB574;
        font-weight: bold;
        margin-right: 0.2rem;
    }

    .record-box ul li span.market span.sell {
        color: #CD3F46;
    }

    .allow-right:after {
        right: 0.3rem;
    }
</style>
