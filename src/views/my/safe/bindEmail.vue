<template>
    <div>
        <top-back>{{$t('shop.email')}}</top-back>
        <div class="page-main">
            <div class="findpwd-content-item mt30">
                <div class="findpwd-content-row email">
                    <ui-input type="email"
                              :label="$t('otc_exchange.otc_exchange_Email')"
                              v-model="formData.email"
                              :placeholder="true"
                              :title="$t('otc_exchange.otc_exchange_Email')"></ui-input><!--邮箱-->
                </div>
                <div class="findpwd-content-row EMAILCode">
                    <ui-input
                            :maxlength="6"
                            :label="$t('account.user_center_code')"
                            v-model="formData.code"
                            :placeholder="true"
                            :title="$t('account.user_center_code')"></ui-input><!--验证码-->
                    <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendEMAILCode}">
                        {{$t('account.user_center_send_SMS')}}<!--发送验证码--> {{disabled ? `（${time}s）` : ''}}
                    </mt-button>
                </div>
                <div class="mt30">
                    <mt-button :disabled="locked || gtLocked" type="primary" size="large"
                               v-tap="{methods: submit}">{{$t('account.user_center_operate_bind')}}<!--绑定--></mt-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import userApi from '@/api/user'
    import UiInput from "../../../components/uiInput"
    import {mapGetters} from 'vuex'
    import myApi from '@/api/individual'
    export default {
        name: "bindEmail",
        components: {
            UiInput
        },
        data() {
            return {
                disabled: false,
                locked: false, // 锁
                gtLocked: false,
                formData: {
                    email: '',
                    code: '',
                },
            }
        },
        computed:{
            ...mapGetters(['getUserInfo']),
        },
        created() {

        },
        beforeRouteEnter(from, to, next){
            myApi.getUserState((data) => {
                data.email ? window.vm.$router.replace({name: 'safe'}) : next()
            }, (msg) => {
                console.error(msg)
                window.vm.$router.replace({name: 'safe'})
            })
        },
        methods: {
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
            submit(){}
        }
    }
</script>

<style scoped lang="less">
.EMAILCode{
    margin-top: 0.2rem;
    display: flex;
    align-items: center;
    .ui_input{
        flex: 1;
    }
}
</style>
