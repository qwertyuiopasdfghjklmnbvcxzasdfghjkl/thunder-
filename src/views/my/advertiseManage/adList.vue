<template>
    <div>
        <top-back>
            {{$t('otc_ad.otc_ad_management')}}
            <router-link slot="right" :to="{name:'qotcAddOrUpdate'}" class="add_ad">
                <img src="../../../assets/img/add.png">
            </router-link>
        </top-back>

        <ul class="tabs">
            <li v-for="item in navList"
                v-tap="{methods:tabs,val:item.val}"
                :class="{'active':nav===item.val}">{{item.name}}
            </li>
        </ul>

        <div class="page-main">
            <div class="loadmore-wrapper">
                <mt-loadmore
                        :class="{'is-loading': messageTopLoading}"
                        ref="loadmore"
                        :autoFill="false"
                        :topDistance="40"
                        :topMethod="loadTop"
                        :top-pull-text="$t('home.top-pull-text')"
                        :top-drop-text="$t('home.drop-text')"
                        :top-loading-text="$t('home.loading-text')"
                        :bottom-pull-text="$t('home.bottom-pull-text')"
                        :bottom-drop-text="$t('home.drop-text')"
                        :bottom-loading-text="$t('home.loading-text')"
                        @top-status-change="handleTopChange"
                        infinite-scroll-immediate-check="false"
                        infinite-scroll-distance="80"
                        infinite-scroll-disabled="messageBottomDisabled"
                        v-infinite-scroll="loadMore"
                >
                    <loading slot="top" :class="{'is-loading': messageTopDrop}"/>
                    <div v-if="messageList.length > 0">
                        <ad-list-cont :list="messageList"/>
                        <loading v-if="messageBottomLoading"/>
                        <noMoreData v-if="!messageBottomLoading && noMoreMessage"/>
                    </div>
                    <noData v-if="!messageTopLoading && messageList.length === 0"/>
                </mt-loadmore>
            </div>

        </div>
    </div>
</template>

<script>
    import AdListCont from "./adList/adListCont";
    import otc from '../../../api/otc'
    import loading from '@/components/common/loading'
    import noData from '@/components/common/noData'
    import noMoreData from '@/components/common/noMoreData'
    export default {
        name: "adList",
        components: {
            AdListCont,
            loading,
            noData,
            noMoreData},
        data() {
            return {
                nav: 9,
                navList: [
                    {name: this.$t('home.home59'), val: 9},
                    {name: this.$t('public0.public51'), val: 1},
                    {name: this.$t('public0.public52'), val: 2},
                    {name: this.$t('public0.public156'), val: 3},
                ],
                param: {
                    page: 1,
                    show: 6,
                    ad_type: 0,
                    symbol: null,
                    status: null
                },
                messageList: [], // 消息列表
                unReadLength: 0, // 未读消息长度
                messageTopDrop: false, // 下拉状态
                messageTopLoading: false, // 下拉加载状态
                messageBottomDisabled: false, // 滚动加载禁用状态
                messageBottomLoading: false, // 滚动加载状态
                noMoreMessage: false, // 是否没有更多消息
                responseState: { // 组件创建时所请求的接口的响应状态
                    item1: false,
                    item2: false
                }
            }
        },
        watch: {
            responseState: { // 数据请求完毕后关闭indicator
                handler(val) {
                    let i = 0
                    let j = 0
                    for (let x in val) {
                        i++
                        if (val[x]) {
                            j++
                        }
                    }
                    if (i === j) {
                        Indicator.close()
                    }
                },
                deep: true
            },
            'param.status'() {
                Indicator.open()
                this.param.page = 1
                this.messageList = []
                this.getMessageList(() => {
                    Indicator.close()
                }, () => {
                    Indicator.close()
                })
            },
            'param.page'(val) {
                if (val !== 1 && !this.noMoreMessage) {
                    this.messageBottomDisabled = true
                    this.messageBottomLoading = true
                    this.getMessageList(() => {
                        this.messageBottomLoading = false
                    }, () => {
                        this.messageBottomLoading = false
                    })
                }
            }
        },
        created() {
            // otc.getMyAdvertisementList()
            Indicator.open()
            this.$nextTick(() => {
                this.getMessageList(() => {
                    this.responseState.item1 = true
                }, () => {
                    this.responseState.item1 = true
                })
                this.getUnReadLength()
            })
        },
        methods: {
            getMessageList(successCallback, errorCallback, isLoadTop) { // 根据参数获取消息
                otc.getMyAdvertisementList(this.param, (res) => {
                    if (isLoadTop) { // 判断是否为下拉刷新方式加载数据，则替换旧数据
                        this.messageList = res.data
                    } else {
                        res.data.forEach((item) => {
                            this.messageList.push(item)
                        })
                    }
                    if (this.messageList.length >= res.total) { // 判断数据是否加载完毕，则禁用滚动加载事件
                        this.messageBottomDisabled = true
                        this.noMoreMessage = true
                    } else {
                        this.messageBottomDisabled = false
                        this.noMoreMessage = false
                    }
                    if (!this.noMoreMessage) { // 如果数据撑不满容器时，继续请求下一页数据
                        this.$nextTick(() => {
                            if (this.$refs.loadmore.$el.clientHeight > this.$refs.messageList.clientHeight) {
                                this.param.page++
                            }
                        })
                    }
                    successCallback && successCallback(res)
                }, (msg) => {
                    errorCallback && errorCallback(msg)
                    if (msg !== 'NOT_FIND_MESSAGE') {
                        console.error(msg)
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    }
                })
            },
            getUnReadLength() { // 获取所有消息
                otc.getMyAdvertisementList(this.param, (res) => {
                    this.unReadLength = res.data.length
                    this.responseState.item2 = true
                }, (msg) => {
                    this.responseState.item2 = true
                    if (msg !== 'NOT_FIND_MESSAGE') {
                        console.error(msg)
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    }
                })
            },
            handleTopChange(status) { // 获取组件的下拉状态 status: pull（组件被下拉但未达到阈值）、drop（组件被下拉且已达到阈值）、loading（组件被下拉达到阈值后释放）
                this.messageTopDrop = status !== 'pull'
                this.messageTopLoading = status === 'loading'
            },
            loadTop() { // 下拉获取最新消息
                this.param.page = 1
                this.getMessageList(() => {
                    setTimeout(()=>{
                        this.messageTopDrop = false
                        this.messageTopLoading = false
                        $('.mint-loadmore-content').css({'transform':'translate3d(0px, 0px, 0px)'})
                    },1000)
                }, () => {
                    setTimeout(()=>{
                        this.messageTopDrop = false
                        this.messageTopLoading = false
                        $('.mint-loadmore-content').css({'transform':'translate3d(0px, 0px, 0px)'})
                    },1000)
                }, true)
            },
            loadMore() { // 向下滚动获取更多消息
                this.param.page++
            },
            tabs(e){
                if(e.val === 9){
                    this.param.status = null
                }else{
                    this.param.status = e.val
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .page-main {
        top: 1.7rem;
    }

    .tabs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #151C2C;
        margin-top: 0.9rem;
        padding: 0 0.3rem;

        li {
            color: #4B5875;
            font-size: 0.32rem;
            height: 0.8rem;
            line-height: 0.8rem;
            border-bottom: 0.04rem solid transparent;

            &.active {
                color: #0C6AC9;
                border-bottom-color: #0C6AC9;
            }
        }
    }
    .add_ad{
        display: inline-flex;
        align-items: center;
        height: 0.5rem;
        img{
            width: 0.34rem;
        }
    }
</style>
