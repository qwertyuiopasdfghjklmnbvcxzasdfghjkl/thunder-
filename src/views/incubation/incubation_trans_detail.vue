<template>
    <div class="page">
        <top-back>
            交易详情
        </top-back>
        <div class="page-main">
            <div class="mt20 pt1 full bgblock">
                <div class="tc f60 mt60">12.1234 TPP</div>
                <ul class="mt80 items pl30 pr30 pb30 f32">
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">状态</span>
                        <span>已完成</span>
                    </li>
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">分类</span>
                        <span>业绩奖励</span>
                    </li>
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">创建时间</span>
                        <span>2019-07-25  17:15:34</span>
                    </li>
                    <li class="ui-flex ui-flex-justify">
                        <span class="cgray">交易号</span>
                        <span>1234567890</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "incubationTransDetail",
    data() {
        return {
            
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
@cgray:#4B5875;
.cgray {color: @cgray;}

.bgblock {background-color: #151C2C;}
.items li {
    line-height: 0.8rem;
}
</style>
