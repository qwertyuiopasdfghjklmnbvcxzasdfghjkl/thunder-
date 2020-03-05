<template>
    <div class="page" style="background-color: #0e1a28;">
        <top-back :params="{market:this.business.market}" :dark="true">
            <div class="market-select">
                <span class="left_nav" v-tap="{methods:toggleMarketList}">
                    <img src="../../assets/img/tc_meus@2x.png"/>
                </span>
                <span class="">{{symbol_display}}</span>
            </div>
            <!-- <i slot="right" class="icon_favorite" :class="{active:curMarket && curMarket.collection}" v-tap="{methods:keep}"></i> -->
        </top-back>
        <div class="page-main">
            <div class="full info mt20">
                <div>
                    <p class="f50 price" :class="{down:Number(getLast24h.percent)<0,up:Number(getLast24h.percent)>0}">
                        <strong>{{toFixed(getLast24h.close)|removeEndZero}}</strong>
                    </p>
                    <p class="fabi mt10 f30 price"
                       :class="{down:Number(getLast24h.percent)<0,up:Number(getLast24h.percent)>0}">
                        <span>{{toFixed(getLast24h.rfvol)}}</span>
                        <span class="ml25">{{getLast24h.percent}}%</span>
                    </p>
                    <p class="mt10 gray6C6F8B">
                        <span>{{$t('market.volume_24h')}}{{$t('home.home04')}}</span><!--24h成交量-->
                        <span class="ml25">{{toFixed(getLast24h.vol, 2)}} {{baseSymbol}}</span>
                    </p>
                </div>
                <div>
                    <p class="mt10">
                        <span class="">{{$t('market.low')}}</span><!--24h最低价--><span>{{toFixed(getLast24h.bottom)}}</span>
                    </p>
                    <p class="mt10">
                        <span class="">{{$t('market.high')}}</span><!--24h最高价--><span>{{toFixed(getLast24h.high)}}</span>
                    </p>
                </div>
            </div>
            <ul class="tabs">
                <li :class="{active:isKline}">
                    <a v-tap="{methods:toggleDepth, type:true}">{{$t('exchange.exchange_candlesticks')}}<!--K线--></a>

                </li>
                <li :class="{active:!isKline}">
                    <a v-tap="{methods:toggleDepth, type:false}">
                        {{$t('exchange.exchange_depth')}}<!--深度图-->
                    </a>
                </li>
                <li class="full_screen">
                    <router-link :to="{name: 'full-screen',params:{market:business.market}}">
                        {{$t('exchange.advanced_full_screen')}} <span><img src="../../assets/img/full.png"/></span>
                    </router-link>
                </li>
            </ul>
            <div class="kline-panel">
                <div class="kline-panel-container" :class="{depth:!isKline}">
                    <div class="kline-container">
                        <iframe ref="klineContainer" id="klineContainer" frameborder="0" height="100%" width="100%" scrolling="no" marginheight="0" marginwidth="0" src="" @load="iframeLoaded"></iframe>
                    </div>
                    <div class="kline-container" id="depthContainer"></div>
                </div>
            </div>
            <div class="depth-list-container full">
                <mt-navbar v-model="label">
                  <mt-tab-item :id="1"><span>{{$t('home.entrus-order')}}<!--委托订单--></span></mt-tab-item>
                  <mt-tab-item :id="2"><span>{{$t('exchange.exchange_trade_history')}}<!--最新成交--></span></mt-tab-item>
                  <mt-tab-item :id="3"><span>{{$t('home.symbol-info')}}<!--币种资料--></span></mt-tab-item>
                </mt-navbar>
                <div v-show="label === 1">
                    <div class="header tc">
                        <p>
                            <span class="buy">{{$t('market.buy')}}</span>
                        </p>
                        <p>
                            <span class="sell">{{$t('market.sell')}}</span>
                        </p>
                    </div>
                    <ul class="dept-list pl30 pr30">
                        <li v-for="(n,index) in depthChange.bids.length">
                            <p>
                                <span>{{toFixed(depthChange.bids[index]&&depthChange.bids[index][1],accuracy.quantityAccu)|number}}</span>
                            </p>
                            <p>
                                <span class="buy text-left">{{toFixed(depthChange.bids[index]&&depthChange.bids[index][0])|number}}</span>
                                <span class="ml15 sell ">{{toFixed(depthChange.asks[index]&&depthChange.asks[index][0])|number}}</span>
                            </p>
                            <p>
                                <span>{{toFixed(depthChange.asks[index]&&depthChange.asks[index][1],accuracy.quantityAccu)|number}}</span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div v-show="label === 2" class="lastdeal">
                    <lastdeal :currentSymbol="currentSymbol"
                              :baseSymbol="baseSymbol"
                              :symbol="symbol"
                              :accuracy="accuracy"
                              class="darktab"
                    ></lastdeal>
                </div>
                <div v-show="label === 3" class="symbol-cont">
                    <label>
                        <p>{{this.currentSymbol}}</p>
                    </label>
                    <p><span>{{$t('home.issue-time')}}</span><span>{{symbolInfo.issueTime || '--'}}</span></p>
                    <p><span>{{$t('home.issue-total')}}</span><span>{{symbolInfo.totalIssuance || '--'}}</span></p>
                    <p><span>{{$t('home.circulate-total')}}</span><span>{{symbolInfo.totalCirculation || '--'}}</span></p>
                    <p><span>{{$t('home.raise-price')}}</span><span>{{symbolInfo.issuePrice || '--'}}</span></p>
                    <p><span>{{$t('home.whitePaper')}}</span><span><a :href="symbolInfo.whitePaperUrl">
                        {{symbolInfo.whitePaperUrl || '--'}}</a></span>
                    </p>
                    <p><span>{{$t('home.web')}}</span><span>
                        <a :href="symbolInfo.officialWebsite">{{symbolInfo.officialWebsite || '--'}}</a>
                    </span></p>
                    <p><span>{{$t('home.block-puery')}}</span>
                        <span><a :href="symbolInfo.blockQueryUrl">{{symbolInfo.blockQueryUrl || '--'}}</a></span>
                    </p>
                    <p><span>{{$t('home.intro')}}</span><span>--</span></p>
                </div>
            </div>
        </div>
        <mask-layer :show="showMarkets" @hide="hideMarketList" :isgray="true">
            <transition enter-active-class="animated short slideInLeft">
                <div class="wallet-list-container" v-show="showMarketsSlide">

                    <!--<div class="title">-->
                        <!--<span v-tap="{methods:toggleMarketList}"></span>-->
                        <!--{{$t('home.select-market')}}-->
                    <!--</div>-->
                    <!--<market :form="'kline'" class></market>-->
                    <market-list @changeMarket="changeMarket"/>

                </div>
            </transition>
        </mask-layer>
        <div class="acpanel">
            <button type="button" class="buy" v-tap="{methods:buyOrSell, t:true}">{{$t('exchange.exchange_buy')}}
                <!--买入--></button>
            <button type="button" class="sell" v-tap="{methods:buyOrSell, t:false}">{{$t('exchange.exchange_sell')}}
                <!--卖出--></button>
        </div>
        <div class="mint-indicator" :class="[loading==false?'mint-indicator-leave-active':'']" v-show="!hideLoading">
            <div class="mint-indicator-wrapper" style="padding: 20px; top: 58%;"><span class="mint-indicator-spin"><div class="mint-spinner-snake" style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 32px; width: 32px;"></div></span> <span class="mint-indicator-text" style="">Loading...</span></div> <div class="mint-indicator-mask">
            </div>
        </div>
    </div>
