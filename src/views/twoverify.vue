<template>
    <div class="page">
        <top-back></top-back>
        <div class="page-main">
            <div class="second-form">
                <p class="login_logo">
                    <img src="../assets/img/logo.png">
                </p>
              <div class="second-content">
                <div class="second-content-inner">
                    <div class="full" v-if="type === '01' || type === '10'">
                      <mt-navbar v-model="formData.verifyType">
                        <mt-tab-item :id="0"><span>{{$t('auth_warning.warning_SMS_auth')}}<!--短信验证--></span></mt-tab-item>
                        <mt-tab-item :id="1"><span>{{$t('auth_warning.warning_google_auth')}}<!--谷歌验证--></span></mt-tab-item>
                      </mt-navbar>
                    </div>
                  <div class="second-content-item mt30" @click="focusVerifyCode">
                    <div class="second-content-row SMSLabel  ui-flex ui-flex-justify" v-if="formData.verifyType===0">
                      <span>{{$t('market.user_SMS_code')}}<!--短信验证码--></span>
                      <mt-button type="default" size="small" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
                    </div>
                    <div class="second-content-row googleLabel  ui-flex ui-flex-justify" v-if="formData.verifyType===1">
                      <span>{{$t('account.user_center_Google_verification_code')}}<!--谷歌验证码--></span>
                    </div>
                    <div class="second-content-row verifyCode">
                      <input id="verifyCode" ref="verifyCode" type="text" v-model="formData.verifyCode" :maxlength="verifyCodeLength" autocomplete="off">
                    </div>
                  </div>
                  <div class="second-content-row button">
                    <mt-button type="primary" size="large" :disabled="!formData.verifyCode" @click="loginbtn">{{$t('login_register.login')}}<!--确定--></mt-button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
export default {
  name: 'twoverify',
  data () {
    return {
      countryCode: '+86',
      testvalue: [],
      options: [
        {
          label: '',
          value: '1'
        }
      ],
      formData: {
        verifyType: 0, // 0 是短信 1 是谷歌
        username: '',
        mobile: '',
        verifyCode: ''
      },
      isShowGoogleDialog: false,
      locked: false, // 锁
      type: '',
      account: '',
      password: '',
      disabled: false,
      time: 60
    }
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
          vm.curl = to.query.curl || '/ucenter'
      })
  },
  computed: {
    ...mapGetters(['getLang']),
    verifyCodeLength () { // 短信长度
      return Number(this.formData.verifyType) === 0 ? 6 : 6
    },
    verifyCodes () {
      let arr = (this.formData.verifyCode || '').split('')
      return arr
    },
  },
  watch: {
    'formData.verifyType' () {
      this.formData.verifyCode = ''
      this.$nextTick(() => {
        $('#verifyCode').focus()
      })
    },
    type (val) {
      if (String(val).indexOf('0') !== -1) {
        this.formData.verifyType = 0
      } else {
        this.formData.verifyType = 1
      }
    }
  },
  created () {
    let username = this.$route.params.username
    if (username) {
      this.formData.username = username
      window.localStorage.setItem('$twoverify_username', username)
    } else {
      username = window.localStorage.getItem('$twoverify_username')
      if (username) {
        this.formData.username = username
      } else {
        this.$router.push({name: 'login'})
      }
    }
    let mobile = this.$route.params.mobile
    if (mobile) {
      this.formData.mobile = mobile
      window.localStorage.setItem('$twoverify_mobile', mobile)
    } else {
      mobile = window.localStorage.getItem('$twoverify_mobile')
      if (mobile) {
        this.formData.mobile = mobile
      }
    }
    let type = this.$route.params.type
    if (type) {
      this.type = type
      window.localStorage.setItem('$twoverify_type', type)
    } else {
      type = window.localStorage.getItem('$twoverify_type')
      if (type) {
        this.type = type
      }
    }
    let countryCode = this.$route.params.countryCode
    if (countryCode) {
      this.countryCode = countryCode
      window.localStorage.setItem('$twoverify_countryCode', countryCode)
    } else {
      countryCode = window.localStorage.getItem('$twoverify_countryCode')
      if (countryCode) {
        this.countryCode = countryCode
      }
    }
    this.$nextTick(() => {
      $('#verifyCode').focus()
    })
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    focusVerifyCode () {
      $('#verifyCode').focus()
    },
    loginbtn () {
      $('#verifyCode').blur()
      if (this.locked) {
        return
      }
      let m = Number(this.formData.verifyType) === 0 ? 'loginMobileVerify' : 'loginTwo'
      let formData = Number(this.formData.verifyType) === 0 ? { // 短信验证
        smsCode: this.formData.verifyCode,
        username: this.formData.username,
        mobile: this.formData.mobile
      } : {
        verifyCode: this.formData.verifyCode,
        username: this.formData.username
      }
      myAPi[m](formData, (apiToken) => {
        window.localStorage.removeItem('$twoverify_username')
        this.locked = false
        this.setApiToken(apiToken)
        myAPi.addLoginHistory()
        this.getInfo()
        Tip({type: 'success', message: this.$t(`user.loginSuccess`)})
        if (this.curl) {
            // this.$router.replace({path: this.curl})
            this.$router.push({name: 'home'})
        } else {
            // this.$router.replace({path: '/'})
            this.$router.push({name: 'home'})
        }
      }, (msg) => {
        this.locked = false
        this.formData.verifyCode = ''
        setTimeout(() => {
          $('#verifyCode').focus()
        }, 10)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      if (!this.formData.mobile) {
        Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
        return
      }
      this.disabled = true
      myAPi.sendAuthSMSCode({
        phoneNumber: this.formData.mobile,
        countryCode: this.countryCode,
        lang:this.getLang
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
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    getInfo() {
        userApi.getUserInfo(res => {
            this.setUserInfo(res);
        },msg=>{
            setTimeout(this.getInfo(),1500)
        })
    },
  }
}
</script>

<style lang="less" scoped>
.second-content {
  /*padding: .3rem;*/
  margin-top: .2rem;
  /*background-color: #fff;*/
  border-radius: 4px;
  /deep/ .mint-navbar {background-color: #151C2C;}
  /deep/ .mint-tab-item {
      height: 0.9rem;
      color: #999;
      padding: 0;
      &.is-selected {
          color: #0C6AC9; border-bottom: none; margin-bottom: 0;
          .mint-tab-item-label span{
              border-bottom: 2px solid #0C6AC9;
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
    margin-top: .4rem;
    &.SMSLabel, &.googleLabel {
      font-size: 0;
      line-height: 0;
      span {
        display: inline-block;
        width: 55%;
        height: .8rem;
        font-size: .3rem;
        line-height: .8rem;
        vertical-align: middle;
      }
      button {
        width: 40%;
      }
    }
    &.SMSLabel {
      margin-top: 0;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    &.googleLabel {
      margin-top: 0;
      span {
        width: 100%;
      }
    }
    &.verifyCode {
      position: relative;
      overflow: hidden;
      input {
        width: 100%;
        height: .8rem;
        font-size: .3rem;
        color: #ffffff;
        background-color: #151C2C;
        /*border: 2px solid #ccc;*/
        border-radius: 4px;
          border: none;
        padding: 0 0.3rem;
        line-height: 1rem;
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

</style>
