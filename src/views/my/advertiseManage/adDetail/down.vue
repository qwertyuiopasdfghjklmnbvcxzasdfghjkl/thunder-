<template>
    <div class="btn" v-tap="{methods:del}">{{$t('otc_ad.otc_cancel_ad')}}</div>
</template>

<script>
    import otc from '../../../../api/otc'
    import { MessageBox } from 'mint-ui'
    export default {
        name: "down",
        props:['item'],
        data() {
            return {}
        },
        created() {

        },
        methods: {
            del(){
                MessageBox({
                    title: this.$t('public0.public242'),
                    message: this.$t('otc_ad.otc_cancel_ad')+'?', // 下架?
                    confirmButtonText: this.$t('public0.ok'),
                    cancelButtonText: this.$t('usercontent.user31'),
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        this.api()
                    }
                })
            },
            api(){
                otc.deleteAdvertisement(this.item.ad_id,res=>{
                    Tip({type: 'success', message: this.$t(`error_code.${res}`)})
                    this.$router.back()
                },msg=>{
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                    this.$router.back()
                })
            }
        }
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
