<template>
  <div class="page">
    <top-back>{{$t('account.my_stake')}} <!-- 我的锁仓 --> 
      <router-link slot="right" :to="{name:'mappingRecords'}" tag="span">{{$t('account.mapping_records')}}<!-- 映射记录 --></router-link>
    </top-back>
    <div class="page-main" id="scroll">
      <div class="full pl30 pr30 mt20 f24 lh18">
        <p class="f30"><strong>{{$t('public0.tip')}}<!-- 提示 -->：</strong></p>
        <ol class="stake-tip">
          <li>{{$t('account.my_stake_tip1')}}</li>
          <li>{{$t('account.my_stake_tip2')}}</li>
          <li>{{$t('account.my_stake_tip3')}}</li>
          <li>{{$t('account.my_stake_tip4')}}</li>
        </ol>
      </div>
      <ul class="full mt20 list bg-c-white">
        <li class="ft-c-lightGray">
          <span>{{$t('exchange.exchange_date')}}<!--时间--></span>
          <span>{{$t('business.QUANTITY')}}<!-- 数量 --></span>
          <span>{{$t('business.STATUS')}}<!-- 状态 --></span>
        </li>
        <li v-for="(item, index) in data" :key="index">
          <span>{{item.createAt|dateFormat('yyyy-MM-dd')}}</span>
          <span>{{toFixed(item.amount) | removeEndZero}} {{item.symbol}}</span>
          <span :class="[statusClass[item.status]]">{{$t(statusName[item.status])}}</span>
        </li>
      </ul>
      <no-data v-show="!data.length"></no-data>
      
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import wallet from '@/api/wallet'
import numUtils from '@/assets/js/numberUtils'
export default {
  name: 'stake',
  components: {
     
  },
  data(){
    return {
      loadLock:false,
      data:[],
      statusClass:{'-1':'failure', '0':'wait', '1':'success'},
      statusName:{'-1':'account.released_invalid', '0':'account.released_wait', '1':'account.released_to_date'},
      params: {
        page: 1,
        show: 20,
        total: 0,
        token:'',
        period:180,
        status:'',
      },
    }
  },
  watch: {
      
  },
  computed: {
    ...mapGetters([]),
    paramsChange () {
      return {
        page: this.params.page,
        pageSize: this.params.show,
        symbol: this.params.token,
        time: this.params.period+'days',
        status: this.params.status
      }
    },
    totalPage(){
      return Math.ceil(this.params.total/this.params.show) || 1
    }
  },
  watch:{
    paramsChange () {
      this.findStakingRecords()
    },
  },
  created(){
    this.findStakingRecords()
    this.$nextTick(()=>{
      this.loadMoreInit()
    })
  },
  methods:{
    loadMoreInit(){ //加载更多
      var self = this
      $('#scroll').scroll(function() {
          //当时滚动条离底部半屏高时开始加载下一页的内容
          if(($(this)[0].scrollTop + $(this).height() + window.innerHeight/1.5) >= $(this)[0].scrollHeight) {
            if (self.totalPage>self.params.page && !self.loadLock) {
              self.params.page += 1
            }
          }
      });
    },
    findStakingRecords () { // 获取锁仓记录
      this.loadLock = true
      wallet.findStakingRecords(this.paramsChange, (total, data) => {
        data.forEach(item=>{
          item.createAt = utils.formatDate(item.createAt).getTime()
        })
        this.loadLock = false
        this.data = this.data.concat(data)
        this.params.total = total
      }, (msg) => {
        this.loadLock = false
        Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
      })
    },
    toFixed (v1) {
      return numUtils.BN(v1).toFixed(8)
    }
  }
  
}
</script>

<style scoped lang="less">
.list {
  background-color: #fff;
  li {
    padding: 0 0.3rem;
    line-height: 0.9rem;
    display: flex;
    justify-content: space-between;
    &+li {border-top: 1px solid #eee;}
    .success {color: #01DFAD;}
    .wait {color: #EB5869;}
    .failure {color: #CCCCCC;}
    
  }
}
.stake-tip {
  padding-left: 0.3rem;
  li {list-style-type: decimal; }
}
</style>
