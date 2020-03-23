<template>
    <div class="data_cont mt20 box">
        <ul class="list_nav">
            <li :class="{active: sort==='desc'}" v-tap="{methods:sortMarket,name:'desc'}">
                {{$t('home.home01')}}<!--涨幅榜-->
            </li>
            <li :class="{active: sort==='asc'}" v-tap="{methods:sortMarket,name: 'asc'}">
                {{$t('home.home02')}}<!--跌幅榜-->
            </li>
        </ul>
        <section class="data_cont_list">
            <ul class="item" v-for="(item, index) in sortMarketDatas" v-show="item.market.includes(key.toUpperCase())"
                :key="index"
                v-tap="{methods:goToExchangePage, item: item}">
                <li class="ui-flex-4">
                    <!-- <img :src="getMarketImg(item.iconBase64)"> -->
                    <span class="f34">{{item.currencySymbol}}</span><span class="ft-c-lightGray f24">/{{item.baseSymbol}}</span>
                    <p class="ft-c-lightGray ellipsis mt10 f24">24H{{$t('home.home04')}}
                        {{toFixed(item.dealAmount, 0)}}</p>
                </li>
                <li class="ui-flex-3">
                    <p class="f34" :class="[percent(item).css]">{{toFixed(item.lastPrice, item.accuracy)|number}}</p>
                    <!--<p class="ft-c-lightGray mt15">≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></p>-->
                </li>
                <li class="ui-flex-3 tr">
                    <span class="percent f26" :class="[percent(item).css]">{{percent(item).percent}}%</span>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import valuation from '@/components/valuation'
    import utils from '@/assets/js/utils'

    export default {
        name: 'market-index',
        components: {
            valuation
        },
        data() {
            return {
                key: '',
                sort: 'desc',
                sortType: 'type',
                type: '',
                scroll: false,
                token: 'USDS',
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getMarketList']),
            sortMarketDatas(){
                let datas = (this.getMarketList || []).sort((item1, item2) => {
                    if (this.sortType === 'type') {
                        let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
                        let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
                        if (m1.equals(m2)) {
                            return 0
                        }
                        return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
                    }
                })
                return datas
            }
        },
        methods: {
            ...mapActions(['setLast24h']),
            humanNum(num) {
                return utils.humanNum(num)
            },
            getMarketImg(base64) {
                return `data:image/png;base64,${base64}`
            },
            sortMarket(args) {
                this.sort = args.name
                console.log(args)
            },
            goToExchangePage(args) {
                Indicator.open('loading...')
                let item = args.item
                localStorage.market =`${item.currencySymbol}_${item.baseSymbol}`
                this.$router.push({name: 'exchange'})
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
    .data_cont {
        padding: 0 0.3rem;
        margin-bottom: 0.3rem;
    }

    .tokens-filter {
        padding: 0.15rem 0.3rem;
        border-bottom: 1px solid #EAEAEA;

        input {
            width: 100%;
            height: 0.6rem;
            background: url('../../../assets/img/search.png') #F9F9F9 no-repeat 0.25rem center;
            background-size: 0.2rem;
            border: none;
            border-radius: 0.3rem;
            padding-left: 0.6rem;
            padding-right: 0.15rem;
        }
    }

    .data_header {
        line-height: 0.9rem;

        li > div {
            height: 0.38rem;
            width: 0.15rem;
            display: inline-block;
            vertical-align: middle;
            position: relative;
            margin-left: 0.05rem;

            i {
                position: absolute;
                left: 0;
                font-size: 0.24rem;
                transform: scale(0.7);

                &:last-of-type {
                    bottom: 0;
                }

                &.active {
                    color: #999;
                }
            }
        }
    }

    .data_cont_list {
        ul {
            display: flex;
            padding: 0.3rem 0;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #1D273C;
            color: #ffffff;

            img {
                vertical-align: middle;
                width: 0.6rem;
                height: 0.6rem;
                object-fit: cover;
                object-position: center;
                margin-right: 0.2rem;
            }

            .percent {
                min-width: 1.3rem;
                line-height: 0.7rem;
                text-align: center;
                padding: 0 0.1rem;
                display: inline-block;
                vertical-align: middle;
                border-radius: 4px;

                &.c-green {
                    color: #fff;
                    background-color: #D74E5A;
                }

                &.c-orange {
                    color: #fff;
                    background-color: #0EB574;
                }
            }

            .c-green {
                color: #D74E5A;
            }

            .c-orange {
                color: #0EB574;
            }
        }
    }
    .list_nav{
        display: flex;
        height: 0.9rem;
        align-items: center;
        li{
            flex: 1;
            text-align: center;
            height: 0.9rem;
            line-height: 0.9rem;
            color: #4B5875;
            font-size: 0.32rem;
            &.active{
                color: #ffffff;
            }
        }
    }
</style>
