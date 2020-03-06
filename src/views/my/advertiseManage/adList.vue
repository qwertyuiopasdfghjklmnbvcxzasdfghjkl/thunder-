<template>
    <div>
        <top-back>
            {{$t('otc_ad.otc_ad_management')}}
            <router-link slot="right" :to="{name:'#'}" class="add_ad">
                <img src="../../../assets/img/add.png">
            </router-link>
        </top-back>

        <ul class="tabs">
            <li v-for="item in navList"
                v-tap="{methods:()=>{nav=item.val}}"
                :class="{'active':nav===item.val}">{{item.name}}
            </li>
        </ul>

        <div class="page-main">
            <ad-list-cont/>
        </div>
    </div>
</template>

<script>
    import AdListCont from "./adList/adListCont";
    export default {
        name: "adList",
        components: {AdListCont},
        data() {
            return {
                nav: 0,
                navList: [
                    {name: this.$t('home.home59'), val: 0},
                    {name: this.$t('public0.public51'), val: 1},
                    {name: this.$t('public0.public52'), val: 2},
                    {name: this.$t('exchange.exchange_cancelled'), val: 3},
                ]
            }
        },
        created() {

        },
        methods: {}
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
