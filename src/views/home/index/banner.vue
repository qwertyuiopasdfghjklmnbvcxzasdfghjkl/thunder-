<template>
    <div class="banner">
        <swiper :options="swiperOption">
            <!-- 幻灯内容 -->
            <swiper-slide v-for="(item,index) in getBanners" :key="index">
                <a :href="item.gameAdvertisementLink">
                    <img :src="item.gameAdvertisementImage">
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import findApi from '@/api/home'
import config from "@/api/config"

export default {
    data() {
        return {
            swiperOption: {
                // 所有配置均为可选（同Swiper配置）

                autoplay: true,
                speed: 400,
                observer: true,
                resistanceRatio:0,
                pagination: {
                    el: '.swiper-pagination',
                },
            },
        }
    },
    computed:{
        ...mapGetters(['getBanners','getLang']),
    },
    created() {
        this.getIndexBanners()
    },
    methods: {
        ...mapActions(['setBanners']),
        getIndexBanners() {
            if(this.getBanners.length){
                return
            }
            findApi.getBanner({type:2}, res => {
                let enbanners = [];
                res.filter(next=>{
                    let data ={}
                    if(this.getLang === 'zh-CN'){
                        data.gameAdvertisementImage =config.url+next.activityImgUrl;
                    }else{
                        data.gameAdvertisementImage =config.url+next.activityImgUrlEn;
                    }
                    data.gameAdvertisementLink =next.jumpAddress;
                    enbanners.push(data)
                })
                this.setBanners(enbanners)
            }, msg => {
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
        }
    }
}
</script>
<style lang="less" scoped="">
    .banner {
        position: relative;
        padding-top: 0;
        margin-left:  0.3rem;
        margin-right: 0.3rem;
        height: 3.35rem;

        .swiper-container {
            position: absolute;
            left: 0;
            top: 0.25rem;
            right: 0;
            bottom: 0;
            border-radius: 4px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        }

        /deep/ .swiper-pagination-bullet {
            background: #fff;
            border-radius: 8px;
            transition: all ease-out 300ms;
        }

        /deep/ .swiper-pagination-bullet-active {
            opacity: 0.8;
            width: 16px;
        }
    }

</style>
