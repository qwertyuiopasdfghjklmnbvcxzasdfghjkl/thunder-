<template>
    <div class="page">
        <top-back>
            {{$t('account.history_staked')}}
        </top-back>
        <div class="tab-bar">
            <mt-navbar v-model="label">
              <mt-tab-item :id="1"><span>{{$t('ieo.status_processing')}}<!--进行中--></span></mt-tab-item>
              <mt-tab-item :id="2"><span>{{$t('ieo.status_over')}}<!--已结束--></span></mt-tab-item>
            </mt-navbar>
        </div>
        <div class="page-main">
            <transition enter-active-class="animated short slideInLeft" leave-active-class="animated short slideOutLeft">
            <hoc ref="hoc1" @getData="getOnData" :params="paramsOn" size="large" v-show="label==1">
                <mt-loadmore
                :top-method="loadTopOn"
                :top-pull-text="$t('home.top-pull-text')"
                :top-drop-text="$t('home.drop-text')"
                :top-loading-text="$t('home.loading-text')"
                :bottom-method="loadBottomOn"
                :bottom-all-loaded="allLoadedOn"
                :bottom-pull-text="$t('public0.loadmore')+'...'"
                :bottom-drop-text="$t('home.drop-text')"
                :bottom-loading-text="$t('home.loading-text')"
                :autoFill="false"
                ref="loadmore">
                    <ul class="items">
                        <router-link :to="{name:'stakedDetail', query:item}" tag="li" v-for="item in datasOn">
                            <div class="full pl30 pr30 bline ui-flex ui-flex-justify">
                                <span class="f32">{{$t('incubation.incubation_days').format(item.lockDays)}}<!-- {0}天孵息 --></span>
                                <span class="green">{{$t('ieo.status_processing')}}<!-- 进行中 --></span>
                            </div>
                            <div class="ui-flex ui-flex-justify">
                                <span class="f32 cgray">{{$t('incubation.incubation_amount')}}<!-- 孵息数量 --></span>
                                <span class="f32">{{item.lockAmount}} {{item.symbol}}</span>
                            </div>
                            <div class="ui-flex ui-flex-justify">
                                <span class="f32 cgray">{{$t('incubation.incubation_release')}}<!-- 孵息释放 --></span>
                                <span class="f32">{{item.incomeAmount}} {{item.symbol}}</span>
                            </div>
                            <div class="ui-flex ui-flex-justify">
                                <span class="f32 cgray">{{$t('referral.start_date')}}<!-- 开始时间 --></span>
                                <span class="f32">{{item.createdAt.split(' ')[0]}}</span>
                            </div>
                        </router-link>
                    </ul>
                    <noMoreData v-if="allLoadedOn"/>
                    <noData v-if="!datasOn.length"/>
                </mt-loadmore>
            </hoc>
            </transition>
            <transition enter-active-class="animated short slideInRight" leave-active-class="animated short slideOutRight">
            <hoc ref="hoc2" @getData="getOffData" :params="paramsOff" size="large" v-show="label==2">
                <mt-loadmore
                :top-method="loadTopOff"
                :top-pull-text="$t('home.top-pull-text')"
                :top-drop-text="$t('home.drop-text')"
                :top-loading-text="$t('home.loading-text')"
                :bottom-method="loadBottomOff"
                :bottom-all-loaded="allLoadedOff"
                :bottom-pull-text="$t('public0.loadmore')+'...'"
                :bottom-drop-text="$t('home.drop-text')"
                :bottom-loading-text="$t('home.loading-text')"
                :autoFill="false"
                ref="loadmore">
                    <ul class="items">
                        <router-link :to="{name:'stakedDetail', query:item}" tag="li" v-for="item in datasOff">
                            <div class="full pl30 pr30 bline ui-flex ui-flex-justify">
                                <span class="f32">{{$t('incubation.incubation_days').format(item.lockDays)}}<!-- {0}天孵息 --></span>
                                <span class="red">{{$t('otc_ad.otc_ad_completed')}}<!--已完成--></span>
                            </div>
                            <div class="ui-flex ui-flex-justify">
                                <span class="f32 cgray">{{$t('incubation.incubation_amount')}}<!-- 孵息数量 --></span>
                                <span class="f32">{{item.lockAmount}} {{item.symbol}}</span>
                            </div>
                            <div class="ui-flex ui-flex-justify">
                                <span class="f32 cgray">{{$t('incubation.incubation_release')}}<!-- 孵息释放 --></span>
                                <span class="f32">{{item.incomeAmount}} {{item.symbol}}</span>
                            </div>
                            <div class="ui-flex ui-flex-justify">
                                <span class="f32 cgray">{{$t('referral.start_date')}}<!-- 开始时间 --></span>
                                <span class="f32">{{item.createdAt.split(' ')[0]}}</span>
                            </div>
                            <div class="ui-flex ui-flex-justify">
                                <span class="f32 cgray">{{$t('referral.end_date')}}<!-- 结束时间 --></span>
                                <span class="f32">{{item.endDate && item.endDate.split(' ')[0] || '--'}}</span>
                            </div>
                        </router-link>
                    </ul>
                    <noMoreData v-if="allLoadedOff"/>
                    <noData v-if="!datasOff.length"/>
                </mt-loadmore>
            </hoc>
            </transition>
        </div>
    </div>
