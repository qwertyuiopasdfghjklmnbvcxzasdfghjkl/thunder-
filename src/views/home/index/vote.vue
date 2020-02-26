<template>
    <div class="ui-flex ui-flex-justify votes">
        <router-link :to="{name:'vote', query:{type:1}}" class="ui-flex-1 sb" tag="div">
            <p header>
                <img class="icon" src="../../../assets/img/icon_vote_sb.png">
                <span class="ml20 title"><strong>{{$t('vote.tpsb')}}<!-- 投票上币 --></strong></span>
                <img class="arrow" src="../../../assets/img/i_rig_w@3x.png">
            </p>
            <p class="mt10 f20 desc">{{$t('vote.title_tpsb')}}<!-- 为您支持的币种投票上币 --></p>
            <p class="mt5 f20 desc" v-if="countDown1">{{$t('vote.count_down')}}：<!--倒计时--></p>
            <p :class="[countDown1?'mt5':'mt40']">{{countDown1?countDown1:$t('vote.coming_soon')}}</p>
            <p class="mt8" v-if="countDown1"><mt-button type="primary" class="minix circle" >{{$t('business.ENJOY')}}<!-- 立即参与 --></mt-button></p>
        </router-link>
        <router-link  :to="{name:'vote', query:{type:2}}" class="ui-flex-1 ml30 ys" tag="div">
            <p header>
                <img class="icon" src="../../../assets/img/icon_vote_ys.png">
                <span class="ml20 title"><strong>{{$t('vote.tpys')}}<!-- 投票映射 --></strong></span>
                <img class="arrow" src="../../../assets/img/i_rig_w@3x.png">
            </p>
            <p class="mt10 f20 desc">{{$t('vote.title_tpys')}}<!-- 为您支持的币种投票映射 --></p>
            <p class="mt5 f20 desc" v-if="countDown2">{{$t('vote.count_down')}}<!--倒计时--></p>
            <p :class="[countDown2?'mt5':'mt40']">{{countDown2?countDown2:$t('vote.coming_soon')}}</p>
            <p class="mt8" v-if="countDown2"><mt-button type="white" class="minix circle" >{{$t('business.ENJOY')}}<!-- 立即参与 --></mt-button></p>
        </router-link>
    </div>
</template>

<script>
import voteApi from '@/api/vote'
export default {
    data(){
        return {
            interval:null,
            timer:0,
            serverTime:0,
            data1:[],
            data2:[]
        }
    },
    created(){
        this.getVoteList()
    },
    beforeDestroy() {
        this.interval && clearInterval(this.interval)
    },
    computed:{
        countDown1(){
            let _rst = false, _start=[], _processing=[]
            this.data1.forEach(item=>{
                switch(this.getStatus(item)){
                    case 1:
                        _start.push(item)
                        break
                    case 2:
                        _processing.push(item)
                        break
                }
            })
            if(_processing.length){
                _rst = this.getCountDown(_processing[0],2)
            } else if(_start.length){
                _rst = this.getCountDown(_start[0],1)
            }
            return _rst
        },
        countDown2(){
            let _rst = false, _start=[], _processing=[]
            this.data2.forEach(item=>{
                switch(this.getStatus(item)){
                    case 1:
                        _start.push(item)
                        break
                    case 2:
                        _processing.push(item)
                        break
                }
            })
            if(_processing.length){
                _rst = this.getCountDown(_processing[0],2)
            } else if(_start.length){
                _rst = this.getCountDown(_start[0],1)
            }
            return _rst
        },
    },
    methods:{
        getVoteList(){
            voteApi.getVoteList(1, (serverTime, res)=>{
                this.serverTime = serverTime
                this.data1 = res
                if(!this.interval){
                    this.interval = setInterval(()=>{this.timer++},1000)
                }
            }, msg=>{
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
            voteApi.getVoteList(2, (serverTime, res)=>{
                this.serverTime = serverTime
                this.data2 = res
                if(!this.interval){
                    this.interval = setInterval(()=>{this.timer++},1000)
                }
            }, msg=>{
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
        },
        getStatus(item){
            let status = 3, time = this.serverTime+this.timer*1000
            if(item.startTime>time){
                status = 1
            } else if(item.startTime<=time && item.closeTime>time){
                status = 2
            }
            return status
        },
        getCountDown(item, status){
            let _temp = {day:'d', hour:'h', min:'m', second:'s'}
            if(status===1){
                return this.$root.humanTime(item.startTime-(this.serverTime+this.timer*1000), _temp)
            } else if(status===2){
                return this.$root.humanTime(item.closeTime-(this.serverTime+this.timer*1000), _temp)
            } else {
                return ''
            }
        },
    }
}
</script>

<style lang="less" scoped>
.votes div {
    padding: 0.2rem 0.25rem;
    height: 2.7rem;
    color: #fff;
    p {text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}
    [header] { line-height: 0.5rem;}
    .title {font-size: 0.34rem;}
    .desc {opacity: 0.8;}
    .icon {width: 0.5rem; height: 0.5rem; object-fit: contain; object-position: center; vertical-align: middle;}
    .arrow {width: 0.12rem; height: 0.5rem; object-fit: contain; object-position: center; vertical-align: middle; margin-left: 0.2rem; opacity: 0.6;}
    &.sb {background: url('../../../assets/img/vote_sb_bg.png') no-repeat center/cover;}
    &.ys {background: url('../../../assets/img/vote_ys_bg.png') no-repeat center/cover;}
}
</style>