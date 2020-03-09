<template>
    <div class="page">
        <top-back :back="false">
            <!--&lt;!&ndash; {{$t('login_register.register')}} &ndash;&gt;{{$t('login_register.register_by_email')}}-->
            <router-link slot="right" class="back_home" :to="{name:'home'}" tag="span">
                <img src="../assets/img/off.png"/>
            </router-link>
        </top-back>
        <div class="page-main">
            <div class="register_p">
                <p class="">{{$t('market.register_title')}}</p>
                <small>{{$t('market.register_p')}}</small>
            </div>

            <div class="findpwd-content">
                <div class="findpwd-content-inner">
                    <div class="">
                        <mt-navbar v-model="formData.registerType">
                            <mt-tab-item :id="1"><span>{{$t('login_register.register_by_cellphone')}}<!--手机注册--></span>
                            </mt-tab-item>
                            <mt-tab-item :id="0"><span>{{$t('login_register.register_by_email')}}<!--邮箱注册--></span>
                            </mt-tab-item>
                        </mt-navbar>
                    </div>

                    <!--手机注册-->
                    <div class="findpwd-content-item cellphone mt30" v-show="formData.registerType===1">
                        <div class="findpwd-content-row countryCode">
                            <select v-model="formData.countryCode">
                                <option v-for="item in areaCodeList" :value="item.code"><!--中国大陆-->&nbsp;{{item.code}}</option>
                            </select>
                            <ui-input class="mobile"
                                      :label="$t('account.user_center_phone')"
                                      v-model="formData.mobile"
                                      :placeholder="true"
                                      :title="$t('account.user_center_phone')"></ui-input><!--手机号-->
                        </div>
                        <div class="findpwd-content-row SMSCode">
                            <ui-input
                                    :maxlength="6"
                                    :label="$t('account.user_center_SMS_code')"
                                    v-model="formData.smsCode"
                                    :placeholder="true"
                                    :title="$t('account.user_center_SMS_code')"></ui-input><!--短信验证码-->
                            <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">
                                {{$t('account.user_center_send_SMS')}}<!--发送验证码--> {{disabled ? `（${time}s）` : ''}}
                            </mt-button>
                        </div>
                        <!--<div class="findpwd-content-row email">-->
                            <!--<ui-input type="email"-->
                                      <!--:label="$t('otc_exchange.otc_exchange_Email')"-->
                                      <!--v-model="formData.email"-->
                                      <!--:placeholder="true"-->
                                      <!--:title="$t('otc_exchange.otc_exchange_Email')"></ui-input>&lt;!&ndash;邮箱&ndash;&gt;-->
                        <!--</div>-->
                    </div>

                    <!--邮箱注册-->
                    <div class="findpwd-content-item mt30" v-show="formData.registerType===0">
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
                    </div>

                    <!--共同部分-->
                    <div class="findpwd-content-row password">
                        <ui-input
                                :type="showpwd? 'text':'password'"
                                :maxlength="32"
                                :label="$t('exchange.exchange_password')"
                                v-model="formData.password"
                                :placeholder="true"
                                :title="$t('exchange.exchange_password')"></ui-input><!--密码-->
                        <i class="icon_showpwd" :class="{active:showpwd}"
                           v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                    </div>
                    <p class="f24 ft-c-red pwd-error" v-if="pwdError">{{$t('login_register.lintonPWReg')}}</p>
                    <div class="findpwd-content-row confirmPassword">
                        <ui-input
                                :type="showpwd? 'text':'password'"
                                :maxlength="32"
                                :placeholder="true"
                                :label="$t('login_register.confirm_new_password')"
                                v-model="formData.passwordConfirm"
                                :title="$t('login_register.confirm_new_password')"></ui-input><!--确认密码-->

                    </div>
                    <div class="findpwd-content-row ref">
                        <ui-input
                                :label="`${$t('public0.public244')}`"
                                v-model="formData.ref"
                                :placeholder="true"
                                :title="`${$t('public0.public244')}（${$t('public0.public237')}）`"></ui-input><!--邀请码-->
                    </div>

                    <div class="findpwd-content-row pt30">
                        <mt-button :disabled="locked || gtLocked" type="primary" size="large"
                                   v-tap="{methods: register}">{{$t('login_register.register')}}<!--注册--></mt-button>

                    </div>
                    <div class="to_login">
                        <router-link :to="{name: 'login'}">{{$t('public0.login')}}<!--登录--></router-link>
                    </div>
                    <div class="findpwd-content-row service">
                        <label for="service">
                            <input id="service" type="checkbox" name="service" v-model="checked">
                            <i type="checkbox"></i>
                        </label>
                        <span>
                    <label for="service">{{$t('login_register.agree_Service')}}<!--我已阅读并同意--></label>
                    <a href="javascript:;" @click="getAgreementUrl">{{$t('login_register.bitark_service').format(brand)}}
                        <!--ETV服务条款--></a>
                  </span>
                    </div>
                </div>
            </div>

            <div v-show="false"> <!-- 用于表单验证 -->
                <input name="mobile" v-model="formData.mobile" v-validate="'required|telphone'">
                <input name="smsCode" maxlength="6" v-model="formData.smsCode" v-validate="'required'">
                <input uid="common-password" name="password" type="password" v-model="formData.password"
                       v-validate="'required|password'">
                <input type="password" name="passwordConfirm" v-model="formData.passwordConfirm"
                       v-validate="'required|passwordAgain'">
                <input name="email" v-model="formData.email" v-validate="">
                <input name="ref" v-model="formData.ref" v-validate="">
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import UiInput from "../components/uiInput"
    import utils from '@/assets/js/utils'
    import commonConfig from '@/assets/js/commonConfig'
    import userApi from '@/api/user'
    import {MessageBox} from 'mint-ui'
    import config from '@/api/config'

    export default {
        name: 'register',
        components: {
            UiInput
        },
        data() {
            console.log(commonConfig)
            return {
                brand: config.brand.toUpperCase(),
                checked: false,
                locked: false, // 锁
                gtLocked: false,
                disabled: false,
                showpwd: false,
                areaCodeList: commonConfig.areaCodeList,
                formData: {
                    countryCode: commonConfig.defaultCode,
                    registerType: 0,
                    mobile: '',
                    smsCode: '',
                    username: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    ref: ''
                },
                time: 60,
                pwdError: false
            }
        },
        computed: {
            ...mapGetters(['getLang']),
            msgs() {
                return {
                    mobile: {required: this.$t('public0.public6')}, // 请输入手机号
                    smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
                    email: {
                        required: this.$t('login_register.email'),
                        email: this.$t('exchange.exchange_Email_format_error')
                    }, // 请输入邮箱；邮箱格式错误
                    password: {required: this.$t('login_register.password')}, // 请输入密码
                    passwordConfirm: {required: this.$t('login_register.confirm_password')}, // 请再次输入密码
                    ref: {required: this.$t('public0.input') + ' ' + this.$t('public0.public244')} // 请再次输入密码
                }
            },

        },
        watch: {
            'formData.registerType'() {
                this.$validator.reset()
                this.disabled = false
            },
        },
        created() {
            this.$nextTick(() => {
                this.formData.ref = this.$route.query.ref || ''
                $('.ui_input.mobile input').focus()
            })
        },
        mounted() {
            $('.password input').on('input', () => {
                if (!this.formData.password) {
                    return
                }
                this.$validator.validate('password').then(error => {
                    if (!error) {
                        this.pwdError = true
                    } else {
                        this.pwdError = false
                    }
                })
            })
        },
        methods: {
            ...mapActions(['setApiToken', 'setUserInfo']),
            getAgreementUrl() {
                this.$router.push({name: 'notice-detail', query: {id: '246605292891013120'}})
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
            sendSMSCode() {
                if (this.disabled) {
                    return
                } else if (!this.formData.mobile) {
                    Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
                    return
                } else if (!this.$root.ismobile(this.formData.mobile)) {
                    Tip({type: 'danger', message: this.$t('public0.public128')}) // 请输入有效的手机号码
                    return
                }
                this.disabled = true
                userApi.sendSMSCode({
                    countryCode: this.formData.countryCode,
                    phoneNumber: this.formData.mobile
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
                    setTimeout(timeOut, 1000)
                    Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')})
                }, (msg) => {
                    this.disabled = false
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                })
            },
            register() {
                var formData = {}
                for (let i in this.formData) {
                    formData[i] = this.formData[i]
                }
                if (Number(formData.registerType) === 0) { // 邮箱注册
                    delete formData.mobile
                    delete formData.countryCode
                    formData.username = formData.email
                } else {
                    formData.username = formData.mobile
                }
                // console.log(formData)
                this.$validator.validateAll(formData).then((validResult) => {
                    if (!validResult) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    if (!this.checked) {
                        Tip({type: 'danger', message: this.$t('public0.public122')})
                        return
                    }
                    if (this.locked) {
                        return
                    }
                    this.gtLocked = true
                    utils.gtValidate((gtParams) => {
                        for (let i in gtParams) {
                            formData[i] = gtParams[i]
                        }
                        this.locked = true
                        userApi.getRsaPublicKey((rsaPublicKey) => {
                            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
                            formData.rsaPublicKey = rsaPublicKey
                            userApi.register(formData, (msg) => {
                                this.locked = false
                                Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                                setTimeout(() => {
                                    this.$router.push({name: 'login'})
                                }, 1500)
                            }, (msg) => {
                                this.locked = false
                                Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                            })
                        }, () => {
                            this.locked = false
                        })
                    }, () => {
                        this.gtLocked = false
                    })
                })
            },
        }
    }
</script>


<style lang="less" scoped>
    .findpwd-content {
        /*padding: .3rem;*/
        margin-top: .2rem;
        /*background-color: #fff;*/
        /*border-radius: 4px;*/

        /deep/ .mint-navbar {
            border-bottom: none;
            background: none;
            border-bottom: 0.01rem solid #364463;
        }

        /deep/ .mint-tab-item {
            height: 0.9rem;
            color: #4C5A74;
            padding: 0;
            flex: none;
            margin: 0 0.2rem;

            &.is-selected {
                color: #ffffff;
                border-bottom: none;
                margin-bottom: 0;

                .mint-tab-item-label span {
                    border-bottom: 2px solid #0C6AC9;
                    margin-bottom: -2px;
                }
            }

            .mint-tab-item-label {
                font-size: 0.3rem;
                line-height: 0.9rem;

                span {
                    display: inline-block;
                    height: 100%;
                }
            }
        }

        &-row {
            position: relative;
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.3rem;

            &.countryCode {
                overflow: hidden;

                .mobile {
                    flex: 1;
                    margin-left: 20%;
                }

                select {
                    position: absolute;
                    /*top: 0.15rem;*/
                    left: 0;
                    width: 20%;
                    height: 0.8rem;
                    font-size: .32rem;
                    color: #ffffff;
                    padding-left: 5px;
                    background-color: #151C2C;
                    border: none;
                }
            }

            .ui_input {
                flex: 1;
            }

            .icon_showpwd {
                position: absolute;
                right: 0.3rem;
                top: 0.42rem;
                margin-top: -0.18rem;
                width: 0.36rem;
                height: 0.36rem;
                background-image: url('../assets/img/eye_closed@2x.png');

                &.active {
                    background-image: url('../assets/img/eye_open@2x.png');
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
                    color: #4B5875;

                    a {
                        text-decoration: underline;
                    }
                }
            }
        }
    }

    .register_p {
        p {
            font-size: 0.48rem;
            color: #ffffff;
        }

        small {
            color: #4C5A74;
            font-size: 0.26rem;
            line-height: 0.4rem;
        }
    }

    .pwd-error {
        margin-top: -0.2rem;
        padding-bottom: 0.1rem;
    }

    .back_home {
        display: flex;
        height: 0.9rem;
        width: 100%;
        align-items: center;
        justify-content: center;
        img {
            width: 0.28rem;
        }
    }
    .to_login{
        a{
            border-radius: 0.1rem;
            border: 0.02rem solid #0C6AC9;
            display: block;
            line-height: 0.86rem;
            text-align: center;
        }
    }
</style>
