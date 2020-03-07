<template>
    <div class="ad_list_cont full">
        <ad-list-cont-law v-for="item in dataList" :item="item"/>
    </div>
</template>

<script>
    import adListContLaw from './adListContLaw'
    export default {
        name: "adListCont",
        components:{adListContLaw},
        props: ['list'],
        data() {
            return {

            }
        },
        computed:{
            dataList(){
                return this.list || []
            }
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped>
.ad_list_cont{
    padding-bottom: 0.2rem;
}
</style>
