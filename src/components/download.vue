<template>
    <div>
    <transition enter-active-class="animated short slideInDown" leave-active-class="animated short slideOutUp">
        <div class="cont" v-if="show===1">
            <span class="leftTit"><img src="../assets/logo.png"/>{{$t('public0.public212')}}</span>
            <p v-if="phone === 'ios'">
                <a href="javascript:;" class="ios" @click="showTip=true" v-if="isWeiXi || isQQ">
                    <img src="../assets/img/appleApp.png"/>
                </a>
                <a :href="'itms-services://?action=download-manifest&url='+url.appleUrl" target="_blank" class="ios" v-else>
                    <img src="../assets/img/appleApp.png"/>
                </a>
                <a :href="url.appleUrl" target="_blank" class="ios" v-else>
                    <img src="../assets/img/appleApp.png"/>
                </a>
            </p>
            <p v-else>
                <template v-if="isWeiXi || isQQ">
                <!-- <a href="javascript:;" @click="showTip=true">
                    <img src="../assets/img/googleApp.png"/>
                </a> -->
                <a href="javascript:;" @click="showTip=true">
                    <img src="../assets/img/androidApp.png"/>
                </a>
                </template>
                <template v-else>
                <!-- <a :href="url.androidUrl" target="_blank">
                    <img src="../assets/img/googleApp.png"/>
                </a> -->
                <a :href="url.androidPath" target="_blank">
                    <img src="../assets/img/androidApp.png"/>
                </a>
                </template>
            </p>
            <i v-tap="{methods:hidden}"></i>
        </div>
    </transition>
    <div class="share-layer" @click="showTip=false" v-if="showTip">
        <p class="lh20">{{$t('public0.app_share_tip').format(isWeiXi?$t('public0.public198'):$t('business.QQ'))}}</p>
    </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import api from '@/api/wallet'
    export default {
        name: "download",
        props: ['phone'],
        data() {
            return {
                show: 0,
                system: 0,
                showTip:false,
                isWeiXi: /MicroMessenger\/[0-9]/i.test(window.navigator.userAgent),
                isQQ: /QQ\/[0-9]/i.test(window.navigator.userAgent)
            }
        },
        computed: {
            ...mapGetters(['getSysParams']),
            url(){
                let _obj = {} 
                for(let item in this.getSysParams){
                    _obj[item] = this.getSysParams[item].value
                }
                return _obj
            }
        },
        mounted(){
            setTimeout(()=>{
                if(Object.keys(this.getSysParams).length){
                    this.show = 1
                    setTimeout(()=>{
                        if(this.show){
                            this.show = 0
                        }
                    },60000)
                }
            },3000)
        },
        methods: {
            hidden(){
                this.show =0
            }
        }

    }
</script>

<style scoped lang="less">
.cont{
    background: #F6F6F6;
    height: 1.2rem;
    line-height: 1rem;
    padding: 0.1rem 0.3rem;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9999;
    color: #333333;
    font-size: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    .leftTit{
        display: flex;
        align-items: center;
        img{
            width: 0.7rem;
            height: 0.7rem;
            margin-right: 0.1rem;
            border-radius:0.1rem;
        }
    }
    p{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 0.6rem;
        a{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.2rem;
            height: 0.7rem;
            background: #F6F6F6;
            border-radius:0.1rem;
            margin-left: 0.2rem;
            img{
                width: 0.4rem;
            }
        }
        .ios{
            background: #0193D2;
        }
    }
    i{
        position: absolute;
        display: inline-block;
        width: 0.8rem;
        height: 1.2rem;
        text-align: center;
        line-height: 1.2rem;
        font-style: normal;
        right: 0;
        top: 0;
        background: url("../assets/img/off_blank.png") no-repeat center;
        background-size: 0.18rem;
    }
}
.share-layer {position: fixed; left: 0; top: 0; right: 0; bottom: 0; color: #fff; z-index: 99999999; background:url('../assets/img/share.png') rgba(0,0,0,.5) no-repeat right top; background-size: 7.5rem auto;}
.share-layer p { position: absolute; left: 0.6rem; right: 0.6rem; top: 40%; text-align: center; font-size: 0.32rem; color: #fff; }
</style>
