<template>
    <div class="page">
        <top-back>
            {{$t('详情')}}
        </top-back>
        <div class="page-main">
            <div class="mt20 full bgblock pl30 pr30 pb40">
                <div class="pt50 tc f60">4000</div>
                <div class="mt10 tc f24 cgray">总释放 TPP</div>
                <div class="mt60 ui-flex ui-flex-justify">
                    <span class="f32 cgray">孵息数量</span>
                    <span class="f32">1000 TPP</span>
                </div>
                <div class="mt50 ui-flex ui-flex-justify">
                    <span class="f32 cgray">锁仓时间</span>
                    <span class="f32">30天</span>
                </div>
                <div class="mt50 ui-flex ui-flex-justify">
                    <span class="f32 cgray">开始时间</span>
                    <span class="f32">2020-03-12</span>
                </div>
                <div class="mt50 ui-flex ui-flex-justify">
                    <span class="f32 cgray">状态</span>
                    <span class="f32" :class="[data.status==1?'green':'red']">已结束</span>
                </div>
            </div>
            <div class="mt20 full bgblock pl30 pr30 pt30 pb40">
                <div class="f32">释放记录</div>
                <ul class="items mt20">
                    <router-link :to="{name:'incubationTransDetail'}" tag="li">
                        <p class="cgray f24">订阅Pick的实盘</p>
                        <div class="ui-flex ui-flex-justify f28">
                            <span>2019-09-04 15:32:35</span>
                            <span>6</span>
                        </div>
                    </router-link>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "staked_history",
        data() {
            return {
                label:1,
                data:{status:1}
            }
        },
        created() {

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

.bgblock {background-color: #151C2C;}
.items li{
    line-height: 0.6rem;
    border-bottom:1px solid #1D273C;
}
</style>