</template>

<script>
import Hoc from '@/components/common/hoc'
import incubationApi from '@/api/incubation'
import noMoreData from '@/components/common/noMoreData'

const _request = (params) => {
    return new Promise((r,j) => {
      incubationApi.financesRecordList(params,(data, total)=>{
        r({data, total})
      },(msg,res)=>{
        j(res)
      })
    })
}
let hoc = new Hoc(null, _request)

export default {
    name: "staked_history",
    components: {
        noMoreData,
        hoc,
    },
    data() {
        return {
            label:1,
            paramsOn:{
                status:1,
                page:1,
                size:10,
                totalPage:1,
            },
            paramsOff:{
                status:2,
                page:1,
                size:10,
                totalPage:1,
            },
            datasOn:[],
            datasOff:[],
            allLoadedOn:false,
            allLoadedOff:false,
        }
    },
    methods: {
        getOnData(data){
            this.datasOn = data.data
            this.paramsOn.totalPage = Math.ceil(data.total/this.paramsOn.size)
        },
        getOffData(data){
            this.datasOff = data.data
            this.paramsOff.totalPage = Math.ceil(data.total/this.paramsOff.size)
        },
        async loadTopOn(){
            let res = await _request(this.paramsOn)
            this.getOnData(res)
            this.$refs.hoc1.$refs.loadmore.onTopLoaded()
        },
        async loadTopOff(){
            let res = await _request(this.paramsOff)
            this.getOffData(res)
            this.$refs.hoc2.$refs.loadmore.onTopLoaded()
        },
        async loadBottomOn(){
            this.paramsOn.page += 1
            let res = await _request(this.paramsOn)
            this.getOnData(res)
            if(this.paramsOn.totalPage == 1){
              this.allLoadedOn = true // if all data are loaded
            }
            this.$refs.hoc1.$refs.loadmore.onBottomLoaded()
        },
        async loadBottomOff(){
            this.paramsOff.page += 1
            let res = await _request(this.paramsOff)
            this.getOnData(res)
            if(this.paramsOff.totalPage == 1){
              this.allLoadedOff = true // if all data are loaded
            }
            this.$refs.hoc2.$refs.loadmore.onBottomLoaded()
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
.page-main {top: 1.86rem;}
.tab-bar {
    margin-top: 0.9rem;
    /deep/ .mint-navbar {border-bottom: 1px solid #131e30; background-color: #131e30;}
    /deep/ .mint-tab-item {
        height: 0.9rem;
        color: #6C6F8B;
        padding: 0;
        &.is-selected {
            color: #0067e7; border-bottom: none; margin-bottom: 0;
            .mint-tab-item-label span{
                padding: 0 0.3rem;
                border-bottom: 2px solid #0067e7;
                margin-bottom: -2px;
            }
        }
        .mint-tab-item-label {
            font-size: 0.3rem;
            line-height: 0.9rem;
            span {display: inline-block; height: 100%;}
        }
    }
}
/deep/ .mint-loadmore {position:absolute; left: -0.3rem; right: -0.3rem;}
.items li{
    background-color: #151C2C;
    padding: 0.1rem 0.3rem 0.2rem;
    margin-top: 0.2rem;
    line-height: 0.75rem;
    .bline {
        border-bottom:1px solid #1D273C;
    }
}
</style>
