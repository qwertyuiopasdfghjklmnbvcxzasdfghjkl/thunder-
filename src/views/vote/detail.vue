<template>
    <div class="page">
        <top-back>{{info.title}}</top-back>
        <div class="page-main">
            <div class="banner full ui-flex ui-flex-column ui-flex-center ft-c-white tc" :class="{active:type===2}">
                <p class="f30" v-if="type===1">{{$t('vote.title_tpsb')}}<!-- 为您支持的币种投票上币 --></p>
                <p class="f30" v-else>{{$t('vote.title_tpys')}}<!-- 为您支持的币种投票映射 --></p>
                <p class="f30 mt20" v-if="getStatus()===3">{{$t('ieo.status_over')}}</p>
                <p class="f30 mt20" v-else>
                    <template v-if="getStatus()===1">{{$t('ieo.start_of_distance')}}：</template>
                    <template v-else>{{$t('ieo.end_of_distance')}}：</template>
                    {{countDown}}
                </p>
            </div>
            <div class="full mt20 votes-about f30">
                <p>
                    <span><strong>{{$t('vote.available_quantity')}}<!-- 可用数量 --></strong></span>
                    <span class="ft-c-gray">{{availableQuantity}} {{info.symbol}}</span>
                </p>
                <p>
                    <span><strong>{{$t('vote.available_votes')}}<!-- 可用票数 --></strong></span>
                    <span class="ft-c-gray">{{availableVotes}} {{$t('vote.votes')}}<!-- 票 --></span>
                </p>
            </div>
            <div class="full mt20 votes-tokens f30">
                <div class="head">
                    <span v-if="type===1"><strong>{{$t('vote.be_added_token')}}<!-- 待上币币种 --></strong></span>
                    <span v-else><strong>{{$t('vote.be_mapped_token')}}<!-- 待映射币种 --></strong></span>
                    <a href="javascript:;" @click="$root.openURL(info.detailsUrl)" target="_blank">{{$t('vote.detailed_info')}}<!-- 详细资料 --></a>
                </div>
                <ul>
                    <li v-for="item in symbols">
                        <p class="ui-flex-2 ellipsis">
                            <img :src="orignal+item.logo">
                            <span class="f30 ml20">{{item.symbol}}</span>
                        </p>
                        <p class="ui-flex-4 pl15 pr15 ui-flex ui-flex-column ui-flex-center">
                            <mt-progress :value="getPercent(item.votes)" :bar-height="7">
                                <span class="ml10" slot="end">{{item.votes}} {{$t('vote.votes')}}<!-- 票 --></span>
                            </mt-progress>
                        </p>
                        <p class="ui-flex-2">
                            <mt-button type="yellow" size="middle" :disabled="getStatus()!==2 || locked" v-tap="{methods:showDialog, item:item}">{{$t('vote.vote')}}<!-- 投票 --></mt-button>
                        </p>
                    </li>
                </ul>
            </div>
            <div class="full mt20 votes-records f30">
                <div class="head">
                    <span><strong>{{$t('vote.vote_records')}}<!-- 投票记录 --></strong></span>
                </div>
                <ul>
                    <li v-for="item in records">
                        <p class="ui-flex-2 ellipsis ui-flex ui-flex-column ui-flex-center">{{item.symbol}}</p>
                        <p class="ui-flex-2 ui-flex ui-flex-column ui-flex-center">{{item.votes}} {{$t('vote.votes')}}<!-- 票 --></p>
                        <p class="ui-flex-4 tr ui-flex ui-flex-column">
                            <span>{{item.consume}} {{info.symbol}}</span>
                            <span class="ft-c-lightGray mt20 f26">{{getDate(item.voteTime)}}</span>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
        <Dialog :show="isShow" :title="$t('vote.vote')" :hide="hideDialog">
            <div class="block f30 mt20 vote-form">
                <div>
                    <span><strong><!-- 投票给 -->{{$t('vote.vote_to')}}：</strong></span>
                    <span>
                        <img :src="orignal+voteToken.logo">
                        <span class="ml20">{{voteToken.symbol}}</span>
                    </span>
                </div>
                <div>
                    <span><strong><!-- 数量 -->{{$t('exchange.exchange_amount')}}：</strong></span>
                    <span>
                        <input type="number" step="1" min="0" name="" v-model="formData.number" :placeholder="$t('vote.vote_min').format(1)" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
                        <span class="f26 ml20 ft-c-lightGray">({{$t('vote.vote_max').format(availableVotes+'')}})</span>
                    </span>
                </div> 
                <div>
                    <span><strong><!-- 消耗 -->{{$t('vote.consume')}}：</strong></span>
                    <span>{{Number(formData.number)*info.price}} {{info.symbol}}</span>
                </div> 
            </div>
            <mt-button type="primary" size="large" class="mt100" @click="vote">{{$t('public0.ok')}}<!-- 确定 --></mt-button>
        </Dialog>

        <mt-popup class="w100" v-model="vertifyVisible" position="bottom">
          <vertify ref="vertify" :params="params" :mobileState="getUserInfo.mobileAuthEnable" @removeDialog="removeDialog" @okCallback="okCallback"></vertify>
        </mt-popup>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Utils from "@/assets/js/utils"
