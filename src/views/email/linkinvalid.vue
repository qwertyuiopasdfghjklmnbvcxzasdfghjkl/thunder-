<template>
  <div class="page">
    <top-back :back="false">{{$t('public.invalid_link')}}<!--链接已失效--></top-back>
    <div class="page-main">
        <div class="block mt20 info tc">
            <img src="../../assets/img/email/lianjieshixiao.png" />
            <p class="f30 mt20">{{$t('public.invalid_link')}}<!--链接已失效--></p>
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
.info img {width: 0.6rem;}
</style>

