<template>
    <div class="page">
        <top/>
        <div class="page-main" >
            <banner/>
            <div class="box">
                <label class="flex">
                    <i class="ico"><img src="../../assets/img/svg/notice.svg"></i>
                    <notice/>
                    <router-link :to="{name: 'notice'}" class="ft-c-lightGray">{{$t('public0.more')}}</router-link>
                </label>
                <data_box/>
            </div>
            <!--<p>{{this.$store.state.common.lang}}</p>-->
            <otc/>
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
    import top from "./index/top";
    import Data_box from "./index/data_box";
    import otc from "./index/otc";


    export default {
        name: 'home',
        components: {
            Data_box,
            top,
            banner,
            notice,
            dataList,
            vote,
            otc
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

    }
</script>

<style lang="less" scoped="">
.page-main {padding: 0}
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.02rem solid #1D273C;
    padding: 0.18rem 0.24rem;
    & > div{
        flex-shrink: 1;
        flex-grow: 1;
    }
    .ico{
        width: 0.36rem;
        height: 0.36rem;
        margin-right: 0.2rem;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
    .box{

    }

</style>
