<template>
    <div class="ad_law box" v-tap="{methods: toDetail}">
        <div class="top">
            <p><span :class="[item.ad_type === 2 ? 'sell' : 'buy']">{{type}}</span>{{item.symbol}}</p>
            <span class="status" :class="status.style">{{status.value}}</span>
        </div>
        <div class="tab">
            <div>
                <p>{{toFlex(item.cur_price)}} {{item.currency}}</p>
                <span>{{$t('exchange.exchange_price')}}</span>
            </div>
            <div>
                <p>{{item.symbol_count}} {{item.symbol}}</p>
                <span>{{$t('exchange.exchange_amount')}}</span>
            </div>
            <div>
                <p>{{item.updated_at}}</p>
                <span>{{$t('exchange.exchange_date')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "adLaw",
        props:['item'],
        data() {
            return {}
        },
        computed:{
            type(){
                return this.$t(this.item.ad_type === 2 ? 'exchange.exchange_sell' : 'exchange.exchange_buy')
            },
            status(){
                // status  广告状态（0：已下架、1：已上架、2：已过期）
                let obj = {
                    style: 'break',
                    value: this.$t('public0.public52')
                }
                switch (true) {
                    case this.item.status === 0:
                        return obj;
                    case this.item.status === 1:
                        obj.style = 'blue'
                        obj.value = this.$t('public0.public51')
                        return obj;
                    case this.item.status === 3:
                        obj.style = 'break'
                        obj.value = this.$t('market.past')
                        return obj
                }
                return obj
            }
        },
        created() {

        },
        methods: {
            toDetail(){
                this.$router.push({name: 'adManageDetail',query: this.item})
            },
            toFlex(i){
                return parseFloat(i).toFixed(2)
            }
        }
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
    .buy {color: #E01C37;}
    .sell {color: #0EB574;}
}
    .status{
        font-size: 0.24rem;
        padding: 0 0.1rem;
        border-radius: 0.1rem;
        line-height: 0.44rem;
        background: #0C6AC9;
        &.break{
            background: #4B5875;
        }
    }
</style>
