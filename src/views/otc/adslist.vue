<!--广告列表-->
<template>
    <section class="coin_content ft-c-lightGray">
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
                :autoFill="false"
                ref="loadmore">

            <ul class="item" v-for="(data, index) in datas" :key="index">
                <li>
                    <section>
                        <img class="avatar" :src="setHeader(data.from_user_id, index)"
                             :class="'pos'+index" @error="setDefaultIcon($event)">
                        <span class="ft-c-white f28">{{data.nickname||data.username}}</span>
                    </section>
                    <section></section>
                    <section class="right">
                        <span>{{$t('otc_ad.otc_ad_Praise')}}<!--好评率--> {{Math.floor(data.user_level||0)}}%</span>
                    </section>
                </li>
                <li>
                    <section>
                        <span>{{$t('message.msg_surplus')}}<!--剩余量--></span>
                        <span>{{data.remain_count||0}} {{data.symbol}}</span>
                    </section>
                    <section>{{tradeParams.price}}<!--单价--></section>
                </li>
                <li>
                    <section>
                        <span>{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
                        <span>{{data.min_amount}} - {{data.max_amount}}</span>
                        <span>{{tradeParams.limit}}</span>
                    </section>
                    <section class="f32" :class="params.ad_type===1?'ft-c-main':'ft-c-success'">
                        {{(data.cur_price||0).toString().toMoney()}} {{data.currency}}
                    </section>
                </li>
                <li>
                    <section>
                        <i class="i_bank" v-if="(data.pay_type||'').indexOf('1') !== -1"></i>
                        <i class="i_alipay" v-if="(data.pay_type||'').indexOf('2') !== -1"></i>
                        <i class="i_wechat" v-if="(data.pay_type||'').indexOf('3') !== -1"></i>
                        <i class="i_paypal" v-if="(data.pay_type||'').indexOf('4') !== -1"></i>
                    </section>
                    <section>
                        <mt-button
                                :class="{'sell':paramsChange.ad_type === 1}"
                                class="mini btn"
                                :disabled="getUserInfo.username === data.username"
                                @click="placeOrderClick(data)">{{tradeParams.tradeTxt}}
                        </mt-button>
                    </section>
                </li>
            </ul>
            <noMoreData v-if="noMoreData"/>
            <noData v-if="!datas.length"/>
        </mt-loadmore>
        <Dialog :show="isShow" :title="$t('qotc.nickname_set')" :modal="true" :hide="hideDialog"
                :submit="modifyNickname">
            <nike-name-form ref="nikeNameForm" :nikename="getUserInfo.nickname" @hide="hideDialog"></nike-name-form>
        </Dialog>
    </section>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox, Indicator} from 'mint-ui'
    import utils from '@/assets/js/utils'
    import numUtils from '@/assets/js/numberUtils'
    import otcApi from '@/api/otc'
    import userUtils from '@/api/individual'
    import avatar from '@/assets/img/user_img@2x.png'
    import noMoreData from '@/components/common/noMoreData'
    import nikeNameForm from '@/views/my/center/nikeNameForm' // 修改昵称
    import userApi from '@/api/user'

    export default {
        name: 'adslist',
        components: {noMoreData, nikeNameForm},
        props: ['params', 'hasPay'],
        data() {
            return {
                datas: [],
                allLoaded: false,
                noMoreData: false,
                sport: '',
                page: 1,
                isShow: false,
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getUserInfo']),
            paramsChange() {
                return {
                    ad_type: this.params.ad_type,
                    symbol: this.params.symbol,
                    currency: this.params.currency,
                    pay_type: this.params.pay_type,
                    sort_mode: this.params.sort_mode,
                    page: this.page,
                    show: this.params.show
                }
            },
            tradeParams() {
                if (this.paramsChange.ad_type === 2) {
                    return {
                        tradeTxt: this.$t('otc_exchange.otc_exchange_buy'), // 购买
                        price: this.$t('otc_exchange.otc_exchange_ask'), // 单价
                        limit: this.params.currency // 交易限额
                    }
                } else {
                    return {
                        tradeTxt: this.$t('otc_exchange.otc_exchange_sell'), // 出售
                        price: this.$t('otc_exchange.otc_exchange_bid'), // 单价
                        limit: this.params.symbol // 交易限额
                    }
                }
            }
        },
        watch: {
            // paramsChange() {
            //     this.getList()
            // }
        },
        created() {
            this.getList()
        },
        methods: {
            ...mapActions(['setUserInfo', 'setUserWallets']),
            async setHeader(id, idx) {
                let res = await this.getHeader(id)
                $('.avatar.pos' + idx).attr('src', res)
            },
            getHeader(id) {
                // 下载当前用户头像
                return new Promise((resolve, reject) => {
                    userUtils.downloadHeaderOther(id, (url) => {
                        resolve(url)
                    }, msg => {
                        resolve('')
                    })
                })
            },
            setDefaultIcon(e) {
                let tar = e.currentTarget
                tar.src = avatar
            },
            modifyNickname() {
                this.$refs.nikeNameForm.submit()
            },
            hideDialog(key) {
                if (key === true) {
                    this.getInfo()
                }
                this.isShow = false
            },
            getInfo() {
                userApi.getUserInfo(res => {
                    this.setUserInfo(res)
                })
            },
            getList() { // 获取广告列表
                Indicator.open()
                otcApi.getAdvertisementList(this.paramsChange, (res) => {
                    Indicator.close()
                    res.data.forEach((item) => { // 广告列表数据格式化处理
                        item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
                        if (this.params.ad_type === 2) {
                            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
                            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
                        } else {
                            item.min_amount = utils.removeEndZero(numUtils.BN(item.min_amount).toFixed(8))
                            item.max_amount = utils.removeEndZero(numUtils.BN(item.max_amount).toFixed(8))
                        }
                        item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
                    })
                    // this.datas = res.data

                    if (this.sport === 'bottom') { // 加载更多数据
                        this.allLoaded = false
                        res.data.forEach(res => {
                            this.datas.push(res)
                        })
                        console.log(this.datas)
                        this.$refs.loadmore.onBottomLoaded();
                    } else if (this.sport === 'top') { // 下拉刷新
                        this.datas = res.data
                        this.noMoreData = false
                        this.allLoaded = false
                        this.$refs.loadmore.onTopLoaded();
                    } else {
                        this.datas = []
                        this.datas = res.data
                    }
                    if (this.datas.length >= res.total) { // 没有更多数据
                        this.noMoreData = Boolean(res.total)
                        this.allLoaded = true
                    }

                }, (msg) => {
                    Indicator.close()
                    console.error(msg)
                })
            },
            loadTop() { // 刷新
                this.sport = 'top';
                this.page = 1;
                this.getList()
            },
            loadBottom() { // 获取下一页
                this.sport = 'bottom'
                this.page++;
                this.allLoaded = true
                this.getList()
            },
            checkSetState(successCallback) {
                if (!this.getUserInfo.nickname) {
                    this.isShow = true
                    return
                }
                if (this.getUserInfo.kycState !== 1) {
                    MessageBox.confirm(this.$t('home.home66'), this.$t('user.realName'), {
                        cancelButtonText: this.$t('public0.no'),
                        confirmButtonText: this.$t('qotc.to_realName')
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({name: 'kyc'})
                        }
                    })
                    return
                }
                // console.log(this.hasPay)
                // if (!this.hasPay) { //买卖需添加收款支付方式
                //     Tip({type: 'error', message: this.$t('qotc.add_payway')})//请添加支付方式
                //     return
                // }
                // if (!this.payType) { //如果是卖需选择收款方式
                //     Tip({
                //         type: 'error',
                //         message: this.type == 1 ? this.$t('qotc.select_payment_method') : this.$t('qotc.select_collection_method')
                //     }) //'请选择付款方式':'请选择收款方式'
                //     return
                // }
                successCallback()
            },
            placeOrderClick(item) {
                if (this.getUserInfo.username === item.username) {
                    return
                }
                let isCheckPaySet = parseInt(item.ad_type) === 1
                this.matchPayType = parseInt(item.ad_type) === 1 ? void 0 : item.pay_type
                this.checkSetState(() => {
                    this.$emit('placeOrderClick', item)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .coin_content {
        font-size: .24rem;
        background-color: #151C2C;

        ul {
            padding: .2rem 0.3rem;

            & + ul {
                border-top: 0.02rem solid #273246;
            }

            li {
                display: flex;
                justify-content: space-between;

                span {
                    vertical-align: middle;
                }

                .avatar {
                    width: .4rem;
                    height: 0.4rem;
                    object-fit: contain;
                    margin-right: 0.15rem;
                    vertical-align: middle;
                }
            }

            li + li {
                margin-top: 0.15rem;
            }

            i {
                display: inline-block;
                width: .5rem;
                height: .4rem;
                margin-top: .15rem;
                margin-right: .2rem;
                vertical-align: middle;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }

            i.i_bank {
                background-image: url('../../assets/img/icon-bank-big.png');
            }

            i.i_alipay {
                background-image: url('../../assets/img/icon-alipay-big.png');
            }

            i.i_wechat {
                background-image: url('../../assets/img/icon-wechat-big.png');
            }

            i.i_paypal {
                background-image: url('../../assets/img/icon-paypal-big.png');
            }
        }
    }

    .btn {
        min-width: 1.7rem;
        min-height: 0.7rem;
    }

    .sell {
        background-color: #D14B64 !important;
    }
</style>
