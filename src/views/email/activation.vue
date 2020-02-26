<template>
  <div class="page">
    <top-back >{{$t('public0.public159')}}<!--邮箱验证--></top-back>
    <div class="page-main">
        <div class="block mt20 info tc">
            <img src="../../assets/img/email/activemailbox.png" />
            <p class="f30 mt20">{{$t('public0.public71')}}<!--邮箱未激活--></p>
            <mt-button type="primary" size="large" class="mt50" @click="sendEmail" v-if="!toLogin">{{$t('public0.public72')}}<!--发送邮件--></mt-button>
            <mt-button type="primary" size="large" class="mt50" v-tap="{methods:$root.routeTo, to:'login', replace:true}" v-else>{{$t('public0.public142')+`（${time}s）`}}<!--前往登录--></mt-button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userApi from '@/api/user'
export default {
  data(){
    return {
      toLogin:false,
      time: 60,
    }
  },
  computed: {
    ...mapGetters(['getLang'])
  },
  methods: {
    sendEmail () {
      let email = this.$route.params.email
      userApi.reSendEmail({
        lang: this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en',
        email: email,
        username: email
      }, (msg) => {
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
        this.toLogin = true
        this.countDown()
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
      })
    },
    countDown(){
      let timeOut = () => {
        this.time--
        if (this.time === 0) {
          this.$router.replace({name:'login'})
          return
        }
        setTimeout(timeOut, 1000)
      }
      setTimeout(timeOut, 1000)
    }
  }
}
</script>

<style scoped lang="less">
.info img {width: 1.6rem;}
</style>

