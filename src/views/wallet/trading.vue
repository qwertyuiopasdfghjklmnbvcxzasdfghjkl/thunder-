<template>
    <div class="page">
        <top-back :back="false" style="background: #0C6AC9;">
            {{$t('home.home45')}}
        </top-back>
        <div class="top top_total">

            <div class="total">
                <p v-tap="{methods:()=>{ showMoney = !showMoney}}">
                    <span>{{$t('exchange.exchange_valuation')}}(USDT)</span>
                    <img :src="showMoney ? require('../../assets/img/assets_eye_open.png'): require('../../assets/img/assets_eye_closed.png')"/>
                </p>
                <h4 class="">{{(totalUSDT.toFixed(8)) | removeEndZero}}</h4>
                <span>≈ {{getCoinSign}} {{totalCNY}}</span>
            </div>

            <div class="nav_item">
                <span v-tap="{methods: withdrawal}">
                      <img src="../../assets/img/i_tx.png">
                    <em>
                        {{$t('home.home49')}}<!--提现-->
                    </em>
                </span>
                <span v-tap="{methods: pay}">
                    <img src="../../assets/img/i_cz.png">
                    <em>
                        {{$t('home.home50')}}<!--充值-->
                    </em>
                </span>
                <span>
                    <router-link :to="{name: 'history'}" slot="right" tag="span">
                        <img src="../../assets/img/i_txjl.png">
                        <em>{{$t('home.home48')}}</em>
                    </router-link>
                </span>
            </div>
            <div class="tab-bar">
                <mt-navbar v-model="type">
                  <mt-tab-item :id="1"><span>{{$t('account.currency_account')}}<!--币币账户--></span></mt-tab-item>
                  <mt-tab-item :id="3"><span>{{$t('incubation.incubation_account')}}<!--孵息账户--></span></mt-tab-item>
                </mt-navbar>
            </div>
            <div class="list_title">
                <label :class="{active:showZero}">
                <span>
                    <!--<img :src="showZero ? require('../../../assets/img/check@3x.png'): require('../../../assets/img/no-check.png')">-->
                    <i>√</i>
                    <input type="checkbox" v-model="showZero">
                </span>
                    <span>{{$t('home.home52')}}</span>
                </label>
            </div>
        </div>

        <div class="page-main">
            <div class="cont_list full ">
                <transition enter-active-class="animated short slideInLeft" leave-active-class="animated short slideOutLeft">
                <ul class="box" v-show="type==1">
                    <li v-for="data in filterSymboltList" v-tap="{methods: toWallet, item:data}">
                        <p>
                            <img :src="'data:image/png;base64,'+data.iconBase64"/>
                            <span>{{data.accountName}}</span>
                        </p>
                        <label>
                            <p>{{data.totalBalance | removeEndZero}}</p>
                            <span><img src="../../assets/img/i_rig_c@3x.png"/></span>
                        </label>
                    </li>
                </ul>
                </transition>
                <transition enter-active-class="animated short slideInRight" leave-active-class="animated short slideOutRight">
                <ul class="box" v-show="type==3">
                    <li v-for="data in filterIncubatedSymbolList" v-tap="{methods: toIncubationWallet, item:data}">
                        <p>
                            <img :src="'data:image/png;base64,'+data.iconBase64"/>
                            <span>{{data.accountName}}</span>
                        </p>
                        <label>
                            <p>{{data.totalBalance | removeEndZero}}</p>
                            <span><img src="../../assets/img/i_rig_c@3x.png"/></span>
                        </label>
                    </li>
                </ul>
                </transition>
            </div>

        </div>

    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox, Toast} from 'mint-ui'
    import market from '@/api/market'
    import numUtils from '@/assets/js/numberUtils'
    import myApi from '@/api/user'
    import walletApi from '@/api/wallet'
    import utils from '@/assets/js/utils'
    import otc from '../../api/otc'


    export default {
        data() {
            return {
                showZero: false,
                showMoney: true,
                totalUSDT: 0,
                curCNYPrice:null,
                type:1
            }
        },
        computed: {
            ...mapGetters(['getUserInfo', 'getUserWallets', 'getIncubatedWallets', 'getBTCValuation', 'getUSDTBTC', 'getBtcPrice', 'getCoinSign']),
            symbolList() { // 获取币种列表
                return this.getUserWallets.sort((item1, item2) => {
                    if (item1.symbol === item2.symbol) {
                        return 0
                    } else {
                        return item1.symbol < item2.symbol ? -1 : 1
                    }
                })
            },
            incubatedSymbolList() { // 获取孵息币种列表
                return this.getIncubatedWallets.sort((item1, item2) => {
                    if (item1.symbol === item2.symbol) {
                        return 0
                    } else {
                        return item1.symbol < item2.symbol ? -1 : 1
                    }
                })
            },
            filterSymboltList() {
                if (this.showZero) {
                    return this.symbolList.filter(item => {
                        return Number(item.totalBalance) > 0 ? true : false
                    })

                } else {
                    return this.symbolList
                }
            },
            filterIncubatedSymbolList() {
                if (this.showZero) {
                    return this.incubatedSymbolList.filter(item => {
                        return Number(item.totalBalance) > 0 ? true : false
                    })

                } else {
                    return this.incubatedSymbolList
                }
            },
            currentSymbolInfo() {
                if (this.showMoney) {
                    return utils.removeEndZero(numUtils.mul(this.getBTCValuation, this.getUSDTBTC).toFixed(4))
                } else {
                    return '******'
                }
            },
            totalUSDTDisplay() {
                if (this.showMoney) {
                    return utils.removeEndZero(numUtils.mul(this.getBTCValuation, this.getBtcPrice.USDT).toFixed(4))
                } else {
                    return '******'
                }
            },
            totalCNY(){
                if (this.showMoney) {
                    return utils.removeEndZero(numUtils.mul(this.totalUSDT, this.curCNYPrice).toFixed(2))
                } else {
                    return '******'
                }
            }
        },
        created() {
            this.type = this.$route.query.type == 3?3:1
            this.showMoney = JSON.parse(localStorage.getItem('showAssets') || 'true')
            this.getCNYPrice()
            this.getAssets()
            this.gettTotalUSDTAmount()
        },
        watch: {
            showMoney(_new) {
                localStorage.setItem('showAssets', _new)
            },
            type(_new) {
                this.$router.replace({name:'trading', query:{type:_new}})
            }
        },
        methods: {
            ...mapActions(['setBTCValuation', 'setSymbol', 'setUserInfo', 'setUserWallets']),
            gettTotalUSDTAmount() {
                walletApi.gettTotalUSDTAmount(res => {
                    this.totalUSDT = res
                })
            },
            getCNYPrice(){
                let data= {
                    ad_type: 1,
                    symbol: 'USDT',
                    currency: 'CNY',
                    bench_marking_id: 1,
                }
                otc.getBenchSymbolInfo(data,res=>{
                    this.curCNYPrice = Number(res.cur_price).toFixed(2) || 0
                })
            },
            getAssets() {
                walletApi.myAssets({}, (res) => {
                    if (res.length == 0) {
                        setTimeout(this.getAssets, 2000)
                        return
                    }
                    res = res.filter(item => {
                        return item.type === 1
                    })
                    res.forEach((item) => {
                        item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
                    })
                    this.setUserWallets(res)
                })
            },
            // getInfo() {
            //     myApi.getUserInfo(res => {
            //         this.setUserInfo(res);
            //     }, msg => {
            //         Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            //     })
            // },
            withdrawal() { // 前往提现
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
                this.$router.push({name: 'withdrawal-select'})
            },
            pay() { // 充值
                // if (this.getUserInfo.mobileAuthEnable === 0) {
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
                this.$router.push({name: 'topup-select'})

            },
            toWallet(params) {
                this.setSymbol(params.item.symbol)
                this.$router.push({name: 'wallet-detail'})
            },
            toIncubationWallet(params) {
                this.$router.push({name: 'incubationDetail', params:{token:params.item.symbol}})
            },
        }
    }
