<template>
    <div class="btn">{{$t('otc_ad.otc_cancel_ad')}}</div>
</template>

<script>
    export default {
        name: "down",
        data() {
            return {}
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped lang="less">
.btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.9rem;
    background: #0C6AC9;
    color: #ffffff;
    text-align: center;
    line-height: 0.9rem;
}
</style>
