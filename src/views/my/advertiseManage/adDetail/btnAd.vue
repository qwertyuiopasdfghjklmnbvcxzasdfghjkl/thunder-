<template>
    <div class="btn">
        <label class="edit" v-tap="{methods:edit}">{{$t('market.edit_ad')}}</label>
        <label class="back" v-tap="{methods:del}">{{$t('market.backout_ad')}}</label>
        <label class="put">{{$t('market.putaway_ad')}}</label>
    </div>
</template>

<script>
    import otc from '../../../../api/otc'
    import { MessageBox } from 'mint-ui'
    export default {
        name: "btnAd",
        props:['item'],
        data() {
            return {}
        },
        created() {

        },
        methods: {
            edit(){
                this.$router.push({name: 'qotcAddOrUpdate',query: this.item})
            },
            del(){
                MessageBox({
                    title: this.$t('public0.public242'),
                    message: this.$t('public0.public3')+'?', // 删除?
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
