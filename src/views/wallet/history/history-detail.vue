<template>
    <div class="page">
        <top-back>{{form === 1 ? $t('home.home54'):$t('home.home55')}}{{$t('trade_record.entrust_detail')}}</top-back>
        <div class="page-main">
            <div class="cont">
                <div class="top">
                    <p>
                        <img :src="`data:image/png;base64,${src}`">
                        <span>{{data.symbol}}</span>
                    </p>
                    <label>
                        <span>{{$t('account.user_center_history_amount')}}</span>
                        <p>{{data.amount}}</p>
                    </label>
                    <label>
                        <span>{{$t('home.home57')}}</span>
                        <p :class="[form === 1 ?getRechargeState(data.status).className:getWithdrawalState(data).className]">
                            {{form === 1
                            ?getRechargeState(data.status).value:getWithdrawalState(data).value}}</p>
                    </label>
                    <label>
                        <span>{{$t('exchange.exchange_type')}}</span>
                        <p>{{exchangeType}}</p>
                    </label>
                </div>
                <div class="bot">
                    <div v-tap="{methods: copy, text:data.toAddress}">
                        <p class="mt30 ft-c-lightGray">{{$t('home.home51')}}
                            <span class="cope"><img src="../../../assets/img/icon_cope.png"/></span>
                        </p>
                        <p class="mt30 ellipsis">{{data.toAddress}}</p>
                    </div>
                    <div v-tap="{methods: copy, text:data.txId}">
                        <p class="mt30 ft-c-lightGray">Txid
                            <span class="cope"><img src="../../../assets/img/icon_cope.png"/></span>
                        </p>
                        <p class="mt30 ellipsis">{{data.txId}}</p>
                    </div>
                    <label>
                        <span>{{$t('exchange.exchange_entrust_time')}}</span>
                        <p>{{new Date(data.updatedAt).format()}}</p>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import utils from '@/assets/js/utils'
    import {Toast} from 'mint-ui'

    export default {
        name: "history-cont",
        data() {
            return {
                data: {},
                form: null,
                src: null
            }
        },
        computed: {
            ...mapGetters(['getUserWallets']),
            exchangeType(){
                let type=null
                if(this.form === 1){
                    type = this.data.withdrawType === 3 ? this.$t('market.inner_withdrawal') : this.$t('market.flash_withdrawal')
                }else{
                    type = this.data.withdrawType === 3 ? this.$t('market.inner_topup') : this.$t('market.flash_topup')
                }
                return type
            }
        },
        created() {
            console.log(this.$route.params)
            let params = this.$route.params
            this.data = params.data
            this.form = params.form
            this.getImg()
        },
        methods: {
            getImg() {
                this.getUserWallets.filter(res => {
                    if (res.symbol === this.data.symbol) {
                        this.src = res.iconBase64
                    }
                })
            },
            getRechargeState(state) { // 获取充值状态
                if (state === 1) {
                    return {
                        className: 'underway',
                        value: this.$t('account.user_center_history_status_wait') // 等待中
                    }
                } else if (state === 2) {
                    return {
                        className: 'success',
                        value: this.$t('account.user_center_history_status_success') // 成功
                    }
                }else if (state === 3 || state === 4) {
                    return {
                        className: 'fail',
                        value: this.$t('account.user_center_history_status_fail') // 失败
                    }
                } else {
                    return {
                        className: null,
                        value: null
                    }
                }
            },
            getWithdrawalState(state) { // 获取提现状态
                if (state.withdrawType === 3) {
                    switch (state.status) {
                        case 1:
                            return {
                                className: 'underway',
                                value: this.$t('usercontent.user77') // 待审核
                            }
                        case 2:
                            return {
                                className: 'success',
                                value: this.$t('account.user_center_history_status_complete') // 已完成
                            }
                        case 3:
                        case 4:
                            return {
                                className: 'fail',
                                value: this.$t('account.user_center_history_status_fail') // 失败
                            }
                    }
                } else {
                    switch (state.status) {
                        case 1:
                            return {
                                className: 'underway',
                                value: this.$t('account.user_center_history_status_review') // 审核中
                            }
                        case 2:
                        case 3:
                            return {
                                className: 'underway',
                                value: this.$t('account.user_center_history_status_withdrawal') // 提现中
                            }
                        case 4:
                            return {
                                className: 'fail',
                                value: this.$t('account.user_center_history_status_repeal') // 已撤销
                            }
                        case 5:
                            return {
                                className: 'fail',
                                value: this.$t('account.user_center_history_status_fail') // 失败
                            }
                        case 6:
                            return {
                                className: 'success',
                                value: this.$t('account.user_center_history_status_complete') // 已完成
                            }
                        default:
                            return {
                                className: null,
                                value: null
                            }
                    }
                }
            },
            copy(args) {
                utils.copyText(args.text)
                Toast(this.$t('public0.public33')) // 复制成功
            },
        }
    }
</script>

<style scoped lang="less">
    .cont {
        .top {
            border-bottom: 0.02rem solid #1D273C;

            & > p {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0.6rem auto;

                span {
                    margin-left: 0.2rem;
                    font-size: 0.32rem;
                }

                img {
                    width: 0.8rem;
                    height: 0.8rem;
                }
            }
        }

        label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0.3rem 0;

            p {
                flex-shrink: 1;
                flex-grow: 1;
                text-align: right;
                white-space: pre-wrap;
                word-break: break-all;
            }

            span {
                color: #4B5875;
                padding-right: 0.2rem;
            }

            i {
                display: inline-block;
                padding: 0.1rem;
                font-style: normal;
                color: #ffffff;
            }
        }
    }

    .cope {
        margin-left: 0.2rem;

        img {
            width: 0.28rem;
            vertical-align: middle;
        }
    }

    .fail {
        color: #F07180;
    }

    .success {
        color: #01C89F;
    }
</style>