import { MessageBox } from 'mint-ui'
import Dialog from '@/components/common/dialogFull'
import voteApi from '@/api/vote'
import numUtils from '@/assets/js/numberUtils'
import vertify from '@/views/my/wallet/vertify'
import walletApi from '@/api/wallet'
import Config from '@/api/config'

export default {
    name: 'vote_detail',
    components: {
       Dialog,
       vertify
    },
    data() {
        return {
            orignal:Config.url,
            type:1,
            isShow:false,
            id:'',
            info:{
                startTime:0,
                closeTime:0,
                price:1
            },
            symbols:[],
            records:[],
            timer:0,
            serverTime:0,
            interval:null,
            locked:false,
            voteToken:{},
            vertifyVisible:false,
            formData:{
                number:'',
            },
        }
    },
    computed: {
        ...mapGetters(['getUserWallets', 'getUserInfo']),
        params () {
          return {
            phoneNumber: this.getUserInfo.mobile,
            countryCode: this.getUserInfo.countryCode || '+86',
            email: this.getUserInfo.email || this.getUserInfo.username
          }
        },
        countDown(){
            let _temp = {day:this.$t('exchange.exchange_day'), hour:this.$t('exchange.exchange_hour'), min:this.$t('exchange.exchange_min'), second:this.$t('exchange.exchange_second')}
            if(this.getStatus()===1){
                return this.$root.humanTime(this.info.startTime-(this.serverTime+this.timer*1000), _temp)
            } else if(this.getStatus()===2){
                return this.$root.humanTime(this.info.closeTime-(this.serverTime+this.timer*1000), _temp)
            } else {
                return ''
            }
        },
        availableQuantity(){
            let _quantity = 0
            for(let item of this.getUserWallets){
                if(item.symbol === this.info.symbol){
                   _quantity =  item.availableBalance
                   break
                }
            }
            return _quantity
        },
        availableVotes(){
            return Math.floor(Number(this.availableQuantity)/this.info.price)
        },
        totalVotes(){
            let _total = 0
            this.symbols.forEach(item=>{
                _total+=item.votes
            })
            return _total
        }
    },
    created() {
        this.type = Number(this.$route.query.type || 1)
        this.id = this.$route.params.id
        this.getVoteDetail()
        this.getVoteRecord()
    },
    beforeDestroy() {
        this.interval && clearInterval(this.interval)
    },
    methods: {
        ...mapActions(['setUserWallets']),
        getDate(date){
            let _date = new Date(date)
            return _date.format()
        },
        getPercent(number){
            if(!this.totalVotes){
                return 0
            } else {
                return number/this.totalVotes*100
            }
        },
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
        getStatus(){
            let status = 3, time = this.serverTime+this.timer*1000
            if(this.info.startTime>time){
                status = 1
            } else if(this.info.startTime<=time && this.info.closeTime>time){
                status = 2
            }
            return status
        },
        getVoteDetail(key){
            voteApi.getVoteDetail(this.id, (serverTime, res)=>{
                this.symbols = res.symbols
                if(!key){
                    this.serverTime = serverTime
                    this.info = res.item
                    this.interval = setInterval(()=>{this.timer++},1000)
                }
            }, msg=>{
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
        },
        getVoteRecord(){
            voteApi.getVoteRecord(this.id, (res)=>{
                this.records = res
            }, msg=>{
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
        },
        vote(){
            let _number = Number(this.formData.number)
            if(!_number){
                Tip({type:'error', message:this.$t('vote.qsr_votes')})//请输入投票数
            } else if(_number>this.availableVotes) {
                Tip({type:'error', message:this.$t('vote.vote_max').format(this.availableVotes+'')})//最多{0}票
            } else {
                this.vertifyVisible = true
            }
        },
        putVote(data){
            if(data.constructor===String){
                data = {
                    type: this.getUserInfo.googleAuthEnable === 1?2:1,
                    googleCode: data.split('$$')[1],
                    smsCode: data.split('$$')[0],
                }
            }
            let _data = {
                id: this.voteToken.id,
                voting:this.formData.number,
                secondaryValidateDTO:data
            }
            Indicator.open('Loading...')
            voteApi.putVote(_data, res=>{
                Tip({type: 'success', message: this.$t(`error_code.SUCCESS`)})
                this.formData.number = ''
                this.getVoteDetail(true)
                this.getVoteRecord()
                this.refreshUserWallets()
            }, msg=>{
                Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            })
        },
        refreshUserWallets(){
            walletApi.myAssets({}, (res) => {
                res = res.filter(item => {
                    return item.type === 1
                })
                res.forEach((item) => {
                    item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
                })
                this.setUserWallets(res)
            })
        },
        showDialog(args){
            this.voteToken = args.item
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
        },
        removeDialog () {
          this.vertifyVisible = false
        },
        okCallback (data) {
          this.vertifyVisible = false
          this.putVote(data)
        },
    }

}
</script>

<style lang="less" scoped="">
.banner {
    height: 1.8rem;
    margin-top: 0.2rem;
    background: url('../../assets/img/shangbi_bg.png') no-repeat center;
    background-size: cover;
    &.active { background-image:  url('../../assets/img/yingshe_bg.png');}
}
.votes-about {
    background-color: #fff;
    p {line-height: 1rem; padding-left: 0.3rem; padding-right: 0.3rem; display: flex; justify-content: space-between; &+p {border-top: 1px solid #eee;}}
}
.votes-tokens {
    background-color: #fff;
    .head {
        line-height: 0.9rem; padding-left: 0.3rem; padding-right: 0.3rem; display: flex; justify-content: space-between; border-bottom: 1px solid #eee;
    }
    ul {
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        li {
            padding: 0.35rem 0 ;
            display: flex;
            justify-content: space-between;
            line-height: 0.7rem;
            border-bottom: 1px solid #eee;
            &:last-of-type {border-bottom: none;}
            img {width: 0.6rem; height: 0.6rem; object-fit: cover; object-position: center; background-color: #E3E3E3; border-radius:100%; overflow: hidden; vertical-align: middle;}
            /deep/ button {height: 0.7rem!important;}
        }
    }

    /deep/ .mt-progress-runway, /deep/ .mt-progress-progress {border-radius: 3px;}
    /deep/ .mt-progress-progress {
        background-color: #FCA337;
    }
    /deep/ button {width: 100%;}
}
.votes-records {
    background-color: #fff;
    .head {
        line-height: 0.9rem; padding-left: 0.3rem; padding-right: 0.3rem; display: flex; justify-content: space-between; border-bottom: 1px solid #eee;
    }
    ul {
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        li {
            padding: 0.3rem 0 ;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            &:last-of-type {border-bottom: none;}
            
        }
    }
}
.vote-form {
    > div {line-height: 1.2rem; display: flex;}
    > div + div {border-top: 1px solid #eee;}
    > div > span:first-of-type {width: 1.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    > div > span:last-of-type {margin-left: 0.2rem; flex: 1;}
    img {width: 0.5rem; height: 0.5rem; object-fit: cover; object-position: center; background-color: #E3E3E3; border-radius:100%; overflow: hidden; vertical-align: middle;}
    input {
        border:1px solid #ccc;
        border-radius:4px;
        padding:0.1rem 0.15rem;
        font-size: 0.3rem;
        width: 1.8rem;
    }
}
</style>
