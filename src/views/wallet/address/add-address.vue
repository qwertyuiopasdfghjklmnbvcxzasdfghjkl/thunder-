<template>
    <div class="page">
        <top-back>{{$t('home.new-address')}} ({{symbol}})</top-back>
        <div class="page-main">
            <div class="form-cont">
                <p class="mt30"><strong>{{$t('home.address')}}<!-- 提币地址 --></strong></p>
                <div class="cont">
                    <ui-input
                            :label="$t('home.input-address')"
                            v-model="form.address"
                            :placeholder="true"
                            :title="$t('home.address')"
                            style="margin-right: 0.6rem;"
                    ></ui-input>
                    <i class="scanning" v-tap="{methods: scanQR}"></i>
                </div>
                <p class="mt30"><strong>{{$t('usercontent.user90')}} / {{$t('usercontent.user89')}}<!-- 备注/标签 --></strong></p>
                <div class="cont">
                    <ui-input
                            :label="$t('home.input-memo')"
                            v-model="form.memo"
                            :placeholder="true"
                            :title="$t('account.user_Remark_label')"
                    ></ui-input>
                </div>
            </div>
            <div class="bottom">
                <mt-button type="primary" size="large" :disabled="!lock || submited"
                           v-tap="{methods: addAddress}">{{$t('home.add-address')}}
                </mt-button>
            </div>
        </div>
        <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
          <vertify ref="vertify" :params="params" :mobileState="getUserInfo.mobileAuthEnable" @removeDialog="removeDialog" @okCallback="okCallback"></vertify>
        </mt-popup>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import UiInput from "../../../components/uiInput";
    import wallet from '../../../api/wallet'
    import cordovaUtils from '@/assets/js/cordovaUtils'
    import vertify from '../vertify'
    import {MessageBox} from 'mint-ui'

    export default {
        components: {UiInput, vertify},
        data() {
            return {
                symbol: null,
                placeOrderVisible:false,
                form: {
                    address: null,
                    memo: null,
                    type:2
                },
                submited:false
            }
        },
        computed: {
            ...mapGetters(['getSymbol', 'getUserInfo']),
            lock() {
                return (this.form.address && this.form.memo && true) || false
            },
            params () {
              return {
                phoneNumber: this.getUserInfo.mobile,
                countryCode: this.getUserInfo.countryCode || '+86',
              }
            },
        },
        created() {
            this.symbol = this.getSymbol
        },
        methods: {
            verify(){
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
                if (this.getUserInfo.googleAuthEnable === 0 && this.getUserInfo.mobileAuthEnable === 0) {
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
                }
                if (this.lock) {
                    this.placeOrderVisible = true
                }
            },
            addAddress(data) {
                if(this.submited){
                    return
                }
                this.submited = true
                this.form.symbol = this.symbol
                /*if(data.constructor===String){
                    this.form.type = 0
                    this.form.googleCode = data
                } else {
                    this.form.type = 1
                    for(let item in data){
                       this.form[item] = data[item]
                    }
                }*/

                wallet.addAddress(this.form,res=>{
                    this.submited = false
                    Tip({type: 'success', message: this.$t(`error_code.SUCCESS`)})
                    this.$router.replace({name:'address'})
                },msg=>{
                    this.submited = false
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            },
            scanQR() {
                cordovaUtils.scanQRCode((addr) => {
                    this.form.address = addr
                    // console.log(addr, this.form.address)
                })
            },
            removeDialog () {
              this.placeOrderVisible = false
            },
            okCallback (data) {
              this.placeOrderVisible = false
              this.addAddress(data)
            },
        }
    }
</script>

<style scoped lang="less">
.page-main {
    padding-bottom: 1.6rem;
}
.form-cont {
    .cont {
        height: 1.25rem;
        padding-top: 0.1rem;
        position: relative;
        .scanning{
            position: absolute;
            right: 0;
            top: 0.4rem;
            z-index: 9;
            width: 0.5rem;
            height: 0.5rem;
            background: url("../../../assets/img/scanner.png") no-repeat center;
            background-size: 0.5rem;
            display: inline-block;
        }
    }
}

.bottom {
    position: fixed;
    bottom: 0.5rem;
    left: 0.3rem;
    right: 0.3rem;
}
.place_order_popup{width: 100%;}
</style>

