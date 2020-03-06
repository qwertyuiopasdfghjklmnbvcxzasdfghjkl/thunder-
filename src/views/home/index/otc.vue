<template>
    <div class="otc">
        <router-link :to="{name:'qotc',params:{type:1}}" class="box">
            <label>
                <p>{{$t('market.flash_buy')}}</p>
                <span>{{$t('market.flash_buy_small')}}</span>
            </label>
            <img src="../../../assets/img/flash_buy.png"/>
        </router-link>
        <router-link :to="{name:'qotc',params:{type:2}}" class="box">
            <label>
                <p>{{$t('market.flash_sell')}}</p>
                <span>{{$t('market.flash_sell_small')}}</span>
            </label>
            <img src="../../../assets/img/flash_sell.png"/>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "otc",
        data() {
            return {}
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped lang="less">
.otc{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.1rem;
    margin-top: 0.2rem;
    .box{
        border-radius: 0.1rem;
        margin: 0 0.1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        padding: 0.2rem;
        height: 1.2rem;
        label{
            p{
                color: #ffffff;
                font-size: 0.32rem;
            }
            span{
                color: #717F8E;
                font-size: 0.22rem;
                padding-top: 0.06rem;
                display: block;
            }
        }
        img{
            width: 0.8rem;
        }
    }
}
</style>
