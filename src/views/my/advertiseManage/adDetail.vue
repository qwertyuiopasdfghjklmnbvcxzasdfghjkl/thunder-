<template>
    <div>
        <top-back>{{$t('gcox_otc.advertising_details')}}</top-back>
        <div class="page-main">
            <div class="ad_detail full">
                <h4>{{$t('market.base_info')}}</h4>
                <div class="box">
                    <p>
                        <span>{{$t('exchange.exchange_type')}}</span>
                        <span :class="[item.ad_type === 2 ? 'sell' : 'buy']">{{type}}</span>
                    </p>
                    <p><span>{{$t('home.home05')}}</span><span>{{item.symbol}}</span></p>
                    <p><span>{{$t('exchange.exchange_Transaction_volume')}}</span><span>{{(item.symbol_count - item.remain_count).toFixed(2)}} {{item.symbol}}</span></p>
                    <p><span>{{$t('exchange.exchange_problem')}}</span><span>{{item.symbol_count}} {{item.symbol}}</span></p>
                    <p><span>{{$t('gcox_otc.remain_count')}}</span><span>{{item.remain_count}} {{item.symbol}}</span></p>
                </div>
            </div>
            <div class="ad_detail full">
                <h4>{{$t('market.pay_require')}}</h4>
                <div class="box">
                    <p>
                        <span>{{$t('otc_ad.otc_ad_expiration_pay')}}</span><span>{{item.pay_limit_time}} {{$t('exchange.exchange_min')}}</span>
                    </p>
                    <p><span>{{$t('otc_ad.otc_ad_Minimum_limit')}}</span><span>{{item.min_amount}} {{item.ad_type === 2 ? item.currency : item.symbol}}</span></p>
                    <p><span>{{$t('otc_ad.otc_ad_Maximum_limit')}}</span><span>{{item.max_amount}} {{item.ad_type === 2 ? item.currency : item.symbol}}</span></p>
                    <p><span>{{$t('otc_ad.otc_ad_Payment_method')}}</span>
                        <span><i class="icon_payment" v-for="data in item.pay_type.split(',')" :class="[payTrans[data]]"></i></span>
                    </p>
                </div>
            </div>
        </div>
        <component :is="btn" :item="item"/>
    </div>
</template>

<script>
    import down from './adDetail/down.vue'
    import btnAd from './adDetail/btnAd.vue'
    import otcConfig from '../../../assets/js/otcconfig'

    export default {
        name: "adDetail",
        components: {down, btnAd},
        data() {
            return {
                btn: null,
                item: {}
            }
        },
        computed:{
            type(){
                return this.$t(this.item.ad_type === 2 ? 'exchange.exchange_sell' : 'exchange.exchange_buy')
            },
            payTrans(){
                let _payTrans = {}
                for(let item of otcConfig.payments){
                    _payTrans[item.id] = item.className
                }
                return _payTrans
            },
        },
        created() {
            this.item = this.$route.query
            // status  广告状态（0：已下架、1：已上架、2：已过期）
            if(this.item.status == 0){
                this.btn = btnAd
            }else if(this.item.status == 1){
                this.btn = down
            }
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
    .buy {color: #E01C37;}
    .sell {color: #0EB574;}

    .icon_payment {
        width: .4rem;
        height: .4rem;
        margin-right: .2rem;
        &.paypal {
            background-image:url('../../../assets/img/icon-paypal-big.png');
        }
        &.alipay {
            background-image:url('../../../assets/img/icon-alipay-big.png');
        }
        &.bank {
            background-image:url('../../../assets/img/icon-bank-big.png');
        }
        &.wechat {
            background-image:url('../../../assets/img/icon-wechat-big.png');
        }
    }
</style>
