<template>
    <div class="page">
        <top-back>{{title}}</top-back>
        <div class="page-main">
            <div class="google-cont" v-if="getUserInfo.googleAuthEnable !== 1">
                <p class="f30"><strong>{{$t('home.google-authentication')}}</strong></p>
                <div class="google">
                    <div ref="qrcode"></div>
                </div>
            </div>
            <div class="google-box">
                <div class="addres" v-if="getUserInfo.googleAuthEnable !== 1">
                    <p class="f30"><strong>{{$t('account.user_center_backup_key')}}</strong></p>
                    <label>
                        <small class="lh54">{{key}}</small>
                        <mt-button type="primary" class="mini" 
                        v-clipboard:copy="key"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError">{{$t('home.copy')}}</mt-button>
                    </label>
                </div>
                <div :class="{mt30:getUserInfo.googleAuthEnable !== 1}">
                    <ui-input
                            :label="$t('account.user_center_login_password')"
                            v-model="formData.password"
                            :title="$t('account.user_center_login_password')"
                    ></ui-input>
                </div>
                <div class="mt30">
                    <ui-input
                            :maxlength="6"
                            :label="$t('account.user_center_Google_verification_code')"
                            v-model="formData.verifyCode"
                            :title="$t('account.user_center_Google_verification_code')"
                    ></ui-input>
                </div>
                
            </div>
            <div class="btn">
                <mt-button type="primary" size="large" :disabled="!lock"
                           v-tap="{methods: submit}">{{buttonTitle}}</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import utils from '@/assets/js/utils'
import individual from '@/api/individual'
import userApi from '@/api/user'
import {Toast} from 'mint-ui'
import UiInput from "@/components/uiInput"
    export default {
        components: {UiInput},
        data() {
            return {
                title: null,
                buttonTitle: null,
                key: null,
                formData: {
                  key: '',
                  verifyCode: '',
                  password: ''
                },
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
            lock(){
                return this.formData.password.trim() && this.formData.verifyCode.trim() && true || false
            }
        },
        watch:{
            'formData.verifyCode'(e){
                if(e.length >= 6){
                    this.$refs.google.blur()
                    // this.submit()
                }
            }
        },
        created() {
            if (this.getUserInfo.googleAuthEnable === 1) {
                this.title = this.$t('account.user_center_operate_unbind')
                this.buttonTitle = this.$t('account.user_center_operate_unbind')
            } else {
                this.title = this.$t('account.user_bind_google_authentication')
                this.buttonTitle = this.$t('home.google-bind')
                this.getGoogleKey()
            }
        },
        methods:{
            ...mapActions(['setUserInfo']),
            onCopy: function (e) {
                Toast(this.$t('public0.public33')) // 复制成功
            },
            onError: function (e) {
                Toast(this.$t('home.copy-error')) // 复制失败
            },
            getGoogleKey () {
                individual.createGoogleKey(res => {

                    this.key = res.key
                    this.formData.key = res.key
                    var qrCode = `otpauth://totp/${res.company}:${this.getUserInfo.username}?secret=${res.key}&issuer=${res.company}`
                    utils.qrcode(this.$refs.qrcode, {
                        width: 150,
                        height: 150,
                        text: qrCode
                    })
                }, (msg) => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            submit() {
                if (this.getUserInfo.googleAuthEnable === 1) {
                    this.unbindGoogleAuth()
                } else {
                    this.bindGoogleAuth()
                }
            },
            bindGoogleAuth () { // 绑定谷歌二次验证
              let formData = {}
              for (let i in this.formData) {
                formData[i] = this.formData[i]
              }
              userApi.getRsaPublicKey((rsaPublicKey) => {
                formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                formData.rsaPublicKey = rsaPublicKey
                Indicator.open('Loading...')
                individual.bindGoogleAuth(formData, (msg) => {
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                    this.bindGoogleFormData = {key: '', verifyCode: '', password: ''}
                    this.getInfo()
                }, (msg) => {
                  Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
              })
            },
            unbindGoogleAuth () { // 解除谷歌二次验证
              let formData = {}
              for (let i in this.formData) {
                formData[i] = this.formData[i]
              }
              userApi.getRsaPublicKey((rsaPublicKey) => {
                formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                formData.rsaPublicKey = rsaPublicKey
                delete formData['key']
                Indicator.open('Loading...')
                individual.unbindGoogleAuth(formData, (msg) => {
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                    this.formData = {verifyCode: '', password: ''}
                    this.getInfo()
                }, (msg) => {
                  Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
              })
            },
            getInfo(){
                userApi.getUserInfo(res => {
                    this.setUserInfo(res);
                    this.$router.replace({name: 'safe'})
                },msg=>{
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .google-cont {
        margin: 0.3rem 0;

        .google {
            width: 3rem;
            height: 3rem;
            background: url("../../../assets/img/ear.png");
            background-size: 3rem 3rem;
            margin: 0.3rem auto;
            overflow: hidden;

            & > div {
                background: #ffffff;
                width: 2.6rem;
                height: 2.6rem;
                margin: 0.2rem;
                padding: 0.1rem;
            }
            /deep/ canvas{
                max-width: 100%;
            }
            /deep/ img {
                max-width: 100%;
            }
        }
    }

    .google-box {
        background: #fff;
        padding: 0.3rem;
        border-radius: 4px;
        margin-top: 0.2rem;
        div {
            p {
                padding: 0.2rem 0;
            }

            label {
                display: flex;
                position: relative;
            }
        }

        .addres {
            small {
                border-bottom: 0.02rem solid #eee;
                flex-grow: 1;
            }

            span {
                background: #3B48C8;
                padding: 0 0.2rem;
                border-radius: 0.1rem;
                line-height: 0.45rem;
            }
        }

    }
    .btn{
        margin-top: 0.4rem;
    }
    .lh54 {line-height: 0.54rem;}
</style>
