<template>
    <div class="page">
        <top-back>
            {{token}}
            <router-link class="fxlink" :to="{name:'incubation', params:{token:token}}" slot="right" tag="span">孵息加速器</router-link>
        </top-back>
        <div class="assets tc">
            <p class="f24">{{token}} 总资产</p>
            <p class="f60 mt20">{{wallet.totalBalance | removeEndZero}}</p>
            <p class="f24 mt15">≈ {{(token=='USDT'?wallet.totalBalance:totalUsdt)|toFixed(8)|removeEndZero}} USDT</p>
        </div>
        <div class="title mt20 f32 ">交易记录</div>
        <div class="page-main">
            <hoc ref="hoc" @getData="getData" :params="params" size="large">
                <mt-loadmore
                :top-method="loadTop"
                :top-pull-text="$t('home.top-pull-text')"
                :top-drop-text="$t('home.drop-text')"
                :top-loading-text="$t('home.loading-text')"
                :bottom-method="loadBottom"
                :bottom-all-loaded="allLoaded"
                :bottom-pull-text="$t('public0.loadmore')+'...'"
                :bottom-drop-text="$t('home.drop-text')"
                :bottom-loading-text="$t('home.loading-text')"
                :autoFill="false"
                ref="loadmore">
                    <ul class="items full">
                        <li class="ui-flex ui-flex-justify" v-if="kycr">
                            <div>
                                <p class="f32">认证奖励</p>
                                <p class="cgray f24">{{kycr.createdAt}}</p>
                            </div>
                            <span class="f32 ui-flex ui-flex-column ui-flex-center">{{kycr.distributeAmount}} {{token}}</span>
                        </li>
                        <li class="ui-flex ui-flex-justify" v-for="item in datas">
                            <div>
                                <p class="f32">{{item.direction==1?'转入':'转出'}}</p>
                                <p class="cgray f24">{{item.createdAt}}</p>
                            </div>
                            <span class="f32 ui-flex ui-flex-column ui-flex-center">{{item.quantity}} {{token}}</span>
                        </li>
                    </ul>
                    <noMoreData v-if="allLoaded"/>
                    <noData v-if="!datas.length"/>
                </mt-loadmore>
            </hoc>
        </div>
        <router-link :to="{name:'transfer', params:{token:token}}" class="transfer-btn" tag="span"></router-link>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import Hoc from '@/components/common/hoc'
import incubationApi from '@/api/incubation'
import noMoreData from '@/components/common/noMoreData'

const _request = (params) => {
    return new Promise((r,j) => {
      incubationApi.transferRecord(params,(data, total)=>{
        r({data, total})
      },(msg,res)=>{
        j(res)
      })
    })
}
let hoc = new Hoc(null, _request)

export default {
    name: "incubation_detail",
    components: {
        noMoreData,
        hoc,
    },
    data() {
        return {
            token:'',
            params:{
                symbol:'',
                page:1,
                size:20,
                totalPage:1,
            },
            kycr:null,
            datas:[],
            allLoaded:false,
        }
    },
    computed:{
        ...mapGetters(['getIncubatedWallets', 'getMarketList']),
        wallet(){
            let _wallet = this.getIncubatedWallets.filter(item=>{return this.token == item.symbol})
            return _wallet.length?_wallet[0]:{}
        },
        market(){
            return `${this.token}USDT`.toUpperCase()
        },
        totalUsdt(){
            let _price = 0
            for(let item of this.getMarketList || []){
                if(item.market==this.market){
                    _price = item.lastPrice
                    break
                }
            }
            return numUtils.mul(this.wallet.totalBalance||0,_price)
        }
    },
    created() {
        this.token = this.params.symbol = this.$route.params.token
        this.kycRebate()
    },
    methods: {
        kycRebate(){
            incubationApi.kycRebate(this.token,(data, total)=>{
              data && (this.kycr = data)
            })
        },
        getData(data){
            this.datas = data.data
            this.params.totalPage = Math.ceil(data.total/this.params.size)
        },
        async loadTop(){
            let res = await _request(this.params)
            this.getData(res)
            this.$refs.hoc.$refs.loadmore.onTopLoaded()
        },
        async loadBottom(){
            this.params.page += 1
            let res = await _request(this.params)
            this.getData(res)
            if(this.params.totalPage == 1){
              this.allLoaded = true // if all data are loaded
            }
            this.$refs.hoc.$refs.loadmore.onBottomLoaded()
        },
    }
}
</script>

<style scoped lang="less">
@green:#0FB475;
@red:#E11B39;
@cgray:#4B5875;
.fxlink {line-height: 0.9rem; padding-right: 0.3rem;}
.green {color: @green;}
.cgray {color: @cgray;}
.red {color: @red;}
.page-main {top: 4.75rem;}
.assets {
    margin: 1.1rem 0.3rem 0;
    height: 2.5rem;
    padding: 0.4rem 0 0.6rem;
    border-radius: 0.1rem;
    background: url('../../assets/img/incubation_detail_bg.png') no-repeat center/cover;
}
.title{ background-color: #151C2C; line-height: 0.95rem; padding-left: 0.3rem; padding-right: 0.3rem; border-bottom: 1px solid #212A3E;}
.items li {padding: 0.1rem 0.3rem 0.05rem;background-color: #151C2C; line-height: 0.6rem; border-bottom: 1px solid #212A3E;}
.transfer-btn {position: absolute; width: 0.8rem; height: 0.8rem; background: url('../../assets/img/icon_transfer.png') #151C2C no-repeat center/0.4rem 0.4rem; z-index: 1; right: 0.5rem; bottom: 0.8rem; border-radius: 100%; border: 1px solid #212A3E;}
</style>
