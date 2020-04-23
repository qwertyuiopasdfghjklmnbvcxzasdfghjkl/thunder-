<template>
    <div class="page">
        <top-back style="background: #151C2C;"> {{$t('home.home50')}}</top-back>
        <div class="page-main">
            <!--<div class="symbol">-->
            <!--<img :src="`data:image/png;base64,${symbolInfo.iconBase64}`"/>-->
            <!--<span>{{symbolInfo.symbol}}</span>-->
            <!--</div>-->
            <div class="topup full">

                <section class="block wallet-contant mt20 box">
                    <!--<p class="title"><strong>{{symbolInfo.symbol}}{{$t('referral.address')}}</strong></p>-->
                    <div ref="qrcode" class="qrcode"></div>
                    <p class="two f26">{{getAddress}}</p>
                    <p class="tc mt50 pb20">
                        <mt-button type="primary" class="mini" v-tap="{methods:copy}">{{$t('referral.copy')}}
                            <!--复制--></mt-button>
                    </p>
                    <template v-if="symbol==='EOS' || symbol==='XRP'">
                        <p class="title mt30">{{symbol}} {{$t('account.recharge_memo')}}<!--充值备注--></p>
                        <div ref="memoQrcode" class="qrcode"></div>
                        <p class="two f26">{{symbolInfo.address}}</p>
                        <p class="tc mt50 pb20">
                            <mt-button type="primary" class="mini" v-tap="{methods:copyMemo}">{{$t('referral.copy')}}
                                <!--复制--></mt-button>
                        </p>
                    </template>
                </section>
                <div class="inner_text box">
                    <p><strong>{{$t('usercontent.notice')}}<!--充值须知--></strong></p>
                    <ul>
                        <li>1. {{$t('account.user_prompt1').format(symbolInfo.symbol)}}
                            <!--.使用BCH地址充值需要6个网格确认才能到账，具体到账以实际到账时间为准--></li>
                        <li>2. {{$t('account.user_prompt2').format(symbolInfo.symbol, symbolInfo.blockConfirm)}}
                            <!--充值最小额度为0.01BCH,小于0.01BCH将无法到账。--></li>
                        <li class="" v-if="symbol==='EOS' || symbol==='XRP'">3.
                            {{$t('account.userRechargeMemoTip')}}
                            <!-- Memo和Address需要同时使用才能充值成功！ --></li>
                    </ul>
                </div>
                <div class="mt30"></div>
            </div>

        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {Toast} from 'mint-ui'
    import utils from '@/assets/js/utils'
    import userUtils from '@/api/wallet'
    import cordovaUtils from '@/assets/js/cordovaUtils'

    export default {
        name: 'page-topup',
        data() {
            return {
                symbol: '',
                symbolInfo: {},
                EOS_MEMO: ''
            }
        },
        computed: {
            ...mapGetters(['getUserWallets', 'getSymbol', 'getSysParams']),
            XRP_MEMO() {
                return (this.getSysParams['mainAddXRP'] && this.getSysParams.mainAddXRP.value) || ''
            },
            getAddress() {
                return this.symbol === 'EOS' ? this.EOS_MEMO : (this.symbol === 'XRP' ? this.XRP_MEMO : this.symbolInfo.address)
            }
        },
        watch: {
            getAddress() {
                utils.qrcode(this.$refs.qrcode, {
                    text: this.getAddress,
                    width: 150,
                    height: 150
                })
            },
        },
        created() {
            this.symbol = this.getSymbol
            this.getInfo()
            if (this.symbol === 'EOS' && !this.EOS_MEMO) {
                this.getEosAddress()
            }
            this.$nextTick(() => {
                    utils.qrcode(this.$refs.qrcode, {
                        text: this.getAddress,
                        width: 150,
                        height: 150
                    })
                    utils.qrcode(this.$refs.memoQrcode, {
                        text: this.symbolInfo.address,
                        width: 150,
                        height: 150
                    })
                }
            )
            console.log(this.getUserWallets, this.getSymbol)
        },
        methods: {
            getEosAddress() {
                userUtils.getEosAddress(data => {
                    this.EOS_MEMO = data
                })
            },
            getInfo() {
                this.getUserWallets.filter(res => {
                    if (this.getSymbol === res.symbol) {
                        this.symbolInfo = res
                    }
                })
            },
            copy() {
                utils.copyText(this.getAddress)
                Toast(this.$t('public0.public33')) // 复制成功
            },
            copyMemo() {
                utils.copyText(this.symbolInfo.address)
                Toast(this.$t('public0.public33')) // 复制成功
            },
        }
    }
</script>

<style lang="less" scoped>
    @font_color_transparent: #cbd4ec;
    @fs_24: .28rem;
    @f_c_2: #999;
    .topup {
        overflow: auto;
    }

    .symbol {
        display: flex;
        height: 0.96rem;
        align-items: center;
        justify-content: left;
        margin: 0 -.3rem;
        padding: 0 .3rem;

        img {
            width: 0.5rem;
            height: 0.5rem;
        }

        span {
            margin-left: 0.2rem;
        }
    }

    .inner_text {
        font-size: 0.3rem;
        padding: 0.3rem;
        color: #4B5875;
        border-top: 0.01rem solid #26314A;

        p {
            padding-bottom: 0.28rem;
        }

        li {
            font-size: 0.3rem;
            line-height: 0.45rem;
        }
    }

    .wallet-contant {
        .title {
            font-size: 0.3rem;
            border-left: 0.04rem solid #3B48C8;
            height: 0.3rem;
            line-height: 0.3rem;
            padding-left: 0.18rem;
            font-weight: bold;
        }

        .qrcode {
            width: 3.1rem;
            height: 3.1rem;
            padding: 0.17rem;
            display: flex;
            align-content: center;
            justify-content: center;
            background: #ffffff;
            margin: 0.4rem auto;
            /deep/ img {
                display: block;
                width: 100%;
            }
        }

        .two {
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .three {
            margin: 0.5rem auto;
        }
    }
</style>
