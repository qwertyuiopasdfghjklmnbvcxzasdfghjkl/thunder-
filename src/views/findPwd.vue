<template>
    <div class="page">
        <top-back>{{$t('home.home34')}}</top-back>
        <div class="page-main">

            <div class="mt_navbar mt20">
                <label :class="{'active':active==='mail'}"
                       v-tap="{methods:()=>{this.active='mail'}}">{{$t('login_register.retrieved_by_email')}}</label>
                <label :class="{'active':active==='phone'}"
                       v-tap="{methods:()=>{this.active='phone'}}">{{$t('login_register.retrieved_by_cellphone')}}</label>
            </div>
            <find-p-w-email v-show="active==='mail'"/>
            <find-p-w-phone v-show="active==='phone'"/>
        </div>
    </div>
</template>

<script>

    import FindPWEmail from "./login/findPWEmail";
    import FindPWPhone from "./login/findPWPhone";
    export default {
        components: {FindPWPhone, FindPWEmail},
        data() {
            return {
                active: 'mail'
            }
        },
        computed: {

        },

        created() {

        },
        methods: {

        }
    }
</script>


<style lang="less" scoped>
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
                color: #ffffff;
            }
        }
    }
</style>
