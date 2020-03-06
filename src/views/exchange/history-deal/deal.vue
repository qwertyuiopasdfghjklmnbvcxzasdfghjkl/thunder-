<template>
    <section class="entrust-container">
        <!--<div class="mt40 pl30">{{$t('account.current_select')}}&lt;!&ndash; 当前选择 &ndash;&gt;:{{`${currentSymbol}/${baseSymbol}`}}</div>-->
        <div class="navbar">
            <div class="ui-flex ui-flex-column ui-flex-center">
                <label class="f30"><input class="hide" type="checkbox" v-model="hideHistoryTrustCanceled"/><i :class="[hideHistoryTrustCanceled?'icon-checkbox-checked ft-c-yellow':'icon-checkbox-unchecked ft-c-lightGray']"></i> {{$t('account.userConcealmentHasBeenRevoked')}}<!--隐藏已撤销--></label>
            </div>
        </div>
        <ul class="trust-list" v-show="fcdatas">
            <li v-for="(item, index) in fcdatas" :key="index">
                <column :data="item" :index="index" :form="'history'"></column>
            </li>
        </ul>
        <no-data v-show="!fcdatas.length"></no-data>
    </section>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import market from '@/api/market'
    import NoData from "../../../components/common/noData";
    import Column from "../now-deal/column";
    import numUtils from '@/assets/js/numberUtils'

    export default {
        props: {
            fixedNumber: {
                type: Number,
                default: 8
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
                type: String,
                default: ''
            },
            mul: {
                type: Function
            },
        },
        components: {
            Column,
            NoData,
        },
        data() {
            return {
                cdatas: [],
                hideHistoryTrustCanceled: false,
                form: {
                    current: 0,
                    hideCancelled: 0,
                    history: "1",
                    limit: 100,
                    tp: 0
                }
            }
        },
        computed: {
            ...mapGetters(['getApiToken','getMarketList']),
            fcdatas(){
                return this.cdatas.filter(item=>{
                    let rst = true

                    if(!rst){
                        return false
                    } else if(this.hideHistoryTrustCanceled){
                        rst = (item.state !== 0 || numUtils.BN(item.finishedAmount).gt(0))
                    }
                    return rst
                })
            },
            symbolList(){
              return this.getMarketList?this.getMarketList.map(item=>{return item.baseSymbol}).join('|'):''
            },
        },
        created() {
            this.$nextTick(() => {
              this.addEvents({
                name: 'extrustEvent',
                fun: this.extrustEvent
              })
            })
            this.getList()
        },
        beforeDestroy () {
          this.removeEvents('extrustEvent')
        },
        methods: {
            ...mapActions(['setEntrustPrices', 'addEvents', 'removeEvents']),
            mergeData(data){
                let newDatas = [], patt = new RegExp(`(.*)(${this.symbolList})$`)
                data.forEach((item) => {
                  let ms = item.market.match(patt)
                  item.toSymbol = ms && ms[1]
                  item.fromSymbol = ms && ms[2]
                  newDatas.push(item)
                })
                return newDatas
            },
            extrustEvent (res) {
              if (res && res.type === 'history') {
                // 当前委托
                this.cdatas = this.mergeData(res.data)
              }
            },
            getList() {
                if (this.getApiToken) {
                    market.getCurrentEntrustByParams(this.form, res => {
                        this.cdatas = this.mergeData(res.data)
                    }, msg => {
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
                } else {
                    this.cdatas = []
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @c_gray: #F4F5FA;
    @c_buy: #24C898;
    @c_sell: #F65B69;
    @c_light: #91A4A3;
    @c_board: #B9D0CF;
    @c_btn: #1C9CE3;

    .entrust-container {
        .navbar {
            margin-top: 0.25rem;
            display: flex;
            justify-content: space-between;
            padding: 0 0.3rem 0.3rem;
            .navs span {
                margin-right: 0.3rem;

                &.active {
                    font-size: 0.32rem;
                    color: #536866;
                }
            }
        }
    }
    .hideOther {
        display: flex;
        align-items: center;
        height: 0.8rem;
        /deep/ .mint-switch-core::before {
            background-color: #eee;
        }
        /deep/ .mint-switch-input:checked + .mint-switch-core {
            border-color: #FCA337;
            background-color: #FCA337;
        }
        .checkbox {
            width: .28rem;
            height: .28rem;
            vertical-align: top;

            input {
                display: none;

                &:checked {
                    + i {
                        background-color: @c_buy;
                        border-color: @c_buy;

                        &::before {
                            border-color: #fff;
                        }
                    }
                }
            }

            i {
                position: relative;
                display: block;
                width: .28rem;
                height: .28rem;
                border: 2px solid @c_board;
                border-radius: 2px;
                margin-top: 0.04rem;
                overflow: hidden;

                &::before {
                    content: "";
                    position: absolute;
                    top: -0.05rem;
                    left: 0.05rem;
                    width: .12rem;
                    height: .22rem;
                    border-width: 0 2px 2px 0;
                    border-style: solid;
                    border-color: transparent;
                    border-radius: 2px;
                    transform: rotate(45deg);
                }
            }
        }
    }

    .all_repeal {
        padding: 0.15rem 0.3rem;
        background-color:#eee;
        border-radius: 0.32rem;
        font-size: 0.3rem;
    }

    .trust-list {
        li {
            padding: 0.25rem 0.3rem;
            /*border-top: 0.2rem solid #F6F6F6;*/
            /*&:last-of-type {border-bottom: 0.2rem solid #F6F6F6;}*/
            .title {
                position: relative;

                .buy {
                    color: @c_buy;
                }

                .sell {
                    color: @c_sell;
                }

                .time {
                    color: @c_board;
                    font-size: 0.24rem;
                    transform: scale(0.916);
                    margin-left: 0.1rem;
                }

                .cancel {
                    position: absolute;
                    right: 0;
                    font-size: 0.26rem;
                    color: #247BDE;
                    background-color: @c_gray;
                    padding: 0.06rem 0.12rem;
                    border-radius: 3px;
                }
            }

            .data {
                margin-top: 0.2rem;

                .data-title {
                    display: flex;

                    span {
                        flex: 1;
                        min-width: 0;
                        color: @c_board;
                        font-size: 0.24rem;

                        &:last-of-type {
                            text-align: right;
                        }
                    }
                }

                .data-info {
                    margin-top: 0.2rem;
                    font-size: 0.3rem;
                    display: flex;

                    span {
                        flex: 1;
                        min-width: 0;

                        &:last-of-type {
                            text-align: right;
                        }

                        em {
                            color: @c_board;
                            font-size: 0.24rem;
                            transform: scale(0.916);
                            font-style: normal;
                        }
                    }
                }
            }
        }
    }

</style>
