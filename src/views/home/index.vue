<template>
    <div class="page">
        <top-back :back="false" :logo="true"></top-back>
        <div class="mt90 pt0" >
            <banner/>
            <label class="flex">
                <i class="ico"><img src="../../assets/img/notice.png"></i>
                <notice/>
                <router-link :to="{name: 'notice'}" class="ft-c-lightGray">{{$t('public0.more')}}</router-link>
            </label>
        </div>
        <div class="page-main">
            <vote/>
            <data-list/>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import banner from './index/banner'
    import notice from './index/notice'
    import dataList from './index/data_list'
    import Utils from "../../assets/js/utils"
    import KLineWebSocket from '@/assets/js/websocket'
    import vote from './index/vote'
    

    export default {
        name: 'home',
        components: {
            banner,
            notice,
            dataList,
            vote
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
                })
                window.setMarketList(res.data)
              }
            }
          })
        },
        beforeDestroy () {
          this.socket && this.socket.close()
        },
        
    }
</script>

<style lang="less" scoped="">
.page-main {top: 5.6rem;}
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.25rem 0.3rem;
    padding: 0.18rem 0.24rem;
    background-color: #fff;
    border-radius:0.45rem;
    & > div{
        flex-shrink: 1;
        flex-grow: 1;
    }
    .ico{
        width: 0.74rem;
        height: 0.54rem;
        padding-right: 0.2rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
}

</style>