</template>

<script>
    import {MessageBox, Toast} from 'mint-ui'
    import {mapGetters, mapActions} from 'vuex'
    import KLineWebSocket from '@/assets/js/websocket'
    import DepthChart from '@/assets/js/kline.depth'
    import numUtils from '@/assets/js/numberUtils'
    import valuation from '@/components/valuation'
    import marketApi from '@/api/market'
    import market from '../market/index'
    import Lastdeal from "./market/lastdeal"
    import Config from "@/api/config"
    import MarketList from "./marketList";

    export default {
        name: 'kline',
        components: {
            MarketList,
            Lastdeal,
            valuation,
            market,
        },
        data() {
            return {
                domain:Config.url,
                asks: [],
                bids: [],
                showMarkets: false,
                showMarketsSlide: false,
                depthChart: null,
                label: 1,
                isKline: true, // 当前是否是K线图
                klineSocket: null,
                symbolInfo: {},
                business: {
                    market: ''
                },
                loading:false,
                hideLoading:false
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getLast24h', 'getInitMarket', 'getMarketList','getUserWallets','getLang']),
            klineURL(){
                if(window['cordova']){
                    window.httpdURL = window.httpdURL?window.httpdURL:'https://etvcoins.com/kline/'
                }
                let _url = window.httpdURL?window.httpdURL:'/kline/'
                return `${_url}?symbol=${this.symbol}&domain=${this.domain}&lang=${this.getLang=='zh-CN'?'zh':'en'}`
            },
            accuracy() {
                let fixedNumber = 8, quantityAccu = 4, amountAccu = 8
                if (this.curMarket) {
                    fixedNumber = Number(this.curMarket.accuracy)
                    quantityAccu = Number(this.curMarket.quantityAccu)
                    amountAccu = Number(this.curMarket.amountAccu)
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
                return this.business.market.split('_')[1]
            },
            currentSymbol() {
                return this.business.market.split('_')[0]
            },
            symbol() {
                return this.business.market.split('_').join('')
            },
            symbol_display() {
                return `${this.currentSymbol}/${this.baseSymbol}`
            },
            depthChange() {
                return {
                    asks: this.filterAsks,
                    bids: this.filterBids
                }
            },
            filterAsks() {
                let mergeDatas = []
                let temp = {}
                this.asks.forEach((item) => {
                    let key = this.toFixed(item.price)
                    let tempItem = temp[key]
                    if (!tempItem) {
                        temp[key] = {
                            price: key,
                            avaliableAmount: item.avaliableAmount
                        }
                        mergeDatas.push(temp[key])
                    } else {
                        tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
                    }
                })
                let newDatas = []
                mergeDatas.forEach((item) => {
                    newDatas.push([item.price, item.avaliableAmount])
                })
                newDatas.sort((item1, item2) => {
                    return numUtils.BN(item1[0]).lt(numUtils.BN(item2[0])) ? -1 : 1
                })
                return newDatas
            },
            filterBids() {
                let mergeDatas = []
                let temp = {}
                this.bids.forEach((item) => {
                    let key = this.toFixed(item.price)
                    let tempItem = temp[key]
                    if (!tempItem) {
                        temp[key] = {
                            price: key,
                            avaliableAmount: item.avaliableAmount
                        }
                        mergeDatas.push(temp[key])
                    } else {
                        tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
                    }
                })
                let newDatas = []
                mergeDatas.forEach((item) => {
                    newDatas.push([item.price, item.avaliableAmount])
                })
                return newDatas
            }
        },
        watch: {
            'showMarkets'(_n) {
                if (_n) {
                    setTimeout(() => {
                        this.showMarketsSlide = true
                    }, 100)
                } else {
                    this.showMarketsSlide = false
                }
            },
            '$route.params.market'() { //切换市场后重新初始化websoket
                this.business.market = this.$route.params.market
                this.klineSocket.close()
                this.showMarkets = false
                this.InitKlineWebSoket()
                this.setIframe()
            },
            depthChange() {
                this.depthChart && this.depthChart.drawDepth(this.depthChange)
            },
            loading(_new){
                if(!_new){
                    setTimeout(()=>{
                        this.hideLoading = true
                    },600)
                } else {
                    this.hideLoading = false
                }
            }
        },
        created() {
            this.business.market = this.$route.params.market || this.getInitMarket

            this.InitKlineWebSoket()
            this.getSymbolInfo()
            this.getDepthList()
            this.$nextTick(()=>{
                // 深度图
                this.depthChart = DepthChart({
                    isAmountShowLeft: true,
                    fixed:this.accuracy.fixedNumber,
                    container: document.getElementById('depthContainer')
                })
            })
        },
        mounted(){
            this.setIframe()
        },
        beforeDestroy() {
            this.klineSocket && this.klineSocket.close()
        },
        methods: {
            ...mapActions(['setLast24h', 'tiggerEvents']),
            iframeLoaded(){
                setTimeout(()=>{
                    this.loading = false
                },1000)
            },
            setIframe(){
                if(!this.loading){
                    this.loading = true
                    this.$refs.klineContainer.src = this.klineURL
                }
            },
            getDepthList() {
                // 获取深度信息
                marketApi.getDepths(this.symbol, (res) => {
                    this.asks = res.asks //  卖
                    this.bids = res.bids // 买
                })
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
            getSymbolInfo(){
                marketApi.getSymbolIntroduce(this.currentSymbol,res=>{
                    // console.log(res)
                    this.symbolInfo = res
                })
            },
            toggleMarketList(args) {
                this.showMarkets = !this.showMarkets
            },
            hideMarketList() {
                this.showMarkets = false
            },
            buyOrSell(args) {
                this.$router.push({name: 'exchange', params: {market: this.business.market, action: args.t}})
            },
            toggleDepth(args) {
                this.isKline = args.type
            },
            InitKlineWebSoket() { // 初始化K线websoket
                this.klineSocket = KLineWebSocket({
                    symbol: this.symbol,
                    subscribe:['depth','last_price','market','new_transaction'],
                    callback: (res) => {
                        if (res.dataType === 'LastOrderBook') {
                            // 深度数据
                            this.asks = res.data.asks
                            this.bids = res.data.bids
                        } else if (res.dataType === 'LastPrice') {
                            // 24小时最新信息
                            this.setLast24h(res.data)
                        } else if (res.dataType === 'LastTrades') {
                            // 最新成交
                            this.tiggerEvents({
                                name: 'lastdealEvent',
                                params: {
                                    type: 'updateData',
                                    data: res.data
                                }
                            })
                        } else if (res.dataType === 'markets') {
                            res.data.forEach(item=>{
                              item.idx = window.marketOrder[item.market]
                              item.iconBase64 = window.marketIcon[item.market]
                              item.collection = window.marketCollection[item.market]
                            })
                            // 市场信息
                            window.setMarketList(res.data)
                        }
                    },
                })
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
            },
            keep() {
                let data = this.curMarket
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
            changeMarket(e){
                this.showMarkets = false
                this.$router.replace({
                    name: 'kline',
                    params: {market: `${e.currencySymbol}_${e.baseSymbol}`}
                })
                console.log(args)
            }
        }
    }
</script>

<style lang="less" scoped>
    .page-main {
        bottom:1rem;
    }

    .icon_favorite {
        width: 0.35rem;
        height: 0.35rem;
        background-image: url('../../assets/img/star_c@2x.png');

        &.active {
            background-image: url('../../assets/img/star_b@2x.png');
        }
    }

    .market-select {
        text-align: left;
        .left_nav{
            img{
                width: 0.3rem;
            }
            margin-left: 0.5rem;
            border-left: 0.01rem solid #4B5875;
            padding: 0 0.3rem;
        }
        .icon_select {
            width: 0.36rem;
            height: 0.32rem;
            background: url('../../assets/img/tc_meus_white@2x.png') no-repeat 0.1rem 0.08rem;
            background-size: 0.24rem;
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


    .price {
        color: #F43148;
    }

    .price.up {
        color: #F43148;
    }

    .price.down {
        color: #01C89F;
    }

    .info {
        display: flex;
        justify-content: space-between;
        padding: 0.2rem 0.3rem;
    }

    .info > div:first-of-type {
        flex: 3;
        min-width: 0;
    }

    .info > div:last-of-type {
        min-width: 0;
        padding-top: 0.54rem;
        p {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span:first-child {
                padding-right: 0.2rem;
                color: #6C6F8B;
            }
            span:last-child {
                padding-right: 0.2rem;
                color: #fff;
            }
        }
    }

    .tabs {
        display: flex;
        height: 0.8rem;
        align-items: center;
        padding: 0 0.3rem;
    }

    .tabs li {
        width: 2rem;
        text-align: center;
        height: 100%;
        line-height: 0.8rem;
        position: relative;
        &.full_screen{
            flex: 1;
            text-align: right;

        }
    }

    .tabs li:first-child {
    }
    .select{
        position: absolute;
        z-index: 99;
        width: 6.9rem;;
        background: #131e30;
        padding: 0.2rem;
        left: 0;
        top: 1rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        span{
            width: 20%;
            text-align: center;
            line-height: 0.6rem;
            font-size: 0.24rem;
            color: #999999;
            &.active{
                color: #0067e7;
            }
        }
        &:after{
            content: '';
            display: block;
            position: absolute;
            border:0.1rem solid #131e30;
            border-left-color: transparent;
            border-bottom-color: transparent;
            top: -0.1rem;
            left: 1rem;
            transform: rotate(-45deg);
        }
    }

    .tabs li a {
        padding: 0.2rem 0;
        color: #999999;
        text-align: center;
    }

    .tabs li.active{
        // border-bottom: 0.04rem solid #0067e7;
    }
    .tabs li.active a {
        color: #0067e7;

    }

    .tabs li img {
        width: 0.24rem;
        vertical-align: middle;

    }

    .acpanel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .acpanel button {
        border: none;
        font-size: 0.34rem;
        color: #fff;
        flex: 1;
    }

    .acpanel button.buy, .acpanel button.sell {
        height: 1rem;
        background-color: #FF2B5D;
    }

    .acpanel button.sell {
        background-color: #1FB674;
    }

    .kline-panel {
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        height: 7.9rem;
        overflow: hidden;
    }

    .kline-panel-container {
        width: 200%;
        height: 100%;
        display: flex;
        transition: 0.3s;
        margin-left: 0px;
    }

    .kline-panel-container.depth {
        margin-left: -100%;
    }

    .kline-panel-container > div {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .kline-container {
        width: 100%;
        height: 100%;
        background-color: transparent;
        position: relative;
        overflow: hidden;
    }
    #klineContainer {width: 100vw; height: 7.9rem;}

    .kine-select {
        height: 0.55rem;
        line-height: 0.55rem;
        position: relative;
        background-color: #0d0d0d;
        display: flex;
        justify-content: space-between;
        z-index: 3;
    }

    .kine-select span {
        padding: 0 0.15rem;
        color: #8089a3;
        font-size: 0.28rem;
    }

    .kine-select span.active {
        color: #cbd4ec;
    }

    .kine-select span.more:after {
        content: '';
        display: inline-block;
        border-top: 0.12rem solid #8089A3;
        border-left: 0.10rem solid transparent;
        border-right: 0.10rem solid transparent;
        margin-left: 0.12rem;
        padding-bottom: 0.05rem;
    }

    .kine-select .choices {
        position: absolute;
        right: 0;
        top: 0.55rem;
        width: 1.8rem;
        box-shadow: 0 3px 6px #11131d;
    }

    .kine-select .choices li {
        line-height: 0.8rem;
        padding-left: 0.3rem;
        background-color: #1b1e2e;
        border-bottom: 1px solid #262a42;
    }

    .kine-select .choices li:last-of-type {
        border-bottom: none;
    }

    .kine-select .choices li.active {
        background-color: #262a42;
    }

    .depth-list-container {
        /deep/ .mint-navbar {border-bottom: 1px solid #131e30; background-color: #131e30;}
        /deep/ .mint-tab-item {
            height: 0.9rem;
            color: #6C6F8B;
            padding: 0;
            &.is-selected {
                color: #0067e7; border-bottom: none; margin-bottom: 0;
                .mint-tab-item-label span{
                    border-bottom: 2px solid #0067e7;
                    margin-bottom: -2px;
                }
            }
            .mint-tab-item-label {
                font-size: 0.3rem;
                line-height: 0.9rem;
                span {display: inline-block; height: 100%;}
            }
        }
        .header {
            display: flex;
            line-height: 0.8rem;
            background-color: #131e30;
            p{
                width: 50%;
            }
        }
        .dept-list {margin-top: 0.1rem; color: #6C6F8B;}
        .dept-list li {
            display: flex;
            justify-content: space-between;

            p {
                display: flex;

                span {
                    min-width: 0;
                }

                &:first-of-type {
                    width: 1.7rem;

                    span:first-of-type {
                        width: 0.6rem;
                    }

                    span:last-of-type {
                        flex: 1;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                &:nth-of-type(2) {
                    flex: 1;
                    padding-left: 0.1rem;
                    padding-right: 0.1rem;

                    span {
                        flex: 1;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                &:last-of-type {
                    width: 1.7rem;
                    text-align: right;

                    span:first-of-type {
                        flex: 1;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }

                    span:last-of-type {
                        width: 0.6rem;
                    }
                }
            }
        }

        .dept-list {
            width: 100%;

            li {
                line-height: 0.6rem;
            }

            li p span {
                &.buy {
                    text-align: right;
                }
            }
        }
    }
    .btn-cont{
        display: flex;
        justify-content: space-between;
        margin: 0.3rem 0;
        label{
            width: 2.2rem;
            height: 0.64rem;
            text-align: center;
            line-height: 0.64rem;
            background: #43434E;
            &.show{
                color:#00A0E9;
                background:  #2A2A34;
            }
        }
    }
    .symbol-cont{
        padding:0.2rem 0.3rem;
        color: #fff;
        a {color: #fff;}
        label{
            display: flex;
            font-size: 0.3rem;
        }
        p{
            display: flex;
            line-height: 0.5rem;
            justify-content: space-between;
            align-items: center;
            span:first-child{
                color: #6C6F8B;
            }
            span:last-child{
                flex-grow: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: right;
                padding-left: 0.2rem;
            }
        }
    }
    .gray6C6F8B {color: #6C6F8B;}
    .buy {
        color: #F43148;
    }
    .sell {
        color: #01C89F;
    }
    /deep/ .darktab {
        color: #6C6F8B;
        &.latest-deal .header {background-color: #131e30; color: #6C6F8B; border-bottom: none;}
        .ft-c-lightGray {color: #6C6F8B;}
    }
    /deep/ .latest-deal .deal-list li.buy span:nth-of-type(2) {
        color: #F43148;
    }


</style>
