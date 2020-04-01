<template>
    <div class="pay_type">
        <h4 class="title">{{$t('shop.payment')}}</h4>
        <ul>
            <li v-for="item in payments" v-tap="{methods:getPay,data:item}"
                :class="{'active': payType.payType === item.payType}">
                <p>{{item.title}}</p>
                <span>{{item.number}}</span>
            </li>
        </ul>
        <p class="add_pay">
            <router-link :to="{name:'set-payway'}" class="active" tag="li">{{$t('qotc.add_collection_method')}}<!-- 添加收款方式 --></router-link>
        </p>
        <div class="btn">
            <mt-button type="default" @click="cancel">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></mt-button>
            <mt-button type="primary" :disabled="locked" @click="sub()">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></mt-button>
        </div>
    </div>
</template>

<script>
    import otcApi from '@/api/otc'
    export default {
        name: "payType",
        data() {
            return {
                payments: [],
                payType: {}
            }
        },
        computed:{
            locked(){
                return !this.payType.payType
            },
        },

        created() {
            this.getPaySettings()
        },
        methods: {
            getPaySettings(){ //获取用户支付方式
                otcApi.getPaySettings(res=>{
                    let type = res.data.pay_type.split(',') || []
                    console.log(type, res.data)
                    type.forEach(i=>{
                        switch (true) {
                            case  i === '1':
                                let b = {
                                    title: this.$t('otc_legal.oyc_legal_Bank_card'),
                                    name: res.data.card_name,
                                    number: res.data.card_number,
                                    payType: 1
                                }
                                this.payments.push(b)
                                break;
                            case i === '2':
                                let a = {
                                    title: this.$t('public0.public199'),//'支付宝',
                                    name: res.data.alipay_name,
                                    number: res.data.alipay_number,
                                    payType: 2
                                }
                                this.payments.push(a)
                                break;
                            case i === '3':
                                let w = {
                                    title: this.$t('otc_ad.otc_ad_WeChatPay'),//'微信支付',
                                    name: res.data.wechat_name,
                                    number: res.data.wechat_number,
                                    payType: 3
                                }
                                this.payments.push(w)
                                break;
                            case i === '4':
                                let p = {
                                    title: 'Paypal',
                                    name: res.data.paypal_name,
                                    number: res.data.paypal_number,
                                    payType: 4
                                }
                                this.payments.push(p)
                        }
                    })
                    console.log(type, this.payments)
                })
            },
            cancel(){
                this.$emit('hidePay')
            },
            getPay(d){
                console.log(d.data)
                this.payType = d.data
            },
            sub(){
                this.$emit('hidePay',this.payType)
            }
        }
    }
</script>

<style scoped lang="less">
.pay_type{
    width: 100%;
    background: #151C2C;
    .title{
        padding: 0.3rem;
        border-bottom: 0.02rem #323236 solid;
        text-align: center;
        font-weight: bold;
        font-size: 0.30rem;
    }
    ul{
        li{
            padding: 0.2rem 0.3rem;
            background-color: #202738;
            margin: 0.3rem;
            border: 0.02rem solid transparent;
            p{
                font-size: 0.3rem;
            }
            &.active{
                border: 0.02rem solid #0C6AC9;
                background-image: url("../../assets/img/icon_checked.png");
                background-position: 6.2rem 0.4rem;
                background-size: 0.4rem;
                background-repeat: no-repeat;
            }
        }
    }
}
.add_pay{
    padding: 0.2rem 0.3rem;
    text-align: center;
    margin: 0.3rem;
    border-top: 0.02rem solid #323236;
}
    .btn{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.3rem;
        button{
            flex: 1;
            margin: 0 0.2rem;
        }
    }
</style>
