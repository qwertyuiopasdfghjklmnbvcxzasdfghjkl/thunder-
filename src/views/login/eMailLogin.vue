<template>
    <div>
        <div class="login-content-input">

            <ui-input
                    :label="`${$t('otc_exchange.otc_exchange_Email')}`"
                    :placeholder="true"
                    v-model="formData.username"
            ></ui-input>

            <ui-input
                    :label="$t('account.user_center_login_password')"
                    :placeholder="true"
                    :type="showpwd? 'text':'password'"
                    v-model="formData.password"
                    :maxlength="32"></ui-input>
            <i class="icon_showpwd" :class="{active:showpwd}"
               v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
        </div>

        <div class="login-content-button mt30">
            <mt-button type="primary" class="circle" :disabled="!gtLocked"
                       size="large" v-tap="{methods:login}">{{$t('public0.login')}}<!--登录--></mt-button>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import utils from '@/assets/js/utils'
    import userApi from '@/api/user'
    import myAPi from '@/api/individual'
    import UiInput from "../../components/uiInput";

    export default {
        name: "eMailLogin",
        components: {UiInput},
        data() {
            return {
                showpwd: false,
                locked: true, // 锁
                formData: {
                    username: '',
                    password: ''
                },
                account: '',
                password: '',
            }
        },
        computed: {
            gtLocked() {
                return this.formData.username && this.formData.password
            }
        },
        created() {

        },
        methods: {
            ...mapActions(['setApiToken', 'setUserInfo']),
            login(args) {
                $('input').blur()
                if (this.locked && this.gtLocked) {
                    this.locked = false
                    utils.gtValidate((gtParams) => {
                        let formData = {}
                        for (let i in this.formData) {
                            formData[i] = this.formData[i]
                        }
                        for (let i in gtParams) {
                            formData[i] = gtParams[i]
                        }
                        userApi.getRsaPublicKey((rsaPublicKey) => {
                            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                            formData.rsaPublicKey = rsaPublicKey
                            console.log(new Date().getTime())
                            userApi.login(formData, (apiToken, res) => {
                                this.locked = true
                                if (apiToken) {
                                    this.setApiToken(apiToken)
                                    myAPi.addLoginHistory()
                                    this.getInfo()
                                    Tip({type: 'success', message: this.$t(`user.loginSuccess`)})
                                    if (this.curl) {
                                        this.$router.replace({path: this.curl})
                                    } else {
                                        this.$router.replace({path: '/'})
                                    }
                                } else {
                                    // 二次验证
                                    this.$router.push({
                                        name: 'twoverify',
                                        params: {
                                            username: this.formData.username,
                                            type: res.type,
                                            countryCode: res.countryCode,
                                            mobile: res.mobile
                                        },
                                        query: {
                                            curl: this.curl
                                        }
                                    })
                                }
                            }, (msg, rst) => {
                                this.locked = true
                                Tip({
                                    type: 'danger',
                                    message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
                                })
                                if (rst === 300) {
                                    this.$router.push({name: 'sendemail', params: {email: this.formData.username}})
                                    console.log(this.formData.username)
                                }
                            })
                        }, () => {
                            this.locked = true
                        })
                    }, () => {
                        this.locked = true
                    })
                }
            },
            getInfo() {
                userApi.getUserInfo(res => {
                    this.setUserInfo(res);
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
        }
    }
</script>

<style scoped lang="less">
    .login-content-input {
        position: relative;

        &>div{
            margin-top: 0.3rem;
        }
        input {
            height: 0.5rem;
            width: 100%;
            font-size: 0.32rem;
            color: #ffffff;
            border: none;
            background-color: transparent;
        }

        .icon_showpwd {
            position: absolute;
            right: 0.3rem;
            bottom: 0.14rem;
            margin-top: -0.18rem;
            width: 0.36rem;
            height: 0.36rem;
            background-image: url('../../assets/img/eye_closed@2x.png');

            &.active {
                background-image: url('../../assets/img/eye_open@2x.png');
            }
        }
    }
</style>
