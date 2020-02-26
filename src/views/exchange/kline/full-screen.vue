<template>
    <div class="cont">
        <div class="top">
            <span>{{symbol_display}}</span>
            <span class="time">{{time.format()}}</span>
            <router-link :to="{name: 'kline', params: {market: `${currentSymbol}_${baseSymbol}`}}" replace></router-link>
        </div>
        <div class="main">
            <iframe ref="klineContainer" id="klineContainer" frameborder="0" height="100%" width="100%" scrolling="no" marginheight="0" marginwidth="0" src="" @load="iframeLoaded"></iframe>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import Config from "@/api/config"
export default {
    name: 'kline-full',
    data() {
        return {
            domain:Config.url,
            klineSocket: null,
            business: {
                market: ''
            },
            time: new Date()
        }
    },
    computed: {
        ...mapGetters(['getInitMarket', 'getLang']),
        klineURL(){
            if(window['cordova']){
                window.httpdURL = window.httpdURL?window.httpdURL:'https://etvcoins.com/kline/'
            }
            let _url = window.httpdURL?window.httpdURL:'/kline/'
            return `${_url}?symbol=${this.symbol}&domain=${this.domain}&lang=${this.getLang=='zh-CN'?'zh':'en'}`
        },
        baseSymbol() {
            return this.business.market.split('_')[1]
        },
        currentSymbol() {
            return this.business.market.split('_')[0]
        },
        symbol() {
            return this.business.market.split('_').join('')
        },
        symbol_display() {
            return `${this.currentSymbol}/${this.baseSymbol}`
        }
    },
    watch: {
        '$route.params.market'() { //切换市场后重新初始化websoket
            this.business.market = this.$route.params.market
        },
    },
    created() {
        this.business.market = this.$route.params.market || this.getInitMarket
        setInterval(() => {
            this.time = new Date()
        }, 1000)
    },
    mounted(){
        this.setIframe()
    },
    methods: {
        ...mapActions([]),
        iframeLoaded(){
            setTimeout(()=>{
                this.loading = false
            },1000)
        },
        setIframe(){
            if(!this.loading){
                this.loading = true
                this.$refs.klineContainer.src = this.klineURL
            }
        },
    }
}
</script>

<style scoped lang="less">
.top {
    background: #131e30;
    flex-shrink: 0;
    height: 0.8rem;
    width: 100vh;
    display: flex;
    align-items: center;
    padding: 0 0.2rem;
    justify-content: space-between;
    color: #6C6F8B;
    a {
        background: url("../../../assets/img/out-full.png") no-repeat center;
        width: 0.8rem;
        height: 0.8rem;
        display: inline-block;
        background-size: 0.4rem;
    }

    span {
        font-size: 0.32rem;
    }

    .time {
        font-size: 0.2rem;
        text-align: right;
        flex: 1;
        margin-right: 0.2rem;
    }
}

.main {
    width: calc(100vh);
    height: calc(100vw);
    position: relative;
    z-index: -1;

    .kline {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
}
/* 竖屏 */
@media screen and (orientation: portrait) {
    .cont {
        background: #0e1a28;
        display: flex;
        width: 100vh;
        height: 100vw;
        top: calc((100vh - 100vw) / 2);
        left: calc((100vw - 100vh) / 2);
        flex-wrap: wrap;
        font-size: 0.28rem;
        position: absolute;
        transform: rotate(90deg);
        .main{
            width: calc(100vh);
            height: calc(100vw - 0.8rem);
        }
    }
}

/* 横屏 */
@media screen and (orientation: landscape) {
    .cont {
        background: #0e1a28;
        display: flex;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        flex-wrap: wrap;
        font-size: 0.14rem;
        position: absolute;
        transform: rotate(0deg);
        .top{
            width: 100vw;
            height: 0.4rem;
            span{
                font-size: 0.16rem;
            }
            .time{
                font-size: 0.1rem;
            }
            a{
                width: 0.4rem;
                height: 0.4rem;
                background-size: 0.2rem;
            }
        }
        .main{
            width: calc(100vw);
            height: calc(100vh - 0.4rem);
        }
    }
}
</style>
