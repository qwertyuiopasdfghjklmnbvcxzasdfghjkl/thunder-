<template>
    <div class="order-book">
        <div>
            <span>{{$t('exchange.exchange_price')}}({{baseSymbol}})<!--价格--></span>
            <span>{{$t('exchange.exchange_amount')}}({{currentSymbol}})<!--数量--></span>
        </div>
        <div class="bid-sell mt20">
            <ul class="sell-list f24" ref="parentListAsk" v-show="sellBuy!==2">
                <li v-for="n in askLength">
                    <span>--</span>
                    <span>--</span>
                </li>
                <li v-for="(item, index) in filterAsks" :style="listItemStyle(item, 'ask')">
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.price)}}</span>
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.avaliableAmount)}}</span>
                </li>
            </ul>
        </div>
        <div class="numb_text">
            <p class="">
                <span class="" :class="{sell:(getLast24h.direction!=1)}">{{toFixed(getLast24h.close)}}</span>
                <small class="f24 pt8 ft-c-dark">
                    ≈ {{getCoinSign}} {{toFixed(CNY, 2)}}
                    <!--<valuation :lastPrice="getLast24h.close" :symbol="currentSymbol" :curCNYPrice="curCNYPrice"/>-->
                </small>
            </p>
            <!--<p class="f24" :class="{sell:(getLast24h.direction!=1)}">{{baseSymbol}}</p>-->
        </div>
        <div class="mt20" v-show="sellBuy!==1">
            <ul class="buy-list f24" ref="parentListBid">
                <li v-for="(item, index) in filterBids" :style="listItemStyle(item, 'bid')">
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.price)}}</span>
                    <span @click="clickChangeValue(toFixed(item.price), 'price')">{{toFixed(item.avaliableAmount)}}</span>
                </li>
                <li v-for="n in bidLength">
                    <span>--</span>
                    <span>--</span>
                </li>
            </ul>
        </div>
        <div class="check">
            <label>
                <p v-tap="{methods:()=>{show=!show,showSellBuy=false}}">
                    <span v-if="accuracy.fixedNumber === 8">{{$t('home.8decimal')}}</span>
                    <span v-if="accuracy.fixedNumber === 6">{{$t('home.6decimal')}}</span>
                    <span v-if="accuracy.fixedNumber === 4">{{$t('home.4decimal')}}</span>
                </p>
                <ul v-if="show">
                    <li v-tap="{methods:()=>{accuracy.fixedNumber = 8,show=false}}">{{$t('home.8decimal')}}</li>
                    <li v-tap="{methods:()=>{accuracy.fixedNumber = 6,show=false}}">{{$t('home.6decimal')}}</li>
                    <li v-tap="{methods:()=>{accuracy.fixedNumber = 4,show=false}}">{{$t('home.4decimal')}}</li>
                </ul>
            </label>
            <label>
                <p v-tap="{methods:()=>{showSellBuy=!showSellBuy,show=false}}">
                    <span v-if="sellBuy===0">{{$t('home.default')}}</span>
                    <span v-if="sellBuy===1">{{$t('home.show-sell')}}</span>
                    <span v-if="sellBuy===2">{{$t('home.show-buy')}}</span>
                </p>
                <ul v-if="showSellBuy">
                    <li v-tap="{methods:()=>{sellBuy = 0,showSellBuy=false}}">{{$t('home.default')}}</li>
                    <li v-tap="{methods:()=>{sellBuy = 1,showSellBuy=false}}">{{$t('home.show-sell')}}</li>
                    <li v-tap="{methods:()=>{sellBuy = 2,showSellBuy=false}}">{{$t('home.show-buy')}}</li>
                </ul>
            </label>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import valuation from '@/components/valuation'

    export default {
        props: {
            value: null,
            accuracy: {
                type: Object
            },
            baseSymbol: {
                type: String,
                default: ''
            },
            currentSymbol: {
                type: String,
                default: ''
            },
            curCNYPrice: 0
        },
        components: {
            valuation
        },
        data() {
            return {
                asks: [],
                bids: [],
                mergeLen: 7,
                price: '0',
                active: 'askbid',
                direction: null,
                decimal: 8,
                show: false,
                sellBuy: 0,
                showSellBuy: false,
            }
        },
        computed: {
            ...mapGetters(['getLast24h', 'getEntrustPrices', 'getNetworkSignal', 'getCoinSign']),
            fromCoin() {
                return this.currentSymbol
            },
            toCoin() {
                return this.baseSymbol
            },
            bidStyle() {
                return this.active === 'bid' ? {height: 'calc(100% - 94px)'} : {}
            },
            askStyle() {
                return this.active === 'ask' ? {height: 'calc(100% - 94px)'} : {}
            },
            filterAsks() {
                let asks = this.mergeDatas(this.asks)
                asks = asks.sort((item1, item2) => {
                    return numUtils.BN(item1.price).lt(item2.price) ? 1 : -1
                })
                return asks.length >= 7 ? asks.slice(asks.length - 7, asks.length) : asks
            },
            filterBids() {
                let bids = this.mergeDatas(this.bids)
                if(this.sellBuy !== 0){
                    return bids.length >= 14 ? bids.slice(0, 14) : bids
                }else{
                    return bids.length >= 7 ? bids.slice(0, 7) : bids
                }
            },
            askMax() {
                return this.getMaxAmount(this.filterAsks)
            },
            bidMax() {
                return this.getMaxAmount(this.filterBids)
            },
            askLength() {
                return Math.max(this.mergeLen - this.filterAsks.length, 0)
            },
            bidLength() {
                return Math.max(this.mergeLen - this.filterBids.length, 0)
            },
            keysEntrust() {
                let keys = {}
                this.getEntrustPrices.forEach((item) => {
                    let price = this.toFixed(item[0])
                    let direction = item[1]
                    let key = price + '_' + direction
                    keys[key] = true
                })
                return keys
            },
            curArrow() {
                if (Number(this.getLast24h.direction) === 2) {
                    return '↓'
                } else if (Number(this.getLast24h.direction) === 1) {
                    return '↑'
                } else {
                    return null
                }
            },
            symbol() {
                return `${this.currentSymbol}${this.baseSymbol}`
            },
            getNetworkTitle() {
                if (!this.getNetworkSignal) {
                    return this.$t('public.market_status_running')
                } else {
                    return this.$t('public.market_status_delay')
                }
            },
            CNY(){
                return numUtils.mul(this.getLast24h.close, this.curCNYPrice)
            }
        },
        watch: {
            symbol() {
                this.getDepthList()
            },
            decimal() {
                console.log(this.filterBids)
            }
        },
        created() {
            this.$nextTick(() => {
                this.addEvents({
                    name: 'depthEvent',
                    fun: this.depthEvent
                })
            })
            this.getDepthList()
            // console.log(this.accuracy)
        },
        beforeDestroy() {
            this.removeEvents('depthEvent')
        },
        methods: {
            ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
            switchLastDeal() {
                this.$emit('input', !this.value)
            },
            getDepthList() {
                // 获取深度信息
                marketApi.getDepths(this.symbol, (res) => {
                    this.asks = res.asks //  卖
                    this.bids = res.bids // 买
                })
            },
            mergeDatas(datas) {
                let mergeDatas = []
                let temp = {}
                try {
                    datas.forEach((item) => {
                        let key = item.price
                        let tempItem = temp[key]
                        if (!tempItem) {
                            temp[key] = {
                                price: key,
                                avaliableAmount: item.avaliableAmount,
                                direction: item.direction
                            }
                            mergeDatas.push(temp[key])
                        } else {
                            console.log('2')
                            tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
                        }
                    })
                } catch (ex) {
                    console.warn(datas)
                }
                console.log(mergeDatas)
                return mergeDatas
            },
            getMaxAmount(datas) {
                let len = datas.length
                if (!len) {
                    return 0
                }
                let max = 0
                datas.forEach((item) => {
                    max = Math.max(max, item.avaliableAmount)
                })
                return max
            },
            getAmountTitle(amount) {
                let a = this.toFixed(amount, 2)
                return numUtils.BN(a).equals(0) ? amount : null
            },
            depthEvent(res) {
                if (res && res.type === 'depthEvent') {
                    this.direction = res.value
                } else if (res && res.type === 'updateDatas') {
                    this.asks = res.asks
                    this.bids = res.bids
                }
            },
            listItemStyle(item, type) {
                if (type === 'ask') { // 卖
                    if (numUtils.BN(this.askMax).equals(0)) {
                        return {}
                    }
                    let percent = Math.max(1, Math.min(100, numUtils.div(item.avaliableAmount, this.askMax).mul(100).toFixed(2)))
                    return {'background-size': `${percent}% 100%`}
                } else if (type === 'bid') { // 买
                    if (numUtils.BN(this.bidMax).equals(0)) {
                        return {}
                    }
                    let percent = Math.max(1, Math.min(100, numUtils.div(item.avaliableAmount, this.bidMax).mul(100).toFixed(2)))
                    return {'background-size': `${percent}% 100%`}
                }
            },
            checkEntrustPrice(item) {
                let price = this.toFixed(item.price)
                let direction = String(item.direction)
                let key = price + '_' + direction
                return this.keysEntrust[key]
            },
            clickChangeValue(item, type) {
                if (type !== 'total') {
                    this.tiggerEvents({
                        name: 'businessEvent',
                        params: {
                            type: type,
                            value: item
                        }
                    })
                } else {
                    this.tiggerEvents({
                        name: 'businessEvent',
                        params: {
                            type: 'price',
                            value: this.toFixed(item.price)
                        }
                    })
                    this.tiggerEvents({
                        name: 'businessEvent',
                        params: {
                            type: 'amount',
                            value: this.toFixed(item.avaliableAmount)
                        }
                    })
                }
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed)
            }
        }
    }
