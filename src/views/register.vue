<template>
    <div class="page bg-c-white">
        <top-back>
            <!-- {{$t('login_register.register')}} -->{{$t('login_register.register_by_email')}}
            <router-link slot="right" :to="{name:'login'}" tag="span">{{$t('login_register.login')}}<!--登录--></router-link>
        </top-back>
        <div class="page-main">
            <p class="login_logo">
                <img src="../assets/img/logo.png">
            </p>
            <div class="findpwd-content">
              <div class="findpwd-content-inner">
                <div class="full" v-if="false">
                  <mt-navbar v-model="formData.registerType">
                    <mt-tab-item :id="1" v-if="false"><span>{{$t('login_register.register_by_cellphone')}}<!--手机注册--></span></mt-tab-item>
                    <mt-tab-item :id="0"><span>{{$t('login_register.register_by_email')}}<!--邮箱注册--></span></mt-tab-item>
                  </mt-navbar>
                </div>

                <!--手机注册-->
                <div class="findpwd-content-item cellphone mt20" v-show="formData.registerType===1">
                  <div class="findpwd-content-row countryCode">
                    <select v-model="formData.countryCode">
                      <option v-for="item in areaCodeList" :value="item.code">{{item.name}}<!--中国大陆-->&nbsp;{{item.code}}</option>
                    </select>
                    <ui-input class="mobile"
                            :label="$t('account.user_center_phone')"
                            v-model="formData.mobile"
                            :title="$t('account.user_center_phone')"></ui-input><!--手机号-->
                  </div>
                  <div class="findpwd-content-row SMSCode">
                    <ui-input 
                            :maxlength="6"
                            :label="$t('account.user_center_SMS_code')"
                            v-model="formData.smsCode"
                            :title="$t('account.user_center_SMS_code')"></ui-input><!--短信验证码-->
                    <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
                  </div>
                </div>

                <!--邮箱注册-->
              <div class="findpwd-content-item mt20" v-show="formData.registerType===0">
                <div class="findpwd-content-row email">
                    <ui-input type="email"
                            :label="$t('otc_exchange.otc_exchange_Email')"
                            v-model="formData.email"
                            :title="$t('otc_exchange.otc_exchange_Email')"></ui-input><!--邮箱-->
                </div>
                <div class="findpwd-content-row EMAILCode">
                    <ui-input 
                            :maxlength="6"
                            :label="$t('account.user_center_code')"
                            v-model="formData.smsCode"
                            :title="$t('account.user_center_code')"></ui-input><!--验证码-->
                    <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendEMAILCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
                  </div>
              </div>

                <!--共同部分-->
                <div class="findpwd-content-row password">
                <ui-input
                        :type="showpwd? 'text':'password'"
                        :maxlength="32"
                        :label="$t('exchange.exchange_password')"
                        v-model="formData.password"
                        :title="$t('exchange.exchange_password')"></ui-input><!--密码-->
                <i class="icon_showpwd" :class="{active:showpwd}"
                       v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                </div>
                <p class="f24 ft-c-main pwd-error" v-if="pwdError">{{$t('login_register.lintonPWReg')}}</p>
                <div class="findpwd-content-row confirmPassword">
                <ui-input 
                        :type="showpwd? 'text':'password'"
                        :maxlength="32"
                        :label="$t('login_register.confirm_new_password')"
                        v-model="formData.passwordConfirm"
                        :title="$t('login_register.confirm_new_password')"></ui-input><!--确认密码-->

                </div>
                <div class="findpwd-content-row ref">
                    <ui-input
                            :label="`${$t('public0.public244')}`"
                            v-model="formData.ref"
                            :title="`${$t('public0.public244')}`"></ui-input><!--邀请码-->
                </div>
                <div class="findpwd-content-row service">
                  <label for="service">
                    <input id="service" type="checkbox" name="service" v-model="checked">
                    <i type="checkbox"></i>
                  </label>
                  <span>
                    <label for="service">{{$t('login_register.agree_Service')}}<!--我已阅读并同意--></label>
                    <a href="javascript:;" @click="getAgreementUrl">{{$t('login_register.bitark_service').format(brand)}}<!--ETV服务条款--></a>
                  </span>
                </div>
                <div class="findpwd-content-row pt30">
                <mt-button :disabled="locked || gtLocked" type="primary" size="large" v-tap="{methods: register}">{{$t('login_register.register')}}<!--注册--></mt-button>
                </div>
                
              </div>
            </div>
            
            <div v-show="false"> <!-- 用于表单验证 -->
                <input name="mobile" v-model="formData.mobile" v-validate="'required|telphone'">
                <input name="smsCode" maxlength="6" v-model="formData.smsCode" v-validate="'required'">
                <input uid="common-password" name="password" type="password" v-model="formData.password" v-validate="'required|password'">
                <input type="password" name="passwordConfirm" v-model="formData.passwordConfirm" v-validate="'required|passwordAgain'">
                <input name="email" v-model="formData.email" v-validate="'required|email'">
                <input name="ref" v-model="formData.ref" v-validate="'required'">
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UiInput from "../components/uiInput"
import utils from '@/assets/js/utils'
import commonConfig from '@/assets/js/commonConfig'
import userApi from '@/api/user'
import { MessageBox } from 'mint-ui'
import config from '@/api/config'

