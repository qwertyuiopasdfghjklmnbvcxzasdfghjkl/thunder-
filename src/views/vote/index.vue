<template>
    <div class="page">
        <top-back>
        <template v-if="Number(type)===1">{{$t('vote.sbtp')}}<!-- 上币投票 --></template>
        <template v-else>{{$t('vote.ysbtp')}}<!-- 映射币投票 --></template>
        <!-- <router-link :to="{name:'voteRules', params:{type:type}}" slot="right" >{{$t('vote.voteRules')}}</router-link>投票规则 -->
        </top-back>
        <div class="page-main">
            <div class="block mt20">
                <h1 class="f32"><strong>{{$t('vote.voteRules')}}<!-- 投票规则 -->：</strong></h1>
                <ol class="mt30 lh20" v-if="$route.params.type==1">
                    <li>• {{$t('vote.rule_1_1')}}</li>
                    <li>• {{$t('vote.rule_1_2')}}</li>
                    <li>• {{$t('vote.rule_1_3')}}</li>
                    <li>• {{$t('vote.rule_1_4')}}</li>
                </ol>
                <ol class="mt30 lh20" v-else>
                    <li>• {{$t('vote.rule_2_1')}}</li>
                    <li>• {{$t('vote.rule_2_2')}}</li>
                    <li>• {{$t('vote.rule_1_3')}}</li>
                    <li>• {{$t('vote.rule_1_4')}}</li>
                </ol>
            </div>
            <ul class="pt20 vote-list">
                <router-link :to="{name:'voteDetail', params:{id:item.id}, query:{type:type}}" tag="li" v-for="(item, index) in sortedData" :key="item.id">
                    <!-- <div class="img"><img :src="orignal+item.icon"></div> -->
                    <div class="detail">
                        <p class="ellipsis f30"><strong>{{item.title}}</strong></p>
                        <p class="ft-c-lightGray mt25">{{item.startTime|dateFormat}}</p>
                    </div>
                    <div class="btn"><mt-button :type="stageClass[getStatus(item)]" size="small" class="">{{$t(stageName[getStatus(item)])}}</mt-button></div>
                </router-link>
            </ul>
            <no-data v-show="!data.length"></no-data>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import voteApi from '@/api/vote'
import Config from '@/api/config'

export default {
    name: 'shangbi',
    components: {
       
    },
    data() {
        return {
            orignal:Config.url,
            type:1,
            data:[],
            timer:0,
            serverTime:0,
            interval:null,
            stageClass:{1:'success', 2:'yellow', 3:'default',},
            stageName:{1:'ieo.status_to_start', 2:'ieo.status_processing', 3:'ieo.status_over',},
        }
    },
    computed: {
        ...mapGetters([]),
        sortedData(){
            return this.data.sort((item1, item2)=>{
                return item2.startTime > item1.startTime ? 1 : -1
            })
        }
    },
    created() {
        this.type = this.$route.query.type || 1
        this.getVoteList()
    },
    beforeDestroy() {
        this.interval && clearInterval(this.interval)
    },
    methods: {
        ...mapActions([]),
        getStatus(item){
            let status = 3, time = this.serverTime+this.timer*1000
            if(item.startTime>time){
                status = 1
            } else if(item.startTime<=time && item.closeTime>time){
                status = 2
            }
            return status
        },
        getVoteList(){
            voteApi.getVoteList(this.type, (serverTime, res)=>{
                this.serverTime = serverTime
                this.data = res
                this.interval = setInterval(()=>{this.timer++},1000)
                if(!this.data.length){
                    Tip({type:'error', message:this.$t('error_code.not_yet_open')})
                }
            }, msg=>{
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
        }
    }

}
</script>

<style lang="less" scoped="">
.vote-list {
    li {
        padding: 0.3rem 0.25rem;
        background:rgba(255,255,255,1);
        border-radius:4px;
        display: flex;
        & + li {
            margin-top: 0.2rem;
        }
        .img {
            width: 0.85rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            img {width: 0.6rem; height: 0.6rem; object-fit: cover; object-position: center; background-color: #E3E3E3; border-radius:100%; overflow: hidden; vertical-align: middle;}
        }
        .detail {
            flex:1;
        }
        .btn {
            display: flex;
            flex-direction: column;
            justify-content: center;
            /deep/ button {min-width: 1.6rem;}
        }
    }
}
</style>
