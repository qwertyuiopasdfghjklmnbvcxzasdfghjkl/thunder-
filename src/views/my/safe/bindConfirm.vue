<template>
    <div class="bind_confirm">
        <div class="title">
            <i class="cancel" @click="closeDialog">
                <img src="../../../assets/img/off_blank.png"/>
            </i>
            <p>{{mobileState === 1 ? $t('auth_warning.warning_SMS_auth') : $t('account.safety_verification')}}
                <!--短信验证||谷歌验证--></p>
        </div>
        <!--短信验证-->
        <div class="form" v-if="mobileState === 1">
            <div class="smsCode">
                <input class="input" v-validate="'required|pInteger'" :maxLength="6"
                       :errs="errors" v-model="form.smsCode" :title="$t('account.user_center_SMS_code')"
                       :placeholder="$t('account.user_center_SMS_code')"><!--短信验证码-->
                <mt-button type="primary" style="font-size: 0.28rem;" :disabled="disabled"
                           v-tap="{methods:sendSMSCode}">
                    {{$t('account.user_center_send_SMS')}}<!--发送验证码--> {{disabled ? `（${time}s）` : ''}}
                </mt-button>
            </div>
            <div class="buttons">
                <mt-button  class="mint-button--primary"
                            @click="auth" :disabled="disabled">{{$t('otc_legal.otc_legal_confirm')}}<!--确定--></mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import userApi from '@/api/user'
    export default {
        name: "bindC",
        data() {
            return {
                mobileState: 1,
                disabled: true,
                form:{
                    smsCode: null
                },
                time: 60
            }
        },
        watch:{
            'form.smsCode'(e){
                if(e.length === 6){
                    this.disabled = false
                }
            }
        },
        created() {

        },
        methods: {
            sendSMSCode(){
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
            auth(){},
            closeDialog() {
                this.$emit('removeDialog')
            },
            sendEMAILCode() {
                if (this.disabled) {
                    return
                } else if (!this.formData.email) {
                    Tip({type: 'danger', message: this.$t('login_register.email')}) // 请输入邮箱
                    return
                } else if (!this.$root.isemail(this.formData.email)) {
                    Tip({type: 'danger', message: this.$t('exchange.exchange_Email_format_error')}) // 邮箱格式错误
                    return
                }
                this.disabled = true
                userApi.reSendEmail({
                    lang: this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en',
                    email: this.formData.email,
                    username: this.formData.email
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
        }
    }
</script>

<style scoped lang="less">
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
