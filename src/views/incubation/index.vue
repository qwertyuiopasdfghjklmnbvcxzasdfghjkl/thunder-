<template>
    <div class="page">
        <top-back style="background: #0C6AC9;">
            {{$t('incubation.accelerator')}}<!-- 孵息加速器 -->
            <router-link slot="right" class="stake-btn" :to="{name:'stakedHistory'}" tag="span">{{$t('account.history_staked')}}<!-- 锁仓记录 --></router-link>
        </top-back>
        <div class="page-main">
            <hoc @getData="getData" :params="params" size="large">
                <div class="full">
                    <div class="top-view text-center">
                        <p class="f24">{{$t('incubation.expected_profit')}}<!-- 预期收益 -->（{{token}}）</p>
                        <p class="f60 mt20">{{expected|toFixed(fixnumber)}}</p>
                        <p class="f24 mt20">≈ {{$t('incubation.avg_inc_vol').format(avgIncVol)}}<!-- {0}%月均孵化量 --></p>
                    </div>
                </div>
                <div class="full bgblock">
                    <div class="ml30 mr30">
                        <div class="pt30 f32">{{$t('account.stake_amount')}}<!-- 锁仓数量 --></div>
                        <div class="mt20 ui-flex bbline">
                            <numberbox class="ui-flex-1" name="amount" v-model="formData.amount" v-validate="'required|limitMin|balance'" :accuracy="fixnumber" :placeholder="$t('incubation.least_amount').format(toFixed(lockMin), token)" v-focus><!-- 最少{0}{1}起 --></numberbox>
                            <span class="allin" v-tap="{methods:allIn}">{{$t('user.all')}}<!-- 全部 --></span>
                        </div>
                        <div class="mt25 pb25 ui-flex ui-flex-justify">
                            <span class="cgray">{{$t('exchange.value_available')}}<!-- 可用 --> {{(wallet.availableBalance?wallet.availableBalance:'0')|removeEndZero}} {{token}}</span>
                            <router-link class="blue" :to="{name:'transfer', params:{token:token}}" tag="span">{{$t('public0.public35')}}<!-- 划转 --> <font class="icon_ circle ml5"><i class="icon_ icon-swap f24"></i></font></router-link>
                        </div>
                    </div>
                </div>
                <div class="mt20 full bgblock pb60">
                    <div class="ml30 mr30">
                        <div class="pt25 f32">{{$t('incubation.lock_period')}}<!-- 锁仓期限 --></div>
                        <ul class="days pt10 clearfix">
                            <li v-for="item in tokenInfo" :class="{active:formData.days==item.lockDays}" v-tap="{methods:()=>{formData.days=item.lockDays}}">{{item.lockDays}}{{$t('exchange.exchange_day')}}<!-- 天 --></li>
                        </ul>
                    </div>
                </div>
                <div class="mt120">
                    <mt-button type="primary" size="large" :disabled="locked" v-tap="{methods:stake}">{{$t('account.confirm_stake')}}<!-- 确定锁仓 --></mt-button>
                </div>
            </hoc>
        </div>
        <!-- 二次确认 -->
        <confirm
          ref="confirm"
          @callBack="saveStake"
        ></confirm>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import { MessageBox } from 'mint-ui'
