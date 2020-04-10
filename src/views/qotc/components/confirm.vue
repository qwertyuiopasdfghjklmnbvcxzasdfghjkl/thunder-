<template>
  <!-- 二次验证 -->
  <mt-popup class="verify_popup" v-model="show" position="bottom">
    <div class="confirm">
      <div class="title">
        <i class="cancel" @click="closeConfirm">
          <img src="../../../assets/img/off_blank.png" />
        </i>
        <p v-if="title">{{title}}</p>
        <p v-else>
          {{mobileState === 1 ? $t('auth_warning.warning_SMS_auth') : $t('account.safety_verification')}}
          <!--短信验证||邮件验证验证-->
        </p>
      </div>

      <div class="desc ft-c-default mt30 pl30 pr30 lh15" v-if="desc">{{desc}}</div>

      <div class="form">
        <!-- google 验证码 -->
        <!-- <input
          v-if="type === 2"
          class="input"
          v-validate="'required|pInteger'"
          :maxLength="6"
          name="googleCode"
          :msgs="msgs.googleCode"
          :errs="errors"
          v-model="form.googleCode"
          :title="$t('account.user_center_Google_verification_code')"
          :placeholder="$t('account.user_center_Google_verification_code')"
        /> -->

        <!-- 短信/邮箱验证码 -->
        <div class="smsCode">
          <input
            class="input"
            v-validate="'required|pInteger'"
            :maxLength="6"
            name="smsCode"
            :msgs="msgs.smsCode"
            :errs="errors"
            v-model="form.smsCode"
            :title="placeholder"
            :placeholder="placeholder"
          />

          <!--发送验证码-->
          <mt-button
            type="primary"
            style="font-size: 0.28rem;"
            :disabled="disabled"
            v-tap="{methods: sendCode}"
          >{{$t('account.user_center_send_SMS')}}{{disabled ? `（${time}s）` : ''}}</mt-button>
        </div>

        <!-- 复选框 -->
        <!-- <ul class="mt10 check">
          <li v-tap="{methods: setCheck}" :class="{active: check}">
            <i :class="[check ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i>
            {{$t('qotc.confirmation_of_collections')}}
          </li>
        </ul>-->

        <!-- 确定 -->
        <div class="buttons">
          <span class="mint-button--primary" @click="auth">{{$t('otc_legal.otc_legal_confirm')}}</span>
        </div>
      </div>
    </div>
  </mt-popup>
</template>

<script>
import { mapGetters } from "vuex";
import utils from "@/assets/js/utils";
import userApi from "@/api/individual";
import myApi from "@/api/user";
import userUtils from "@/api/wallet";

