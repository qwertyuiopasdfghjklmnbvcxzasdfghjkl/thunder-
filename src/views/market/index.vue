<template>
    <div class="page" :class="{exchange:form==='exchange' || form==='kline'}">

        <div class="box one">
            <div class="inner">
                <section class="coin_tab">
                    <ul>
                        <!--自选-->
                        <!-- <li :class="{'active':symbol===''}"
                            v-tap="{methods: tab, symbol:''}">
                            <span>{{$t('home.home_favorites')}}</span>
                        </li> -->
                        <li v-for="(item, i) in baseSymbol"
                            :class="{'active':item === symbol}"
                            v-tap="{methods: tab, symbol:item}"><span>{{item}}</span></li>
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

        <div class="page-main">
            <div class="full bg-c-white">
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
                                <p><span class="percent" :class="[percent(item).css]"> {{percent(item).percent}}% </span></p>
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
        name: 'markets',
        components: {
            NoData,
            valuation
        },
        props:['form','cSymbol'],
        data() {
            return {
                sortActive: null,
                sort: null,
                scroll: false,
                symbol: this.cSymbol||'USDT',
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getMarketList']),
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
                datas = datas.filter(item=>{
                    return item.visible == 1
                })
                return datas
            },
            marketsList(){
                let markets = []
                let _temp = this.getMarketList || []
                if(this.symbol){
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
            baseSymbol(){
                let _temp = this.getMarketList || []
                let _list = _temp.map(item=>{
                    return item.baseSymbol
                })
                return [...new Set(_list)].sort()
            }
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
            },
            goToExchangePage(item) {
                if(this.form === 'kline'){
                    this.$router.push({name: 'kline', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
                }else{
                    this.$router.push({name: 'exchange', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
                }
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
    @write: #ffffff;
    @write-20: #cbd4ec;
    @write-374: #ffffff;
    @write-8e9: #666;
    .page.exchange {top: 0.9rem; height: calc(~"100vh - 0.9rem");}
    .page-main {top: 1.47rem;}
    .right {
        img {
            width: 0.34rem;
        }
    }

    .mint-tab-container {
        /*position: absolute;*/
        /*top: 2.2rem;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0*/
    }

    .mint-tab-container /deep/ .mint-tab-container-wrap {
        height: 100%;
    }

    .mint-tab-container /deep/ .mint-tab-container-item {
        overflow: auto;
        padding-bottom: 0.2rem;
    }

    .lastspace {
        height: 0.4rem;
        width: 100%;
    }

    .box {
        font-size: .3rem;
        padding: 0;
    }

    .box > .inner {
        color: #999;
        background:@write;
    }

    .coin_tab {
        border-bottom: 1px solid #ccc;
        overflow-y: hidden;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }

    .coin_tab ul {
        display: flex;
        justify-content: space-around;
        overflow-x: auto;
    }

    .coin_tab ul li {
        position: relative;
        bottom: 0rem;
        line-height: .75rem;
        height: .75rem;
        white-space: nowrap;
        margin-right: 0.1rem;
    }

    .coin_tab ul li.active {
        color: #3B48C8;
    }

    .coin_tab ul li.active::after {
        content: "";
        position: absolute;
        display: flex;
        width: calc(~"100% - 0.08rem");
        height: 0.01rem;
        background: #3B48C8;
        left: 0.04rem;
        bottom: 0rem;
    }

    .coin_tab ul li span {
        padding: 0.04rem 0.08rem;
    }

    .coin_header ul {
        display: flex;
        justify-content: space-between;
        border-bottom: .01rem solid #ccc;
        padding: 0 0.3rem;
    }

    .coin_header ul li {
        font-size: .26rem;
        width: 1.8rem;
        line-height: .72rem;
        height: .72rem;
        color: @write-8e9;
        flex-shrink: 0;
    }

    .coin_header ul li:first-child {
        width: 2.5rem
    }

    .coin_header ul li:nth-child(2) {
        width: 2.4rem;
    }

    .coin_header ul li:last-child {
        text-align: right;
        flex-shrink: 1;
        flex: 1;
    }

    .coin_header ul li i.down {
        display: inline-block;
        width: 0.12rem;
        height: 0.3rem;
        margin-left: .1rem;
        background: url('../../assets/img/i_down.png') no-repeat center;
        background-size: contain;
        vertical-align: sub;
    }

    .coin_header ul li i.up {
        display: inline-block;
        width: 0.12rem;
        height: 0.3rem;
        margin-left: .1rem;
        background: url('../../assets/img/i_up.png') no-repeat center;
        background-size: contain;
        vertical-align: sub;
    }

    .coin_header ul li:nth-child(3) {
        text-align: right;
    }

    .coin_content {
        font-size: .24rem;
    }

    .coin_content .item {
        border-bottom: 1px solid #eee;
    }

    .coin_content .item:first-child {

    }

    .coin_content ul {
        padding: .16rem .3rem;
        display: flex;
        justify-content: space-between;
    }

    .coin_content ul li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 0.82rem;
    }

    .coin_content ul li img {
        height: .4rem;
        display: inline-block;
        width: .4rem;
        left: 0.3rem;
        border-radius: 50%;
        overflow: hidden;
    }

    .coin_content ul li:nth-child(1) {
        width: 2.5rem;
        color: @write-8e9;
        flex-shrink: 0;

        h1 span {
            font-size: .34rem;
            color: #333;
        }

        h1 i {
            font-style: normal;
            font-size: .24rem;
            color: @write-8e9;
        }

        h2 {
            font-size: .24rem;
            color: @write-8e9;
            margin-top: 0.1rem;
        }
    }

    .coin_content ul li:nth-child(2) {
        width: 2.4rem;
        display: flex;
        flex-shrink: 0;
        overflow: hidden;

        h1 {
            font-size: .34rem;
            width: 100%;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        h2 {
            font-size: .24rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: block;
            color: @write-8e9;
        }
    }

    .coin_content ul li:nth-child(3) {
        flex:1;
    }

    .percent {
        min-width: 1.3rem;
        line-height: 0.6rem;
        text-align: center;
        padding:0 0.1rem;
        display: inline-block;
        vertical-align: middle;
        border-radius: 4px;
        &.c-green {
            color: #fff;
            background-color: #42BCA0;
        }
        &.c-orange {
            color: #fff;
            background-color: #F43148;
        }
    }
    .c-green {
        color: #42BCA0;
    }

    .c-orange {
        color: #F43148;
    }
</style>
