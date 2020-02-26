<template>
  <div class="uploading">
    <div class="uploading-container">
      <p>
        <loading :size="0.6"></loading>
        <span class="ml20">{{$t('public0.public188')}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import loading from '@/components/common/loading'
export default {
  components: {
    loading
  }
}
</script>

<style scoped>
.uploading{display: flex;justify-content: center;align-items: center;position: fixed;top: 0; right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, 0.5);}
.uploading-container{padding:0.3rem;background-color: #fff;max-width:calc(100% - 0.6rem);border-radius:0.1rem;}
.uploading-container p{line-height:0.4rem; color: #999; display:flex;align-items:center;}
</style>
