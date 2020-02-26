<template>
<div class="page">
    <top-back>
        {{$t('exchange.exchange_trade_history')}}({{`${currentSymbol}/${baseSymbol}`}})
    </top-back>
    <div class="page-main">
        <lastdeal :currentSymbol="currentSymbol"
                  :baseSymbol="baseSymbol"
                  :symbol="symbol"
                  :accuracy="accuracy"
        ></lastdeal>
    </div>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import lastdeal from "./market/lastdeal"
import KLineWebSocket from '@/assets/js/websocket'

export default {
    name: "last-deal",
    components: {lastdeal},
    data(){
        return{
            currentSymbol:null,
            baseSymbol:null,
            symbol:null,
        }
    },
    created () {
        let params = this.$route.params
        this.currentSymbol = params.currentSymbol
        this.baseSymbol = params.baseSymbol
        this.symbol = params.symbol
        this.accuracy = params.accuracy
        this.socket = KLineWebSocket({
            symbol: this.symbol,
            subscribe:['new_transaction'],
            callback: (res) => {
                if (res.dataType === 'LastTrades') {
                    // 最新成交
                    this.tiggerEvents({
                        name: 'lastdealEvent',
                        params: {
                          type: 'updateData',
                          data: res.data
                        }
                    })
                }
            }
        })
    },
    beforeDestroy () {
      this.socket && this.socket.close()
    },
    methods:{
        ...mapActions(['tiggerEvents']),
        
    }
}
</script>

<style scoped lang="less">

</style>
