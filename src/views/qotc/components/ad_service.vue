<template>
  <!-- 添加广告和客服跳转 -->
  <div>
    <router-link
      class="icon_ add-advertisement"
      v-if="isMerchant" tag="span"
      :to="{name:'qotcAddOrUpdate', query: {type}}"
    ></router-link>
    <span class="icon_ online-service" v-tap="{methods: goOnlineService}"></span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'

export default {
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
       isMerchant: false
    }
  },
  computed:{
    ...mapGetters(['getApiToken'])
  },
  created() {
    this.getAdPermission()
  },
  methods: {
    // 获取是否有商家权限
    getAdPermission () {
      if(!this.getApiToken){
          return
      }
      otcApi.getAdPermission((res) => {
          this.isMerchant = res.otcMerchantsPermission==1 ? true : false
      })
    },

    goOnlineService() {
      this.$router.push({name: 'online'})
    },
  }
}
</script>

<style lang="less" scoped>
.online-service {
    position: absolute;
    bottom: 2.16rem;
    right: 0.3rem;
    width: 0.9rem;
    height: 0.9rem;
    z-index: 1;
    background-image: url('../../../assets/img/icon_service.png');
}
.add-advertisement {
    position: absolute;
    bottom: 3.36rem;
    right: 0.3rem;
    width: 0.9rem;
    height: 0.9rem;
    z-index: 1;
    background-image: url('../../../assets/img/icon_add_advertisement.png');
    background-color: #101724;
    border-radius: 50%;
}
</style>
