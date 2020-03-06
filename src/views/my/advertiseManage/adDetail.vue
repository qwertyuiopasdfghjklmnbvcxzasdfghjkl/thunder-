<template>
    <div>
        <top-back>{{$t('gcox_otc.advertising_details')}}</top-back>
        <div class="page-main">
            <div class="ad_detail full">
                <h4>{{$t('market.base_info')}}</h4>
                <div class="box">
                    <p><span>{{$t('exchange.exchange_type')}}</span><span>{{$t('otc_exchange.otc_exchange_buy')}}</span>
                    </p>
                    <p><span>{{$t('home.home05')}}</span><span>USDT</span></p>
                    <p><span>{{$t('exchange.exchange_Transaction_volume')}}</span><span>1.21 CNY</span></p>
                    <p><span>{{$t('exchange.exchange_problem')}}</span><span>500 USDT</span></p>
                    <p><span>{{$t('gcox_otc.remain_count')}}</span><span>500 USDT</span></p>
                </div>
            </div>
            <div class="ad_detail full">
                <h4>{{$t('market.pay_require')}}</h4>
                <div class="box">
                    <p>
                        <span>{{$t('otc_ad.otc_ad_expiration_pay')}}</span><span>{{$t('otc_exchange.otc_exchange_buy')}}</span>
                    </p>
                    <p><span>{{$t('otc_ad.otc_ad_Minimum_limit')}}</span><span>USDT</span></p>
                    <p><span>{{$t('otc_ad.otc_ad_Maximum_limit')}}</span><span>1.21 CNY</span></p>
                    <p><span>{{$t('otc_ad.otc_ad_Payment_method')}}</span><span>500 USDT</span></p>
                </div>
            </div>
        </div>
        <component :is="btn"/>
    </div>
</template>

<script>
    import down from './adDetail/down.vue'
    import btnAd from './adDetail/btnAd.vue'

    export default {
        name: "adDetail",
        components: {down, btnAd},
        data() {
            return {
                btn: null
            }
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped lang="less">
    .page-main {
        bottom: 1rem;
    }

    .ad_detail {
        h4 {
            font-size: 0.28rem;
            color: #ffffff;
            padding: 0.3rem;
            position: relative;
            line-height: 0.36rem;
            text-indent: 0.2rem;

            &:before {
                content: '';
                display: block;
                position: absolute;
                left: .3rem;
                top: 0.34rem;
                height: 0.28rem;
                width: 0.06rem;
                background: #0C6AC9;
            }
        }

        .box {
            padding: 0.3rem;

            p {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.3rem;
                line-height: 0.6rem;

                span:first-child {
                    color: #4C5A74;
                }
            }
        }
    }
</style>
