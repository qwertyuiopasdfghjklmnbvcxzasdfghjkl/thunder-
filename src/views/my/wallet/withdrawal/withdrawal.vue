<template>
    <div class="page">
        <top-back>{{$t('public0.topup')}}</top-back>

        <div class="page-main">
            <div class="symbol">
                <img :src="`data:image/png;base64,${symbolInfo.iconBase64}`"/>
                <span>{{symbolInfo.symbol}}</span>
            </div>
            <div class="inner_text">
                <p>{{$t('home.notice')}}：<!--温馨提示--></p>
                <ol>
                    <li>{{$t('public0.text001')}}<!--您可以在充值提现历史记录页面跟踪状态。--></li>
                </ol>
            </div>
            <div class="block mt20">
                <ul class="payment-detail">
                    <li>
                        <label class="address" v-tap="{methods: getAddress}">{{$t('account.user_Pick_up_address')}}
                            <img src="../../../../assets/img/tc_meus_b@2x.png"/><!--提现地址--></label>
                        <p class="address mt10">
                            <input type="text" v-validate="'required'" name="selToAddress" v-model="form.toAddress" :placeholder="$t('public0.public-new-address')" autocomplete="off"/>
                            <i class="scanning" v-tap="{methods: scanQRCode}"></i>
                            
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
                                   :placeholder="$t('account.user_minimum_number_of_cash').format(`：${symbolInfo.minWithdraw} ${symbol}`)"/>
                            <!--最小提现数量为：{0} {symbol}-->
                            <a href="javascript:;" @click="setAll">{{$t('trade_record.trade_record_all')}}</a>
                        </p>
                        <small class="aumont">
                            <span>{{$t('exchange.advanced_fee')}}<!--手续费-->
                                {{procedureFee}} {{symbol}}</span>
                            <span>
                                {{$t('account.estimated_value_available')}}:<!--可用余额-->
                                <i class="ft-c-main">{{symbolInfo.availableBalance}} {{symbol}}</i>
                            </span>
                        </small>
                    </li>                    
                    <li class="add-top mt15">
                        <h4>{{$t('account.user_Actual_arrival')}}：<!--到账数量-->
                            <span>{{lastAmount}}</span> <span> {{symbol}}</span></h4>
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
          <confirm ref="confirm" :params="params" @removeDialog="removeDialog" @okCallback="okCallback"></confirm>
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


    export default {
        name: 'page-withdrawal',
        components:{
            confirm
        },
        data() {
            return {
                symbolInfo: {},
                symbol: null,
                placeOrderVisible:false,
                form: {
                    toAddress: '',
                    amount: '',
                    password: '',
                    googleCode: '',
                    memo: null
                },
            }
        },
        computed: {
            ...mapGetters(['getUserWallets', 'getSymbol','getUserInfo']),
            lock() {
                return (this.form.toAddress && this.form.amount && true) || false
            },
            lastAmount() {
                if (this.form.amount) {
                    let rst = numUtils.minus(this.form.amount, this.procedureFee)
                    return rst.gte(numUtils.BN(0))?rst:0
                } else {
                    return 0
                }
            },
            params () {
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
            procedureFee(){
                if(this.symbolInfo.procedureFeeType==0){
                    return this.symbolInfo.procedureFee
                } else {
                    return !!Number(this.form.amount)?utils.removeEndZero(numUtils.mul(this.symbolInfo.procedureFee, this.form.amount).toFixed(8)):'--'
                }
            }
        },
        watch: {
            
        },
        created() {
            this.symbol = this.getSymbol
            this.form.toAddress = this.$route.params.address || ''
            this.getInfo()
        },
        methods: {
            setAll(){
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
            getAddress(){
                this.$router.push({name:'address', params:{from:'withdrawal'}})
            },
            walletWithdraw(){
                if(Number(this.form.amount) > Number(this.symbolInfo.availableBalance)){
                    Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')})
                    return
                } else if (Number(this.form.amount) < Number(this.symbolInfo.minWithdraw)) {
                    Tip({type: 'danger', message: this.$t('account.user_minimum_number_of_cash').format(`：${this.symbolInfo.minWithdraw} ${this.symbol}`)}) // 最小提币数量为{0}。
                    this.form.amount = this.symbolInfo.minWithdraw
                    return
                }
                this.placeOrderVisible = true
            },
            removeDialog () {
              this.placeOrderVisible = false
            },
            okCallback () {
              this.placeOrderVisible = false
              this.$router.push({name: 'trading'})
            },
        }
    }
</script>

<style lang="less" scoped>

    @f_c_2: #999;

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
        color: @f_c_2;
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
                margin-top: 0.2rem;
                display: flex;
                height: 0.5rem;
                position: relative;

                input {
                    flex-shrink: 0;
                    flex-grow: 1;
                    background: none;
                    border: none;
                    border-bottom: 0.02rem solid #ddd;
                    outline: none;
                    line-height: 0.4rem;
                }

                .scanning {
                    width: 0.5rem;
                    height: 0.5rem;
                    background: url("../../../../assets/img/scanner.png") no-repeat center;
                    background-size: 0.5rem;
                    margin-left: 0.2rem;
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
                color: #9da2a9;

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
            .address{
                img{
                    width: 0.2rem;
                    vertical-align: middle;
                }
            }
        }
    }
.bottom{
    margin-top: 0.4rem;
}
.place_order_popup{width: 100%;}
</style>
