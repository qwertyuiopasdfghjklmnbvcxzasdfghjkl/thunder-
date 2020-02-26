<template>
  <div class="page">
    <top-back :back="false">{{$t('public.withdrawal_confirm')}}<!--提币确认--></top-back>
    <div class="page-main">
        <div class="block mt20 info tc">
            <img src="../../assets/img/email/tibiqueren.png" />
            <p class="f30 mt20">{{$t('public.withdrawal_successful')}}<!--提币请求确认成功！可在“我的数字资产”窗口点击“历史记录”查看提币进度。--></p>
            <mt-button type="primary" size="large" class="mt50"  @click="closeWin">{{$t('public.close_window')}}<!--关闭窗口--></mt-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeWin () {
      window.opener = null
      window.close()
    }
  }
}
</script>

<style scoped lang="less">
.info img {width: 1.6rem;}
</style>