</script>

<style lang="less" scoped>

    .top_total {
        background: url("../../assets/img/total_bg.png") no-repeat center #0C6AC9;
        background-size: cover;
    }

    .nav_item{
        background: #151C2C;
        margin: 0 0.3rem;
        border-radius:0.16rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 1.6rem;
        position: relative;
        bottom: -0.8rem;
        span{
            flex: 1;
            text-align: center;
            img{
                width: 0.48rem;
                height: 0.42rem;
            }
            em{
                font-style: normal;
                display: block;
            }
        }
    }
    .top {
        margin-top: 0.9rem;
    }

    .page-main {
        top: 7rem;
        overflow-x: hidden;
    }

    .wallet-feature {
        display: flex;
        justify-content: space-between;
        border-bottom: 0.02rem solid #eee;
        line-height: 0.9rem;
        padding: 0 0.3rem;

    }

    .wallet-feature p {
        font-size: 0.32rem;
        color: #3B48C8;
        position: relative;
        border-bottom: 2px solid #3B48C8;
        margin-bottom: -1px;
    }

    .wallet-feature-symbol {
        width: 0.8rem;
        height: 0.8rem;
        object-fit: contain;
        object-position: center;
        margin-left: auto;
        margin-right: auto;
        display: block;
    }

    .wallet-feature-operation {
        display: flex;
        /*width: 3.3rem;;*/
        justify-content: flex-end;
    }

    .wallet-feature-operation span {
        margin-right: 0.2rem;
        display: inline-flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 0.24rem;

        &:nth-of-type(3) {
            margin-right: 0;
        }
    }

    .wallet-feature-operation span img {
        width: 0.32rem;
        object-fit: contain;
        object-position: center;
        vertical-align: middle;
    }

    .wallet-feature-operation span em {
        font-style: normal;
        display: inline-block;
        margin-left: 0.1rem;
    }

    .wallet-feature-operation span em.disabled {
        opacity: 0.6;
    }

    .total {
        text-align: center;
        overflow: auto;
        p {
            color: #ffffff;
            font-size: 0.28rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.3rem;

            span {
                padding-right: 0.2rem;
            }

            img {
                width: 0.3rem;
                vertical-align: middle;
            }
        }

        h4 {
            margin-top: 0.25rem;
            font-size: 0.6rem;
            font-weight: 400;
        }
    }

    .list_title {
        background-color: #151C2C;
        padding: 0.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        label {
            display: inline-flex;
            align-items: center;
            i{
                display: inline-block;
                width: 0.3rem;
                height: 0.3rem;
                background: #4B5875;
                color: #4B5875;
                font-weight: bold;
                font-size: 0.2rem;
                text-align: center;
                line-height: 0.3rem;
            }

            &.active span {
                color: #ffffff;
                i{
                    color: #fff;
                }
            }

            span {
                line-height: 0.24rem;
                color: #4B5875;
            }

            span:first-child {
                margin-right: 0.16rem;
                position: relative;
                width: 0.24rem;
                height: 0.24rem;
                display: inline-block;

                input {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 9;
                    opacity: 0;
                }
            }
        }
    }

    .cont_list {
        position:relative;
        font-size: 0.3rem;
        ul {
            position:absolute;
            width: 100%;
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 0.02rem solid #222938;
                padding: 0.3rem;

                &:last-child {
                    border-bottom: none;
                }

                label {
                    display: inline-flex;
                    flex-wrap: nowrap;
                    align-items: center;

                    p {
                        padding-right: 0.24rem;
                        color: #ffffff;
                    }

                    img {
                        width: 0.13rem;
                        height: 0.21rem;
                        vertical-align: middle;
                    }
                }
                p{
                    display: flex;
                    align-items: center;
                    img{
                        width: 0.7rem;
                        height: 0.7rem;
                        margin-right: 0.24rem;
                    }
                }
            }
        }
    }

    .tab-bar {
        padding-top:0.8rem;
        background-color: #151C2C;
        /deep/ .mint-navbar {border-bottom: 1px solid #131e30; background-color: #151C2C;}
        /deep/ .mint-tab-item {
            height: 0.9rem;
            color: #6C6F8B;
            padding: 0;
            &.is-selected {
                color: #0067e7; border-bottom: none; margin-bottom: 0;
                .mint-tab-item-label span{
                    padding: 0 0.3rem;
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
    }
</style>
