<template>
    <div class="page">
        <top-back>
            交易详情
        </top-back>
        <div class="page-main">
            <div class="mt20 pt1 full bgblock">
                <div class="tc f60 mt60">{{info.distributeAmount}} {{info.symbol}}</div>
                <ul class="mt80 items pl30 pr30 pb30 f32">
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">状态</span>
                        <span>已完成</span>
                    </li>
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">分类</span>
                        <span>{{distributeType[info.distributeType]}}</span>
                    </li>
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">创建时间</span>
                        <span>{{info.createdAt}}</span>
                    </li>
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">交易号</span>
                        <span>{{info.distributeId}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "stakedTransDetail",
    data() {
        return {
            info:{},
            distributeType:{'1':'孵息收益', '2':'本金释放', '3':'认证奖励', '4':'业绩奖励'}
        }
    },
    created() {
        this.info = this.$route.query
    },
}
</script>

<style scoped lang="less">
@cgray:#4B5875;
.cgray {color: @cgray;}

.bgblock {background-color: #151C2C;}
.items li {
    line-height: 0.8rem;
}
</style>
