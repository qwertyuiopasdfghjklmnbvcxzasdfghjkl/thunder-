<template>
    <div class="cont">
        <div class="top">
            <span :class="[data.direction==1?'buy':'sell']">{{getPrice(data.price)}}{{data.direction==1 ? $t('exchange.exchange_buy') : $t('exchange.exchange_sell')}}</span>
            <span><strong class="ft-c-white">{{data.toSymbol}} / {{data.fromSymbol}}</strong></span>
            <span class="time">{{new Date(Number(data.createdAt)).format()}}</span>
        </div>

        <div class="data">
            <div class="ear">
                <div class="ear-cont">
                    <div class="ear-left">
                        <div class="border-right"
                             :class="[data.direction==1?'buy':'sell']"
                             :style="{transform: `rotate(${leftRotate}deg)`}">
                        </div>
                    </div>
                    <div class="ear-right">
                        <div class="border-left"
                             :class="[data.direction==1?'buy':'sell']"
                             :style="{transform: `rotate(${rightRotate}deg)`}"></div>
                    </div>
                    <p :class="[data.direction==1?'buy':'sell']">{{value}}%</p>
                </div>
            </div>
            <div class="data-title">
                <p>{{$t('exchange.exchange_amount')}}<!--数量-->
                    <span>{{toFixed(data.finishedAmount)|number}} / {{toFixed(data.totalAmount)|number}}</span>
                </p>
                <p>{{$t('exchange.exchange_price')}}<!--价格--> <span>{{data.price==-1?$t('exchange.exchange_market'):toFixed(data.price)|number}}</span></p>
            </div>
            <div class="btn">
                <span v-if="form">{{getStatue(data)}}</span>
                <span v-else class="cancel" @click="cancelOrder(data.orderBookId)">
                    {{$t('exchange.exchange_revoked')}}<!--撤销-->
                </span>
            </div>
        </div>
    </div>
</template>

<script>

    import numUtils from '@/assets/js/numberUtils'

    export default {
        props: ['data','index','form'],
        data() {
            return {
                rightRotate: 45,
                value: 0,
                fixedNumber: 8
            }
        },
        computed: {
            leftRotate() {
                let roatte = (this.toFixed(this.data.finishedAmount) / this.toFixed(this.data.totalAmount)) * 100
                this.value = Number(this.toFixed(roatte,2));
                if (roatte <= 50) {
                    return (roatte * 3.6) + 45
                } else {
                    this.rightRotate = (roatte - 50) * 3.6 + 45
                    return 180 + 45
                }
            }
        },
        methods: {
            getType(type) {
                if (numUtils.BN(type).equals(numUtils.BN(1))) {
                    return this.$t('exchange.exchange_buys') // 买
                } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
                    return this.$t('exchange.exchange_sells') // 卖
                }
            },
            getPrice(price) {
                if (numUtils.BN(price).equals(numUtils.BN(-1))) {
                    return this.$t('exchange.exchange_market_price') // 市价
                } else {
                    return this.$t('home.limit') // 限价
                }
            },
            cancelOrder(orderBookId) {
                let data = {
                    i: this.index,
                    id: orderBookId
                }
               this.$emit('del',data)
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
            },
            getStatue (item) { // 状态
                let state = Number(item.state)
                if (state === 0) {
                    if (numUtils.BN(item.finishedAmount).gt(0)) {
                        return this.$t('exchange.exchange_partial_transaction') // 部分成交
                    }
                    return this.$t('exchange.exchange_cancelled') // 已撤销
                } else if (state === 2) {
                    return this.$t('exchange.exchange_partial_transaction') // 部分成交
                } else if (state === 3 || state === 4) {
                    return this.$t('exchange.exchange_complete_transaction') // 完全成交
                } else {
                    return '--'
                }
            },
        }
    }
</script>

<style scoped lang="less">
    @c_f: #4B5875;
    @c_buy: #D74E5A;
    @c_sell: #0EB574;
    .cont {
        .top {
            display: flex;

            span {
                font-size: 0.3rem;

                &:first-child {
                    width: 1.4rem;
                }

                &:nth-child(2) {

                }

                &:last-child {
                    flex-grow: 1;
                    text-align: right;
                    font-size: 0.24rem;
                    color: @c_f;
                }
            }
        }

        .buy {
            color:  @c_sell;
        }

        .sell {
            color: @c_buy;
        }

        .data {
            display: flex;
            align-items: center;

            .ear {
                padding: 0.16rem;
                margin-right: 0.2rem;
            }

            .ear-cont {
                width: 0.9rem;
                height: 0.9rem;
                position: relative;
                border: 0.06rem solid #ccc;
                border-radius: 50%;

                & > div {
                    position: absolute;
                    width: 0.45rem;
                    height: 0.9rem;
                    z-index: 9;
                    overflow: hidden;

                    div {
                        position: absolute;
                        width: 0.9rem;
                        height: 0.9rem;
                        border-radius: 50%;

                    }

                    .buy {
                        border: 0.08rem solid @c_sell;
                    }

                    .sell {
                        border: 0.08rem solid @c_buy;
                    }

                    .border-right {
                        left: 0;
                        top: 0;
                        border-left-color: transparent;
                        border-bottom-color: transparent;
                    }

                    .border-left {
                        right: 0;
                        top: 0;
                        border-right-color: transparent;
                        border-top-color: transparent;
                    }
                }

                .ear-left {
                    left: -0.06rem;
                    top: -0.06rem;
                }

                .ear-right {
                    right: -0.06rem;
                    top: -0.06rem;
                }
                p{
                    text-align: center;
                    padding-top: 0.24rem;
                    font-size: 0.2rem;
                }
            }
        }
        .data-title {
            flex: 1;
            min-width: 0;
            p{
                line-height: 0.52rem;
                /*color: #ffffff;*/
                color: @c_f;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span{
                    padding-left: 0.2rem;
                }
            }
        }
        .btn{
            min-width: 1.2rem;
            text-align: right;
            .cancel{
                padding: 0.1rem 0.3rem;
                margin-top: 0.2rem;
                background-color: #212A40;
                color: #0C6AC9;
                border-radius:0.25rem;
                display: inline-block;
            }
        }
    }
</style>
