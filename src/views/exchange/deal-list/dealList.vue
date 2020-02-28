<template>
    <div class="deal_list">
        <top-back>
            <mt-navbar v-model="active">
                <mt-tab-item id="current"><span>{{$t('trade_record.current_entrust')}}<!--当前委托--></span>
                </mt-tab-item>
                <mt-tab-item id="history"><span>{{$t('trade_record.history_entrust')}}<!--历史委托--></span>
                </mt-tab-item>
            </mt-navbar>
        </top-back>
        <div class="page-main">
            <div class="full entrust-container">

                <entrust ref="entrust"
                         v-show="active==='current'"></entrust>

                <history-deal ref="historydeal"
                              v-show="active==='history'"></history-deal>
            </div>
        </div>
    </div>

</template>

<script>
    import Entrust from "../now-deal/entrust";
    import historyDeal from "../history-deal/deal";
    import DataWebSocket from '@/assets/js/websocket'

    export default {
        name: "dealList",
        components: {historyDeal, Entrust},
        data() {
            return {
                active: 'current',
                dataSocket: null,
            }
        },
        computed:{

        },
        created() {
            this.InitDataSoket()
        },
        beforeDestroy() {
            this.dataSocket && this.dataSocket.close()
        },
        methods: {
            InitDataSoket() { //初始化数据websoket
                this.dataSocket = DataWebSocket({
                    symbol: this.symbol,
                    period: '1m',
                    subscribe: ['last_price', 'account', 'user_new_orderbook', 'user_history_orderbook', 'new_transaction'],
                    callback: (res) => {
                        if (res.dataType === 'LastUserOrderBook') {
                            // 当前委托
                            this.tiggerEvents({
                                name: 'extrustEvent',
                                params: {
                                    type: 'current',
                                    data: res.data
                                }
                            })
                        } else if (res.dataType === 'LastHistoryBook') {
                            // 历史委托
                            this.tiggerEvents({
                                name: 'extrustEvent',
                                params: {
                                    type: 'history',
                                    data: res.data
                                }
                            })
                        }
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .page-main{
        /*top: 0;*/
    }
    .mint-navbar{
        width: 5rem;
        margin: 0 auto;
        background: none;
        height: 0.7rem;
    }
    .mint-navbar .mint-tab-item{}
    .mint-navbar .mint-tab-item{
        font-size: 0.36rem;
        color: #4B5875;
        padding: 0;
    }
    .mint-navbar .mint-tab-item.is-selected{
        border-bottom: none;
        position: relative;
        color: #0C6AC9;
    }
    .mint-navbar .mint-tab-item.is-selected:after{
        content: '';
        width: 0.6rem;
        height: 0.04rem;
        display: block;
        background: #0C6AC9;
        bottom: 0.1rem;
        left: 0.98rem;
        position: absolute;
    }
</style>
