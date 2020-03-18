<template>
    <div class="download">
        <div class="banner1">
            <div class="content">
                <div style="height: 50px;"></div>
                <h1 class="title1">{{$t('public0.public285')}}</h1>
                <h3 class="title2">{{$t('public0.public286')}}</h3>
                <div class="buttons" v-if="isWeiXi">
                    <a class="button" @click="showTip" v-if="android">
                        <!--安卓下载-->
                        {{$t('public0.public226')}}
                    </a>
                    <a class="button" @click="showTip" v-if="apple">
                        <!--IOS下载-->
                        {{$t('public0.public227')}}
                    </a>
                </div>
                <div class="buttons" v-if="!isWeiXi">
                    <div class="qrcode" ref="qrcode_apk" v-show="android"></div>
                    <a class="button" :class="{en:getLang=='en'}" :href="android" target="_blank" v-if="android">
                        <!--安卓下载-->
                        <img src="../assets/images/download/android.png">{{$t('public0.public226')}}
                    </a>
                    <div class="qrcode" ref="qrcode_ios" v-show="apple"></div>
                    <a class="button" :class="{en:getLang=='en'}" :href="apple" target="_blank" v-if="apple">
                        <!--IOS下载-->
                        <img src="../assets/images/download/iphone.png">{{$t('public0.public227')}}
                    </a>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Vue from 'vue'
import {mapGetters} from 'vuex'
import utils from '@/assets/js/utils'
import config from '@/assets/js/config'
import market from '@/api/market'
export default {
  data () {
    return {
      android:'',
      apple:'',
      isWeiXi: /MicroMessenger/i.test(window.navigator.userAgent),
      ios:'https://www.pgyer.com/eS28'
    }
  },
  computed: {
    ...mapGetters(['getLang']),
  },
  created(){
    this.getrateSysparams()
  },
  watch:{
    android(_new){
      if(_new){
        this.initAndroidQr()
      }
    },
    apple(_new){
      if(_new){
        this.initAppleQr()
      }
    }
  },
  methods: {
    initAndroidQr(){
      utils.qrcode(this.$refs.qrcode_apk, {
        text: this.android,
        width: 150,
        height: 150
      })
    },
    initAppleQr(){
      utils.qrcode(this.$refs.qrcode_ios, {
        text: this.apple,
        width: 150,
        height: 150
      })
    },
    getrateSysparams () {
      market.rateSysparams((res) => {
        res.forEach((item) => {
          if (item.code === 'androidUrl') {
            this.android = item.value
          }
          if (item.code === 'appleUrl') {
            this.apple = item.value
          }
        })
      })
    },
    showTip () {
      Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public213')})
    },
    showTip2 () {
      Vue.$confirmDialog({content: 'Coming soon', showCancel: false})
    }
  }
}
</script>

<style scoped>
.qrcode {width: 320px; margin-top: 20px;}
.qrcode /deep/ img {margin-left: auto; margin-right: auto; border: 10px solid #fff;}
.download{min-width:1200px;width:100%; height: calc(100% - 70px);display:flex;flex-direction:column;align-items:center; background:url(../assets/images/download/bg.jpg) #010A1E no-repeat center;background-size:cover;}
@media screen and (max-width: 1600px) {
  .download {height: calc(100% - 60px);}
}
.download .banner1{
    min-width:1200px;width:100%;position: relative;display:flex;align-items:center;justify-content:center;
    
}
.download .banner1 .content{min-width:1200px;}
.download .banner1 .content .title1{font-size:50px;font-weight:bold;color:#fff;}
.download .banner1 .content .title2{font-size:28px;font-weight:normal;color:#CCCCCC;line-height:73px;}
.download .banner1 .content .buttons .button{
    display: block; text-align: center; width:320px;height:70px; line-height: 70px; cursor: pointer; color:#FFF;font-size:24px; background-color: rgba(4,114,233,0.6); border-radius: 4px; margin-top: 30px;
}
.download .banner1 .content .buttons .button img{ vertical-align: middle; margin-right: 20px; }
.download .banner1 .content .buttons .button.en{font-size:18px;}
.download .tips{position: relative;display:flex;justify-content:center;}
.download .tips img{width:100%;}
.download .tips p{
    height:100%;position:absolute;display:flex;align-items:center;top:0px;width:1200px;
    font-size:27px;color:#010101;font-weight:bold;
}
</style>
