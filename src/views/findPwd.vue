<template>
    <div class="page bg-c-white">
        <top-back>
            {{$t('home.home34')}}
            <router-link slot="right" :to="{name:'login'}" tag="span">{{$t('login_register.login')}}<!--登录--></router-link>
        </top-back>
        <div class="page-main">
            <p class="login_logo">
                <img src="../assets/img/logo.png">
            </p>
            <div class="findpwd-content">
              <div class="full" v-if="false">
                <mt-navbar v-model="findpwdType">
                  <mt-tab-item :id="1" v-if="false"><span>{{$t('login_register.retrieved_by_cellphone')}}<!--手机找回--></span></mt-tab-item>
                  <mt-tab-item :id="0"><span>{{$t('login_register.retrieved_by_email')}}<!--邮箱找回--></span></mt-tab-item>
                </mt-navbar>
              </div>

              <!--手机找回-->
              <div class=" mt20" v-show="findpwdType===1">
                <div class="findpwd-content-row countryCode">
                  <select v-model="countryCode">
                    <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}&nbsp;{{item.code}}</option>
                  </select>
                  <ui-input class="mobile"
                          :label="$t('account.user_center_phone')"
                          v-model="mobileFormData.phoneNumber"
                          :title="$t('account.user_center_phone')"></ui-input><!--手机号-->
                </div>
                <div class="findpwd-content-row SMSCode">
                  <ui-input 
                          :maxlength="6"
                          :label="$t('account.user_center_SMS_code')"
                          v-model="mobileFormData.smsCode"
                          :title="$t('account.user_center_SMS_code')"></ui-input><!--短信验证码-->
                  <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
                </div>
              </div>

              <!--邮箱找回-->
              <div class="mt20" v-show="findpwdType===0">
                <div class="findpwd-content-row email">
                  <ui-input type="email"
                          :label="$t('otc_exchange.otc_exchange_Email')"
                          v-model="mobileFormData.username"
                          :title="$t('otc_exchange.otc_exchange_Email')"></ui-input><!--邮箱-->
                </div>
                <div class="findpwd-content-row SMSCode">
                  <ui-input 
                          :maxlength="6"
                          :label="$t('account.user_center_SMS_code')"
                          v-model="mobileFormData.smsCode"
                          :title="$t('account.user_center_code')"></ui-input><!--验证码-->
                  <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendEMAILCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
                </div>
              </div>
              <!-- 共同部分 -->
              <div class="findpwd-content-row password">
                <ui-input
                        :type="showpwd? 'text':'password'"
                        :maxlength="32"
                        :label="$t('account.user_center_new_password')"
                        v-model="mobileFormData.password"
                        :title="$t('account.user_center_new_password')"></ui-input><!--新密码-->
                <i class="icon_showpwd" :class="{active:showpwd}"
                       v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
              </div>
              <p class="f24 ft-c-main pwd-error" v-if="pwdError">{{$t('login_register.lintonPWReg')}}</p>
              <div class="findpwd-content-row confirmPassword">
                <ui-input 
                        :type="showpwd? 'text':'password'"
                        :maxlength="32"
                        :label="$t('login_register.confirm_new_password')"
                        v-model="mobileFormData.passwordConfirm"
                        :title="$t('login_register.confirm_new_password')"></ui-input><!--确认密码-->
                
              </div>
              <div class="findpwd-content-row pt30">
                <mt-button :disabled="locked || gtLocked" type="primary" size="large" v-tap="{methods: updatePwd}">{{$t('otc_legal.otc_legal_confirm')}}<!--确定--></mt-button>
              </div>
            </div>
            
            <div v-show="false"> <!-- 用于表单验证 -->
                <input name="phoneNumber" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'">
                <input name="smsCode" maxlength="6" v-model="mobileFormData.smsCode" v-validate="'required'">
                <input uid="common-password" name="password" type="password" v-model="mobileFormData.password" v-validate="'required|password'">
                <input type="password" name="passwordConfirm" v-model="mobileFormData.passwordConfirm" v-validate="'required|passwordAgain'">
                <input name="username" type="email" v-model="mobileFormData.username" v-validate="'required|email'">
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
import myAPi from '@/api/individual'
import { MessageBox } from 'mint-ui'

