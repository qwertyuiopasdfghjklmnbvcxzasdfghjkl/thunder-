<template>
    <div id="app">
        <transition enter-active-class="animated short myFadeIn" leave-active-class="animated short fadeOut">
            <router-view :class="{wrap:$route.meta.nav}"/>
        </transition>
        <update ref="update"></update>
        <download v-if="system === 0" :phone="phone"></download>
        <nav-footer v-show="$route.meta.nav"></nav-footer>
         <init-slides></init-slides>
    </div>
</template>

<script>
    import navFooter from '@/components/common/nav'
    import update from '@/components/update'
    import {mapGetters, mapActions} from 'vuex'
    import GlobalWebSocket from '@/assets/js/websocket'
    import OtcWebSocket from '@/assets/js/websocket-otc'
    import utils from '@/assets/js/utils'
    import numUtils from '@/assets/js/numberUtils'
    import cordovaUtils from '@/assets/js/cordovaUtils'
    import marketApi from '@/api/market'
    import walletApi from '@/api/wallet'
    import Download from "@/components/download";
    import userApi from '@/api/user'
    import initSlides from '@/components/initSlides'

    export default {
        components: {
            navFooter,
            update,
            Download,
            initSlides
        },
        data(){
            return{
              gws:null,
              otcws:null,
              system: 1,
              phone: null
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getOtcSocketEvents', 'getMarketList'])
        },
        watch: {
            getApiToken(newVal) {
                this.loadLoginInfo()
                this.queryMarketList()
                this.getBtcPrice()
                this.gws && this.gws.changeLogin()
            },
        },
        created() {
            utils.gtValidate()
            this.queryMarketList()
            this.getSysparams()
            this.getBtcPrice()
            this.loadLoginInfo()
            this.checkDeviceready()
            window.setMarketList = this.queryMarketList //全局市场数据处理函数
            //建立全局推送，初始化数据
            this.gws = new GlobalWebSocket({
                type: 'global',
                checkNetWork: (signal) => {
                    this.setNetworkSignal(signal)
                },
                onClose: () => {
                    this.setNetworkSignal(3)
                },
                callback: (res) => {
                    if (res.dataType === 'LastValuation') {
                        this.setUSDCNY({
                            USD: numUtils.BN(res.USD).toFixed(8),
                            CNY: numUtils.BN(res.USDCNY).toFixed(8),
                            USDT: numUtils.BN(res.USDT).toFixed(8),
                        })
                        let list = {}
                        for(let v in res){
                            list[v] = Number(res[v])
                        }
                        // console.log(list)
                        // this.setBtcPrice(list)
                        this.setBTCValuation(numUtils.BN(res.totalAmount).toFixed(8)) // 当前转换人民币
                    }
                }
            })

            //建立OTC推送，初始化数据
            this.otcws = new OtcWebSocket({
              onMessage: (data) => {
                let events = this.getOtcSocketEvents
                for (let i = 0; i < events.length; i++) {
                  let ev = events[i]
                  ev(data)
                }
              }
            })


            if(!window['cordova']){
                this.system = 0
                this.phone = utils.getPhonePlatform()
            }

        },
        mounted() {
            $('#app').on('click', 'input', (e) => {
                e.target.focus()
            })
        },
        beforeDestory(){
            this.stopServer()
        },
        methods: {
            ...mapActions(['setBTCValuation', 'setUSDCNY', 'setNetworkSignal', 'setBtcValues', 'setMarketList',
                'setUserWallets', 'setMarketConfig', 'setApiToken', 'setUserInfo', 'setVersion', 'setSysParams',
                'setInitMarket', 'setBtcPrice']),
            getSysparams(){
              marketApi.rateSysparams(res=>{
                let params = {}
                for(let item of res){
                  params[item.code] = item
                }
                this.setSysParams(params)
                setTimeout(()=>{
                    this.$refs.update.getLatestVersion() //检测全量更新
                },3000)
              })
            },
            queryMarketList(data) {
                //获取市场列表并初始化BTC币种与其它币种最新交易价格
                let fun = (res)=>{
                    if(!res){
                        return
                    }
                    if (!this.getApiToken) {
                        res.forEach((item) => {
                            item.collection = false
                        })
                    }
                    let list = []
                    res.filter((d) => {
                        if(d.marketType === '1'){
                            list.push(d) //隐藏虚拟市场
                        }
                    })
                    // console.log(list)
                    this.setMarketList(list)
                    this.setInitMarket(list[0].currencySymbol+'_'+list[0].baseSymbol)
                    this.setBtcValues(list)
                    let config = {}
                    list.forEach((item) => {
                        config[item.market] = {
                            minAmount: item.minAmount,
                            minQuantity: item.minQuantity
                        }
                    })
                    this.setMarketConfig(utils.isPlainEmpty(config) ? null : config)
                }
                if(!data){
                    if(this.getMarketList && this.getMarketList.length){
                        return
                    }
                    marketApi.marketList((res) => {
                        fun(res)
                    }, msg=>{
                        setTimeout(()=>{
                            this.queryMarketList()
                        }, 100)
                    })
                } else {
                    fun(data)
                }
            },
            loadLoginInfo() {
                // console.log('getApiToken===', this.getApiToken)
                if (this.getApiToken) {
                    this.getInfo()
                    walletApi.myAssets({}, (res) => {
                        if(res.length==0){
                            setTimeout(this.loadLoginInfo,2000)
                            return
                        }
                        res = res.filter(item => {
                            return item.type === 1
                        })
                        res.forEach((item) => {
                            item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
                        })
                        this.setUserWallets(res)
                    })
                } else {
                    this.setUserWallets([])
                }
            },
            getInfo() {
                userApi.getUserInfo(res => {
                    this.setUserInfo(res)
                })
            },
            getBtcPrice() {
                // if (!this.getApiToken) {
                //     return
                // }
                marketApi.getBtcPrice(res => {
                    this.setUSDCNY({
                        USD: numUtils.BN(res.USD).toFixed(8),
                        CNY: numUtils.BN(res.CNY).toFixed(8),
                        USDT: numUtils.BN(res.USDT).toFixed(8),
                    })
                    let list={}
                    for(let v in res){
                        list[v] = Number(res[v])
                    }
                    // console.log(list)
                    this.setBtcPrice(list)
                    this.setBTCValuation(numUtils.BN(res.btcAmount).toFixed(8)) // 当前转换人民币
                })
            },
            checkDeviceready() {
                if (window['deviceready']) {
                    console.log('AppVersion = ', AppVersion.version)
                    this.setVersion(AppVersion.version)
                    this.startServer('kline')
                } else {
                    setTimeout(this.checkDeviceready, 100)
                }
            }, //检测壳连接状态
            stopServer() {
                if ( window.httpd ) {
                    window.httpd.stopServer(()=>{},(error)=>{});
                }
            },
            startServer( wwwroot ) { //启动本地http服务
                window.httpd = window['cordova'] && window['cordova'].plugins && window['cordova'].plugins.CorHttpd ? window['cordova'].plugins.CorHttpd : null
                if ( window.httpd ) {
                    window.httpd.getURL((url)=>{
                        if(url.length > 0) {
                            window.httpdURL = 'http://127.0.0.1:8080'
                        } else {
                            window.httpd.startServer({
                                'www_root' : wwwroot,
                                'port' : 8080
                            }, (url)=>{
                                window.httpdURL = 'http://127.0.0.1:8080'
                            }, (error)=>{
                                Tip({type:'error', message:'failed to start server: '+ error});
                            });
                        }

                    },()=>{});
                }
            },
        }
    }
</script>

<style lang="less">
    @import './assets/css/style.css';
    @import './assets/css/common.less';
    @import './assets/css/fonts.css';

    #app {
        font-family: SFUIText-Regular, PingFang-SC, 'Microsoft YaHei', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .page.wrap {
        height: -webkit-calc(~'100vh - 0.98rem');
        height: calc(~'100vh - 0.98rem');
    }
</style>
<style type="text/css">
    @media screen and (min-aspect-ratio: 13/9) {
        .tip {
            padding: 0.08rem !important;
            font-size: 0.16rem !important;
        }
    }
</style>
