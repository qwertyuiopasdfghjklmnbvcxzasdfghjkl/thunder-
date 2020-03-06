<template>
    <div class="btn">
        <label class="edit">{{$t('market.edit_ad')}}</label>
        <label class="back">{{$t('market.backout_ad')}}</label>
        <label class="put">{{$t('market.putaway_ad')}}</label>
    </div>
</template>

<script>
    export default {
        name: "btnAd",
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
    color: #ffffff;
    text-align: center;
    line-height: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .edit{
        background: #E01C37;
        flex: 1;
    }
    .back{
        background: #1D2537;
        flex: 1;
    }
    .put{
        background: #0C6AC9;
        flex: 2;
    }
}
</style>
