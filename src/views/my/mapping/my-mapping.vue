<template>
  <div class="page">
    <top-back>{{$t('account.my_mapping')}}<!-- 我的映射 --></top-back>
    <div class="page-main">
      <ul class="full mt20 top">
        <li>
          <span><strong><!-- 我的地址 -->{{$t('account.my_address')}}:</strong></span>
          <span class="ft-c-lightGray">{{info.txid && info.address || '--'}}</span>
        </li>
        <li>
          <span><strong><!-- 映射Txid -->{{$t('account.mapping_txid')}}:</strong></span>
          <span class="ft-c-lightGray">{{info.txid || '--'}}</span>
        </li>
        <li>
          <span><strong><!-- 映射时间 -->{{$t('account.mapping_time')}}:</strong></span>
          <span class="ft-c-lightGray">{{info.txid && info.maptime ? new Date(Number(info.maptime)).format() : '--'}}</span>
        </li>
      </ul>
      <div class="full mt20 rules">
        <h1 class="f32 tc"><strong>{{$t('business.ACTIVITY_RULES')}}<!-- 活动规则 --></strong></h1>
        <ol class="mt20 lh20">
            <li>• {{$t('vote.rule_3_1')}}</li>
            <li>• {{$t('vote.rule_3_2')}}</li>
            <li>• {{$t('vote.rule_3_3')}}</li>
            <li>• {{$t('vote.rule_3_4')}}</li>
        </ol>
      </div>
      <div class="full mt20 bottom">
        <p>{{$t('account.support_mapping_tokens')}}<!-- 支持的映射币种 --></p>
        <ul class="f30">
          <li class="ft-c-lightGray f26">
            <span>{{$t('trade_record.trade_record_currency')}}<!-- 币种 --></span>
            <span>{{$t('account.symbol_type')}}<!-- 公链 --></span>
            <span>{{$t('account.contract_address')}}<!-- 合约地址 --></span>
            <span></span>
          </li>
          <li v-for="item in tokens">
            <span>{{item.symbol}}</span>
            <span>{{item.symbolType}}</span>
            <span class="f24 ellipsis">{{item.contractAddress|encrypt(12,12)}}</span>
            
          </li>
        </ul>
      </div>
    </div>
    <div class="mapbtn">
      <mt-button type="primary" size="large" v-tap="{methods:$root.routeTo, to:'toMap'}">{{$t('account.to_mapping')}}<!-- 我要映射 --></mt-button>
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
      info:{},
      tokens:[]
    }
  },
  watch: {
      
  },
  computed: {
    ...mapGetters(['getUserWallets']),

  },
  created(){
    this.getMyMapping()
    this.getMappingSymbolList()
  },
  methods:{
    getTokenImg(token){
        let _img = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBMDAwNTBFQTE1QkIxMUVBOUFBOUMzMTQ5NzQ1MDQ5MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBMDAwNTBFQjE1QkIxMUVBOUFBOUMzMTQ5NzQ1MDQ5MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkEwMDA1MEU4MTVCQjExRUE5QUE5QzMxNDk3NDUwNDkzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkEwMDA1MEU5MTVCQjExRUE5QUE5QzMxNDk3NDUwNDkzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+3nE3gQAAAKRJREFUeNrs0QENAAAIwzDAv+djg5BOwtpJSncaC4AICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAAERABASIgQATkeyvAAPvNA8UTegMeAAAAAElFTkSuQmCC'
        
        for(let item of this.getUserWallets){
            if(item.symbol === token){
               _img =  item.iconBase64
               break
            }
        }
        return `data:image/png;base64,${_img}`
    },
    getMyMapping(){
      voteApi.getMyMapping(res=>{
          this.info = res
      }, msg=>{
          Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
      })
    },
    getMappingSymbolList(){
      voteApi.getMappingSymbolList(res=>{
          this.tokens = res
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
.page-main {bottom: 0.9rem;}
.mapbtn {position: absolute; bottom: 0; left: 0; right: 0; .mint-button {border-radius: 0;}}
.top {
  background-color: #fff;
  padding: 0.4rem 0.3rem;
  li {display: flex; &+li {margin-top: 0.3rem;}}
  span {word-break: break-all;}
  span:first-of-type { width: 1.5rem; }
  span:last-of-type { flex: 1; margin-left: 0.2rem;}
}
.rules {padding: 0.3rem; background-color: #fff;}
.bottom {
  background-color: #fff;
  p {line-height:  0.9rem; padding-left: 0.3rem; padding-right: 0.3rem;}
  ul li {
    padding: 0 0.3rem;
    line-height: 0.9rem;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eee;
    &+li {line-height: 1.2rem;}
    span:nth-of-type(1) {width: 1.3rem;}
    span:nth-of-type(2) {width: 1.3rem;}
    span:nth-of-type(3) {flex: 1;}
    span:nth-of-type(4) {width: 0.4rem; margin-left: 0.3rem;}
    .icon_token {width: 0.6rem; height: 1.2rem; margin-right: 0.2rem; object-fit: contain;}
    .icon_copy {width: 0.4rem; height: 100%; background-image: url('../../../assets/img/copy.png'); background-position: center;}
  }
}
</style>