export default {
  name: 'register',
  components: {
    UiInput
  },
  data () {
    console.log(commonConfig)
    return {
      brand: config.brand.toUpperCase(),
      checked: false,
      locked: false, // 锁
      gtLocked: false,
      disabled: false,
      showpwd:false,
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
      pwdError:false
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        mobile: {required: this.$t('public0.public6')}, // 请输入手机号
        smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
        email: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')}, // 请输入邮箱；邮箱格式错误
        password: {required: this.$t('login_register.password')}, // 请输入密码
        passwordConfirm: {required: this.$t('login_register.confirm_password')}, // 请再次输入密码
        ref: {required: this.$t('public0.input')+' '+this.$t('public0.public244')} // 请再次输入密码
      }
    },
    
  },
  watch: {
    'formData.registerType' () {
      this.$validator.reset()
    },
  },
  created () {
    this.$nextTick(() => {
        this.formData.ref = this.$route.query.ref || ''
        $('.ui_input.mobile input').focus()
    })
  },
  mounted(){
    $('.password input').on('input', ()=>{
      if(!this.formData.password){
        return
      }
      this.$validator.validate('password').then(error=>{
        if(!error){
          this.pwdError = true
        } else {
          this.pwdError = false
        }
      })
    })
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    getAgreementUrl () {
      this.$router.push({name: 'notice-detail', query: {id: '246605292891013120'}})
    },
    sendEMAILCode(){
      if (this.disabled) {
        return
      } else if (!this.formData.email) {
        Tip({type: 'danger', message: this.$t('login_register.email')}) // 请输入邮箱
        return
      } else if(!this.$root.isemail(this.formData.email)){
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
    sendSMSCode () {
      if (this.disabled) {
        return
      } else if (!this.formData.mobile) {
        Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
        return
      } else if(!this.$root.ismobile(this.formData.mobile)){
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
    register () {
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
        delete formData.email
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
  padding: .3rem;
  // margin-top: .2rem;
  background-color: #fff;
  border-radius: 4px;
  /deep/ .mint-navbar {border-bottom: 1px solid #eee;}
  /deep/ .mint-tab-item {
      height: 0.9rem;
      color: #999;
      padding: 0;
      &.is-selected {
          color: #3B48C8; border-bottom: none; margin-bottom: 0;
          .mint-tab-item-label span{
              border-bottom: 2px solid #3B48C8;
              margin-bottom: -2px;
          }
      }
      .mint-tab-item-label {
          font-size: 0.3rem;
          line-height: 0.9rem;
          span {display: inline-block; height: 100%;}
      }
  }
  &-row {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
    &.countryCode {
      overflow: hidden;
      .mobile {flex: 1; margin-left: 45%;}
      select {
        position: absolute;
        top: 0.15rem;
        left: 0;
        width: 40%;
        height: 0.65rem;
        font-size: .3rem;
        color: #8089a3;
        padding-left:5px;
        background-color: transparent;
        border:none;
        border-bottom: 0.02rem solid #ddd;
      }
    }
    .ui_input {flex: 1;}
    
    .icon_showpwd {
        position: absolute;
        right: 0.3rem;
        top: 0.54rem;
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
        a {
          text-decoration: underline;
        }
      }
    }
  }
}
.login_logo {
    padding-top: 0.2rem;
    height: 2.3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 1.8rem;
    }
}
.pwd-error {margin-top: -0.2rem; padding-bottom: 0.1rem;}
</style>
