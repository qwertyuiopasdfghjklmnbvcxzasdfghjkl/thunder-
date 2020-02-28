<template>
    <div class="page-top" :class="{dark:dark, logo:logo}">
        <div class="btn-left">
            <slot name="left"></slot>
        </div>
        <span class="btn-back" v-tap="{methods:goBack}" v-if="back"></span>
        <span class="btn-home" v-tap="{methods:goHome}" v-if="home"></span>
        <strong><slot></slot></strong>
        <div class="btn-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'top-back',
        props: {
            back: {
                type: Boolean,
                default: true
            },
            home: {
                type: Boolean,
                default: false
            },
            backPage: {
                type: String,
                default: ''
            },
            dark: {
                type: Boolean,
                default: false
            },
            params: {
                type: [Object, Array],
                default: ()=>{}
            },
            logo: {
                type:Boolean,
                default:false
            }
        },
        methods: {
            goBack() {
                if (this.backPage) {
                    this.$router.replace({name: this.backPage,params: this.params})
                } else {
                    this.$router.back()
                }
            },
            goHome() {
                this.$router.replace({path: '/'})
            }
        }
    }

</script>
<style lang="less" scoped>
    .page-top {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 0.9rem;
        padding: 0.2rem 0.3rem;
        text-align: center;
        line-height: 0.5rem;
        font-size: .34rem;
        color: #ffffff;
        background: none;
        &.logo {background: url('../../assets/img/logo_top.png') #fff no-repeat center; background-size: auto 0.6rem;}

        &.line {
            border-bottom: 1px solid #fff;
        }

        .btn-back {
            position: absolute;
            width: 0.8rem;
            height: 0.5rem;
            left: 0;
            background: url('../../assets/img/icon_back_b@3x.png') no-repeat 0.3rem center;
            background-size: 0.2rem auto;
            z-index: 9;
        }

        .btn-left{
            position: absolute;
            top: 0.2rem;
            line-height: 0.5rem;
            left: 0.3rem;
            font-size: 0.32rem;
        }
        .btn-home {
            position: absolute;
            width: 0.4rem;
            height: 0.5rem;
            right: 0.3rem;
            background: url('../../assets/img/icon_home.png') no-repeat center;
            background-size: contain;
        }

        .btn-right {
            position: absolute;
            top: 0.2rem;
            line-height: 0.5rem;
            right: 0.3rem;
            font-size: 0.32rem;
        }

        &.dark {
            background: #131e30;
            color: #fff;
            .btn-back {
                background-image: url('../../assets/img/icon_back_w@3x.png');
            }
        }
    }
</style>
