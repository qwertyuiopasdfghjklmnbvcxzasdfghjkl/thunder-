<template>
    <div class="confirm">
        <div class="title">
            <i class="cancel" @click="closeDialog">
                <img src="../../../assets/img/off_blank.png"/>
            </i>
            <p>{{mobileState === 1 ? $t('auth_warning.warning_SMS_auth') : $t('account.safety_verification')}}
                <!--短信验证||谷歌验证--></p>
        </div>
        <!--短信验证-->
        <div class="form" v-if="mobileState === 1">
            <input class="input" ref="box" type="password" v-validate="'required'" name="passwordVerify"
                   :msgs="msgs.password" :errs="errors" v-model="comData.password"
                   :title="$t('account.user_center_login_password')"
                   :placeholder="$t('account.user_center_login_password')"><!--登录密码-->
            <div class="smsCode">
                <input class="input" v-validate="'required|pInteger'" :maxLength="6" name="smsCode" :msgs="msgs.smsCode"
                       :errs="errors" v-model="comData.smsCode" :title="$t('account.user_center_SMS_code')"
                       :placeholder="$t('account.user_center_SMS_code')"><!--短信验证码-->
                <mt-button type="primary" style="font-size: 0.28rem;" :disabled="disabled" @click="sendSMSCode">
                    {{$t('account.user_center_send_SMS')}}<!--发送验证码--> {{disabled ? `（${time}s）` : ''}}
                </mt-button>
            </div>
            <div class="buttons">
                <span class="mint-button--default" @click="closeDialog">{{$t('otc_legal.otc_legal_cancel')}}
                    <!--取消--></span>
                <span class="mint-button--primary" @click="auth">{{$t('otc_legal.otc_legal_confirm')}}<!--确定--></span>
            </div>
        </div>
        <!--谷歌验证-->
        <div class="form" v-if="mobileState !== 1">
            <div class="smsCode safetyCode">
                <input v-validate="'required|pInteger'" class="verifycode mr20" :maxLength="6" name="safetyCode"
                       :msgs="msgs.safetyCode" :errs="errors" v-model="formData.safetyCode"
                       :title="$t('account.user_center_code')" :placeholder="$t('account.user_center_code')"/>
                <mt-button type="primary" style="font-size: 0.28rem;" :disabled="disabled"
                           v-tap="{methods:sendEMAILCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码--> {{disabled
                    ? `（${time}s）` : ''}}
                </mt-button>
            </div>
            <input v-validate="'required|pInteger'" class="verifycode" :maxLength="6" name="verifyCode"
                   :msgs="msgs.verifyCode" :errs="errors" v-model="formData.verifyCode"
                   :title="$t('account.user_center_Google_verification_code')"
                   :placeholder="$t('account.user_center_Google_verification_code')" v-if="googleState === 1"/>
            <!--谷歌验证码-->
            <div class="buttons">
                <!--<span class="mint-button&#45;&#45;default">{{$t('otc_legal.otc_legal_cancel')}}&lt;!&ndash;取消&ndash;&gt;</span>-->
                <span class="mint-button--primary" @click="auth1">{{$t('otc_legal.otc_legal_confirm')}}<!--确定--></span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import utils from '@/assets/js/utils'
    import userApi from '@/api/individual'
    import myApi from '@/api/user'
    import userUtils from '@/api/wallet'

    export default {
        props: ['params', 'mobileState'],
        data() {
            return {
                toAddress: '',
                password: '',
                code: '',
                comData: {
                    type: 1,
                    password: '',
                    smsCode: ''
                },
                formData: {
                    verifyCode: '',
                    safetyCode: ''
                },
                disabled: false,
                time: 60
            }
        },
        computed: {
            ...mapGetters(['getLang']),
            msgs() {
                return {
                    verifyCode: {
                        required: this.$t('login_register.inputGoogleAuthCode'),
                        pInteger: this.$t('error_code.NUMERIC')
                    }, // 请输入验证码
                    password: {required: this.$t('login_register.password')}, // 请输入密码
                    smsCode: {required: this.$t('login_register.verify_code'), pInteger: this.$t('error_code.NUMERIC')}, // 请输入验证码
                    safetyCode: {
                        required: this.$t('account.safety_code_required'),
                        pInteger: this.$t('error_code.NUMERIC')
                    } // 请输入安全验证码
                }
            }
        },
        created() {

        },
        methods: {
            auth1() {
                this.$validator.validateAll().then((valid) => {
                    if (!valid) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    this.$emit('okCallback', `${this.formData.safetyCode}$$${this.formData.verifyCode}`)
                })
            },
            sendEMAILCode() {
                if (this.disabled) {
                    return
                } else if (!this.$root.isemail(this.params.email)) {
                    Tip({type: 'danger', message: this.$t('exchange.exchange_Email_format_error')}) // 邮箱格式错误
                    return
                }
                this.disabled = true
                myApi.reSendEmail({
                    lang: this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en',
                    email: this.params.email,
                    username: this.params.email
                }, (msg) => {
                    let timeOut = () => {
                        this.time--
                        if (this.time === 0) {
                            this.disabled = false
                            this.time = 60
                            return
                        }
                        setTimeout(timeOut, 1000)
                    }
                    setTimeout(timeOut, 1000)
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                }, (msg) => {
                    this.disabled = false
                    Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
                })
            },
            sendSMSCode() {
                if (this.disabled) {
                    return
                }
                this.disabled = true
                userApi.sendAuthSMSCode({
                    phoneNumber: this.params.phoneNumber,
                    countryCode: this.params.countryCode
                }, (res) => {
                    let timeOut = () => {
                        this.time--
                        if (this.time === 0) {
                            this.disabled = false
                            this.time = 60
                            return
                        }
                        setTimeout(timeOut, 1000)
                    }
                    this.time = 60
                    setTimeout(timeOut, 1000)
                    Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')})
                }, (msg) => {
                    this.disabled = false
                    Tip({type: 'danger', message: msg})
                })
            },
            auth() {
                this.$validator.validateAll().then((valid) => {
                    if (!valid) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    let formData = {
                        type: 1,
                        password: this.comData.password,
                        smsCode: this.comData.smsCode
                    }
                    let saveFun = () => {
                        this.$emit('okCallback', formData)
                    }
                    myApi.getRsaPublicKey((rsaPublicKey) => {
                        formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                        formData.rsaPublicKey = rsaPublicKey
                        saveFun()
                    })
                })
            },
            closeDialog() {
                this.$emit('removeDialog')
            },
        }
    }
