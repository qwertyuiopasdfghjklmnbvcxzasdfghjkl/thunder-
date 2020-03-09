<template>
    <div class="page ft-c-dark">
        <top-back :back="false">
            <div slot="left"  v-tap="{methods:toggleMarketList}">
                <span class="left_nav">
                    <img src="../../assets/img/tc_meus@2x.png"/>
                </span>
            </div>
            <div class="market-select">
                <span class="market_title">{{symbol_display}}</span>
            </div>
            <span slot="right">

                <router-link :to="{name: 'kline', params: {market: `${currentSymbol}_${baseSymbol}`}}" tag="i"
                             class="icon_kline"></router-link>
                <!--<i class="icon_favorite" :class="{active:curMarket && curMarket.collection}" v-tap="{methods:keep}"></i>-->

             </span>
        </top-back>

        <div class="page-main">
            <section class="exchange-container">
                <div>
                    <div class="top_checkt">
                        <label v-tap="{methods:switchTradeType, name: 'buy'}"
                               :class="{'active_buy': tradeType === 'buy'}">{{$t('exchange.exchange_buy')}}</label>
                        <label v-tap="{methods:switchTradeType, name: 'sell'}"
                               :class="{'active_sell': tradeType === 'sell'}">{{$t('exchange.exchange_sell')}}</label>
                        <!--<router-link :to="{name:'lastDeal', params:{currentSymbol:currentSymbol, baseSymbol:baseSymbol, symbol:symbol, accuracy:accuracy}}" tag="label">{{$t('exchange.exchange_trade_history')}}</router-link>-->
                        <!-- <router-link :to="{name:'otc', query:{symbol:baseSymbol}}" tag="label">{{$t('otc.quick_buy_sell')}}快捷买卖</router-link> -->
                    </div>
                    <business
                            :pTradeType="tradeType"
                            :tradeType="tradeType"
                            :currentSymbol="currentSymbol"
                            :baseSymbol="baseSymbol"
                            :accuracy="accuracy"></business>
                </div>

                <div class="right">
                    <depth v-model="showLatestDeal" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol"
                           v-show="!showLatestDeal" :accuracy="accuracy"></depth>
                </div>
            </section>
            <div class="full entrust-container box mt20">
                <div class="entrust_top">
                    <span>{{$t('trade_record.current_entrust')}}<!--当前委托--></span>
                    <router-link :to="{name: 'exchangeDealList'}">{{$t('trade_record.my_trade_record')}}</router-link>
                </div>
                <entrust ref="entrust" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :symbol="symbol"
                         v-show="active==='current'" :hide-other-trust="true"></entrust>
            </div>
        </div>
        <mask-layer :show="showMarkets" @hide="hideMarketList" :isgray="true">
            <transition enter-active-class="animated short slideInLeft">
                <div class="wallet-list-container" v-show="showMarketsSlide">
                    <market-list @changeMarket="changeMarket"/>
                </div>
            </transition>
        </mask-layer>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox, Toast} from 'mint-ui'
    import DataWebSocket from '@/assets/js/websocket'
    import numUtils from '@/assets/js/numberUtils'
    import business from '@/views/exchange/market/business'
    import depth from '@/views/exchange/market/depth'
    import cpSwitch from '@/components/switch'
    import marketApi from '@/api/market'
    import market from '../market/index'
    import historyDeal from "./history-deal/deal";
    import entrust from "./now-deal/entrust";
    import MarketList from "./marketList";

    export default {
        name: 'exchange',
        components: {
            MarketList,
            business,
            depth,
            cpSwitch,
            market,
            historyDeal,
            entrust,
        },
        data() {
            return {
                active: 'current',
                filterTitle: '',
                showMarkets: false,
                showMarketsSlide: false,
                showLatestDeal: false,
                dataSocket: null,
                tradeType: 'buy',
                business: {
                    market: ''
                },
                inter: null,
                market: null
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getMarketList', 'getUserWallets', 'getInitMarket']),
            filterMarketList() {
                if (this.getMarketList) {
                    return this.getMarketList.filter(item => {
                        return `${item.currencySymbol}${item.baseSymbol}`.toLowerCase().includes(this.filterTitle.toLowerCase())
                    })
                } else {
                    return []
                }
            },
            accuracy() {
                let fixedNumber = 8, quantityAccu = 4, amountAccu = 8
                for (let item of this.getMarketList || []) {
                    if (item.market === this.symbol) {
                        fixedNumber = Number(item.accuracy)
                        quantityAccu = Number(item.quantityAccu)
                        amountAccu = Number(item.amountAccu)
                        break
                    }
                }
                return {fixedNumber: fixedNumber, quantityAccu: quantityAccu, amountAccu: amountAccu}
            },
            curMarket() {
                if (!this.getMarketList) {
                    return false
                }
                let markets = this.getMarketList
                for (let i = 0; i < markets.length; i++) {
                    if (this.symbol === markets[i].market) {
                        return markets[i]
                    }
                }
                return false
            },
            baseSymbol() {
                console.log(this.getInitMarket)
                let symbol = this.market || localStorage.getItem('market') || this.getInitMarket
                symbol = symbol.split('_')[1]
                return symbol ? symbol : this.getInitMarket.split('_')[1]
            },
            currentSymbol() {
                let symbol = this.market || localStorage.getItem('market') || this.getInitMarket
                symbol = symbol.split('_')[0]
                return symbol ? symbol : this.getInitMarket.split('_')[0]
            },
            symbol() {
                return `${this.currentSymbol}${this.baseSymbol}`
            },
            symbol_display() {
                return `${this.currentSymbol}/${this.baseSymbol}`
            },
            wallet() {
                for (let i = 0; i < this.getUserWallets.length; i++) {
                    let item = this.getUserWallets[i]
                    if (item.symbol === this.currentSymbol) {
                        return item
                    }
                }
                return {}
            },
        },
        watch: {
            showMarkets(_n) {
                if (_n) {
                    setTimeout(() => {
                        this.showMarketsSlide = true
                    }, 100)
                } else {
                    this.showMarketsSlide = false
                }
            },
            symbol() {
                this.dataSocket && this.dataSocket.switchSymbol(this.symbol)
            },
            'market'() {
                this.showMarkets = false
                console.log(this.symbol)
                this.dataSocket.close()
                this.InitDataSoket()
                // this.dataSocket.switchSymbol(this.symbol)
            },
            curMarket() {
                this.checkMarket()
            }
        },
        created() {
            this.checkMarket()
            this.tradeType = this.$route.params.action !== false ? 'buy' : 'sell'
            this.InitDataSoket()
        },
        mounted() {
            /* this.inter = setInterval(()=>{
                this.getDep()
                this.getPrice()
            }, 2000) */
            localStorage.setItem('market', `${this.currentSymbol}_${this.baseSymbol}`)
        },
        updated() {
            localStorage.setItem('market', `${this.currentSymbol}_${this.baseSymbol}`)
        },
        beforeDestroy() {
            this.dataSocket && this.dataSocket.close()
            window.clearInterval(this.inter)
        },
        methods: {
            ...mapActions(['setLast24h', 'tiggerEvents']),
            checkMarket() {
                if (this.curMarket && this.curMarket.market !== 'ETVUSDT' && this.curMarket.visible == 0) {
                    if (!this.$route.query.visible) {
                        this.$router.replace({name: 'exchange'})
                    }
                } else if (!this.curMarket && this.getMarketList) {
                    let _market = this.getMarketList[0]
                    this.$router.replace({
                        name: 'exchange',
                        params: {market: _market.currencySymbol + '_' + _market.baseSymbol}
                    })
                }
            },
            switchTradeType(active) {
                this.tradeType = active.name
                // console.log(active)
            },
            upOrDown(item) {
                if (numUtils.BN(item.openingPrice).equals(0)) {
                    return ''
                } else if (item.openingPrice && item.lastPrice) {
                    var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
                    if (percent.equals(0)) {
                        return ''
                    }
                    return percent.gt(0) ? 'up' : 'down'
                } else {
                    return ''
                }
            },
            toggleMarketList(args) {
                this.showMarkets = !this.showMarkets
            },
            hideMarketList() {
                this.showMarkets = false
                this.filterTitle = ''
            },
            changeMarket(args) {
                this.showMarkets = false
                // this.$router.replace({
                //     name: 'exchange',
                //     params: {market: `${args.currencySymbol}_${args.baseSymbol}`}
                // })
                this.market = `${args.currencySymbol}_${args.baseSymbol}`
                // localStorage.market = this.market
            },
            getDep() {
                marketApi.getDepth(this.symbol, res => {
                    if (res.asks.length <= 1) {
                        return
                    }
                    this.tiggerEvents({
                        name: 'depthEvent',
                        params: {
                            type: 'updateDatas',
                            asks: res.asks || [],
                            bids: res.bids || []
                        }
                    })
                    // console.log(res)
                }, msg => {
                })
            },
            getPrice() {
                let data = {
                    'symbol': this.symbol
                }
                marketApi.get24hPrice(data, res => {
                    this.setLast24h(data)
                }, msg => {
                })
            },
            InitDataSoket() { //初始化数据websoket
                this.dataSocket = DataWebSocket({
                    symbol: this.symbol,
                    period: '1m',
                    subscribe: ['depth', 'last_price', 'account', 'user_new_orderbook', 'new_transaction', 'market'],
                    callback: (res) => {
                        if (res.symbol && res.symbol !== this.symbol) {
                            console.log(`市场数据不匹配...`)
                            return
                        }
                        if (res.dataType === 'LastOrderBook') {
                            // 深度数据
                            let data = res.data
                            this.tiggerEvents({
                                name: 'depthEvent',
                                params: {
                                    type: 'updateDatas',
                                    asks: data.asks || [],
                                    bids: data.bids || []
                                }
                            })
                        } else if (res.dataType === 'LastPrice') {
                            // 24小时最新信息
                            this.setLast24h(res.data)
                        } else if (res.dataType === 'LastAccounts') {
                            // 用户账户余额
                            let temp = {}
                            res.data.forEach((item) => {
                                temp[item.accountName] = item
                            })
                            this.getUserWallets.forEach((item) => {
                                let d = temp[item.accountName]
                                if (d) {
                                    item.availableBalance = d.availableBalance
                                    item.frozenBalance = numUtils.add(d.frozenBalance, d.adFrozenBalance).add(d.loanBalance).toFixed(8)
                                    item.totalBalance = d.totalBalance
                                }
                            })
                            this.tiggerEvents({
                                name: 'updateStatisticsEvent'
                            })
                        } else if (res.dataType === 'LastUserOrderBook') {
                            // 当前委托
                            this.tiggerEvents({
                                name: 'extrustEvent',
                                params: {
                                    type: 'current',
                                    data: res.data
                                }
                            })
                        }
                        // else if (res.dataType === 'LastHistoryBook') {
                        //     // 历史委托
                        //     this.tiggerEvents({
                        //         name: 'extrustEvent',
                        //         params: {
                        //             type: 'history',
                        //             data: res.data
                        //         }
                        //     })
                        // }
                        else if (res.dataType === 'LastTrades') {
                            // 最新交易记录
                            this.tiggerEvents({
                                name: 'lastdealEvent',
                                params: {
                                    type: 'updateData',
                                    data: res.data
                                }
                            })
                        }
                        else if (res.dataType === 'markets') {
                            // 市场信息
                            res.data.forEach(item => {
                                item.idx = window.marketOrder[item.market]
                                item.iconBase64 = window.marketIcon[item.market]
                                item.collection = window.marketCollection[item.market]
                            })
                            window.setMarketList(res.data)
                        }
                    }
                })
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
            },
            keep() {
                let data = this.curMarket
                console.log(data)
                if (this.getApiToken) {
                    if (data.collection) { // 取消
                        marketApi.removeCollection({
                            market: data.market
                        }, (res) => {
                            data.collection = false
                            window.marketCollection[data.market] = false
                        })
                    } else {
                        marketApi.addCollection({ // 收藏
                            market: data.market
                        }, (res) => {
                            data.collection = true
                            window.marketCollection[data.market] = true
                        })
                    }
                } else {
                    MessageBox.confirm(`${this.$t('public0.not_logged')}, ${this.$t('public0.goLogin')}`, {
                        title: this.$t('public0.tip'),
                        confirmButtonText: this.$t('public0.ok'),
                        cancelButtonText: this.$t('public0.no')
                    }).then(state => {
                        this.$router.push({path: '/login'})
                    })
                }
            },
            toNowDeal() {
                this.$router.push({
                    name: 'now-deal',
                    params: {currentSymbol: this.currentSymbol, baseSymbol: this.baseSymbol, symbol: this.symbol}
                })
            },
            toHistoryDeal() {
                this.$router.push({
                    name: 'history-deal',
                    params: {currentSymbol: this.currentSymbol, baseSymbol: this.baseSymbol, symbol: this.symbol}
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .top_checkt {
        height: 0.7rem;
        display: flex;
        justify-content: space-around;
        align-items: flex-end;

        label {
            font-size: 0.32rem;
            flex: 1;
            text-align: center;
            line-height: 0.7rem;
            background: #1A2233;
            border-radius:0.1rem;

            &.active_buy {
                background: #0EB574;
                color: #ffffff;
            }
            &.active_sell {
                background: #E01C37;
                color: #ffffff;
            }
        }
    }

    .page-main {
        /*top: 1.7rem;*/
    }

    .icon_favorite {
        margin-left: 0.25rem;
        width: 0.35rem;
        height: 0.35rem;
        background-image: url('../../assets/img/i_nc_light@2x.png');

        &.active {
            background-image: url('../../assets/img/i_sc@2x.png');
        }
    }

    .icon_kline {
        width: 0.8rem;
        height: 0.9rem;
        background-image: url('../../assets/img/sxq_a@2x.png');
        background-size: 0.4rem;
        background-position: center;
    }

    .market-select {
        position: absolute;
        left: 50%;
        height: 0.35rem;
        line-height: 0.35rem;
        top: 0.27rem;
        transform: translateX(-50%);

        .icon_select {
            width: 0.2rem;
            height: 0.15rem;
            background-image: url('../../assets/img/tc_meus_w@2x.png');
            margin-left: 0.1rem;
        }

        .market_title {
            font-size: 0.36rem;
            line-height: 0.4rem;
        }
    }

    .wallet-list-container {
        position: relative;
        width: 70vw;
        height: 100vh;

        .title {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 0.9rem;
            text-align: center;
            background: #fff;
            z-index: 9;
            line-height: 0.9rem;
            font-size: 0.32rem;
            color: #333;

            span {
                width: 0.8rem;
                height: 0.8rem;
                position: absolute;
                left: 0;
                top: 0.05rem;
                background: url("../../assets/img/icon_back_b_white@3x.png") no-repeat center;
                background-size: 0.4rem;
            }
        }
    }

    .price.up {
        color: #0EB574;
    }

    .price.down {
        color: #E01C37;
    }

    .exchange-container {
        background-color: #151C2C;
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        position: relative;
        overflow: auto;
    }

    .exchange-container {
        padding: 0.3rem;
        display: flex;
    }

    .exchange-container .right {
        flex: 1;
        margin-left: 0.3rem;
        position: relative;
        text-overflow: hidden;
    }

    .entrust-container {
        /deep/ .mint-tab-item {
            height: 0.9rem;
            color: #999;
            padding: 0;

            &.is-selected {
                color: #3B48C8;
                border-bottom: none;
                margin-bottom: 0;

                .mint-tab-item-label span {
                    border-bottom: 2px solid #3B48C8;
                    margin-bottom: -2px;
                }
            }

            .mint-tab-item-label {
                font-size: 0.3rem;
                line-height: 0.9rem;

                span {
                    display: inline-block;
                    height: 100%;
                }
            }
        }
    }

    .sepline {
        height: 0.2rem;
        background-color: #F6F6F6;
    }
    .entrust_top{
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 0.3rem;
        border-bottom: 0.01rem solid #1D273C;
        span{
            color: #ffffff;
            font-size: 0.32rem;
        }
        a{
            color: #4B5875;
        }
    }
    .left_nav{
        width: 0.8rem;
        height: 0.9rem;
        top: 0;
        left: 0;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
            width:0.3rem
        }
    }
</style>
