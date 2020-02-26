<template>
  <div class="page">
    <top-back :back="false">{{$t('public0.public159')}}<!--邮箱验证--></top-back>
    <div class="page-main">
        <div class="block mt20 info tc">
            <img src="../../assets/img/email/activation.png" />
            <p class="f30 mt20">{{$t('public0.public69')}}<!--邮箱激活成功，马上开始交易--></p>
            <mt-button type="primary" size="large" class="mt50" @click="goLogin">{{$t('public0.public142')}}<!--前往登录--></mt-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goLogin () {
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style scoped lang="less">
.info img {width: 1.6rem;}
</style>

