<template>
    <div class="page">
        <top-back style="background: #0C6AC9;">
            孵息加速器
            <router-link slot="right" class="stake-btn" :to="{name:'stakedHistory'}" tag="span">锁仓记录</router-link>
        </top-back>
        <div class="page-main">
            <div class="full">
                <div class="top-view text-center">
                    <p class="f24">预期收益（{{token}}）</p>
                    <p class="f60 mt20">1.4234566</p>
                    <p class="f24 mt20">≈24.00%月均孵化量</p>
                </div>
            </div>
            <div class="full bgblock">
                <div class="ml30 mr30">
                    <div class="pt30 f32">锁仓数量</div>
                    <div class="mt20 ui-flex bbline">
                        <numberbox class="ui-flex-1" v-model="formData.total" :accuracy="fixnumber" :placeholder="$t(`10000 ${token} 起`)"></numberbox>
                        <span class="allin" v-tap="{methods:allIn}">全部</span>
                    </div>
                    <div class="mt25 pb25 ui-flex ui-flex-justify">
                        <span class="cgray">可用0.00000000</span>
                        <router-link class="blue" :to="{name:'transfer', params:{token:token}}" tag="span">划转 <font class="icon_ circle ml5"><i class="icon_ icon-swap f24"></i></font></router-link>
                    </div>
                </div>
            </div>
            <div class="mt20 full bgblock pb60">
                <div class="ml30 mr30">
                    <div class="pt25 f32">锁仓期限</div>
                    <ul class="period pt10 clearfix">
                        <li v-for="item in periods" :class="{active:formData.period==item}" v-tap="{methods:()=>{formData.period=item}}">{{item}}{{$t('天')}}</li>
                    </ul>
                </div>
            </div>
            <div class="mt120">
                <mt-button type="primary" size="large" v-tap="{methods:stake}">确定锁仓</mt-button>
            </div>
        </div>
        <!-- 二次确认 -->
        <confirm
          ref="confirm"
          @callBack="saveStake"
        ></confirm>
    </div>
</template>

<script>
import numberbox from '@/components/numberInput'
import confirm from '@/views/qotc/components/confirm'
    export default {
        name: "incubation",
        components: {
            numberbox,
            confirm
        },
        data() {
            return {
                fixnumber:8,
                token:'TPP',
                periods:[30,60,90,180,360],
                formData:{
                    total:'',
                    period:30,
                }
            }
        },
        created() {
            this.token = this.$route.params.token || 'TPP'
        },
        methods: {
            allIn(){

            },
            stake(){
                this.$refs.confirm.openConfirm()
            },
            saveStake(){

            }
        }
    }
</script>

<style scoped lang="less">
@blue:#0C6AC9;
@cgray:#4B5875;
.blue {color: @blue;}
.cgray {color: @cgray;}
.top-view {
    padding: 0.3rem 0 0.5rem;
    background-color: @blue;
    color: #fff;
}
.bgblock {background-color: #151C2C;}
input[type=text] {
    background-color: transparent;
    font-size: 0.32rem;
    color: #fff;
    border: none;
    height: 0.8rem;
    padding: 0.15rem 0;
}
.bbline {border-bottom: 1px solid #2B364E;}
.allin {padding-left: 0.3rem; line-height: 0.8rem; color: @blue;}
.circle {width: 0.4rem; height: 0.4rem; background-color: #212A40; border-radius: 100%; text-align: center; padding: 0.02rem; transform: scale(0.8);}
.period {
    margin-left: -0.3rem; 
    margin-right: -0.3rem;
    li {float: left; margin-top: 0.3rem; margin-left: 0.3rem; margin-right: 0.3rem; width: 1.9rem;  line-height: 0.8rem; border-radius: 4px; border: 1px solid #2B364E; text-align: center; color: @cgray;}
    li.active {color: @blue; border-color: @blue;}
}
.stake-btn {line-height: 0.9rem; margin-right: 0.3rem;}
</style>