</script>

<style lang="less" scoped="">
    .title {
        font-size: 0.32rem;
        height: 1rem;
        line-height: 1rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        color: #222222;
        text-align: center;
        border-bottom: 0.01rem solid #eeeeee;
        position: relative;
        .cancel{
            display: inline-block;
            width: 1rem;
            height: 1rem;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;
            img{
                vertical-align: middle;
                width: 0.3rem;
            }
        }
    }

    .form {
        padding: 0.3rem;
    }

    .input, .verifycode {
        width: 100%;
        background-color: #fff;
        border: 2px solid #ddd;
        border-radius: 4px;
        padding: 0.2rem;
        font-size: 0.32rem;
        box-sizing: border-box;
    }

    .smsCode {
        display: flex;
        justify-content: space-between;
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }

    .smsCode.safetyCode {
        margin-top: 0;
        margin-bottom: 0;
    }

    .smsCode input {
        width: 60%;
    }

    .smsCode span {
        display: inline-block;
        width: 2.3rem;
        height: 0.9rem;
        line-height: 0.9rem;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
    }

    .smsCode span.disabled {
        background: #999;
    }

    .buttons span {
        display: inline-block;
        width: 3rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        cursor: pointer;
        font-size: 0.3rem;
        border-radius: 4px;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
    }

    input.verifycode {
        margin-bottom: 0.3rem;
    }
</style>
