<template>
    <div class="page">
        <top-back> 孵息加速器 </top-back>
        <div class="page-main">
            <div class="full">
                <div class="symbol mt20 bgc pl30 pr30 ui-flex ui-flex-justify">
                     <span class="cgray">币种</span>
                     <span class="f32">TPP</span>
                </div>
                <div class="desc mt20 bgc pl30 pr30 pt15 ui-flex">
                     <span class="cgray ui-flex ui-flex-column ui-flex-center">从</span>
                     <div class="ui-flex-1 bline">
                         <p class="f32">币币账户</p>
                         <p class="cgray f24">TPP</p>
                     </div>
                </div>
                <div class="desc bgc pl30 pr30 pt15 ui-flex">
                     <span class="cgray ui-flex ui-flex-column ui-flex-center">到</span>
                     <div class="ui-flex-1">
                         <p class="f32">孵息账户</p>
                         <p class="cgray f24">TPP</p>
                     </div>
                </div>
                <div class="bgc mt20 pl30 pr30 pt40 pb20">
                     <div class="cgray">数量</div>
                     <div class="mt20 ui-flex ui-flex-justify bline">
                         <numberbox class="ui-flex-1" v-model="formData.total" :accuracy="fixnumber" :placeholder="$t('请输入数量')"></numberbox>
                         <span class="f32 blue lh80" v-tap="{methods:allIn}">全部划转</span>
                     </div>
                     <div class="lh80 cgray">最多可转8888.88888 TPP</div>
                </div>
            </div>
            <div class="mt120">
                <mt-button type="primary" size="large" v-tap="{methods:transfer}">确定划转</mt-button>
            </div>
        </div>
        <confirm
          ref="confirm"
          @callBack="saveTransfer"
        ></confirm>
    </div>
</template>

<script>
import numberbox from '@/components/numberInput'
import confirm from '@/views/qotc/components/confirm'
    export default {
        name: "staked_history",
        components: {
            numberbox,
            confirm
        },
        data() {
            return {
                fixnumber:8,
                formData:{
                    total:''
                }
            }
        },
        created() {

        },
        methods: {
            allIn(){},
            transfer(){
                this.$refs.confirm.openConfirm()
            },
            saveTransfer(){

            }
        }
    }
</script>

<style scoped lang="less">
@blue:#0C6AC9;
@cgray:#4B5875;
.blue {color: @blue;}
.cgray {color: @cgray;}

.bgc {background-color: #151C2C;}
.symbol {line-height: 0.96rem;}
.desc > span {width: 0.8rem;}
.desc > div {line-height: 0.6rem;}
.bline {border-bottom: 1px solid #252E44;}
input[type=text] {
    background-color: transparent;
    font-size: 0.32rem;
    color: #fff;
    border: none;
    height: 0.8rem;
    padding: 0.15rem 0;
}
.lh80 {line-height: 0.8rem;}
</style>
