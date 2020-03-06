<template>
    <div class="ad_list_cont full">
        <ad-list-cont-law/>
    </div>
</template>

<script>
    import adListContLaw from './adListContLaw'
    export default {
        name: "adListCont",
        components:{adListContLaw},
        data() {
            return {}
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
