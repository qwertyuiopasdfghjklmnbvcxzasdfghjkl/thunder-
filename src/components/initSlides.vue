<template>
    <transition leave-active-class="animated fadeOut">
        <div class="banner unselected" v-if="isFirst">
            <swiper :options="swiperOption" ref="initSwiper">
                <!-- 幻灯内容 -->
                <swiper-slide v-for="(item,index) in slides" :key="index">
                    <div class="img" :style="{backgroundImage:'url(' + item + ')'}"></div>
                    <span class="start-btn" v-if="index==2" v-tap="{methods:start}"></span>
                </swiper-slide>
                <div class="swiper-pagination" slot="custom"></div>
            </swiper>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                isFirst: window['cordova'] && !localStorage.getItem('isFirst') ? true : false,
                canStart: false,
                slides: [require('@/assets/img/slides/s1.png'), require('@/assets/img/slides/s2.png'), require('@/assets/img/slides/s3.png')],
                swiperOption: {
                    speed: 400,
                    observer: true,
                    resistanceRatio: 0,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                }
            }
        },
        computed: {
            swiper() {
                return (this.$refs.initSwiper && this.$refs.initSwiper.swiper)
            },
        },
        mounted() {
            let self = this
            this.swiper && this.swiper.on('slideChangeTransitionEnd', function () {
                if (self.slides.length === (this.activeIndex + 1)) {
                    self.canStart = true
                }
            })
            setTimeout(() => {
                if (this.isFirst && window.StatusBar) {
                    // StatusBar.backgroundColorByHexString('#020A25')
                }
            }, 1000)
        },
        methods: {
            start() {
                if (this.canStart) {
                    localStorage.setItem('isFirst', true)
                    this.isFirst = false
                    if (window.StatusBar) {
                        // StatusBar.backgroundColorByHexString('#ff576b')
                    }
                }
            }
        }
    }
</script>
<style lang="less" scoped="">
    .start-btn {
        position: absolute;
        z-index: 1;
        width: 2.6rem;
        height: 0.8rem;
        background: url('../assets/img/slides/start.png') no-repeat center/contain;
        left: 50%;
        bottom: 2.3rem;
        margin-left: -1.3rem;
    }

    .banner {
        position: fixed;
        z-index: 999999;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        overflow: hidden;

        .img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            background-position: center;
            background-size: cover;
        }

        .swiper-pagination {
            bottom: 0.8rem;
        }

        /deep/ .swiper-pagination-bullet {
            background-color: #fff;
            width: 12px;
            height: 4px;
            opacity: 0.3;
            border-radius: 8px;
            transition: all ease-out 300ms;
        }

        /deep/ .swiper-pagination-bullet-active {
            opacity: 1;
            width: 20px;
        }
    }

    .swiper-container {
        width: 100%;
        height: 100%;
    }
</style>
