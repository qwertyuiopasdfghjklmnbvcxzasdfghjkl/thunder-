<template>
    <div class="page">
        <top-back>{{$t('home.announcement')}}</top-back>
        <div class="page-main">
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
                <ul class="cont">
                    <li v-for="item in list" v-tap="{methods: toDetail,item}">
                        <label>
                            <p><strong>{{getLang === 'en'?item.titleEn:item.titleCn}}</strong></p>
                            <small>{{new Date(item.updatedAt).format()}}</small>
                        </label>
                        <span>
                        <img src="../../../assets/img/i_rig_c@3x.png"/>
                    </span>
                    </li>
                </ul>
                <no-more-data v-show="noMoreData"></no-more-data>
                <no-data v-show="!list.length"></no-data>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import findApi from '@/api/home'
    import NoMoreData from "../../../components/common/noMoreData";

    export default {
        name: "notice-list",
        components: {NoMoreData},
        data() {
            return {
                list: [],
                getData: {
                    firstLevel: 1,
                    secondLevel: 1,
                    page: 0,
                    size: 10,
                    state: 1
                },
                sport: '',
                allLoaded: false,
                noMoreData: false,
            }
        },
        computed:{
            ...mapGetters(['getLang']),
        },
        created() {
        },
        methods: {
            getList() {
                findApi.getCmsList(this.getData, res => {
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
                this.getData.page = 1;
                this.getList()
            },
            loadBottom() { // 获取下一页
                this.sport = 'bottom'
                this.getData.page++;
                this.getList()
                this.allLoaded = true
            },
            toDetail(data) {
                // console.log(data.item)
                this.$router.push({name: 'notice-detail', query: {id: data.item.cmsInfoId}})
            }
        }
    }
</script>

<style scoped lang="less">
.page-main {
    padding: 0;
}

.cont {
    li {
        display: flex;
        padding: 0.24rem 0.3rem;
        background: #fff;
        margin: 0.2rem 0;
        align-items: center;
        justify-content: space-between;

        label {
            p {
                margin-bottom: 0.1rem;
            }

            small {
                color: #999;
            }
        }

        span {
            padding-left: 0.2rem;

            img {
                width: 0.15rem;
            }
        }
    }
}
</style>
