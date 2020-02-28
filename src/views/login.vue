<template>
    <div class="page">
        <top-back :back="false" v-tap="{methods: showC}">
            <span class="right" v-tap="{methods:goBack}">
                {{$t('account.user_cancel')}}
            </span>
        </top-back>
        <div class="page-main">
            <p class="login_logo">
                <img src="../assets/img/logo.png">
            </p>
            <div class="login-form">

                <div class="mt_navbar">
                    <label :class="{'active':active==='mail'}"
                           v-tap="{methods:()=>{this.active='mail'}}">{{$t('market.email_login')}}</label>
                    <label :class="{'active':active==='phone'}"
                           v-tap="{methods:()=>{this.active='phone'}}">{{$t('market.phone_login')}}</label>
                </div>
                <div>
                    <e-mail-login v-show="active==='mail'"/>
                    <phone-login v-show="active==='phone'"/>
                </div>

                    <router-link tag="span" class="forget mt60" :to="{name:'findpwd'}">{{$t('login_register.forget_password')}} <!--忘记密码--></router-link>
                    <router-link class="register" :to="{name:'register'}">{{$t('login_register.register')}}</router-link>


            </div>
        </div>
    </div>
</template>

<script>

    import config from '@/api/config'
    import VConsole from 'vconsole'
    import EMailLogin from "./login/eMailLogin";
    import PhoneLogin from "./login/phoneLogin";

    export default {
        name: 'login',
        components: {PhoneLogin, EMailLogin},
        data() {
            return {
                brand: config.brand.toUpperCase(),
                curl: '', //登录回调地址
                vi: 0,
                active: 'mail'
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.curl = to.query.curl || '/ucenter'
            })
        },

        created() {

        },
        methods: {

            goBack(){
                this.$router.back();
            },
            goSet(){
                this.$router.push({name: 'set-lang'})
            },
            showC() { // 偷偷连按五次打开调试
                this.vi++
                let timer
                clearTimeout(timer)
                timer = setTimeout(() => {
                    this.vi = 0
                }, 1000)
                if (this.vi === 5) {
                    window.vConsole = new VConsole()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page{
        background: #101722;
    }
    .right{
        position: absolute;
        top: 0;
        right:0.3rem;
        z-index: 99;
        height: 0.8rem;
        width: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.3rem;
        font-weight: 400;
        color: #4B5875;
        img{
            width: 0.4rem;
        }
    }
    .login-title {
        margin-top: 0.5rem;
        color: #9DAAAA;
        font-size: 0.52rem;
    }

    .no-account {
        position: absolute;
        bottom: 0.5rem;
        left: 0;
        right: 0;
        text-align: center;
    }

    .login_logo {
        height: 3.3rem;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 1.5rem;
        }
    }

    .forget_password {
        position: absolute;
        left: 0.2rem;
        bottom: 0.8rem;
    }

    .sing_in {
        position: absolute;
        right: 0.2rem;
        bottom: 0.8rem;
    }

    .off {
        position: absolute;
        width: 0.8rem;
        height: 0.9rem;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 0.27rem;
            height: 0.27rem;
        }
    }

    .mt_navbar{
        background: none;
        color: #4B5875;
        border-bottom: 0.02rem solid #364463;
        height: 0.6rem;
        display: flex;
        align-items: center;

        label{
            margin: 0 0.2rem;
            height: 0.6rem;
            border-bottom: 0.04rem solid transparent;
            &.active{
                border-bottom: 0.04rem solid #0C6AC9;
            }
        }
    }
    .forget{
        display: block;
        text-align: center;
        color: #0C6AC9;
    }
    .register{
        position: absolute;
        width: 100%;
        display: block;
        left: 0;
        bottom: 0.6rem;
        text-align: center;
        color: #ffffff;
        font-size: 0.26rem;
    }
</style>
