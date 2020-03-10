<template>
    <div class="page">
        <top-back style="background: #151C2C" :backPage="'home'">
            {{$t('nav.my')}}
            <!-- <router-link to="/ucenter/set" slot="right">
                <img class="icon_setting" src="../../assets/img/ic_sz@3x.png">
            </router-link> -->
        </top-back>
        <div class="page-main">
            <div class="full user">
                <div class="user_head">
                    <div class="info" v-tap="{methods:$root.routeTo, to:'center'}">
                        <label>
                            <img src="../../assets/img/user_img@2x.png" v-if="!getUserInfo.headerImagePath">
                            <img :src="orignal+getUserInfo.headerImagePath" @error="setDefaultIcon($event)" v-else>
                        </label>
                        <div>
                            <!--<p>-->
                                <!--<span v-if="getUserInfo.nickname">{{getUserInfo.nickname}}</span>-->
                                <!--<a class="yellow" v-else>{{$t('public0.public40')}}&lt;!&ndash;修改昵称&ndash;&gt;</a>-->
                                <!--<span class="state entrance" v-if="showVerifyState(0)"-->
                                      <!--v-tap="{methods:$root.routeTo, to:'kyc'}">{{$t('account.user_Real_name_verification')}}</span>-->
                                <!--&lt;!&ndash;实名认证&ndash;&gt;-->

                            <!--</p>-->
                            <p class="f36">{{getUserInfo.username}}</p>
                            <p class="f28">UID：{{getUserInfo.uidSort}}</p>
                        </div>
                        <span>
                            <img src="../../assets/img/i_rig_w@3x.png" style="opacity:0.6;">
                        </span>
                    </div>
                </div>
            </div>
            <!--<ul class="block sublist ui-flex mt20">-->
                <!--<router-link class="ui-flex-1" v-for="item in data1" tag="li" :to="{name:item.route}">-->
                    <!--<img :src="item.icon"/>-->
                    <!--<p class="ellipsis">{{item.name}}</p>-->
                <!--</router-link>-->
            <!--</ul>-->
            <div class="mt20 box full">
                <rail-bar :item="kyc">
                    <div>
                        <span class="state wait"  v-if="showVerifyState(1)">{{$t('public0.public37')}}</span>
                        <!--待审核-->
                        <span class="state wait" v-if="showVerifyState(4)">{{$t('public0.public151')}}</span>
                        <!--审核中-->
                        <span class="state success" v-if="showVerifyState(2)">{{$t('public0.public38')}}</span>
                        <!--已认证-->
                        <span class="state fail" v-if="showVerifyState(3)">{{$t('public0.public39')}}</span>
                        <!--未通过-->
                    </div>
                </rail-bar>
                <rail-bar v-for="data in data2" :item="data"></rail-bar>
            </div>
            <div class="mt20 box full">
                <rail-bar v-for="data in data3" :item="data"></rail-bar>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapActions, mapGetters} from 'vuex'
    import railBar from '../../components/RailBar'
    import avatar from '@/assets/img/user_img@2x.png'
    import config from '../../api/config'
    import userApi from '@/api/individual'
    import myApi from '@/api/user'

    export default {
        components: { 
            railBar
        },
        data() {
            return {
                orignal: process.env.NODE_ENV === 'development'  ? config.url + '/ceph-data/dev/user/' : config.url + '/ceph-data/produ-thunder/user/' ,
                user: {},
                isUseCoinPay: false,
                messageList: null,
                title: null,
                userState: { // 用户状态信息
                    coinState: 0,
                    googleState: 0,
                    nickname: null,
                    verifyState: 0,
                    verifyTimes: 0
                },
                data1: [
                    {
                        route: 'referral',
                        icon: require('@/assets/img/icon_yqfl.png'),
                        name: this.$t('referral.to_rebate'),
                    },
                    {
                        route: 'stake',
                        icon: require('@/assets/img/icon_wdsc.png'),
                        name: this.$t('account.my_stake'),
                    },
                ],
                kyc: {
                    route: 'kyc',
                    icon: require('@/assets/img/kyc.png'),
                    name: this.$t('user.realId'),
                },
                data2: [

                    {
                        route: 'safe',
                        icon: require('@/assets/img/ic_aqzx@3x.png'),
                        name: this.$t('user.safety')
                    },
                    // {
                    //     route: 'myMapping', // otc的功能 我的订单
                    //     icon: require('@/assets/img/icon_wddd.png'),
                    //     name: this.$t('usercontent.user60'),
                    // },
                    {
                        route: 'history',
                        icon: require('@/assets/img/icon_ctjl.png'),
                        name: this.$t('usercontent.user59'),
                    },
                    {
                        route: 'transRecords',
                        icon: require('@/assets/img/icon_yjjl.png'),
                        name: this.$t('trade_record.my_trade_record'),
                    },
                    // {
                    //     route: 'adManage',  // otc 功能 我的广告
                    //     icon: require('@/assets/img/icon_ad.png'),
                    //     name: this.$t('otc_ad.otc_ad_management'),
                    // },
                    {
                        route: 'referral',  // 邀请好友
                        icon: require('@/assets/img/invite.png'),
                        name: this.$t('referral.invite_friends'),
                    },
                ],
                data3: [
                    {
                        route: 'message',
                        icon: require('@/assets/img/ic_xx@3x.png'),
                        name: this.$t('account.message_center'),
                        small: ''
                    },
                    {
                        route: 'online',
                        icon: require('@/assets/img/ic_zxkf.png'),
                        name: this.$t('account.online_service')
                    },
                    {
                        route: 'set',
                        icon: require('@/assets/img/ic_setting.png'),
                        name: this.$t('user.set')
                    },
                    {
                        route: 'set-lang',
                        icon: require('@/assets/img/lang_set.png'),
                        name: this.$t('user.lang')
                    },

                    {
                        route: 'about',
                        icon: require('@/assets/img/ic_gy@3x.png'),
                        name: this.$t('user.about'),
                        small: '',
                        method: () => {

                        }
                    }
                ],
            }
        },
        computed: {
            ...mapGetters(['getUserInfo', 'getVersion']),
        },
        created() {
            this.getUserState()
            this.getMessageList();
            this.getInfo()
            // this.data4[1].small = `<span class="ft-c-lightGray">${this.getVersion}</span>`
        },
        methods: {
            ...mapActions(['setApiToken', 'setUserInfo']),
            getInfo() {
                myApi.getUserInfo(res => {
                    this.setUserInfo(res);
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            setDefaultIcon(e) {
                let tar = e.currentTarget
                tar.src = avatar
            },
            getUserState() {
                // 获取当前用户状态信息
                userApi.getUserState((data) => {
                    this.userState = {
                        coinState: data.coinState,
                        googleState: data.googleState,
                        nickname: data.nickname,
                        verifyState: data.verifyState,
                        verifyTimes: data.verifyTimes
                    }
                    if(this.userState.verifyState !== 0){
                        this.kyc.route = 'ucenter'
                    }
                    this.isUseCoinPay = (data.coinState === 1)
                }, (msg) => {
                    // console.error(msg)
                })
            },
            showVerifyState(targetVerifyState) { // 实名验证状态
                if (this.userState.verifyTimes <= 3) {
                    if (this.userState.verifyTimes === 3) {
                        if (this.userState.verifyState === 0) {
                            return targetVerifyState === 3
                        } else {
                            return targetVerifyState === this.userState.verifyState
                        }
                    } else {
                        return targetVerifyState === this.userState.verifyState
                    }
                } else {
                    return targetVerifyState === 3
                }
            },
            getMessageList() {
                // 参数为空时获取所有未读消息
                userApi.getMessages({}, (res) => {
                    if (res.total) {
                        this.data3[0].small = `<span class="ft-c-lightGray">${this.$t('account.unread_message')}</span><span class="mint-badge is-error is-size-small">${res.total}</span>`
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped="">
    .page-main{
        padding-bottom: 0.4rem;
    }
    .user {
        .user_head {
            position: relative;
            overflow: hidden;
            background: #151C2C;
            margin-top: 0.2rem;
            padding: 0.3rem;

            .info {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                color: #fff;

                label {
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 50%;
                    overflow: hidden;

                    img {
                        height: 100%;
                        width: 100%;
                        object-fit: cover;
                    }
                }

                div {
                    padding-left: 0.32rem;
                    width: 5.72rem;
                }

                p {
                    line-height: 0.5rem;
                }

                & > span {
                    img {
                        width: 0.15rem;
                        height: 0.24rem;
                    }
                }
            }
        }
    }

    .hr /deep/ {
        position: relative;

        &:after {
            content: '';
            display: block;
            position: absolute;
            z-index: 9;
            bottom: 0;
            right: 0.3rem;
            left: 0.3rem;
            background: #eee;
            height: 0.02rem;
        }

        &:last-of-type:after {
            display: none;
        }
    }

    .msg {
        color: #fff;
        display: inline-block;
        border-radius: 50%;
        font-size: 0.24rem;
        line-height: 0.2rem;
        width: 0.3rem;
        height: 0.3rem;
        text-align: center;
        background: #4AC6C3;
    }

    .icon_setting {
        width: 0.35rem;
    }

    .state {
        display: inline-block;
        margin-left: 0.3rem;
        line-height: .5rem;
        padding-left: .2rem;
        padding-right: .2rem;
        border-radius: 4px;

        &.entrance {
            color: #56C1FF;
        }

        &.wait {
            color: #ffde00;
        }

        &.success {
            color: #03c087;
        }

        &.fail {
            color: #e76d42;
        }
    }

    /deep/ .mint-badge {
        color: #fff;
        text-align: center;
        display: inline-block;
        line-height: normal;
        transform: scale(.9);
        transform-origin: center right;

        &.is-size-small {
            border-radius: 10px;
            font-size: 0.24rem;
            padding: 0.03rem 0.1rem 0.04rem;
        }

        &.is-error {
            background-color: #f44336;
        }
    }

    .sublist {
        padding-left: 0;
        padding-right: 0;
    }

    .sublist li {
        font-size: 0.24rem;
        text-align: center;

        img {
            width: 0.95rem;
            height: 0.95rem;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }
    }
</style>
