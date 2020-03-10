<template>
    <div class="page">
        <top-back :backPage="'ucenter'">{{$t('user.safety')}}</top-back>
        <div class="page-main">
            <div class="mt20">
                <rail-bar v-for="data in data1" :item="data"></rail-bar>
            </div>
        </div>
    </div>
</template>

<script>
    import railBar from '../../../components/RailBar'
    import {mapGetters} from 'vuex'

    export default {
        components: {
            railBar
        },
        data() {
            return {
                data1: [
                    {
                        route: 'google-verify',
                        name: this.$t('home.home12'),
                    },
                    {
                        route: 'phoneVerify',
                        name: this.$t('auth_warning.warning_SMS_auth'),
                    },
                    {
                        route: 'resetPW',
                        name: this.$t('account.user_center_change_password'),
                    },
                    {
                        route: 'bindEmail',
                        name: this.$t('public0.public159'),
                    }
                ],
                userInfo: {},
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
        },
        watch: {
            getUserInfo(){
                this.setStatus()
                if(this.getUserInfo.email){
                    this.data1[3].route = 'safe'
                }
            }
        },
        created() {
            this.setStatus()
        },
        methods: {
            setStatus(){
                if (this.getUserInfo.googleAuthEnable === 1) {
                    this.data1[0].small = `<span style="color:#999">${this.$t('account.user_center_state_bind')}</span>`
                } else {
                    this.data1[0].small = `<span style="color:#999">${this.$t('user.noBind')}</span>`
                }
                if(this.getUserInfo.mobileAuthEnable === 1){
                    this.data1[1].small = `<span style="color:#999">${this.$t('account.user_center_state_bind')}</span>`
                } else {
                    this.data1[1].small = `<span style="color:#999">${this.$t('user.noBind')}</span>`
                }
                this.data1[3].small = this.getUserInfo.email ? `<span style="color:#999">${this.$t('account.user_center_state_bind')}</span>`:
                    `<span style="color:#999">${this.$t('user.noBind')}</span>`
            }
        }
    }
</script>

<style scoped lang="less">
    .page-main {
        padding-left: 0;
        padding-right: 0;
    }

    .hr {
        position: relative;

        &:after {
            content: '';
            display: block;
            position: absolute;
            z-index: 9;
            /*width: calc(100% - 0.88rem);*/
            bottom: 0;
            right: 0.3rem;
            left: 0.3rem;
            background: #eee;
            height: 0.02rem;
        }

        &:last-child:after {
            display: none;
        }
    }
    .cont{
        position: relative;
        .switchT{
            position: absolute;
            right: 0.3rem;
            top: 0.18rem;
            z-index: 999;
        }
    }
</style>
