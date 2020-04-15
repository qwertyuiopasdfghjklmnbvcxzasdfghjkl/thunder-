<template>
    <div class="page">
        <top-back>
            {{$t('锁仓记录')}}
        </top-back>
        <div class="tab-bar">
            <mt-navbar v-model="label">
              <mt-tab-item :id="1"><span>{{$t('进行中')}}<!--进行中--></span></mt-tab-item>
              <mt-tab-item :id="2"><span>{{$t('已结束')}}<!--已结束--></span></mt-tab-item>
            </mt-navbar>
        </div>
        <div class="page-main">
            <ul class="full items">
                <router-link :to="{name:'stakedDetail'}" tag="li">
                    <div class="full pl30 pr30 bline ui-flex ui-flex-justify">
                        <span class="f32">30天孵息</span>
                        <span class="green">进行中</span>
                    </div>
                    <div class="ui-flex ui-flex-justify">
                        <span class="f32 cgray">孵息数量</span>
                        <span class="f32">400 TPP</span>
                    </div>
                    <div class="ui-flex ui-flex-justify">
                        <span class="f32 cgray">孵息释放</span>
                        <span class="f32">400 TPP</span>
                    </div>
                    <div class="ui-flex ui-flex-justify">
                        <span class="f32 cgray">开始时间</span>
                        <span class="f32">2020-03-12</span>
                    </div>
                    <div class="ui-flex ui-flex-justify">
                        <span class="f32 cgray">结束时间</span>
                        <span class="f32">2020-04-12</span>
                    </div>
                </router-link>
                
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "staked_history",
        data() {
            return {
                label:1,
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
@cgray:#4B5875;
.green {color: @green;}
.cgray {color: @cgray;}
.page-main {top: 1.86rem;}
.tab-bar {
    margin-top: 0.9rem;
    /deep/ .mint-navbar {border-bottom: 1px solid #131e30; background-color: #131e30;}
    /deep/ .mint-tab-item {
        height: 0.9rem;
        color: #6C6F8B;
        padding: 0;
        &.is-selected {
            color: #0067e7; border-bottom: none; margin-bottom: 0;
            .mint-tab-item-label span{
                padding: 0 0.3rem;
                border-bottom: 2px solid #0067e7;
                margin-bottom: -2px;
            }
        }
        .mint-tab-item-label {
            font-size: 0.3rem;
            line-height: 0.9rem;
            span {display: inline-block; height: 100%;}
        }
    }
}
.items li{
    background-color: #151C2C;
    padding: 0.1rem 0.3rem 0.2rem;
    margin-top: 0.2rem;
    line-height: 0.75rem;
    .bline {
        border-bottom:1px solid #1D273C;
    }
}
</style>