export default {
  props: {
    title: {
      type: String,
      default: function () {
        // default = 二次验证
        return this.$t("account.user_center_two_auth")
      }
    },
    desc: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false,

      mobileState: "",
      googleState: "",
      emailState: "",

      phoneNumber: "",
      countryCode: "",
      email: "",

      type: "", // 验证方式

      placeholder: "",
      disabled: false,
      time: 60,
      check: false,
      form: {
        googleCode: "",
        smsCode: ""
      }
    };
  },
  computed: {
    ...mapGetters(["getLang", "getUserInfo"]),
    msgs() {
      return {
        googleCode: {
          required: this.$t("account.safety_code_required"),
          pInteger: this.$t("error_code.NUMERIC")
        },
        smsCode: {
          required: this.$t("public0.input") + this.$t("market.user_SMS_code"),
          pInteger: this.$t("error_code.NUMERIC")
        }
      };
    }
  },
  mounted() {
    this.mobileState = this.getUserInfo.mobileAuthEnable;
    this.googleState = this.getUserInfo.googleAuthEnable;
    this.emailState = this.getUserInfo.emailAuthEnable;

    this.phoneNumber = this.getUserInfo.mobile;
    this.countryCode = this.getUserInfo.countryCode || "+86";
    this.email = this.getUserInfo.email || this.getUserInfo.username;

    console.log("mobile/google", this.mobileState, "/", this.googleState);

    if (
      this.emailState === 1 &&
      this.googleState === 0 &&
      this.mobileState === 0
    ) {
      // 邮箱验证
      this.type = 3;
    } else if (
      this.emailState === 1 &&
      this.googleState === 1 &&
      this.mobileState === 0
    ) {
      // 邮箱 + Google 验证码验证
      this.placeholder = this.$t("usercontent.user62");
      this.type = 2;
    } else if (this.mobileState === 1) {
      // 短信验证
      this.placeholder = this.$t("market.user_SMS_code");
      this.type = 1;
    }
  },
  methods: {
    auth() {
      // if (!this.check) {
      //   Tip({
      //     type: "danger",
      //     message: this.$t("qotc.confirmation_of_collections2")
      //   });
      //   return;
      // }
      this.$validator.validateAll().then(valid => {
        if (!valid) {
          let items = this.errors.items;
          if (items && items.length && items[0]) {
            let name = items[0].field;
            let msg =
              this.msgs[name] && this.msgs[name][this.errors.firstRule(name)]
                ? this.msgs[name][this.errors.firstRule(name)]
                : this.$t(this.errors.first(name));
            Tip({ type: "danger", message: msg });
          }
          return;
        }
        let _data = {
          verifyType: this.type,
          // googleCode: this.form.googleCode,
          code: this.form.smsCode,
          mobileNumber: this.phoneNumber
        };
        this.$emit("callBack", _data);
      });
    },

    sendCode() {
      console.log("sendCode  type", this.type);
      if (this.type === 2 || this.type === 3) {
        this.sendEMAILCode();
      } else if (this.type === 1) {
        this.sendSMSCode();
      }
    },

    sendEMAILCode() {
      if (this.disabled) {
        return;
      } else if (!this.$root.isemail(this.email)) {
        Tip({
          type: "danger",
          message: this.$t("exchange.exchange_Email_format_error")
        }); // 邮箱格式错误
        return;
      }
      this.disabled = true;
      myApi.reSendEmail(
        {
          lang:
            this.getLang === "zh-CN" || this.getLang === "cht" ? "cn" : "en",
          email: this.email,
          username: this.email
        },
        msg => {
          let timeOut = () => {
            this.time--;
            if (this.time === 0) {
              this.disabled = false;
              this.time = 60;
              return;
            }
            setTimeout(timeOut, 1000);
          };
          setTimeout(timeOut, 1000);
          Tip({ type: "success", message: this.$t(`error_code.${msg}`) });
        },
        msg => {
          this.disabled = false;
          Tip({
            type: "danger",
            message: this.$t(
              `error_code.${typeof msg === "string" ? msg : msg[0]}`
            )
          });
        }
      );
    },

    sendSMSCode() {
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      userApi.sendAuthSMSCode(
        {
          phoneNumber: this.phoneNumber,
          countryCode: this.countryCode
        },
        res => {
          let timeOut = () => {
            this.time--;
            if (this.time === 0) {
              this.disabled = false;
              this.time = 60;
              return;
            }
            setTimeout(timeOut, 1000);
          };
          this.time = 60;
          setTimeout(timeOut, 1000);
          Tip({
            type: "success",
            message: this.$t("error_code.SEND_CODE_SUCCESS")
          });
        },
        msg => {
          this.disabled = false;
          Tip({ type: "danger", message: msg });
        }
      );
    },

    closeConfirm() {
      this.show = false;
    },

    openConfirm() {
      this.show = true;
    },

    setCheck() {
      this.check = !this.check;
    }
  }
};
</script>

<style lang="less" scoped>
@grey: #4b5875;
@blue: #0c6ac9;
@error: #ef4f4f;

.verify_popup {
  width: 100%;
  border-top-left-radius: 0.32rem;
  border-top-right-radius: 0.32rem;
  overflow: hidden;
}

.title {
  font-size: 0.32rem;
  height: 1rem;
  line-height: 1rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  color: #222222;
  text-align: center;
  border-bottom: 0.01rem solid #eeeeee;
  position: relative;
  .cancel {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    position: absolute;
    left: 0;
    top: 0;
    text-align: center;
    img {
      vertical-align: middle;
      width: 0.3rem;
    }
  }
}

.form {
  padding: 0.3rem;
}

.input,
.verifycode {
  width: 100%;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 0.2rem;
  font-size: 0.32rem;
  box-sizing: border-box;
}

.smsCode {
  display: flex;
  justify-content: space-between;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}

.smsCode.safetyCode {
  margin-top: 0;
  margin-bottom: 0;
}

.smsCode input {
  width: 60%;
}

.smsCode span {
  display: inline-block;
  width: 2.3rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}

.smsCode span.disabled {
  background: #999;
}

.buttons span {
  display: inline-block;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  cursor: pointer;
  font-size: 0.3rem;
  border-radius: 4px;
  flex: 1;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

input.verifycode {
  margin-bottom: 0.3rem;
}

.check {
  display: flex;
  flex-wrap: wrap;
  color: #333;
  margin-bottom: 0.3rem;
  li {
    line-height: 0.6rem;
    i {
      margin-right: 0.1rem;
    }
    &.active {
      color: @blue;
    }
  }
}
</style>
