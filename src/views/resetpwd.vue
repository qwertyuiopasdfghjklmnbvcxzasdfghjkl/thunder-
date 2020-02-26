<template>
  <div class="page">
    <top-back :back="false">{{$t('error_code.RESETCODE_FAIL')}}<!--重置密码--></top-back>

    <div class="page-main">
      <p class="login_logo">
          <img src="../assets/img/logo.png">
      </p>
      <div class="findpwd-content">
          <div class="findpwd-content-row password">
            <ui-input
                    :type="showpwd? 'text':'password'"
                    :maxlength="32"
                    :label="$t('account.user_center_new_password')"
                    v-model="formData.password"
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
                    v-model="formData.passwordConfirm"
                    :title="$t('login_register.confirm_new_password')"></ui-input><!--确认密码-->
            
          </div>
          <div class="findpwd-content-row mt50">
            <mt-button type="primary" :disabled="locked" size="large" @click="resetPwd">{{$t('exchange.exchange_determine')}}<!--确定--></mt-button>
          </div>
      </div>
    </div>
    <div v-show="false"> <!-- 用于表单验证 -->
        <input uid="common-password" name="password" type="password" v-model="formData.password" v-validate="'required|password'">
        <input type="password" name="passwordConfirm" v-model="formData.passwordConfirm" v-validate="'required|passwordAgain'">
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
import UiInput from "../components/uiInput"
export default {
  name: 'app',
  components: {
    UiInput
  },
  data () {
    return {
      locked: false,
      showpwd:false,
      pwdError:false,
      formData: {
        resetCode: '',
        password: '',
        passwordConfirm: ''
      }
    }
  },
  computed: {
    msgs () {
      return {
        password: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        passwordConfirm: {required: this.$t('account.user_center_Please_confirm_password')} // 请再次输入新密码
      }
    }
  },
  created(){
    this.formData.resetCode = this.$route.query.code || ''
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
    
    resetPwd () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        if (this.locked) {
          return
        }
        this.locked = true
        let formData = {}
        for (let i in this.formData) {
          formData[i] = this.formData[i]
        }
        userApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
          formData.rsaPublicKey = rsaPublicKey
          userApi.forgetPwdChangePwd(formData, () => {
            Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
            setTimeout(() => {
              this.$router.replace({name: 'login'})
            }, 1500)
          }, (msg) => {
            this.locked = false
            Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
          })
        }, () => {
          this.locked = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.findpwd-content {
  padding: .3rem;
  margin-top: .2rem;
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

