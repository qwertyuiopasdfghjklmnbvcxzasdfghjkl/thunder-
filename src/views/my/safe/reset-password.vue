<template>
    <div class="page">
        <top-back>{{$t('user.changePassword')}}</top-back>
        <div class="page-main">
            <div class=" mt20">
                <div class="cont">
                    <ui-input
                            :title="$t('exchange.exchange_old_password')"
                            :label="$t('home.oldPW')"
                            :type="showpwd? 'text':'password'"
                            :placeholder="true"
                            v-model="formData.passwordOld"></ui-input>
                    <i class="icon_showpwd" :class="{active:showpwd}"
                       v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                    <p class="error" v-if="!passwordOldError">{{$t('home.oldPW')}}</p>
                </div>
                <div class="cont">
                    <ui-input
                            :title="$t('account.user_center_new_password')"
                            :label="$t('account.user_center_Please_new_password')"
                            :type="showpwd? 'text':'password'"
                            :placeholder="true"
                            v-model="formData.password"></ui-input>
                    <p class="error" v-if="!passwordError">{{$t('login_register.lintonPWReg')}}</p>
                </div>
                <div class="cont">
                    <ui-input
                            :title="$t('account.user_center_confirm_password')"
                            :label="$t('account.user_center_Please_confirm_password')"
                            :type="showpwd? 'text':'password'"
                            :placeholder="true"
                            v-model="formData.passwordConfirm"></ui-input>
                    <p class="error" v-if="!passwordConfirmError">{{$t('home.home23')}}</p>
                </div>
            </div>
            <div class="mt50">
                <mt-button type="primary" :disabled="!lock || gtLocked" size="large" v-tap="{methods:submit}">{{$t('public0.submit')}}<!--提交--></mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import UiInput from "../../../components/uiInput";
    import {mapGetters, mapActions} from 'vuex'
    import userApi from '../../../api/user'
    import utils from '@/assets/js/utils'

    export default {
        components: {UiInput},
        data() {
            return {
                showpwd: false,
                passwordError: true,
                passwordOldError: true,
                passwordConfirmError: true,
                formData: {
                    passwordOld: '',
                    password: '',
                    passwordConfirm: '',
                },
                userInfo: {},
                gtLocked: false,
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
            lock() {
                return this.formData.passwordOld && this.formData.password && this.formData.passwordConfirm && this.passwordOldError && this.passwordError && this.passwordConfirmError || false
            }
        },
        watch: {
            'formData.passwordOld'(e) {
                this.passwordOldError = e.trim()!==''
            },
            'formData.password'(e) {
                this.passwordError = /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(e)
                if(this.formData.passwordConfirm.trim()){
                    this.passwordConfirmError = this.formData.passwordConfirm === this.formData.password
                }
            },
            'formData.passwordConfirm'(e) {
                this.passwordConfirmError = e === this.formData.password
            }
        },
        created() {
            this.userInfo = this.getUserInfo
        },
        methods: {
            ...mapActions(['setApiToken']),
            submit() {
                if(this.lock){
                    this.gtLocked = true
                    utils.gtValidate((gtParams) => {
                      let formData = {}
                      for (let i in gtParams) {
                        formData[i] = gtParams[i]
                      }
                      userApi.getRsaPublicKey((rsaPublicKey) => {
                        formData.passwordOld = utils.encryptPwd(rsaPublicKey, this.formData.passwordOld)
                        formData.password = utils.encryptPwd(rsaPublicKey, this.formData.password)
                        formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, this.formData.passwordConfirm)
                        formData.rsaPublicKey = rsaPublicKey
                        Indicator.open('Loading...')
                        userApi.changePwd(formData, (msg) => {
                          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                          this.$router.replace({name: 'center'})
                        }, (msg) => {
                          Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
                        })
                      }, () => {
                      })
                    }, () => {
                      this.gtLocked = false
                    })
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .cont {
        position: relative;
        &+.cont {margin-top: 0.5rem;}
        &:last-of-type {padding-bottom: 0.5rem;}

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

        .error {
            position: absolute;
            top: .8rem;
            font-size: 0.2rem;
            color: #3B48C8;
        }
    }
</style>
