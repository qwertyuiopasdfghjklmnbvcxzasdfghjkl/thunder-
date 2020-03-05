<template>
    <div class="head">
        <div class="img" v-tap="{methods:$root.routeTo, to:'ucenter', replace:true}">
            <img src="../../../assets/img/user_img@2x.png" v-if="!getUserInfo.headerImagePath">
            <img :src="orignal+getUserInfo.headerImagePath" @error="setDefaultIcon($event)" v-else>
        </div>
        <p>Thunder PRO</p>
        <div class="phone">
            <img src="../../../assets/img/svg/service.svg">
        </div>
    </div>
</template>

<script>
    import img from '../../../assets/img/icon_my_b3x.png'
    import { mapActions, mapGetters } from 'vuex'
    import config from '../../../api/config'
    export default {
        data() {
            return {
                src: img,
                orignal: process.env.NODE_ENV === 'development'  ? config.url + '/ceph-data/dev/user/' : config.url + '/ceph-data/produ-etv/user/'
            }
        },
        computed:{
            ...mapGetters(['getUserInfo']),
        },
        created() {

        },
        methods: {
            setDefaultIcon(e){
                let tar = e.currentTarget
                tar.src = avatar
            },
        }
    }
</script>

<style scoped lang="less">
.head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 0.8rem;
    padding: 0 0.3rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 99;
    .img{
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        overflow: hidden;
        background-color: #eeeeee;
        img{
            width: 100%;
            min-height: 100%;
        }
    }
    p{
        color: #ffffff;
        font-size: 0.36rem;
    }
    .phone{
        width: 0.4rem;
        height: 0.4rem;
        img{
            width: 100%;
            min-height: 100%;
        }
    }
}
</style>
