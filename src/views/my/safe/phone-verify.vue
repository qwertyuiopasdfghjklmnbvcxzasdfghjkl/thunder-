<template>
    <div class="page">
        <top-back :back="true">
            {{getUserInfo.mobileAuthEnable !==
            1?$t('account.user_bind_SMS_verification'):$t('account.user_unbind_SMS_verification')}}
        </top-back>

        <div class="page-main">
            <p class="mt20 f24 ft-c-main" v-if="getUserInfo.mobileAuthEnable === 1">
                （{{$t('public0.public245')}}）<!--为了您的资产安全，不建议您解除手机短信验证码功能。--></p>
            <!--1、绑定短信认证-->
            <div class="input_cont mt20">
                <div class="form">
                    <div class="form-row countryCode" v-if="getUserInfo.mobileAuthEnable !== 1">
                        <select v-model="mobileFormData.countryCode">
                            <option v-for="item in areaCodeList" :value="item.code">{{item.name}}<!--中国大陆-->&nbsp;{{item.code}}</option>
                        </select>
                        <ui-input class="mobile"
                                  :label="$t('account.user_center_phone')"
                                  v-model="mobileFormData.phoneNumber"
                                  :value="mobileFormData.phoneNumber"
                                  :placeholder="true"
                                  :readonly="phoneDisabled"
                                  :title="$t('account.user_center_phone')"></ui-input><!--手机号-->
                    </div>
                    <div class="form-row SMSCode">
                        <ui-input
                                :maxlength="6"
                                :label="$t('account.user_center_SMS_code')"
                                v-model="mobileFormData.smsCode"
                                :placeholder="true"
                                :title="$t('account.user_center_SMS_code')"></ui-input><!--短信验证码-->
                        <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">
                            {{$t('account.user_center_send_SMS')}}<!--发送验证码--> {{disabled ? `（${time}s）` : ''}}
                        </mt-button>
                    </div>
                    <div class="form-row password">
                        <ui-input
                                :label="$t('account.user_center_login_password')"
                                :title="$t('account.user_center_login_password')"
                                :type="showpwd? 'text':'password'"
                                :placeholder="true"
                                v-model="mobileFormData.phonepassword"
                                :maxlength="32"></ui-input>
                        <i class="icon_showpwd" :class="{active:showpwd}"
                           v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                    </div>
                </div>
            </div>
            <mt-button type="primary" class="mt50" size="large" :disabled="lock" v-tap="{methods: bindMobile}">
                {{getUserInfo.mobileAuthEnable !== 1 ? $t('account.user_center_operate_bind') :
                $t('account.user_center_operate_unbind')}}<!--绑定--></mt-button>
        </div>
        <div v-show="false"> <!-- 用于表单验证 -->
            <input name="phoneNumber" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'">
            <input name="smsCode" maxlength="6" v-model="mobileFormData.smsCode" v-validate="'required'">
            <input type="password" name="phonepassword" v-model="mobileFormData.phonepassword" v-validate="'required'">
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import commonConfig from '@/assets/js/commonConfig'
    import utils from '@/assets/js/utils'
    import myApi from '@/api/user'
    import userApi from '@/api/individual'
    import UiInput from "@/components/uiInput"

    export default {
        name: 'phone-verify',
        components: {
            UiInput
        },
        data() {
            return {
                mobileState: 0, // 1 已经绑定  0 未绑定
                disabled: false,
                lock: false,
                showpwd: false,
                phoneDisabled: false,
                time: 60,
                areaCodeList: commonConfig.areaCodeList,
                mobileFormData: {
                    countryCode: commonConfig.defaultCode,
                    phoneNumber: '',
                    phonepassword: '',
                    smsCode: ''
                }
            }
        },
        computed: {
            ...mapGetters(['getUserInfo', 'getLang']),
            msgs() {
                return {
                    phoneNumber: {required: this.$t('public0.public6')}, // 请输入手机号
                    phonepassword: {required: this.$t('login_register.password')}, // 请输入密码
                    smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
                }
            }
        },
        mounted() {
            this.mobileFormData.phoneNumber = this.getUserInfo.mobile
            if(this.mobileFormData.phoneNumber){
                this.phoneDisabled= true
            }
        },
        methods: {
            ...mapActions(['setUserInfo']),
            bindMobile() {
                this.$validator.validateAll(this.mobileFormData).then((validResult) => {
                    if (!validResult) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    let formData = {}
                    for (let i in this.mobileFormData) {
                        formData[i] = this.mobileFormData[i]
                    }
                    formData.password = formData.phonepassword
                    delete formData.phonepassword
                    this.lock = true
                    myApi.getRsaPublicKey((rsaPublicKey) => {
                        formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                        formData.rsaPublicKey = rsaPublicKey
                        Indicator.open('Loading...')
                        if (this.getUserInfo.mobileAuthEnable === 1) {
                            userApi.unbindMobile(formData, (msg) => {
                                this.lock = false
                                Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                                this.mobileFormData = {
                                    countryCode: commonConfig.defaultCode,
                                    phoneNumber: '',
                                    phonepassword: '',
                                    smsCode: ''
                                }
                                this.getInfo()
                                // this.getValidateStatus(0)
                            }, (msg) => {
                                this.lock = false
                                Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                            })
                            return
                        }
                        userApi.bindMobile(formData, (msg) => {
                            this.lock = false
                            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                            this.getInfo()
                            // this.getValidateStatus(1)
                        }, (msg) => {
                            this.lock = false
                            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                        })
                    })
                })
            },
            // getValidateStatus(i) {
            //     myApi.validateStatus(i, res => {
            //
            //     }, msg => {
            //
            //     })
            // },
            getInfo() {
                myApi.getUserInfo(res => {
                    this.setUserInfo(res);
                    this.$router.replace({name: 'safe'})
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            sendSMSCode() {
                if (this.disabled) {
                    return
                } else if (!this.mobileFormData.phoneNumber) {
                    Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
                    return
                } else if (!this.$root.ismobile(this.mobileFormData.phoneNumber)) {
                    Tip({type: 'danger', message: this.$t('public0.public128')}) // 请输入有效的手机号码
                    return
                }
                this.disabled = true
                userApi.sendAuthSMSCode({
                    countryCode: this.mobileFormData.countryCode,
                    phoneNumber: this.mobileFormData.phoneNumber
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
                    Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')}) // 验证码发送成功
                }, (msg) => {
                    this.disabled = false
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .input_cont {
        /*background: #314254;*/
    }

    .form-row {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.3rem;

        &:last-of-type {
            margin-bottom: 0;
        }

        &.countryCode {
            overflow: hidden;

            .mobile {
                flex: 1;
                margin-left: 45%;
            }

            select {
                position: absolute;
                top: 0.15rem;
                left: 0;
                width: 40%;
                height: 0.65rem;
                font-size: .3rem;
                color: #ffffff;
                padding-left: 5px;
                background-color: transparent;
                border: none;
                /*border-bottom: 0.02rem solid #ddd;*/
            }
        }

        .ui_input {
            flex: 1;
        }

        .icon_showpwd {
            position: absolute;
            right: 0.3rem;
            bottom: 0.14rem;
            margin-top: -0.18rem;
            width: 0.36rem;
            height: 0.36rem;
            background-image: url('../../../assets/img/eye_closed@2x.png');

            &.active {
                background-image: url('../../../assets/img/eye_open@2x.png');
            }
        }

        &.service {
            margin-top: 0;
            font-size: 0;
            line-height: 0;

            > label {
                display: inline-block;
                width: .32rem;
                height: .32rem;
                margin-top: .24rem;
                vertical-align: top;

                input {
                    display: none;

                    &:checked {
                        + i {
                            background-color: #3B48C8;
                            border-color: #3B48C8;

                            &::before {
                                border-color: #fff;
                            }
                        }
                    }
                }

                i {
                    position: relative;
                    display: block;
                    width: .32rem;
                    height: .32rem;
                    border: 2px solid #999;
                    border-radius: 2px;
                    overflow: hidden;

                    &::before {
                        content: "";
                        position: absolute;
                        top: -0.16rem;
                        left: -0.08rem;
                        width: .32rem;
                        height: .32rem;
                        border-width: 0 2px 2px 0;
                        border-style: solid;
                        border-color: transparent;
                        border-radius: 2px;
                        transform: rotate(45deg);
                    }
                }
            }

            span {
                display: inline-block;
                width: 100%;
                min-height: .4rem;
                padding: .2rem 0 .3rem .52rem;
                margin-left: -0.32rem;
                font-size: .3rem;
                line-height: .4rem;
                vertical-align: top;

                a {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
