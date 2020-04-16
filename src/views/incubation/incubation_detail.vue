<template>
    <div class="page">
        <top-back>
            {{token}}
        </top-back>
        <div class="assets tc">
            <p class="f24">{{token}} 总资产</p>
            <p class="f60 mt20">0.0000</p>
            <p class="f24 mt15">≈ 0.00 USDT</p>
        </div>
        <div class="title mt20 f32 ">交易记录</div>
        <div class="page-main">
            <ul class="items full">
                <router-link :to="{name:'incubationTransDetail'}" class="ui-flex ui-flex-justify" tag="li">
                    <div>
                        <p class="f32">转入</p>
                        <p class="cgray f24">07-25 17:15</p>
                    </div>
                    <span class="f32 ui-flex ui-flex-column ui-flex-center">8888.6 {{token}}</span>
                </router-link>
            </ul>
        </div>
        <router-link :to="{name:'transfer', params:{token:token}}" class="transfer-btn" tag="span"></router-link>
    </div>
</template>

<script>
export default {
    name: "staked_history",
    data() {
        return {
            token:'',
        }
    },
    created() {
        this.token = this.$route.params.token
    },
    methods: {
        
    }
}
</script>

<style scoped lang="less">
@green:#0FB475;
@red:#E11B39;
@cgray:#4B5875;
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