export default {
  name: 'findPwd',
  components: {
    UiInput
  },
  data () {
    return {
      areaCodeList: commonConfig.areaCodeList,
      countryCode: commonConfig.defaultCode,
      locked: false,
      gtLocked: false,
      findpwdType: 0,
      showpwd:false,
      mobileFormData: {
        phoneNumber: '',
        username: '',
        smsCode: '',
        password: '',
        passwordConfirm: ''
      },
      disabled: false,
      time: 60,
      pwdError:false
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        phoneNumber: {required: this.$t('public0.public6')}, // 请输入手机号
        smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
        password: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        passwordConfirm: {required: this.$t('account.user_center_Please_confirm_password')}, // 请再次输入新密码
        username: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')} // 请输入邮箱 邮箱格式错误
      }
    }
  },
  watch: {
    findpwdType () {
      this.$nextTick(() => {
        this.$validator.reset()
      })
    }
  },
  created () {
    this.$nextTick(() => {
      $('.ui_input.mobile input').focus()
    })
  },
  mounted(){
    $('.password input').on('input', ()=>{
      if(!this.mobileFormData.password){
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
    sendEMAILCode(){
      if (this.disabled) {
        return
      } else if (!this.mobileFormData.username) {
        Tip({type: 'danger', message: this.$t('login_register.email')}) // 请输入邮箱
        return
      } else if(!this.$root.isemail(this.mobileFormData.username)){
        Tip({type: 'danger', message: this.$t('exchange.exchange_Email_format_error')}) // 邮箱格式错误
        return
      }
      this.disabled = true
      userApi.reSendEmail({
        lang: this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en',
        email: this.mobileFormData.username,
        username: this.mobileFormData.username
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
    updatePwd () {
      if (this.locked) {
        return
      }
      var formData = {}
      for (let i in this.mobileFormData) {
        formData[i] = this.mobileFormData[i]
      }
      if (this.findpwdType == 0) { // 邮箱注册
        delete formData.phoneNumber
      } else {
        delete formData.username
      }
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
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.mobileFormData) {
            formData[i] = this.mobileFormData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.phoneNumber = (this.findpwdType==0?this.mobileFormData.username:this.mobileFormData.phoneNumber)
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            delete formData.username
            userApi.mobileResetPwd(formData, () => {
              Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
              setTimeout(() => {
                this.locked = false
                this.$router.push({name: 'login'})
              }, 1500)
            }, (msg) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            })
          }, () => {
            this.locked = false
          })
        })
      })
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      } else if (!this.mobileFormData.phoneNumber) {
        Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
        return
      } else if(!this.$root.ismobile(this.mobileFormData.phoneNumber)){
        Tip({type: 'danger', message: this.$t('public0.public128')}) // 请输入有效的手机号码
        return
      }
      this.disabled = true
      myAPi.sendAuthSMSCode({
        countryCode: this.countryCode,
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
        setTimeout(timeOut, 1000)
        Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')})
      }, (msg) => {
        this.disabled = false
        Tip({type: 'success', message: msg})
      })
    },
    resetPW (arg) {
      let pwd= $(".login-form").find("input[name=password]")
      if (pwd.next().hasClass('invisible')) { // 如果隐藏
        pwd.next().removeClass('invisible').addClass('visible') // 密码可见
        pwd.prop('type', 'text')
      } else {
        pwd.next().removeClass('visible').addClass('invisible') // 密码不可见
        pwd.prop('type', 'password')
      }
    }
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
  }
}
.login_logo {
    height: 3.3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 1.8rem;
    }
}
.pwd-error {margin-top: -0.2rem; padding-bottom: 0.1rem;}
</style>
