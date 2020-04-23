<template>
    <div class="page">
        <top-back> {{$t('incubation.accelerator')}}<!-- 孵息加速器 --> </top-back>
        <div class="page-main">
            <div class="full">
                <div class="symbol mt20 bgc pl30 pr30 ui-flex ui-flex-justify">
                     <span class="cgray">{{$t('trade_record.trade_record_currency')}}<!-- 币种 --></span>
                     <span class="f32">{{token}}</span>
                </div>
                <div class="desc mt20 bgc pl30 pr30 pt15 ui-flex">
                     <span class="cgray ui-flex ui-flex-column ui-flex-center">{{$t('public0.public54')}}<!-- 从 --></span>
                     <div class="ui-flex-1 bline">
                         <p class="f32">{{$t('account.currency_account')}}<!-- 币币账户 --></p>
                         <p class="cgray f24">{{token}}</p>
                     </div>
                </div>
                <div class="desc bgc pl30 pr30 pt15 ui-flex">
                     <span class="cgray ui-flex ui-flex-column ui-flex-center">{{$t('public0.to')}}<!-- 到 --></span>
                     <div class="ui-flex-1">
                         <p class="f32">{{$t('incubation.incubation_account')}}<!-- 孵息账户 --></p>
                         <p class="cgray f24">{{token}}</p>
                     </div>
                </div>
                <div class="bgc mt20 pl30 pr30 pt40 pb20">
                     <div class="cgray">{{$t('business.QUANTITY')}}<!-- 数量 --></div>
                     <div class="mt20 ui-flex ui-flex-justify bline">
                         <numberbox class="ui-flex-1" name="amount" v-model="formData.amount" v-validate="'required|positiveValue|balance'" :accuracy="fixnumber" :placeholder="$t(`public0.public58`)" v-focus><!-- 请输入划转数量 --></numberbox>
                         <span class="f32 blue lh80" v-tap="{methods:allIn}">{{$t('incubation.transfer_all')}}<!-- 全部划转 --></span>
                     </div>
                     <div class="lh80 cgray">{{$t('incubation.most_transfer')}}<!-- 最多可转 --> {{(wallet.availableBalance?wallet.availableBalance:'0')|removeEndZero}} {{token}}</div>
                </div>
            </div>
            <div class="mt120">
                <mt-button type="primary" size="large" :disabled="locked" v-tap="{methods:transfer}">{{$t('incubation.confirm_transfer')}}<!-- 确定划转 --></mt-button>
            </div>
        </div>
        <confirm
          ref="confirm"
          @callBack="saveTransfer"
        ></confirm>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import { MessageBox } from 'mint-ui'
import numberbox from '@/components/numberInput'
import confirm from '@/views/qotc/components/confirm'
import numUtils from '@/assets/js/numberUtils'
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
import incubationApi from '@/api/incubation'
    export default {
        name: "staked_history",
        components: {
            numberbox,
            confirm
        },
        data() {
            return {
                fixnumber:8,
                token:'',
                formData:{
                    amount:''
                },
                locked:false
            }
        },
        computed:{
            ...mapGetters(['getUserWallets']),
            msgs(){
                return {
                    amount:{
                        required: this.$t('public0.public58'),//请输入划转数量
                        balance: this.$t('incubation.insufficient_to_recharge'),//当前余额不足，请您去充值
                    }
                }
            },
            wallet(){
                let _wallet = this.getUserWallets.filter(item=>{return this.token == item.symbol})
                return _wallet.length?_wallet[0]:{}
            },
        },
        created() {
            this.token = this.$route.params.token
            this.$validator.extend('balance',{
                getMessage:(field, args)=>'',
                validate:(value, args)=>{
                    return numUtils.BN(value).lte(this.wallet.availableBalance||0)
                }
            })
        },
        methods: {
            ...mapActions(['setSymbol']),
            allIn(){
                this.formData.amount = this.wallet.availableBalance
            },
            transfer(){
                this.$validator.validateAll().then(res=>{
                    if(!res){
                        let items = this.errors.items
                        if (items && items.length) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            if(this.errors.firstRule(name)=='balance'){
                                MessageBox.confirm(msg, this.$t('public0.tip'),{
                                  confirmButtonText: this.$t('public0.ok'),
                                  cancelButtonText: this.$t('public0.no'),
                                }).then(ac => {
                                    this.setSymbol(this.token)
                                    this.$router.push({name:'page-topup'})
                                })
                            } else {
                                Tip({type: 'danger', message: msg})
                            }
                            
                        }
                        return
                    }
                    this.$refs.confirm.openConfirm()
                })
            },
            async saveTransfer(data){
                this.$refs.confirm.closeConfirm()
                let _data = {
                    type:data.verifyType,
                    code:data.code,
                    google:data.googleCode,
                    amount:this.formData.amount,
                    symbol:this.token,
                    sType:this.wallet.symbolType,
                }
                let rsaPublicKey = await this.getRsaPublicKey()
                let _params = {
                    param:utils.encryptPwd(rsaPublicKey, JSON.stringify(_data)),
                    pubKey:rsaPublicKey
                }
                // console.log({_data},{_params})
                this.locked = true
                Indicator.open('Loading...')
                incubationApi.transfer(_params, msg=>{
                    Indicator.close()
                    this.locked = false
                    window.getAssets()
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                    this.$router.back()
                },msg=>{
                    Indicator.close()
                    this.locked = false
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })

            },
            getRsaPublicKey(){
                return new Promise((r,j)=>{
                    userApi.getRsaPublicKey((rsaPublicKey) => {
                       r(rsaPublicKey)
                    },msg=>{
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
                })
            }
        }
    }
</script>

<style scoped lang="less">
@blue:#0C6AC9;
@cgray:#4B5875;
.blue {color: @blue;}
.cgray {color: @cgray;}

.bgc {background-color: #151C2C;}
.symbol {line-height: 0.96rem;}
.desc > span {width: 0.8rem;}
.desc > div {line-height: 0.6rem;}
.bline {border-bottom: 1px solid #252E44;}
input[type=text] {
    background-color: transparent;
    font-size: 0.32rem;
    color: #fff;
    border: none;
    height: 0.8rem;
    padding: 0.15rem 0;
}
.lh80 {line-height: 0.8rem;}
</style>
