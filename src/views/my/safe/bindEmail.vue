<template>
    <div>
        <top-back>{{$t('shop.email')}}</top-back>
        <div class="page-main">
            <div class="findpwd-content-item mt30" v-if="!getUserInfo.email">
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
                            v-model="formData.smsCode"
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

            <!--关闭邮箱验证-->
            <div class="mt30" v-else>
                <div class="findpwd-content-row email">
                    <ui-input type="email"
                              :value="getUserInfo.email"
                              :readonly="true"
                              :placeholder="true"></ui-input><!--邮箱-->
                </div>
                <!--<div class="mt50 switch">-->
                    <!--<label>-->
                        <!--<span>{{$t('public0.public159')}}</span>-->
                        <!--<cp-switch v-model="switchStatus" :size="'leg'" :openText="'ON'"></cp-switch>-->
                    <!--</label>-->
                <!--</div>-->
            </div>

            <!--确认框-->
            <!--<mt-popup class="place_bind_popup" v-model="bindConfirm" position="bottom">-->
                <!--<bind-confirm @removeDialog="removeDialog"/>-->
            <!--</mt-popup>-->
        </div>
    </div>
</template>

<script>

    import UiInput from "../../../components/uiInput"
    import CpSwitch from "../../../components/switch"
    import {mapGetters} from 'vuex'
    import myApi from '@/api/individual'
    import BindConfirm from './bindConfirm'
    import userApi from '@/api/user'

    export default {
        name: "bindEmail",
        components: {
            UiInput, CpSwitch, BindConfirm
        },
        data() {
            return {
                disabled: false,
                locked: false, // 锁
                gtLocked: false,
                switchStatus: true,
                bindConfirm: false,
                time: 60,
                formData: {
                    email: '',
                    smsCode: '',
                },
            }
        },
        computed: {
            ...mapGetters(['getUserInfo','getLang']),
        },
        watch: {
            switchStatus() {
                this.bindConfirm = true
            }
        },
        created() {

        },
        // beforeRouteEnter(from, to, next) {
        //     myApi.getUserState((data) => {
        //         data.email ? window.vm.$router.replace({name: 'safe'}) : next()
        //     }, (msg) => {
        //         console.error(msg)
        //         window.vm.$router.replace({name: 'safe'})
        //     })
        // },
        methods: {
            removeDialog() {
                this.bindConfirm = false
            },
            sendEMAILCode(){
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
            submit() {
                if (!this.formData.email) {
                    Tip({type: 'danger', message: this.$t('login_register.email')}) // 请输入邮箱
                    return
                }else if (!this.formData.smsCode){
                    Tip({type: 'danger', message: this.$t('home.home30')}) // 请输入邮箱验证码
                    return
                }

                userApi.bindEmail(this.formData,res=>{
                    Tip({type: 'success', message: this.$t(`error_code.${res}`)})
                    this.$router.push({name: 'ucenter'})
                },msg=>{
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .EMAILCode {
        margin-top: 0.2rem;
        display: flex;
        align-items: center;

        .ui_input {
            flex: 1;
        }
    }

    .switch {

        label {
            display: flex;
            justify-content: space-between;
        }
    }

    .place_bind_popup {
        width: 100%;
    }
</style>
