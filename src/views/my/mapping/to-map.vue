<template>
  <div class="page">
    <top-back> {{$t('account.to_mapping')}}<!-- 我要映射 --> </top-back>
    <div class="page-main">
      <div class="full mt20 top f30">
        <p><strong>{{$t('account.to_mapping_address')}}<!-- 请向此地址 -->:</strong></p>
        <div class="ui-flex mt20">
          <p class="ui-flex-1 address f24">{{info.address}}&nbsp;</p>
          <span class="icon_copy ml30" 
              v-clipboard:copy="info.address"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"></span>
        </div>
        <div class="line mt30"></div>
        <div class="mt20"><strong>{{$t('public0.public161')}}:<!-- 发送 --></strong></div>
        <div class="ui-flex mt20">
          <span class="ui-flex-2 ui-flex ui-flex-column ui-flex-center"><strong>ETH{{$t('exchange.exchange_amount')}}：<!-- 数量 --></strong></span>
          <p class="ui-flex-3 address lh50 tc">{{info.ethamount}}</p>
          <span class="ml25 lh90">ETH</span>
        </div>
        <div class="ui-flex mt30">
          <span class="ui-flex-2 ui-flex ui-flex-column ui-flex-center"><strong>{{$t('account.hexadecimal_data')}}<!-- 十六进制数据 -->：</strong></span>
          <p class="ui-flex-3 address lh50 tc">{{info.hex}}&nbsp;</p>
          <span class="icon_copy ml30" 
              v-clipboard:copy="info.hex"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"></span>
        </div>
        <div class="line mt30"></div>
        <p class="lh19 f28 mt30">
        <strong>{{$t('public0.tip')}}<!-- 提示 --></strong><br />
        *{{$t('vote.to_mapping_tip_1')}}<!-- Imtoken  点解高级选项 --> <br />
        *{{$t('vote.to_mapping_tip_2')}}<!-- Gas Price 输入10 --> <br />
        *{{$t('vote.to_mapping_tip_3')}}<!-- Gas 输入22000 --> <br />
        *{{$t('vote.to_mapping_tip_4')}}<!-- 十六进制数据输入上面显示的加粗内容 -->
      </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import {Toast} from 'mint-ui'
import voteApi from '@/api/vote'
export default {
  name: 'mapping',
  components: {
     
  },
  data(){
    return {
      info:{}
    }
  },
  watch: {
      
  },
  computed: {
    ...mapGetters(['getLang']),

  },
  created(){
    this.getMappingAddress()
  },
  methods:{
    getMappingAddress(){
      voteApi.getMappingAddress(res=>{
          this.info = res
      }, msg=>{
          Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
      })
    },
    onCopy: function (e) {
        Toast(this.$t('public0.public33')) // 复制成功
    },
    onError: function (e) {
        Toast(this.$t('home.copy-error')) // 复制失败
    },
  }
  
}
</script>

<style scoped lang="less">
.top {
  background-color: #fff;
  padding: 0.3rem;
}
.icon_copy {width: 0.4rem;background-image: url('../../../assets/img/copy.png'); background-position: center;}
.address {
  background-color: #F6F6F6; padding: 0.2rem 0.3rem; word-break: break-all; 
}
.line {border-top: 1px solid #eee;}
.lh90 {line-height: 0.9rem;}
.lh50 {line-height: 0.5rem;}
</style>
