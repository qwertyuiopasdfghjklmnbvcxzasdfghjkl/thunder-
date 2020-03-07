<template>
    <div class="page">
        <top-back>{{$t('user.about')}}Thunder</top-back>
        <div class="page-main">
            <div class="full">
                <div class="logo" @click="showConsole">
                    <img src="../../../assets/img/about_logo.png"/>
                    <p>Thunder PRO<span>  {{getVersion}}</span></p>
                </div>
                <!-- <rail-bar :item="data1"></rail-bar> -->
                <rail-bar class="mt20" :item="data2" v-if="isApp"></rail-bar>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import railBar from '@/components/RailBar'
import { MessageBox } from 'mint-ui'
import marketApi from '@/api/market'
import VConsole   from 'vconsole'
export default {
    components: {
        railBar
    },
    data() {
        return {
            taps:0,
            vConsole:null,
            data1:{
                route: 'about-bar',
                name: this.$t('account.user_center_contact'),
            },
            data2:{
                name: `${this.$t('update.checkUpdate')} <i class="icon-help ft-c-main"></i>`,
                rightIcon:true,
                disabled:true,
                action:''
            },
        }
    },
    computed:{
        ...mapGetters(['getVersion']),
        isApp(){
            return window['cordova']
        }
    },
    created(){
      this.data2.action = this.checkUpdate
    },
    methods:{
        ...mapActions(['setSysParams']),
        checkUpdate(){
          // 检测更新
          marketApi.rateSysparams(res=>{
            let params = {}
            for(let item of res){
              params[item.code] = item
            }
            this.setSysParams(params)
            this.$parent.$parent.$refs.update.getLatestVersion(true) //检测全量更新
          })
        },
        showConsole(event) { //激活、隐藏调试器
          this.taps += 1
          if(!this.vConsole && this.taps>=5){
            this.vConsole = new VConsole()
          }
        },
        checkVersion(){
          // 检测全量更新
          this.$parent.$refs.update.getLatestVersion(true)
        }
    }
}
</script>

<style scoped lang="less">
    .logo{
        text-align: center;
        margin-top: 1rem;
        margin-bottom: 0.8rem;
        img{
            height: 1.8rem;
        }
        p{
            padding: 0.3rem;
            font-size: 0.32rem;
            color: #4B5875;
        }
    }
    .foot{
        text-align: center;
        position: fixed;
        bottom: 0.4rem;
        left: 0;
        width: 100vw;
        color: #787b7b;
        p{
            line-height: 0.6rem;
        }
        small{
            line-height: 0.4rem;
            font-size: 0.2rem;
        }
    }
    .bar{
        background: #151C2C;
    }
</style>
