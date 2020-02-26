<template>
    <div class="page" @click="hideActive">
        <top-back>
            {{$t('home.home48')}}
        </top-back>
        <div class="history-tabs">
            <mt-navbar v-model="selected">
                <mt-tab-item id="tab1"><span>{{$t('home.home54')}}</span></mt-tab-item>
                <mt-tab-item id="tab2"><span>{{$t('home.home55')}}</span></mt-tab-item>
            </mt-navbar>
        </div>
        
        <div class="list_box">
            <div class="list" :class="{active:active==='tokens'}">
                <label @click="active= active==='tokens'?'':'tokens'">{{$t('home.home56')}}<i><img src="../../../../assets/img/tc_meus_b@2x.png"/></i></label>
                <div>
                    <span @click="symbol='', active=''" :class="{'active': !symbol}">{{$t('home.home59')}}</span>
                    <span v-for="item in symbolList" @click="symbol = item,  active=''" :class="{'active': symbol === item}">{{item}}</span>
                </div>
            </div>
            <div class="list" :class="{active:active==='status'}">
                <label @click="active= active==='status'?'':'status'">{{$t('home.home57')}}<i><img src="../../../../assets/img/tc_meus_b@2x.png"/></i></label>
                <div>
                    <span @click="status = ''" :class="{'active': status === ''}">{{$t('home.home59')}}</span>
                    <span @click="status = 1" :class="{'active': status === 1}">{{$t('home.home61')}}</span>
                    <span @click="status = 2" :class="{'active': status === 2}">{{$t('home.home60')}}</span>
                </div>
            </div>
            <div class="list" :class="{active:active==='time'}">
                <label @click="active= active==='time'?'':'time'">{{$t('home.home58')}}<i><img src="../../../../assets/img/tc_meus_b@2x.png"/></i></label>
                <div>
                    <span @click="time = 7" :class="{'active': time === 7}">7 {{$t('exchange.exchange_day')}}</span>
                    <span @click="time = 30" :class="{'active': time === 30}">30{{$t('exchange.exchange_day')}}</span>
                    <span @click="time = 180" :class="{'active': time === 180}">180{{$t('exchange.exchange_day')}}</span>
                </div>
            </div>
        </div>
        <mt-tab-container v-model="selected"  class="mt20">
            <mt-tab-container-item id="tab1">
                <div class="loadmore-wapper">
                    <mt-loadmore
                            :top-method="loadTop"
                            :bottom-method="loadBottom"
                            :bottom-all-loaded="allLoaded"
                            :top-pull-text="$t('home.top-pull-text')"
                            :top-drop-text="$t('home.drop-text')"
                            :top-loading-text="$t('home.loading-text')"
                            :bottom-pull-text="$t('public0.loadmore')+'...'"
                            :bottom-drop-text="$t('home.drop-text')"
                            :bottom-loading-text="$t('home.loading-text')"
                            :autoFill="false"
                            ref="loadmore">
                        <ul class="tab_list bg-c-white">
                            <li v-for="item in list" v-tap="{methods: todetail, params:{data: item, form: 1}}">
                                <div>
                                    <h4><span><strong>{{item.symbol}}</strong></span><span>{{item.amount}}</span></h4>
                                    <p>{{new Date(item.updatedAt).format()}}</p>
                                </div>
                                <p :class="[getRechargeState(item.status).className]">{{getRechargeState(item.status).value}}</p>
                            </li>
                        </ul>
                        <noMoreData v-if="noMoreData"/>
                        <no-data v-if="noData"/>
                    </mt-loadmore>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab2">
                <div class="loadmore-wapper">
                    <mt-loadmore
                            :top-method="loadWithdrawalTop"
                            :bottom-method="loadWithdrawalBottom"
                            :bottom-all-loaded="allWithdrawalLoaded"
                            :top-pull-text="$t('home.top-pull-text')"
                            :top-drop-text="$t('home.drop-text')"
                            :top-loading-text="$t('home.loading-text')"
                            :bottom-pull-text="$t('public0.loadmore')+'...'"
                            :bottom-drop-text="$t('home.drop-text')"
                            :bottom-loading-text="$t('home.loading-text')"
                            :autoFill="false"
                            ref="loadmoreWithdrawal">
                        <ul class="tab_list bg-c-white">
                            <li v-for="item in listWithdrawal" v-tap="{methods: todetail, params:{data: item, form: 2}}">
                                <div>
                                    <h4><span><strong>{{item.symbol}}</strong></span><span>{{item.amount}}</span></h4>
                                    <p>{{new Date(item.updatedAt).format()}}</p>
                                </div>
                                <p :class="[getWithdrawalState(item.status).className]">{{getWithdrawalState(item.status).value}}</p>
                            </li>
                        </ul>
                        <noMoreData v-if="noMoreDataWithdrawal" :bgColor="'#F7F7F7'"/>
                        <no-data v-if="noDataWithdrawal"/>
                    </mt-loadmore>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
    import loading from '@/components/common/loading'
    import noMoreData from '@/components/common/noMoreData'
    import wallet from '../../../../api/wallet'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: "history-list",
        components: {
            loading,
            noMoreData
        },
        data() {
            return {
                selected: 'tab1',
                symbol: '',
                status: '',
                time: 7,
                allLoaded: false,
                allWithdrawalLoaded: false,
                page:1,
                withdrawalPage:1,
                sport: '',
                sportWithdrawal: '',
                list: [],
                listWithdrawal: [],
                noMoreData: false,
                noMoreDataWithdrawal: false,
                noData: false,
                noDataWithdrawal: false,
                active:''
            }
        },
        computed:{
            ...mapGetters(['getUserWallets']),
            paramsChange(){
                return{
                    direction: 1,
                    pageSize: 10,
                    symbol: this.symbol,
                    time: this.time+'days',
                    status: this.status,
                }
            },
            paramsChange2(){
                return{
                    direction: 2,
                    pageSize: 10,
                    symbol: this.symbol,
                    time: this.time+'days',
                    status: this.status
                }
            },
            symbolList(){
                return this.getUserWallets.map(item => {
                    return item.symbol
                })
            }
        },
        watch:{
            selected(){
                this.active = ''
                let query = {
                    symbol: this.symbol,
                    time: this.time,
                    status: this.status,
                    tab:this.selected
                }
                this.$router.replace({name:'history',query:query})
            },
            paramsChange(){
                let query = {
                    symbol: this.symbol,
                    time: this.time,
                    status: this.status,
                    tab:this.selected
                }
                this.$router.replace({name:'history',query:query})
                this.list = []
                this.getList()
            },
            paramsChange2(){
                this.listWithdrawal = []
                this.getWithdrawalList()
            }
        },
        created() {
            this.selected = this.$route.query.tab || 'tab1'
            this.symbol = this.$route.query.symbol || ''
            this.time = Number(this.$route.query.time) || 7
            this.status = Number(this.$route.query.status) || ''
            this.getList()
            this.getWithdrawalList()
        },
        methods: {
            hideActive(e){
                let $tar = $(e.target)
                if($tar.hasClass('list_box') || $tar.parents('.list_box').length){

                } else {
                    this.active = ''
                }
            },
            loadBottom() { // 获取下一页
                this.sport = 'bottom'
                this.page++;
                this.allLoaded = true
                this.getList()
            },
            getList() {
                let params = {page:this.page}
                params = Object.assign(params,this.paramsChange)
                wallet.listDepositHistory(params, res => {
                    if (this.sport === 'bottom') { // 加载更多数据
                        this.allLoaded = false
                        res.data.filter(d => {
                            this.list.push(d)
                        })
                        this.$refs.loadmore.onBottomLoaded();
                        if (this.list.length >= res.total) { // 没有更多数据
                            this.list.length ? this.noMoreData = true : this.noMoreData = false
                            this.allLoaded = true
                        }
                    } else if (this.sport === 'top') { // 下拉刷新
                        this.list = res.data
                        this.$refs.loadmore.onTopLoaded();
                    } else {
                        this.list = res.data
                    }
                    this.noData = !this.list.length
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            loadTop() { // 刷新
                this.sport = 'top';
                this.page = 1;
                this.noMoreData = false
                this.getList()
            },

            loadWithdrawalBottom() { // 获取下一页
                this.sportWithdrawal = 'bottom'
                this.withdrawalPage++;
                this.getWithdrawalList()
                this.allWithdrawalLoaded = true
            },
            getWithdrawalList() {
                let params = {page:this.withdrawalPage}
                params = Object.assign(params,this.paramsChange2)
                wallet.listDepositHistory(params, res => {
                    if (this.sportWithdrawal === 'bottom') { // 加载更多数据
                        this.allWithdrawalLoaded = false
                        res.data.filter(d => {
                            this.listWithdrawal.push(d)
                        })
                        this.$refs.loadmoreWithdrawal.onBottomLoaded();
                        if (this.listWithdrawal.length >= res.total) { // 没有更多数据
                            this.noMoreDataWithdrawal = true
                            this.allWithdrawalLoaded = true
                        }
                    } else if (this.sportWithdrawal === 'top') { // 下拉刷新
                        this.listWithdrawal = res.data
                        this.$refs.loadmoreWithdrawal.onTopLoaded();
                    } else {
                        this.listWithdrawal = res.data
                    }
                    this.noDataWithdrawal = !this.listWithdrawal.length
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            loadWithdrawalTop() { // 刷新
                this.sportWithdrawal = 'top';
                this.withdrawalPage = 1;
                this.noMoreDataWithdrawal = false
                this.getWithdrawalList()
            },


            getRechargeState(state) { // 获取充值状态
                if (state === 1) {
                    return {
                        className: 'underway',
                        value: this.$t('account.user_center_history_status_wait') // 等待中
                    }
                } else if (state === 2) {
                    return {
                        className: 'success',
                        value: this.$t('account.user_center_history_status_success') // 成功
                    }
                } else {
                    return {
                        className: null,
                        value: null
                    }
                }
            },
            getWithdrawalState(state) { // 获取提现状态
                switch (state) {
                    case 1:
                        return {
                            className: 'underway',
                            value: this.$t('account.user_center_history_status_review') // 审核中
                        }
                    case 2:
                    case 3:
                        return {
                            className: 'underway',
                            value: this.$t('account.user_center_history_status_withdrawal') // 提现中
                        }
                    case 4:
                        return {
                            className: 'fail',
                            value: this.$t('account.user_center_history_status_repeal') // 已撤销
                        }
                    case 5:
                        return {
                            className: 'fail',
                            value: this.$t('account.user_center_history_status_fail') // 失败
                        }
                    case 6:
                        return {
                            className: 'success',
                            value: this.$t('account.user_center_history_status_complete') // 已完成
                        }
                    default:
                        return {
                            className: 'underway',
                            value: null
                        }
                }
            },
            todetail(d){
               console.log(d.params)
                let data = d.params.data
                let form = d.params.form
                this.$router.push({name: 'history-detail',params:{data: data, form: form}})
            },
        }
    }
</script>

<style scoped lang="less">
    @bgc: #fff;
    @brc: #999;

    .list_box {
        background: @bgc;
        display: flex;
        align-items: center;
        line-height: 0.8rem;
        position: relative;

        .list {
            flex:1;
            text-align: center;
            & > div {
                display: none;
                position: absolute;
                width: 90vw;
                left: 5vw;
                top: 1rem;
                background: @bgc;
                padding: 0.3rem;
                justify-content: left;
                align-items: flex-end;
                flex-wrap: wrap;
                border-radius: 0.12rem;
                z-index: 9;
                box-shadow:0 0 0.12rem 0 rgba(0, 0, 0, 0.06);

                &:before {
                    position: absolute;
                    content: '';
                    display: block;
                    z-index: 8;
                    width: 0.4rem;
                    height: 0.4rem;
                    background: @bgc;
                    border: 0.02rem solid rgba(0, 0, 0, 0.06);
                    border-bottom: none;
                    border-left: none;
                    top: -0.21rem;
                    transform: rotate(-45deg);
                }

                span {
                    width: 1.82rem;
                    height: 0.8rem;
                    flex-shrink: 0;
                    text-align: center;
                    line-height: 0.8rem;
                    margin-bottom: 0.3rem;
                    margin-right: 0.3rem;
                    background-color: #F6F6F6;
                    border-radius: 4px;
                    color: #999;

                    &:nth-child(3n) {
                        margin-right: 0;
                    }

                    &.active {
                        background-color: #3B48C8;
                        color: #ffffff;
                    }
                }
            }

            &.active {
                & > div {
                    display: flex;
                }

                & > label {
                    img {
                        transform: rotate(180deg);
                    }
                }
            }

            & > label {
                i {
                    margin-left: 0.1rem;

                    img {
                        width: 0.15rem;
                        vertical-align: middle;
                    }
                }
            }

            &:first-child {
                & > div:before {
                    left: 0.8rem;
                }
            }

            &:nth-child(2) {
                & > div:before {
                    left: 3.2rem;
                }
            }

            &:nth-child(3) {
                & > div:before {
                    left: 5.6rem;
                }
            }
        }
    }

    .no_data {
        text-align: center;

        img {
            width: 4rem;
            margin-top: 1.6rem;
        }
    }

    .loadmore-wapper {
        height: calc(100vh - 2.7rem);
        overflow-y: auto;
    }

    .tab_list {
        padding: 0 .3rem;
        scroll-padding: 0;
        scroll-snap-margin: 0;

        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 0;
            &+li {border-top: 0.02rem solid #eee;}

            div {
                h4 {
                    font-size: 0.28rem;

                    span {
                        padding-right: 0.34rem;
                    }
                }

                p {
                    font-size: 0.24rem;
                    margin-top: 0.2rem;
                }
            }
        }
    }
    .history-tabs {
        margin-top: 0.9rem;
        position: relative;
        z-index: 1;
        /deep/ .mint-navbar {border-bottom: 1px solid #eee;}
        /deep/ .mint-tab-item {
            height: 0.9rem;
            color: #999;
            padding: 0;
            &.is-selected {
                color: #3B48C8; border-bottom: none; margin-bottom: 0;
                .mint-tab-item-label span{
                    border-bottom: 2px solid #3B48C8;
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
    .fail {color: #F07180;}
    .success {color: #01C89F;}
    .underway {color: #999;}
</style>
