<template>
    <div class="page">
        <top-back>{{$t('referral.to_rebate')}} <!-- 邀请返利 --> </top-back>
        <div class="page-main">
            <div class="full box mt20 top">
                <p class="title">{{$t('referral.invitation_code')}}<!-- Invitation Code --></p>
                <div class="mt20 ui-flex ui-flex-justify">
                    <input type="text" name="" readonly="" class="ui-flex-1" :value="getUserInfo.myInvitationCode"> <img
                        src="../../assets/img/i_copy.png"
                        v-clipboard:copy="getUserInfo.myInvitationCode"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError">
                </div>
                <p class="title mt35">{{$t('referral.invitation_link')}}<!-- Invitation Link --></p>
                <div class="mt20 ui-flex">
                    <input type="text" name="" readonly="" class="ui-flex-1" :value="getUserInfo.myInvitationUrl"> <img
                        src="../../assets/img/i_copy.png"
                        v-clipboard:copy="getUserInfo.myInvitationUrl"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError">
                </div>
            </div>
            <div class="box mt20 full">
                <router-link class="title allow-right rp ft-c-main f30"
                             :to="{name:'invitePoster', query:{url:getUserInfo.myInvitationUrl}}" tag="p">
                    <strong>{{$t('referral.exclusive_pictures')}}
                    <!-- 专属图片 --></strong></router-link>
            </div>
            <div class="box mt20 full">
                <label class="law">
                    <p>{{$t('referral.recom_user')}}<!-- 已推荐的朋友 --></p>
                    <span>{{inviteUsers}}</span>
                </label>
            </div>
            <ul class="box mt20 list f30 full">
                <li class="ft-c-lightGray f26">
                    <span>{{$t('referral.invited_user')}}<!-- 已邀请的用户 --></span>
                    <!--<span>{{$t('referral.level')}}&lt;!&ndash; 级别 &ndash;&gt;</span>-->
                </li>
                <li v-for="item in invitedUsers">
                    <span>{{item.username}}</span>
                    <!--<span>{{item.levelName==='0B'?'0T':item.levelName}}</span>-->
                </li>
                <li class="ft-c-lightGray f28" v-tap="{methods:loadMore}" v-if="total>5 && !loadAll">
                    <span class="tc">{{$t('public0.loadmore')}}
                    <!-- 加载更多 --></span></li>
            </ul>
            <div class="box mt20 rules full">
                <h1 class="f32 tc"><strong>{{$t('referral.program_rules')}}<!-- 邀请规则 --></strong></h1>
                <ol class="mt30 lh20">
                    <li>• {{$t('vote.rule_4_1')}}</li>
                    <li>• {{$t('vote.rule_4_2')}}</li>
                    <li>• {{$t('vote.rule_4_3')}}</li>
                    <li>• {{$t('vote.rule_3_4')}}</li>
                </ol>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {Toast} from 'mint-ui'
    import voteApi from '@/api/vote'

    export default {
        name: 'referral',
        data() {
            return {
                inviteUsers: 0,
                inviteCommission: 0,
                invitedUsers: [],
                params: {
                    size: 5,
                },
                total: 0,
                loadAll: false,
            }
        },
        watch: {},
        computed: {
            ...mapGetters(['getLang', 'getUserInfo']),

        },
        created() {
            this.getInviteUsers()
            this.getInviteCommission()
            this.getInvitedUsers()
        },
        methods: {
            loadMore() {
                this.params.size = 0
                this.loadAll = true
                this.getInvitedUsers()
            },
            getInviteUsers() {
                voteApi.getInviteUsers(res => {
                    this.inviteUsers = res
                }, msg => {
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            },
            getInviteCommission() {
                voteApi.getInviteCommission(res => {
                    this.inviteCommission = res
                }, msg => {
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            },
            getInvitedUsers() {
                voteApi.getInvitedUsers(this.params, (total, res) => {
                    this.total = total || 0
                    this.invitedUsers = res || []
                }, msg => {
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            },
            onCopy: function (e) {
                Toast(this.$t('public0.public33')) // 复制成功
            },
            onError: function (e) {
                Toast(this.$t('home.copy-error')) // 复制失败
            },
        }

    }
</script>

<style scoped lang="less">
    .top {
        padding: 0.4rem 0.3rem;

        .title {
            font-size: 0.3rem;
            font-weight: bold;
            color: #4B5875;
        }

        input {
            height: 0.6rem;
            border: none;
            border-bottom: 1px solid #1D273C;
            line-height: 0.6rem;
            background: transparent;
            color: #ffffff;
        }

        img {
            width: 0.36rem;
            height: 0.36rem;
            margin-left: 0.25rem;
            vertical-align: middle;
        }
    }

    .list {
        /*background-color: #fff;*/

        li {
            padding: 0 0.3rem;
            line-height: 0.9rem;
            display: flex;
            justify-content: space-between;

            & + li {
                /*border-top: 1px solid #eee;*/
            }
        }
    }

    .rules {
        padding: 0.3rem;
        /*background-color: #fff;*/
        ol{
            color: #4B5875;
        }
    }
.allow-right{
    padding: 0.3rem;
}
    .allow-right:after {
        right: 0.3rem;
    }
    .law{
        padding: 0.3rem;
        display: flex;
        font-size: 0.28rem;
        p{
            flex: 1;
            color: #4B5875;
        }
    }
</style>
