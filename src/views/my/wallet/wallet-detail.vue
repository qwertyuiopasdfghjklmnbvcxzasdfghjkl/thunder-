<template>
    <div class="page">
        <top-back>{{$t('exchange.exchange_wallet')}}<!--钱包--></top-back>
        <div class="page-main">
            <div class="detail">
                <div class="name">
                    <span><img :src="'data:image/png;base64,'+symbolInfo.iconBase64"/></span>
                    <span>{{getSymbol}}</span>
                </div>
                <label>
                    <span>{{$t('home.total')}}</span>
                    <p>{{symbolInfo.totalBalance}}</p>
                </label>
                <label>
                    <span>{{$t('account.estimated_value_available')}}</span>
                    <p>{{symbolInfo.availableBalance}}</p>
                </label>
                <label>
                    <span>{{$t('wallet.value_frozen')}}</span>
                    <p>{{symbolInfo.frozenBalance}}</p>
                </label>
                <label class="top-border">
                    <span>{{$t('account.refund_obtained')}}<!-- 已获得手续费返佣 --></span>
                    <p>{{fee}}</p>
                </label>
            </div>
            <div class="market">
                <p>{{$t('home.go-market')}}</p>
                <ul>
                    <li v-for="item in dataList" v-tap="{methods: goMarket, data: item}">
                        <label>
                            <p><b>{{getSymbol}}</b><span class="ft-c-gray">/{{item.baseSymbol}}</span></p>
                            <small>{{(last24h[item.market]||0)|removeEndZero}}</small>
                        </label>
                        <span class="percent c-normal" :class="[percent(item).css]">{{percent(item).percent}}%</span>
                        <span class="ui-flex-1 rp">
                            <i class="allow-right"></i>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="btn">
                <label class="withdrawal" :class="{disabled: Number(symbolInfo.withdrawFlag) !== 1}" v-tap="{methods: withdrawal}">{{$t('public0.topup')}}</label>
                <label class="topup" :class="{disabled: Number(symbolInfo.rechargeFlag) !== 1}" v-tap="{methods: topup}">{{$t('home.topup')}}</label>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import {MessageBox, Toast} from 'mint-ui'
    import marketApi from '@/api/market'
    import walletApi from '@/api/wallet'
    import utils from '@/assets/js/utils'

    export default {
        name: "wallet-detail",
        computed: {
            ...mapGetters(['getUserWallets', 'getSymbol', 'getMarketList','getUserInfo']),
            dataList() {
                let _markets = this.getMarketList || []
                return _markets.filter(res => {
                    return this.getSymbol === res.currencySymbol
                })
            },
            symbolInfo(){
                let _temp = this.getUserWallets.filter(res => {
                    return this.getSymbol === res.symbol
                })
                return _temp[0]?_temp[0]:{}
            },
        },
        data() {
            return {
                last24h:{},
                fee:'--'
            }
        },
        watch:{
            dataList(_new){
                this.getLast24h()
            }
        },
        created(){
            this.getLast24h()
            this.getUserInvitedFeeCommission()
        },
        methods: {
            getUserInvitedFeeCommission(){
                walletApi.getUserInvitedFeeCommission(this.symbolInfo.accountId, (res)=>{
                    this.fee = res&&res.commissionAmount&&utils.removeEndZero(numUtils.BN(res.commissionAmount).toFixed(8)) || '--'
                })
            },
            getLast24h(){
                let _last24h = {}
                this.dataList.forEach(item=>{
                    marketApi.get24hPrice({symbol: item.market}, (res) => {
                        _last24h[item.market] = res[0][3]
                        this.last24h = _last24h
                    })
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
            goMarket(data) {
                // console.log(data)
                let item = data.data
                this.$router.push({name: 'exchange', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
            },
            withdrawal() {
                if(Number(this.symbolInfo.withdrawFlag) !== 1){
                    return
                }
                if (this.getUserInfo.kycState !== 1) {
                    MessageBox({
                        title: this.$t('public0.public242'),
                        message: this.$t('home.home66'), // 请先完成实名验证
                        confirmButtonText: this.$t('public0.ok')
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({name: 'kyc'})
                        }
                    })
                    return
                }
                /*if (this.getUserInfo.googleAuthEnable === 0 && this.getUserInfo.mobileAuthEnable === 0) {
                    MessageBox({
                        title: this.$t('public0.public242'),
                        message: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
                        confirmButtonText: this.$t('public0.ok')
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({name: 'safe'})
                        }
                    })
                    return
                }*/
                this.$router.push({name: 'withdrawal'})
            },
            topup() {
                if(Number(this.symbolInfo.rechargeFlag) !== 1){
                    return
                }
                // if (this.getUserInfo.googleAuthEnable === 0 && this.getUserInfo.mobileAuthEnable === 0) {
                //     MessageBox({
                //         title: this.$t('public0.public242'),
                //         message: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
                //         confirmButtonText: this.$t('public0.ok')
                //     }).then(action => {
                //         if (action === 'confirm') {
                //             this.$router.push({name: 'safe'})
                //         }
                //     })
                //     return
                // }
                this.$router.push({name: 'page-topup'})

            },
        }
    }
</script>

<style scoped lang="less">
    .detail {
        .name {
            text-align: center;
            margin: 0.7rem auto 0.2rem;

            img {
                width: 0.8rem;
            }

            span {
                line-height: 0.8rem;
                height: 0.8rem;
                display: inline-block;
                vertical-align: top;
                margin: 0 0.1rem;
                font-size: 0.4rem;
            }
        }

        label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.2rem 0;
            font-size: 0.3rem;

            span {
                color: #999;
            }
        }

        .top-border {
            border-top: 0.02rem solid #ddd;
            margin-top: 0.1rem;
        }
    }

    .market {
        margin-bottom: 1.2rem;
        padding-top: 0.3rem;
        border-top: 0.02rem solid #ddd;
        & > p {
            font-size: 0.3rem;
            color: #999;
        }

        ul {
            margin: 0.5rem auto;
            li {
                padding: .2rem;
                border-radius: 0.1rem;
                height: 1.5rem;
                margin-bottom: 0.2rem;
                display: flex;
                background-color: #fff;

                label {
                    p {
                        b {
                            font-weight: 400;
                            font-size: 0.36rem;
                        }
                    }

                    small {
                        font-size: 0.3rem;
                        line-height: 0.4rem;
                        color: #999;
                        padding-top: 0.2rem;
                        display: block;
                    }
                }
                .percent {margin-left: 0.6rem;}
            }
        }
    }

    .btn {
        position: fixed;
        width: 100vw;
        height: 1.1rem;
        bottom: 0;
        left: 0;
        display: flex;
        label{
            width: 50%;
            height: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.3rem;
            color: #fff;
            background: #1FB674;
            &.withdrawal{
                background: #FF2B5D;
            }
            &.disabled {opacity: 0.6;}

        }
    }

    .c-green {
        color: #42BCA0;
    }

    .c-orange {
        color: #F43148;
    }
</style>
