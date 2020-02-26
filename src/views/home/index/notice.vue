<template>
    <div class="notice">
        <swiper :options="swiperOption">
            <!-- 切换公告 -->
            <swiper-slide v-for="(item,index) in getNotice" :key="index">
                <router-link :to="{name:'notice-detail', query:{id:item.cmsInfoId}}">
                    <p>{{getLang === 'en'?item.titleEn:item.titleCn}}</p>
                </router-link>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import findApi from '@/api/home'

export default {
    data() {
        return {
            swiperOption: {
                // 所有配置均为可选（同Swiper配置）

                autoplay: true,
                speed: 1000,
                observer: true,
                direction : 'vertical',
            },
        }
    },
    computed:{
        ...mapGetters(['getNotice','getLang']),
    },
    created() {
        this.getIndexNotice()
    },
    methods: {
        ...mapActions(['setNotice']),
        getIndexNotice() {
            if(this.getNotice.length){
                return
            }
            let data = {
                firstLevel: 1,
                secondLevel: 1,
                page: 1,
                size: 3,
                state: 1
            }
            findApi.getCmsList(data, res => {
                this.setNotice(res.data)
            }, msg => {
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
        }
    }
}
</script>
<style lang="less" scoped="">
    .notice {
        position: relative;
        height: 0.54rem;
        overflow: hidden;

        .swiper-container {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }
        p{
            color: #333;
            font-size: .30rem;
            line-height: 0.54rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

</style>
