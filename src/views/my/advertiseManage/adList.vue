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
                        :top-method="loadTop"
                        :bottom-method="loadBottom"
                        :bottom-all-loaded="allLoaded"
                        :top-pull-text="$t('home.top-pull-text')"
                        :top-drop-text="$t('home.drop-text')"
                        :top-loading-text="$t('home.loading-text')"
                        :bottom-pull-text="$t('home.bottom-pull-text')"
                        :bottom-drop-text="$t('home.drop-text')"
                        :bottom-loading-text="$t('home.loading-text')"
                        ref="loadmore">
                    <div v-if="list.length > 0">
                        <ad-list-cont :list="list"/>
                    </div>
                    <noMoreData v-if="noMoreData"/>
                    <noData v-if="!list.length"/>
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
            // loading,
            // noData,
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
                    status: null,
                },
                list: [], // 消息列表
                sport: '',
                allLoaded: false,
                noMoreData: false,
            }
        },
        watch: {
            'param.status'(){
                this.getList()
            }
        },
        created() {
            this.getList()
        },
        methods: {

            getList() {
                otc.getMyAdvertisementList(this.param, res => {
                    if (this.sport === 'bottom') { // 加载更多数据
                        this.allLoaded = false
                        res.data.filter(d => {
                            if (d.state === 1) {
                                this.list.push(d)
                            }
                        })
                        this.$refs.loadmore.onBottomLoaded();
                        if (this.list.length >= res.total) { // 没有更多数据
                            this.noMoreData = true
                            this.allLoaded = true
                        }
                    } else if (this.sport === 'top') { // 下拉刷新
                        this.list = []
                        res.data.filter(d => {
                            if (d.state === 1) {
                                this.list.push(d)
                            }
                        })

                        this.$refs.loadmore.onTopLoaded();
                    } else {
                        this.list = []
                        res.data.filter(d => {
                            if (d.state === 1) {
                                this.list.push(d)
                            }
                        })
                    }
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            loadTop() { // 刷新
                this.sport = 'top';
                this.param.page = 1;
                this.getList()
            },
            loadBottom() { // 获取下一页
                this.sport = 'bottom'
                this.param.page++;
                this.getList()
                this.allLoaded = true
            },

            tabs(e){
                if(e.val === 9){
                    this.param.status = null
                }else{
                    this.param.status = e.val
                }
                this.nav = e.val
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
