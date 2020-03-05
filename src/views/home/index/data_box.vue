<template>
    <div class="data_box">
        <swiper :options="swiperOption">
            <swiper-slide v-for="(item,index) in list" :key="index">
                <div class="cont" @click="goToExchangePage(item)">
                    <p class="tit">
                        <span class="">{{item.currencySymbol}}</span>
                        <span class="">/{{item.baseSymbol}}</span>
                    </p>
                    <p class="nub f36" :class="[percent(item).css]">{{percentToMoney(item)}}</p>
                    <span class="f24 fmt" :class="[percent(item).css]">
                        {{percent(item).percent}}%
                    </span>
                </div>
            </swiper-slide>
            <div class="swiper-pagination-box" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import utils from '../../../assets/js/utils'

    export default {
        name: "data_box",
        data() {
            return {
                swiperOption: {
                    // 所有配置均为可选（同Swiper配置）
                    slidesPerGroup: 3,
                    slidesPerView: 3,
                    slidesPerGroupSkip: 4,
                    autoplay: false,
                    observer: true,
                    resistanceRatio: 0,
                    pagination: {
                        el: '.swiper-pagination-box',
                        type: 'progressbar',
                        bulletClass : 'my-bullet'
                    },
                },
            }
        },
        computed: {
            ...mapGetters(['getMarketList']),
            list() {
                let d = JSON.stringify(this.getMarketList)
                let data = JSON.parse(d)
                let datas = (data || []).sort((item1, item2) => {
                    let m1 = numUtils.BN(item1.createdAt)
                    let m2 = numUtils.BN(item2.createdAt)
                    return (m1.lt(m2) ? -1 : 1)
                })
                return datas
            }
        },
        methods: {
            ...mapActions(['setLast24h']),
            percent(item) {
                if (numUtils.BN(item.openingPrice).equals(0)) {
                    return {
                        css: 'c-green',
                        percent: '0.00'
                    }
                } else if (item.openingPrice && item.lastPrice) {
                    var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
                    if (percent.equals(0)) {
                        return {
                            css: 'c-green',
                            percent: '0.00'
                        }
                    }
                    return {
                        css: percent.gt(0) ? 'c-green' : 'c-orange',
                        percent: percent.gt(0) ? '+' + percent.toFixed(2) : + percent.toFixed(2)
                    }
                } else {
                    return {
                        css: 'c-green',
                        percent: '0.00'
                    }
                }
            },
            toFixed(v1, fixed) {
                return numUtils.BN(v1).toFixed(fixed !== undefined ? fixed : 8)
            },
            goToExchangePage(item) {
                console.log(item)
                marketApi.get24hPrice({symbol: `${item.currencySymbol}${item.baseSymbol}`}, (data) => {
                    this.setLast24h(data)
                    localStorage.market =`${item.currencySymbol}_${item.baseSymbol}`
                    this.$router.push({name: 'exchange' })
                })
            },
            percentToMoney(item) {
                return utils.removeEndZero(this.toFixed(item.lastPrice, item.accuracy)).toMoney()
            }
        }
    }
</script>

<style scoped lang="less">
    .data_box {
        width: 100vw;
        height: 2.3rem;
        overflow: hidden;

        .cont {
            text-align: center;
            padding-top: 0.2rem;
            height: 2.3rem;

            .tit {
                color: #ffffff;
                font-size: 0.24rem;
                line-height: 0.4rem;
            }

            .nub {
                color: #0EB574;
                line-height: 0.5rem;
            }

            .c-green {
                color: #0EB574;
            }

            .c-orange {
                color: #E01C37;
            }
        }
    }
    .swiper-container-horizontal>.swiper-pagination-progressbar, .swiper-container-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite{
        width: 1rem;
        top: 2rem;
        left:50%;
        margin-left: -0.5rem;
        height:0.04rem;
        border-radius: 0.02rem;
        background: #222B3D;
    }
</style>
