<template>
    <mt-tabbar v-model="selected" :fixed="true">
        <mt-tab-item id="home" v-tap="{methods:$root.routeTo, to:'home', replace:true}">
            <img slot="icon" src="../../assets/img/icon_home_a@3x.png">
            <img slot="icon" src="../../assets/img/icon_home_b@3x.png">
            <p>{{$t('nav.home')}}</p>
        </mt-tab-item>
        <mt-tab-item id="market" v-tap="{methods:$root.routeTo, to:'market', replace:true}">
            <img slot="icon" src="../../assets/img/icon_market_a@3x.png">
            <img slot="icon" src="../../assets/img/icon_market_b@3x.png">
            <p>{{$t('exchange.advanced_market')}}</p>
        </mt-tab-item>
        <mt-tab-item id="exchange" v-tap="{methods:$root.routeTo, to:'exchange', replace:true}">
            <img slot="icon" src="../../assets/img/icon_trade_a@3x.png">
            <img slot="icon" src="../../assets/img/icon_trade_b@3x.png">
            <p>{{$t('nav.trade')}}</p>
        </mt-tab-item>
        <mt-tab-item id="trading" v-tap="{methods:$root.routeTo, to:'trading', replace:true}">
            <img slot="icon" src="../../assets/img/icon_account_a@3x.png">
            <img slot="icon" src="../../assets/img/icon_account_b@3x.png">
            <p>{{$t('home.home45')}}</p>
        </mt-tab-item>
    </mt-tabbar>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'nav-footer',
        data() {
            return {
                selected: 'home'
            }
        },
        mounted() {
            this.setTab()
        },
        watch: {
            $route(_new) {
                this.setTab()
                if (window.StatusBar) {
                  if(_new.name==='ucenter'){
                    StatusBar.backgroundColorByHexString('#3B48C8')
                  } else if(_new.name==='kline' || _new.name==='full-screen'){
                    StatusBar.backgroundColorByHexString('#131e30')
                  } else {
                    StatusBar.backgroundColorByHexString('#FFFFFF')
                  }
                }
            },
        },
        computed: {
            ...mapGetters([]),
        },
        methods: {
            setTab() {
                if (this.$route.path.indexOf('exchange') > -1) {
                    this.selected = 'exchange'
                } else if (this.$route.path.indexOf('trading') > -1) {
                    this.selected = 'trading'
                } else if (this.$route.path.indexOf('market') > -1) {
                    this.selected = 'market'
                } else {
                    this.selected = 'home'
                }
            }
        },
    }

</script>
<style lang="less">
    #app .mint-tabbar {
        background-color: #1D2537;
        background-image: none;
        > .mint-tab-item {
            color: #4B5875;
            padding: 0.14rem 0;
            background-color: #1D2537;

            .mint-tab-item-icon {
                width: 0.42rem;
                height: 0.42rem;
                margin-bottom: 0;

                img {
                    object-fit: contain;
                }
            }

            img:last-of-type {
                display: none;
            }

            &.is-selected {
                color: #0C6AC9;

                img:first-of-type {
                    display: none;
                }

                img:last-of-type {
                    display: block;
                }
            }

            .mint-tab-item-label {
                font-size: 0.2rem;
                line-height: 0.2rem;
                padding-top: 0.1rem;
            }
        }

    }

    .red-dot {
        position: absolute;
        right: 0.4rem;
        top: 0.2rem;
        background-color: red;
        width: 5px;
        height: 5px;
        border-radius: 50%;
    }
</style>
