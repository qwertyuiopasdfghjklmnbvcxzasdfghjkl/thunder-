<template>
    <div class="latest-deal">
        <div class="header">
            <span class="ui-flex-3">{{$t('exchange.exchange_date')}}<!--时间--></span>
            <span class="ui-flex-4">{{$t('exchange.exchange_price')}}<!--价格-->({{baseSymbol}})</span>
            <span class="ui-flex-4 tr">{{$t('exchange.exchange_amount')}}<!--数量-->({{currentSymbol}})</span>
        </div>
        <ul class="deal-list">
            <li v-for="(item, index) in datas" :key="index" :class="{buy:item.direction==1}"
                @click="clickChangeValue(item)">
                <span class="ui-flex-3 ft-c-lightGray">{{formatDate(item.createdAt)}}</span>
                <span class="ui-flex-4">{{toFixed(item.price)|removeEndZero}}</span>
                <span class="ui-flex-4">{{toFixed(item.amount,accuracy.quantityAccu)|removeEndZero}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import market from '@/api/market'

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
            symbol: {
                type: String
            }
        },
        data() {
            return {
                showLoading: true,
                datas: []
            }
        },
        computed: {
            ...mapGetters(['getApiToken'])
        },
        watch: {
            getApiToken() {
                this.changeLogin()
            },
            symbol() {
                this.changeLogin()
            },
        },
        created() {
            this.$nextTick(() => {
                this.addEvents({
                    name: 'lastdealEvent',
                    fun: this.lastdealEvent
                })
            })
            this.changeLogin()
        },
        beforeDestroy() {
            this.removeEvents('lastdealEvent')
        },
        methods: {
            ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
            lastdealEvent(res) {
                if (res && res.type === 'updateData') {
                    this.datas = res.data
                }
            },
            clickChangeValue(item) {
                this.setEntrustNewPrice(item.price)
            },
            changeLogin() {
                // 最近交易记录
                market.getNearestTradeRecords(this.symbol, (res) => {
                    this.datas = res
                }, (msg) => {
                    console.log(msg)
                })
            },
            toFixed(price, fixed) {
                return numUtils.BN(price).toFixed(fixed || this.accuracy.fixedNumber)
            },
            formatDate(date) {
                return (new Date(Number(date))).format('HH:mm:ss')
            }
        }
    }
</script>

<style lang="less" scoped>
    .latest-deal .header {
        display: flex;
        border-bottom: 0.02rem solid #eee;
        color: #999;
        line-height: 0.8rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }

    .latest-deal .header > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .latest-deal .deal-list {
        padding: 0 0.3rem;
    }

    .latest-deal .deal-list li {
        height: 0.6rem;
        line-height: 0.6rem;
        display: flex;
    }

    .latest-deal .deal-list li span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .latest-deal .deal-list li span:nth-of-type(2) {
        color: #01C89F;
    }

    .latest-deal .deal-list li span:nth-of-type(3) {
        text-align: right;
    }

    .latest-deal .deal-list li.buy span:nth-of-type(2) {
        color: #F07180;
    }
</style>