import numUtils from '@/assets/js/numberUtils'
import numberbox from '@/components/numberInput'
import confirm from '@/views/qotc/components/confirm'
import incubationApi from '@/api/incubation'
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
import Hoc from '@/components/common/hoc'
    const _req = (params) => {
        return new Promise((r,j) => {
          incubationApi.findFinances(params,(data)=>{
            r(data)
          },(msg,res)=>{
            j(res)
          })
        })
    }
    let hoc = new Hoc(null, _req)
    export default {
        name: "incubation",
        components: {
            numberbox,
            confirm,
            hoc,
        },
        data() {
            return {
                fixnumber:8,
                token:null,
                tokens:[],
                params:{
                    page:1,
                    size:99999
                },
                formData:{
                    amount:'',
                    days:30,
                },
                locked:false
            }
        },
        computed:{
            ...mapGetters(['getIncubatedWallets', 'getMarketList']),
            msgs(){
                return {
                    amount:{
                        required: this.$t('incubation.input_stake_amount'),//请输入锁仓数量
                        limitMin: this.$t('incubation.least_stake_amount').format(this.toFixed(this.lockMin), this.token),//锁仓数量不能低于{0}{1}
                        balance: this.$t('incubation.insufficient_to_transfer'),//当前余额不足，请您去划转
                    }
                }
            },
            avgIncVol(){
                let _percent = numUtils.mul(this.selectedToken.monthRatio||0, 100)
                return _percent.toFixed(4)
            },
            expected(){
                return numUtils.mul(numUtils.mul(this.formData.amount, this.formData.days), this.selectedToken.releaseRatio)
            },
            wallet(){
                let _wallet = this.getIncubatedWallets.filter(item=>{return this.token == item.symbol})
                return _wallet.length?_wallet[0]:{}
            },
            tokenInfo(){
                let _info = (this.tokens[this.token]||[]).sort((A,B)=>{
                   return A.lockDays > B.lockDays? 1:-1
                })
                _info.length && (this.formData.days = _info[0].lockDays)
                return _info
            },
            selectedToken(){
                let _token = this.tokenInfo.filter(item=>{return item.lockDays == this.formData.days})
                return _token.length && _token[0] || {}
            },
            market(){
                return `${this.token}USDT`.toUpperCase()
            },
            lockMin(){
                if(this.token=='USDT'){
                    return this.selectedToken.lockMin
                } 
                let _price = 0
                for(let item of this.getMarketList || []){
                    if(item.market==this.market){
                        _price = item.lastPrice
                        break
                    }
                }
                return _price?numUtils.div(this.selectedToken.lockMin||0,_price):0
            }
        },
        created() {
            this.token = this.$route.params.token || null
            this.$validator.extend('limitMin',{
                getMessage:(field, args)=>'',
                validate:(value, args)=>{
                    return numUtils.BN(value).gte(this.lockMin||0)
                }
            })
            this.$validator.extend('balance',{
                getMessage:(field, args)=>'',
                validate:(value, args)=>{
                    return numUtils.BN(value).lte(this.wallet.availableBalance||0)
                }
            })
        },
        methods: {
            toFixed(value, digit){
                return utils.removeEndZero(utils.toFixed(value, digit||this.fixnumber))
            },
            getData(data){
                !this.token && data.length && (this.token = data[0].symbol)
                data = data.reduce((obj, item)=>{
                    if(obj[item.symbol]){
                        obj[item.symbol].push(item)
                    } else {
                        obj[item.symbol] = [item]
                    }
                    return obj
                },{})
                this.tokens = data
            },
            allIn(){
                this.formData.amount = this.wallet.availableBalance
            },
            stake(){
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
                                    this.$router.push({name:'transfer', params:{token:this.token}})
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
            async saveStake(data){
                this.$refs.confirm.closeConfirm()
                let _data = {
                    type:data.verifyType,
                    code:data.code,
                    google:data.googleCode,
                    amount:this.formData.amount,
                    id:this.selectedToken.id
                }
                let rsaPublicKey = await this.getRsaPublicKey()
                let _params = {
                    param:utils.encryptPwd(rsaPublicKey, JSON.stringify(_data)),
                    pubKey:rsaPublicKey
                }
                // console.log({_data},{_params})
                this.locked = true
                Indicator.open('Loading...')
                incubationApi.investFunds(_params, msg=>{
                    Indicator.close()
                    this.locked = false
                    window.getAssets()
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
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
.top-view {
    padding: 0.3rem 0 0.5rem;
    background-color: @blue;
    color: #fff;
}
.bgblock {background-color: #151C2C;}
input[type=text] {
    background-color: transparent;
    font-size: 0.32rem;
    color: #fff;
    border: none;
    height: 0.8rem;
    padding: 0.15rem 0;
}
.bbline {border-bottom: 1px solid #2B364E;}
.allin {padding-left: 0.3rem; line-height: 0.8rem; color: @blue;}
.circle {width: 0.4rem; height: 0.4rem; background-color: #212A40; border-radius: 100%; text-align: center; padding: 0.02rem; transform: scale(0.8);}
.days {
    margin-left: -0.3rem; 
    margin-right: -0.3rem;
    li {float: left; margin-top: 0.3rem; margin-left: 0.3rem; margin-right: 0.3rem; width: 1.9rem;  line-height: 0.8rem; border-radius: 4px; border: 1px solid #2B364E; text-align: center; color: @cgray;}
    li.active {color: @blue; border-color: @blue;}
}
.stake-btn {line-height: 0.9rem; margin-right: 0.3rem;}
</style>
