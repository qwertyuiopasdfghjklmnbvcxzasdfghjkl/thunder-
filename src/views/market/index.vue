<template>
    <div class="page">
        <top-back :back="false"><span>{{$t('exchange.advanced_market')}}</span></top-back>
        <div class="ft-c-dark">
            <ul class="top_nav">
                <!--<li :class="{'active':type===1}"-->
                    <!--v-tap="{methods: tab, type: 1}">-->
                    <!--<span>{{$t('home.home_favorites')}}&lt;!&ndash;自选&ndash;&gt;</span>-->
                <!--</li>-->

                <li :class="{'active':type===2}"
                    v-tap="{methods: tab, type: 2}"><span>{{$t('market.main_board')}}</span><!--主板--></li>

                <li :class="{'active':type===3}"
                    v-tap="{methods: tab, type: 3}"><span>{{$t('market.new_board')}}</span><!--创新版--></li>
            </ul>
        </div>

        <div class="">
            <market-borad :list="listData"/>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapGetters, mapActions} from 'vuex'
    import KLineWebSocket from '@/assets/js/websocket'
    import marketBorad from "./marketBorad";

    export default {
        name: 'markets',
        components: {
            marketBorad
        },
        data() {
            return {
                type: 2,
            }
        },
        computed: {
            ...mapGetters(['getMarketList']),
            selfData(){
                return (this.getMarketList||[]).filter(res=>{
                    if(res.collection){
                        return res
                    }
                })
            },
            mainData(){
                return (this.getMarketList||[]).filter(res=>{
                    if(Number(res.marketCategory) === 1){
                        return res
                    }
                })
            },
            newData(){
                return (this.getMarketList||[]).filter(res=>{
                    if(Number(res.marketCategory) === 2){
                        return res
                    }
                })
            },
            listData(){
                if(this.type === 1){
                    return this.selfData
                }else if(this.type===2){
                    console.log(this.mainData)
                    return this.mainData
                }else if(this.type===3){
                    console.log(this.newData)
                    return this.newData
                }
            }
        },
        watch:{

        },
        created () {
            this.socket = KLineWebSocket({
                subscribe:['market'],
                callback: (res) => {
                    if (res.dataType === 'markets') {
                        res.data.forEach(item=>{
                            item.idx = window.marketOrder[item.market]
                            item.iconBase64 = window.marketIcon[item.market]
                            item.collection = window.marketCollection[item.market]
                            item.marketCategory = window.marketCategory[item.market]
                        })
                        window.setMarketList(res.data)
                    }
                }
            })
        },
        beforeDestroy () {
            this.socket && this.socket.close()
        },
        methods: {
            tab(e) {
                this.type = e.type
            }
        }
    }
</script>

<style lang="less" scoped>
    .top_nav {
        margin: 0.1rem 0.3rem;
        margin-top: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 0.02rem solid #4B5875;
        border-radius: 0.1rem;

        li {
            flex: 1;
            line-height: 0.6rem;
            text-align: center;
            border-left: 0.02rem solid #4B5875;
            &.active{
                background: #0C6AC9;
                color: #ffffff;
            }
            &:first-child{
                border-left: none;
            }
        }
    }
</style>
