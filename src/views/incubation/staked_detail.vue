<template>
    <div class="page">
        <top-back>
            {{$t('public0.detail')}}<!-- 详情 -->
        </top-back>
        <div class="page-main">
            <div class="mt20 full bgblock pl30 pr30 pb40">
                <div class="pt50 tc f60">{{info.incomeAmount}}</div>
                <div class="mt10 tc f24 cgray">{{$t('incubation.total_release')}}<!-- 总释放 --> {{info.symbol}}</div>
                <div class="mt60 ui-flex ui-flex-justify">
                    <span class="f32 cgray">{{$t('incubation.incubation_amount')}}<!-- 孵息数量 --></span>
                    <span class="f32">{{info.lockAmount}} {{info.symbol}}</span>
                </div>
                <div class="mt50 ui-flex ui-flex-justify">
                    <span class="f32 cgray">{{$t('incubation.lock_period')}}<!-- 锁仓期限 --></span>
                    <span class="f32">{{info.lockDays}}{{$t('exchange.exchange_day')}}<!-- 天 --></span>
                </div>
                <div class="mt50 ui-flex ui-flex-justify">
                    <span class="f32 cgray">{{$t('referral.start_date')}}<!-- 开始时间 --></span>
                    <span class="f32">{{info.createdAt.split(' ')[0]}}</span>
                </div>
                <div class="mt50 ui-flex ui-flex-justify">
                    <span class="f32 cgray">{{$t('exchange.exchange_status')}}<!-- 状态 --></span>
                    <span class="f32 green" v-if="info.status==1">{{$t('ieo.status_processing')}}<!--进行中--></span>
                    <span class="f32 red" v-else>{{$t('ieo.status_over')}}<!--已结束--></span>
                </div>
            </div>
            <hoc @getData="getData" :params="params" size="large">
                <div class="mt20 full bgblock pl30 pr30 pt30 pb40">
                    <div class="f32">{{$t('incubation.release_record')}}<!-- 释放记录 --></div>
                    <ul class="items mt20">
                        <router-link :to="{name:'stakedTransDetail', query:item}" tag="li" v-for="item in data">
                            <p class="cgray f24">{{$t(`incubation.distribute_type_${item.distributeType}`)}} <!-- '1':'孵息收益', '2':'本金释放', '3':'认证奖励', '4':'业绩奖励' --></p>
                            <div class="ui-flex ui-flex-justify f28">
                                <span>{{item.createdAt}}</span>
                                <span>{{item.distributeAmount}} {{item.symbol}}</span>
                            </div>
                        </router-link>
                    </ul>
                    <noData v-if="!data.length"/>
                </div>
            </hoc>
        </div>
    </div>
</template>

<script>
import incubationApi from '@/api/incubation'
import Hoc from '@/components/common/hoc'

const _req = (params) => {
    return new Promise((r,j) => {
      incubationApi.distributeRecord(params,(data, total)=>{
        r({data, total})
      },(msg,res)=>{
        j(res)
      })
    })
}
let hoc = new Hoc(null, _req)
export default {
    name: "staked_history_detail",
    components: {
        hoc,
    },
    data() {
        return {
            params:{
                page:1,
                size:9999,
                orderId:null
            },
            info:{},
            data:[],
        }
    },
    created() {
        this.info = this.$route.query
        this.params.orderId = this.info.orderId
    },
    methods: {
        getData(res){
            this.data = res.data
        }
    }
}
</script>

<style scoped lang="less">
@green:#0FB475;
@red:#E11B39;
@cgray:#4B5875;
.green {color: @green;}
.cgray {color: @cgray;}
.red {color: @red;}

.bgblock {background-color: #151C2C;}
.items li{
    line-height: 0.6rem;
    border-bottom:1px solid #1D273C;
}
</style>
