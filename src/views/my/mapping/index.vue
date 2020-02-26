<template>
  <div class="page">
    <top-back> {{$t('account.mapping_records')}}<!-- 映射记录 --> 
    </top-back>
    <div class="page-main">
      <ul class="full mt20 list bg-c-white">
        <li class="ft-c-lightGray f24">
          <span class="ui-flex-2">{{$t('account.mapping_tokens')}}<!-- 映射币种 --></span>
          <span class="ui-flex-3">{{$t('business.QUANTITY')}}<!-- 数量 --></span>
          <span class="ui-flex-2">{{$t('exchange.exchange_price')}}(USDT)<!-- 价格(USDT) --></span>
          <span class="ui-flex-3">{{$t('account.get_plf_token_quantity')}}<!-- 获得ETV数量 --></span>
        </li>
        <li v-for="item in data">
          <span>{{item.symbol}}</span>
          <span>{{item.amount}}</span>
          <span>{{item.currencyPrice}}</span>
          <span >
            <p>{{item.mappingSymbolAmount}} ETV</p>
            <p class="ft-c-lightGray f24">{{item.createdAt|dateFormat('yyyy-MM-dd')}}</p>
          </span>
        </li>
      </ul>
      <no-data v-show="!data.length"></no-data>
      
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import voteApi from '@/api/vote'
export default {
  name: 'mapping',
  components: {
     
  },
  data(){
    return {
      data:[]
    }
  },
  watch: {
      
  },
  computed: {
    ...mapGetters([]),

  },
  created(){
    this.getMappingList()
  },
  methods:{
    getMappingList(){
      voteApi.getMappingList(res=>{
          this.data = res
      }, msg=>{
          Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
      })
    },
  }
  
}
</script>

<style scoped lang="less">
.list {
  background-color: #fff;
  li {
    padding: 0 0.3rem;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    &+li {border-top: 1px solid #eee;}
    span {display: flex; flex-direction: column; justify-content: center; word-break: break-all;}
    span:last-of-type {text-align: right; line-height: 1.6;}
    span + span {margin-left: 0.1rem;}
    
  }
}
</style>
