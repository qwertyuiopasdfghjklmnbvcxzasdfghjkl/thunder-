<template>
    <div class="head">
        <div class="img" v-tap="{methods:$root.routeTo, to:'ucenter', replace:true}">
            <img :src="src" v-if="!getUserInfo.headerImagePath">
            <img :src="orignal+getUserInfo.headerImagePath" @error="setDefaultIcon($event)" v-else>
        </div>
        <p>Thunder PRO</p>
        <div class="phone" v-tap="{methods: linke}">
            <img src="../../../assets/img/svg/service.svg">
        </div>
    </div>
</template>

<script>
    import img from '../../../assets/img/user_img@2x.png'
    import { mapActions, mapGetters } from 'vuex'
    import config from '../../../api/config'
    export default {
        data() {
            return {
                src: img,
                orignal: config.headUrl
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
                tar.src = img
            },
            linke(){
                this.$router.push({name: 'online'})
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
            height: 100%;
            object-fit: cover;
        }
    }
    p{
        color: #ffffff;
        font-size: 0.36rem;
    }
    .phone{
        width: 0.8rem;
        height: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
            width: 0.4rem;
            height: 0.4rem;
        }
    }
}
</style>
