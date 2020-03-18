<template>
  <div class="bk-wrap index-slider">
     <div class="bk-main">
      <swiper v-if="banners.length" :options="swiperOption">
        <swiper-slide v-for="(item,index) in banners" :key="index">
          <a :href="item.url">
              <img :src="item.imgUrl" />
          </a>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
     </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import userApi from '@/api/individual'
  import config from '@/assets/js/config'
  export default {
    data () {
      return {
        datas: [],
        origin: config.origin,
        swiperOption: {
          loop: true,
          autoplay: {
            delay: 10000, // 自动切换的时间间隔，单位ms
            stopOnLastSlide: false, // 当切换到最后一个slide时停止自动切换
            disableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay。
            waitForTransition: true // 等待过渡完毕。自动切换会在slide过渡完毕后才开始计时。
          },
          speed: 500,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      }
    },
    computed: {
      ...mapGetters(['getLang']),
      banners () {
        let datas = []
        this.datas.forEach((item) => {
          if (this.getLang === 'zh-CN') {
            datas.push({
              imgUrl: `${this.origin}${item.activityImgUrl}`,
              url: `${item.jumpAddress}`
            })
          } else if (this.getLang === 'cht') {
            datas.push({
              imgUrl: `${this.origin}${item.activityImgUrlCht}`,
              url: `${item.jumpAddressCht}`
            })
          } else {
            datas.push({
              imgUrl: `${this.origin}${item.activityImgUrlEn}`,
              url: `${item.jumpAddressEn}`
            })
          }
        })
        datas.sort((item1, item2) => {
          let n1 = Number(item1.adPosition)
          let n2 = Number(item2.adPosition)
          if (n1 === n2) {
            return 0
          }
          return n1 < n2 ? -1 : 1
        })
        return datas
      }
    },
    created () {
      userApi.getBannersList((res) => {
        this.datas = res
      })
    }
  }
</script>

<style scoped>
  .bk-wrap{position:relative;overflow:hidden; padding-top: 34.375%;}
  .bk-main{position: absolute; left: 0; top: 0; right: 0; bottom: 0;}
  .index-slider{background: #0c151d;min-width:1200px;}
  .index-slider /deep/ .swiper-container {height: 100%;}
  .index-slider  img{width:100%; height: 100%; object-fit: cover; object-position: center;}
  .swiper-pagination{position: absolute;bottom:45px;width:100%;display:flex;align-items:center;justify-content:center;z-index:10;}
  .swiper-pagination /deep/ .swiper-pagination-bullet{width:35px;height:4px;border-radius:5px;background:#fff;margin:0 5px;opacity:0.5; -webkit-transition:300ms;transition:300ms;}
  .swiper-pagination /deep/ .swiper-pagination-bullet:focus{border:none;outline:none;}
  .swiper-pagination /deep/ .swiper-pagination-bullet-active{width:45px;height:5px;background:#fff;opacity:1;}
</style>
