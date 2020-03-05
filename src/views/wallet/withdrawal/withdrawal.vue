<template>
    <div class="page">
        <top-back style="background: #151C2C;">{{$t('public0.topup')}}</top-back>

        <div class="page-main">
            <div class="select full">
                <label :class="{'active':withdrawalType === 1}" v-tap="{methods: ()=>{withdrawalType = 1}}">{{$t('market.def_withdrawal')}}</label>
                <label :class="{'active':withdrawalType === 2}" v-tap="{methods: ()=>{withdrawalType = 2}}">{{$t('market.inset_withdrawal')}}</label>
            </div>
            <div class="withdrawal mt20">
                <ul class="payment-detail">
                    <li v-show="withdrawalType === 1">
                        <label>
                            {{$t('account.user_Pick_up_address')}}
                        </label>
                        <p class="address mt10">
                            <input type="text" v-validate="'required'" v-model="form.toAddress"
                                   :placeholder="$t('public0.public-new-address')" autocomplete="off"/>
                            <i class="scanning" v-tap="{methods: scanQRCode}"></i>
                            <i class="address" v-tap="{methods: getAddress}"></i>
                        </p>
                    </li>
                    <li v-show="withdrawalType === 2" class="account_type">
                        <span>{{$t('market.select_account_type')}}</span>
                        <div>
                            <p v-tap="{methods:()=>{showType = !showType}}">{{accountType.name}}</p>
                            <ul v-show="showType">
                                <li v-for="item in accountTypeList"
                                    v-tap="{methods:()=>{accountType = item;showType=false}}">{{item.name}}
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li v-show="withdrawalType === 2">
                        <!--手机、邮箱、UID-->
                        <label>
                            {{$t('account.user_center_account')}}
                        </label>
                        <p class="address mt10">
                            <input type="text" v-validate="'required'"
                                   v-model="form.toAddress" @blur="focusAccount()"
                                   :placeholder="accountType.name" autocomplete="off"/>
                        </p>
                    </li>
                    <li v-if="symbol==='EOS' || symbol==='XRP'">
                        <label>{{$t('account.user_center_history_note')}}<!--提现备注--></label>
                        <p class="mt10"><input type="text" maxlength="1000" v-model="form.memo"
                                               :placeholder="'Memo,'+$t('public0.public237')"/></p>
                    </li>
                    <li class="add_num">
                        <label>{{$t('account.user_Draw_the_number')}}<!--提现数量--></label>
                        <p class="mt10">
                            <input type="number" v-model="form.amount"
                                   name="amount"
                                   :placeholder="$t('account.user_minimum_number_of_cash').format(`：${symbolInfo.minWithdraw}`)"/>{{symbol}}
                            <!--最小提现数量为：{0} {symbol}-->
                            <a href="javascript:;" class="set_all" @click="setAll">{{$t('trade_record.trade_record_all')}}</a>
                        </p>
                        <small class="aumont">
                            <span>
                                {{$t('account.estimated_value_available')}}<!--可用余额-->
                                <i class="">{{symbolInfo.availableBalance}} {{symbol}}</i>
                            </span>
                        </small>
                    </li>
                    <li>
                        <label>{{$t('exchange.advanced_fee')}}<!--手续费--></label>
                        <p class="mt10">
                            <input :value="procedureFee" disabled/> {{symbol}}
                        </p>
                    </li>
                    <li>
                        <div class="inner_text">
                            <p>{{$t('home.notice')}}：<!--温馨提示--></p>
                            <ol>
                                <li>{{$t('public0.text001')}}<!--您可以在充值提现历史记录页面跟踪状态。--></li>
                            </ol>
                        </div>
                    </li>
                    <li class="add-top mt15">
                        <h4>
                            <span>{{$t('account.user_Actual_arrival')}}</span><!--到账数量-->
                            <span>{{lastAmount}}</span>
                            <span> {{symbol}}</span>
                        </h4>
                    </li>
                </ul>
            </div>
            <div class="bottom">
                <mt-button type="primary" size="large" :disabled="!lock"
                           v-tap="{methods: walletWithdraw}">{{$t('public0.submit')}}
                </mt-button>
            </div>
        </div>
        <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
            <confirm ref="confirm" :params="params" :type="withdrawalType" :toUserType="accountType.type"
                     @removeDialog="removeDialog" @okCallback="okCallback"></confirm>
        </mt-popup>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import wallet from '@/api/wallet'
    import cordovaUtils from '@/assets/js/cordovaUtils'
    import numUtils from '@/assets/js/numberUtils'
    import confirm from './confirm'
    import utils from '@/assets/js/utils'
    import userUtils from '@/api/wallet'


    export default {
        name: 'page-withdrawal',
        components: {
            confirm
        },
        data() {
            return {
                symbolInfo: {},
                symbol: null,
                placeOrderVisible: false,
                withdrawalType: 1,
                form: {
                    toAddress: '',
                    amount: '',
                    password: '',
                    googleCode: '',
                    memo: null
                },
                accountType: {
                    name: this.$t('otc_exchange.otc_exchange_phone'),
                    type: 1
                },
                accountTypeList: [
                    {name: this.$t('otc_exchange.otc_exchange_phone'), type: 1},
                    {name: this.$t('usercontent.user02'), type: 2},
                    {name: 'UID', type: 3}
                ],
                showType: false,
                lockAccount:true
            }
        },
        computed: {
            ...mapGetters(['getUserWallets', 'getSymbol', 'getUserInfo']),
            lock() {
                return (this.form.toAddress && this.form.amount && this.lockAccount) || false
            },
            lastAmount() {
                if (this.form.amount) {
                    let rst = numUtils.minus(this.form.amount, this.procedureFee)
                    return rst.gte(numUtils.BN(0)) ? rst : 0
                } else {
                    return 0
                }
            },
            params() {
                return {
                    symbol: this.symbol,
                    symbolType: this.symbolInfo.symbolType,
                    amount: this.form.amount,
                    fromAccount: this.symbolInfo.accountId, // 用户id
                    selToAddress: this.form.toAddress,
                    memo: this.form.memo,
                    phoneNumber: this.getUserInfo.mobile,
                    countryCode: this.getUserInfo.countryCode || '+86',
                    email: this.getUserInfo.email || this.getUserInfo.username
                }
            },
            insetWithdrawalParams(){
                return {
                    toUserType: this.accountType.type,
                    toAccountName: this.form.toAddress,
                    quantity: this.form.amount,
                    symbol: this.symbol,
                    symbolType: this.symbolInfo.symbolType,
                    // memo: this.form.memo,
                }
            },
            procedureFee() {
                if (this.withdrawalType === 2) {
                    return this.$t('market.fee')
                } else {
                    if (this.symbolInfo.procedureFeeType == 0) {
                        return this.symbolInfo.procedureFee
                    } else {
                        return !!Number(this.form.amount) ? utils.removeEndZero(numUtils.mul(this.symbolInfo.procedureFee, this.form.amount).toFixed(8)) : '--'
                    }
                }
            }
        },
        watch: {},
        created() {
            this.symbol = this.getSymbol
            this.form.toAddress = this.$route.params.address || ''
            this.getInfo()
        },
        methods: {
            setAll() {
                this.form.amount = this.symbolInfo.availableBalance
            },
            getInfo() {
                this.getUserWallets.filter(res => {
                    if (this.getSymbol === res.symbol) {
                        this.symbolInfo = res
                    }
                })
            },
            scanQRCode() {
                cordovaUtils.scanQRCode((addr) => {
                    this.form.toAddress = addr
                    console.log(addr)
                })
            },
            getAddress() {
                this.$router.push({name: 'address', params: {from: 'withdrawal'}})
            },
            walletWithdraw() {
                if (Number(this.form.amount) > Number(this.symbolInfo.availableBalance)) {
                    Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')})
                    return
                } else if (Number(this.form.amount) < Number(this.symbolInfo.minWithdraw)) {
                    Tip({
                        type: 'danger',
                        message: this.$t('account.user_minimum_number_of_cash').format(`：${this.symbolInfo.minWithdraw} ${this.symbol}`)
                    }) // 最小提币数量为{0}。
                    this.form.amount = this.symbolInfo.minWithdraw
                    return
                }
                if(this.withdrawalType === 2){
                    userUtils.insetWithdraw(this.insetWithdrawalParams,res=>{
                        Tip({type: 'success', message: res})
                    },msg=>{
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
                }else {
                    this.placeOrderVisible = true
                }

            },
            removeDialog() {
                this.placeOrderVisible = false
            },
            okCallback() {
                this.placeOrderVisible = false
                this.$router.push({name: 'trading'})
            },
            focusAccount(e) {
                console.log(e)
                if(!this.form.toAddress.length){return}
                if (this.accountType.type === 1) {
                    let reg = /^[0-9]*$/
                    if (!reg.test(this.form.toAddress)) {
                        Tip({type: 'danger', message: this.$t('error_code.SMS_MOBILE_FORMAT_ERROR')})
                        this.lockAccount = false
                    }else{
                        this.lockAccount = true
                    }
                } else if (this.accountType.type === 2) {
                    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                    if (!reg.test(this.form.toAddress)) {
                        Tip({type: 'danger', message: this.$t('error_code.EMAIL_FORMAT_ERROR')})
                        this.lockAccount = false
                    }else{
                        this.lockAccount = true
                    }
                }else{
                    this.lockAccount = true
                }
            }
        }
    }
</script>

<style lang="less" scoped>

    @f_c_2: #999;

    .withdrawal {
        color: #4B5875;
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
        padding: 0.3rem 0;

        p {
            padding-bottom: 0.28rem;
        }

        li {
            font-size: 0.3rem;
            line-height: 0.38rem;
        }
    }


    .payment-detail {
        li {
            margin-bottom: 0.35rem;
            position: relative;

            & > p {
                margin-top: 0.3rem;
                display: flex;
                height: 0.5rem;
                position: relative;
                border-bottom: 0.02rem solid #1D273C;
                padding-bottom: 0.2rem;
                font-size: 0.32rem;

                input {
                    flex-shrink: 0;
                    flex-grow: 1;
                    background: none;
                    border: none;
                    outline: none;
                    color: #ffffff;
                    font-size: 0.32rem;
                    line-height: 0.5rem;
                }

                .scanning, .address {
                    width: 0.44rem;
                    height: 0.44rem;
                    background: url("../../../assets/img/scanner.png") no-repeat center;
                    background-size: 0.44rem;
                    margin-left: 0.4rem;
                }

                .address {
                    background: url("../../../assets/img/icon_address.png") no-repeat center;
                    background-size: 0.44rem;
                }

                .eye {
                    position: absolute;
                    right: 0.1rem;
                    display: inline-block;
                    width: 0.4rem;
                    height: 0.4rem;

                    img {
                        width: 0.4rem;
                    }
                }
            }

            .aumont {
                display: flex;
                justify-content: space-between;
                margin-top: 0.15rem;

                i {
                    font-style: normal;
                    padding-left: 0.1rem;
                }
            }

            .show_error {
                position: absolute;
                bottom: -0.35rem;
                left: 0;
                font-size: 0.2rem;
                color: #f65416;
            }

            .address {
                img {
                    width: 0.2rem;
                    vertical-align: middle;
                }
            }

            .set_all {
                color: #ffffff;
                padding-left: 0.3rem;
                line-height: 0.34rem;
            }


        }

        .add-top {
            h4 {
                font-size: 0.32rem;
                display: flex;

                span:nth-child(2) {
                    flex: 1;
                    text-align: right;
                    color: #ffffff;
                }

                span:nth-of-type(3) {
                    color: #ffffff;
                }
            }

        }
    }

    .bottom {
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
    }

    .place_order_popup {
        width: 100%;
        border-radius: 0.3rem 0.3rem 0 0;
    }

    .select {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.15rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;

        label {
            flex: 1;
            height: 0.9rem;
            text-align: center;
            line-height: 0.9rem;
            color: #ffffff;
            background: #0EB574;
            border-radius: 0.1rem;
            margin: 0.15rem;

            &.active {
                background: #E01C37;
            }
        }
    }

    .account_type {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
            color: #ffffff;
        }

        div {
            margin-left: 0.4rem;
            flex: 1;
            position: relative;
            border: 0.02rem solid #1D273C;
        }

        p {
            padding: 0.2rem 0.3rem;
            background: url("../../../assets/img/ic_up@2x.png") no-repeat right center;
            background-size: 0.16rem;
            margin-right: 0.2rem;
        }

        ul {
            position: absolute;
            top: 0.8rem;
            left: 0;
            background: #000;
            box-shadow: 0.2rem 0.2rem 0.4rem #151C2C;
            width: 100%;
            z-index: 99;

            li {
                padding: 0.2rem;
                margin: 0;
                border-bottom: 0.01rem solid #151C2C;
            }
        }
    }
</style>
