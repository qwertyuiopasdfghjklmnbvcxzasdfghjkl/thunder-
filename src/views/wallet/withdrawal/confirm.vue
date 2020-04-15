<template>
    <div class="confirm">
        <div class="title">
            <i class="cancel" @click="closeDialog">
                <img src="../../../assets/img/off_blank.png"/>
            </i>
            <p>{{ $t('account.safety_verification')}}</p>
        </div>

        <div class="form">
            <!-- google 验证码 -->
            <input
                v-if="type === 2"
                class="input"
                v-validate="'required|pInteger'"
                :maxLength="6"
                name="googleCode"
                :msgs="msgs.verifyCode"
                :errs="errors"
                v-model="comData.googleCode"
                :title="$t('account.user_center_Google_verification_code')"
                :placeholder="$t('account.user_center_Google_verification_code')"
            >

            <!-- 短信/邮箱验证码 -->
            <div class="smsCode">
                <input
                    class="input"
                    v-validate="'required|pInteger'"
                    :maxLength="6"
                    name="smsCode"
                    :msgs="msgs.smsCode"
                    :errs="errors"
                    v-model="comData.smsCode"
                    :title="codePlaceholder"
                    :placeholder="codePlaceholder"

                >

                <mt-button
                    type="primary"
                    style="font-size: 0.28rem;"
                    :disabled="disabled"
                    v-tap="{methods:sendCode}"
                >
                    {{$t('account.user_center_send_SMS')}}<!--发送验证码--> {{disabled ? `（${time}s）` : ''}}
                </mt-button>

            </div>

            <!-- 确定 -->
            <div class="buttons">
                <span class="mint-button--primary" @click="auth">{{$t('otc_legal.otc_legal_confirm')}}</span>
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
    import user from '@/api/user'

    export default {
        props: ['params', 'withdrawalType', 'toUserType'],
        data() {
            return {
                toAddress: '',
                password: '',
                code: '',
                codePlaceholder: '',
                comData: {
                    type: 1,
                    googleCode: '',
                    smsCode: '',
                },
                formData: {
                    verifyCode: '',
                    // safetyCode: ''
                },
                disabled: false,
                time: 60,
                type: ''
            }
        },
        computed: {
            ...mapGetters(['getSysParams', 'getLang']),
            msgs() {
                return {
                    verifyCode: {
                        required: this.$t('login_register.inputGoogleAuthCode'),
                        pInteger: this.$t('error_code.NUMERIC')
                    }, // 请输入验证码
                    password: {required: this.$t('login_register.password')}, // 请输入密码
                    googleCode: {required: this.$t('login_register.verify_code'), pInteger: this.$t('error_code.NUMERIC')}, // 请输入验证码
                    smsCode: {required: this.$t('login_register.verify_code'), pInteger: this.$t('error_code.NUMERIC')}, // 请输入验证码
                    // safetyCode: {
                    //     required: this.$t('account.safety_code_required'),
                    //     pInteger: this.$t('error_code.NUMERIC')
                    // } // 请输入安全验证码
                }
            }
        },
        created() {
            this.getUserState()
        },
        methods: {
            auth() {
                console.log('auth');

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

                    if (this.withdrawalType === 2) {
                        // 站内转账
                        this.insetWithdrawal()
                    } else if (this.withdrawalType === 1) {
                        // 普通提币
                        this.defWithdrawal()
                    }

                })

            },

            // 站内转账
            insetWithdrawal() {
                let formData = {
                    uType: this.toUserType,
                    name: this.params.selToAddress,
                    amount: this.params.amount,
                    symbol: this.params.symbol,
                    sType: this.params.symbolType,
                    type: this.type,
                    google: this.comData.googleCode,
                    code: this.comData.smsCode
                }
                user.getRsaPublicKey((rsaPublicKey) => {
                    const temp = JSON.stringify(formData)
                    const param = utils.encryptPwd(rsaPublicKey, temp)

                    const _temp = {
                        param: param,
                        pubKey: rsaPublicKey
                    }
                    // user.forgetPwdChangePwd(formData, () => {
                    //     Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
                    //     setTimeout(() => {
                    //     this.$router.replace({name: 'login'})
                    //     }, 1500)
                    // }, (msg) => {
                    //     this.locked = false
                    //     Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
                    // })
                    userUtils.insetWithdraw(_temp, res=>{
                        Tip({type: 'success', message: res})
                        this.$router.push({name: 'trading'})
                    },msg=>{
                        this.once = false
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })

                }, () => {
                })


                // userUtils.insetWithdraw(formData, res=>{
                //     Tip({type: 'success', message: res})
                //     this.$router.push({name: 'trading'})
                // },msg=>{
                //     this.once = false
                //     Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                // })
            },

            // 普通提币
            defWithdrawal() {
                let formData = { // 提现
                    symbol: this.params.symbol,
                    symbolType: this.params.symbolType,
                    amount: this.params.amount,
                    fromAccount: this.params.fromAccount, // 用户id
                    toAddress: this.params.selToAddress,
                    googleCode: this.comData.googleCode,
                    smsCode: this.comData.smsCode,
                    type: this.type,
                    memo: this.params.memo,
                    lang: this.getLang === 'zh-CN' ? 'cn' : 'en'
                }
                userUtils.walletWithdraw(formData, () => {
                    let msg = this.getSysParams.withdrawEmail && this.getSysParams.withdrawEmail.value === '1' ? this.$t('login_register.Mail_sent_successfully') : this.$t('message.WITHDRAWALS_SUCCESS')  // 邮件发送成功
                    Tip({type: 'success', message: msg})
                    this.$emit('okCallback')
                }, (msg) => {

                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    this.closeDialog()
                })
            },

            sendCode() {
                console.log('sendCode  type', this.type)
                if (this.type === 2 || this.type === 3) {
                    this.sendEMAILCode()
                } else if (this.type === 1) {
                    this.sendSMSCode()
                }
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
                console.log(this.disabled)
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

            closeDialog() {
                console.log('close');
                this.comData.googleCode = ""
                this.comData.smsCode = ""
                this.disabled = false
                this.$emit('removeDialog')
            },

            // 获取当前用户状态信息
            getUserState() {
                // 1.只有邮箱的时候，邮箱验证 type = 3
                // 2.只有手机的时候，短信验证 type = 1
                // 3.邮箱和谷歌验证，同时需要邮箱和谷歌验证 type = 2
                // 4.邮箱和手机号码，短信验证 type = 1
                // 5.手机号码和谷歌，短信验证 type = 1
                // 6.邮箱、谷歌验证和手机号码，短信验证 type = 1

                userApi.getUserState((data) => {

                    if (data.emailAuthEnable === 1  && data.googleState === 0 && data.mobileAuthState === 0) {
                        // 邮箱验证
                        this.type = 3
                    } else if (data.emailAuthEnable === 1  && data.googleState === 1 && data.mobileAuthState === 0) {
                        // 邮箱 + Google 验证码验证
                        this.codePlaceholder = this.$t('usercontent.user62')
                        this.type = 2
                    } else if (data.mobileAuthState === 1) {
                        // 短信验证
                        this.codePlaceholder = this.$t('market.user_SMS_code')
                        this.type = 1
                    }
                }, (msg) => {
                    console.error(msg)
                })


            }
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

        .cancel {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            position: absolute;
            left: 0;
            top: 0;
            text-align: center;

            img {
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
        border: 0.01rem solid #cccccc;
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
        flex: 1;
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
