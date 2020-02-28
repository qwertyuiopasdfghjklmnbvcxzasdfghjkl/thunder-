<template>
    <div class="no-data" :style="`background-color:${bgColor};`">
        <img src="../../assets/img/nodata.png"/>
        <span :style="`font-size:${fontSize}rem;`">{{text || $t('public0.public50')}}<!--{{text}}||暂无相关数据--></span>
    </div>
</template>

<script>
    export default {
        name:'noData',
        props: {
            iconSize: {
                type: Number,
                default: 0.6
            },
            fontSize: {
                type: Number,
                default: 0.24
            },
            text: {
                type: String,
                default: ''
            },
            bgColor: {
                type: String,
                default: 'transparent'
            }
        }
    }
</script>

<style scoped>
    .no-data {
        background-color: transparent;
        text-align: center;
        margin: 1rem auto;
    }
    .no-data img{
        width: 1.7rem;
    }

    .no-data span {
        display: block;
        height: 1.2rem;
        font-size: .28rem;
        line-height: .6rem;
        margin-top: 0.2rem;
        color: #4B5875;
        text-align: center;
    }
</style>
