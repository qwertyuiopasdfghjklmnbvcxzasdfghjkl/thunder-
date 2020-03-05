<template>
    <div>
        <div class="one ft-c-dark">
            <div class="inner">
                <section class="coin_tab">
                    <ul>
                        <li v-for="(item, i) in baseSymbol"
                            :class="{'active':item === symbol}"
                            v-tap="{methods: tab,symbol:item}"><span>{{item}}</span></li>
                    </ul>
                </section>
                <section class="coin_header">
                    <ul>
                        <li @click="sortMarket('dealAmount')">
                            {{$t('home.home05')}}/{{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->
                            <template v-if="sortActive==='dealAmount'">
                                <i class="up" v-if="sort=='asc'"></i>
                                <i class="down" v-if="sort=='desc'"></i>
                            </template>
                        </li>
                        <li @click="sortMarket('lastPrice')">
                            {{$t('exchange.exchange_price')}}<!--价格-->
                            <template v-if="sortActive==='lastPrice'">
                                <i class="up" v-if="sort=='asc'"></i>
                                <i class="down" v-if="sort=='desc'"></i>
                            </template>
                        </li>
                        <li @click="sortMarket('fall')">
                            {{$t('home.home06')}}<!--24h涨跌-->
                            <template v-if="sortActive==='fall'">
                                <i class="up" v-if="sort=='asc'"></i>
                                <i class="down" v-if="sort=='desc'"></i>
                            </template>
                        </li>
                    </ul>
                </section>
            </div>
        </div>

        <!---->

        <div class="page-main ft-c-dark">
            <div class="full">
                <section class="coin_content">
                    <div class="inner">
                        <ul class="item" v-for="(item, index) in sortMarketDatas" :key="index"
                            @click="goToExchangePage(item)">
                            <li>
                                <h1><span>{{item.currencySymbol}}</span>/<i>{{item.baseSymbol}}</i></h1>
                                <h2>24h{{$t('home.home04')}} {{toFixed(item.dealAmount, 2)}}</h2>
                            </li>
                            <li>
                                <h1 :class="[percent(item).css]">{{toFixed(item.lastPrice, item.accuracy)}}</h1>
                            </li>
                            <li class="tr">
                                <p><span class="percent"
                                         :class="[percent(item).css]"> {{percent(item).percent}}% </span></p>
                            </li>
                        </ul>
                        <div class="lastspace"></div>
                    </div>
                </section>
                <no-data v-if="!sortMarketDatas.length"></no-data>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import valuation from '@/components/valuation'
    import NoData from "../../components/common/noData";

    export default {
        components: {
            NoData,
            valuation
        },
        props: ['list'],
        data() {
            return {
                sortActive: null,
                sort: null,
                scroll: false,
                symbol: ''
            }
        },
        computed: {
            ...mapGetters(['getApiToken']),
            sortMarketDatas() {
                let datas = this.marketsList.sort((item1, item2) => {
                    if (this.sortActive === 'dealAmount') {
                        let m1 = numUtils.BN(item1.dealAmount)
                        let m2 = numUtils.BN(item2.dealAmount)
                        if (m1.equals(m2)) {
                            return 0
                        }
                        return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
                    } else if (this.sortActive === 'lastPrice') {
                        let m1 = numUtils.BN(item1.lastPrice)
                        let m2 = numUtils.BN(item2.lastPrice)
                        if (m1.equals(m2)) {
                            return 0
                        }
                        return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
                    } else if (this.sortActive === 'fall') {
                        let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
                        let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
                        if (m1.equals(m2)) {
                            return 0
                        }
                        return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
                    } else {
                        let m1 = numUtils.BN(item1.idx)
                        let m2 = numUtils.BN(item2.idx)
                        return m1.gt(m2) ? -1 : 1
                    }
                })
                datas = datas.filter(item => {
                    return item.visible == 1
                })
                return datas
            },
            marketsList() {
                let markets = []
                let _temp = this.list || []
                if (this.symbol) {
                    markets = _temp.filter(item => {
                        return item.baseSymbol === this.symbol
                    })
                } else {
                    markets = _temp.filter(item => {
                        return item.collection
                    })
                }
                return markets
            },
            baseSymbol() {
                let _temp = this.list || []
                let _list = _temp.map(item => {
                    return item.baseSymbol
                })
                return [...new Set(_list)].sort()
            },

        },
        watch:{
            baseSymbol(){
                if(!this.symbol){
                    this.symbol = this.baseSymbol[0]
                }else{
                    if((this.baseSymbol||[]).indexOf(this.symbol) === -1){
                        this.symbol = this.baseSymbol[0]
                    }
                }
            }
        },
        mounted(){
            console.log(this.list)
        },

        methods: {
            ...mapActions(['setLast24h']),
            sortMarket(active) {
                if (active === this.sortActive) {
                    this.sort = this.sort === 'asc' ? 'desc' : 'asc'
                } else {
                    this.sortActive = active
                    this.sort = 'asc'
                }
            },
            tab(args) {
                this.symbol = args.symbol
                console.log(this.symbol)
            },
            goToExchangePage(item) {
                this.$router.push({name: 'kline', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
                marketApi.get24hPrice({symbol: `${item.currencySymbol}${item.baseSymbol}`}, (data) => {
                    this.setLast24h(data)
                })
            },
            percent(item) {
                if (numUtils.BN(item.openingPrice).equals(0)) {
                    return {css: 'c-orange', percent: '0.00'}
                } else if (item.openingPrice && item.lastPrice) {
                    var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
                    if (percent.equals(0)) {
                        return {css: 'c-orange', percent: '0.00'}
                    }
                    return {
                        css: percent.gt(0) ? 'c-orange' : 'c-green',
                        percent: percent.gt(0) ? '+' + percent.toFixed(2) : '' + percent.toFixed(2)
                    }
                } else {
                    return {css: 'c-orange', percent: '0.00'}
                }
            },
            toFixed(v1, fixed) {
                return numUtils.BN(v1).toFixed(fixed !== undefined ? fixed : 8)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "market";
</style>
