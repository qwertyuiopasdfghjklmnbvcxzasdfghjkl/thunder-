<template>
    <div class="ad_law box">
        <div class="top">
            <p><span class="ft-c-red">{{type}}</span>USDT</p>
            <span class="status">{{status}}</span>
        </div>
        <div class="tab">
            <div>
                <p>132</p>
                <span>{{$t('exchange.exchange_price')}}</span>
            </div>
            <div>
                <p>100</p>
                <span>{{$t('market.buy_total')}}</span>
            </div>
            <div>
                <p>02-10</p>
                <span>{{$t('exchange.exchange_date')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "adLaw",
        data() {
            return {}
        },
        computed:{
            type(){
                return this.$t('otc_exchange.otc_exchange_buy')
            },
            status(){
                return this.$t('public0.public51')
            }
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped lang="less">
.ad_law{
    margin-top: 0.2rem;
    padding: 0.3rem;
    .top, .tab{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #ffffff;
    }
    .top{
        font-size: 0.32rem;
        p{
            span{
                margin-right: 0.12rem;
            }
        }
    }
    .tab{
        div{
            line-height: 0.45rem;
            flex: 1;
            width: 33.33%;
            margin-top: 0.2rem;
            p{
                font-size: 0.28rem;
            }
            span{
                font-size: 0.24rem;
                color: #4C5A74;
            }
            &:nth-of-type(1){
                text-align: left;
            }
            &:nth-of-type(2){
                text-align: center;
            }
            &:nth-of-type(3){
                text-align: right;
            }
        }
    }
}
    .status{
        font-size: 0.24rem;
        padding: 0 0.1rem;
        border-radius: 0.1rem;
        line-height: 0.44rem;
        background: #0C6AC9;
    }
</style>