</script>

<style lang="less" scoped>
    @c_gray: #F4F5FA;
    @c_buy: #0EB574;
    @c_sell: #D74E5A;
    @c_light: #4B5875;
    @c_board: #4B5875;
    .order-book {
        position: relative;
    }

    .order-book > div:nth-of-type(1) {
        display: flex;
        justify-content: space-between;
    }

    .order-book > div:nth-of-type(1) span {
        color: @c_board;
        font-size: 0.24rem;
    }

    .order-book > div:nth-of-type(3) {
        position: relative;
    }

    .order-book > div:nth-of-type(3) p:first-of-type {
        color: @c_buy;
        font-size: 0.34rem;
    }

    .order-book > div:nth-of-type(3) p:first-of-type.sell {
        color: @c_sell;
    }

    .order-book > div:nth-of-type(5) {
        flex: 7;
        min-height: 0;
        position: relative;
        display: flex;
        align-items: center;
    }

    .order-book > div:nth-of-type(5) > p {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-65%);
        font-size: 0.28rem;
    }

    .order-book > div:nth-of-type(5) > p:after {
        content: '';
        position: absolute;
        right: 0;
        top: 0.1rem;
        border-bottom: 0.15rem solid #fff;
        border-left: 0.13rem solid transparent;
        border-right: 0.13rem solid transparent;
    }

    .order-book .sell-list, .order-book .buy-list {
        width: 100%;
    }

    .order-book .sell-list li, .order-book .buy-list li {
        display: flex;
        justify-content: space-between;
        height: 0.54rem;
        line-height: 0.54rem;
        background: url('../../../assets/img/buy-list-bg.png') no-repeat right center;
        background-size: 0% 100%;
    }

    .order-book .sell-list li span, .order-book .buy-list li span {
        &:first-of-type {
            color: @c_sell;
        }

        &:last-of-type {
            color: @c_light;
        }
    }

    .order-book .sell-list.active {
        opacity: 1;
    }

    .order-book .buy-list li {
        background-image: url('../../../assets/img/sell-list-bg.png');
    }

    .order-book .buy-list li span:first-of-type {
        color: @c_buy;
    }

    .numb_text {
        border: 0.02rem solid #1D273C;
        border-width: 1px 0 1px 0;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 0.1rem 0;
        p{
            span{
                display: block;
                font-size: 0.32rem;
            }
        }
    }

    .check {
        display: flex;
        margin-top: 0.1rem;
        justify-content: space-between;

        label {
            padding: 0.06rem 0.1rem;
            position: relative;
            border: 0.02rem solid #4B5875;
            font-size: 0.2rem;
            flex: 1;
            text-align: center;
            &+label {
                border-left:none;
            }
            p {
                padding-right: 0.3rem;
                background: url("../../../assets/img/tc_meus_b@2x.png") no-repeat center right;
                background-size: 0.2rem;
                min-width: 1rem;
            }

            ul {
                position: absolute;
                left: -1px;
                right: -1px;
                bottom: 0.44rem;
                border: 0.02rem solid #4B5875;
                z-index: 9;
                background: #1d2537;

                li {
                    padding: 0.16rem 0.2rem;
                    border-bottom: 0.02rem solid #4B5875;

                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }
    }
</style>
