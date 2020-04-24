<template>
    <div class="page">
        <top-back>
            {{$t('incubation.incubation_record')}}
        </top-back>
        <div class="page-main">
            <hoc ref="hoc" @getData="getData" :params="params" size="large">
                <mt-loadmore
                :top-method="loadTop"
                :top-pull-text="$t('home.top-pull-text')"
                :top-drop-text="$t('home.drop-text')"
                :top-loading-text="$t('home.loading-text')"
                :bottom-method="loadBottom"
                :bottom-all-loaded="allLoaded"
                :bottom-pull-text="$t('public0.loadmore')+'...'"
                :bottom-drop-text="$t('home.drop-text')"
                :bottom-loading-text="$t('home.loading-text')"
                :autoFill="false"
                ref="loadmore">
                    <ul class="items mt20">
                        <router-link :to="{name:'stakedTransDetail', query:item}" tag="li" v-for="item in datas">
                            <p class="cgray f24">{{$t(`incubation.distribute_type_${item.distributeType}`)}} <!-- '1':'孵息收益', '2':'本金释放', '3':'认证奖励', '4':'业绩奖励' --></p>
                            <div class="ui-flex ui-flex-justify f28">
                                <span>{{item.createdAt}}</span>
                                <span>{{item.distributeAmount}} {{item.symbol}}</span>
                            </div>
                        </router-link>
                    </ul>
                    <noMoreData v-if="allLoaded"/>
                    <noData v-if="!datas.length"/>
                </mt-loadmore>
            </hoc>
        </div>
    </div>
</template>

<script>
import Hoc from '@/components/common/hoc'
import incubationApi from '@/api/incubation'
import noMoreData from '@/components/common/noMoreData'

const _request = (params) => {
    return new Promise((r,j) => {
      incubationApi.distributeRecord(params,(data, total)=>{
        r({data, total})
      },(msg,res)=>{
        j(res)
      })
    })
}
let hoc = new Hoc(null, _request)

export default {
    name: "incubation_history",
    components: {
        noMoreData,
        hoc,
    },
    data() {
        return {
            params:{
                orderId:null,
                page:1,
                size:20,
                totalPage:1,
            },
            datas:[],
            allLoaded:false,
        }
    },
    methods: {
        getData(data){
            this.datas = data.data
            this.params.totalPage = Math.ceil(data.total/this.params.size)
        },
        async loadTop(){
            let res = await _request(this.params)
            this.getData(res)
            this.$refs.hoc.$refs.loadmore.onTopLoaded()
        },
        async loadBottom(){
            this.params.page += 1
            let res = await _request(this.params)
            this.getData(res)
            if(this.params.totalPage == 1){
              this.allLoaded = true // if all data are loaded
            }
            this.$refs.hoc.$refs.loadmore.onBottomLoaded()
        },
    }
}
</script>

<style scoped lang="less">
@green:#0FB475;
@cgray:#4B5875;
@red:#E11B39;
.green {color: @green;}
.cgray {color: @cgray;}
.red {color: @red;}
.items li{
    line-height: 0.6rem;
    border-bottom:1px solid #1D273C;
}
</style>
