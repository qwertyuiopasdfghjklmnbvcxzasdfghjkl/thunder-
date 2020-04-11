<template>
  <mt-popup class="place_order_popup" v-model="show" position="bottom">
    <div class="pay_type">
      <!-- 选择广告收款方式 -->
        <h4 class="title">{{$t('shop.payment')}}</h4>
        <ul>
            <li
                v-for="item in payments"
                :key="item.payType"
                v-tap="{methods:getPay,data:item}"
                :class="{'active': type == item.type}"
            >
                <p>{{item.title}}</p>
                <span>{{item.number}}</span>
            </li>
        </ul>
        <div class="btn">
            <mt-button type="default" @click="close">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></mt-button>
            <mt-button type="primary" :disabled="locked" @click="submit()">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></mt-button>
        </div>
    </div>
  </mt-popup>
</template>


<script>
    import otcApi from '@/api/otc'
    export default {
        name: "payType",
        props: {
          // 广告对应的收款方式
          payType: {
            type: Array
          },
          // 所有收款方式
          payList: {
            type: Array
          }
        },
        data() {
          return {
            show: false,
            type: '',
            payments: [],
            currentPayType: ''
          }
        },
        computed:{
          locked(){
            return !this.type
          },
        },
        watch: {
          payList() {
            let arr = []
            this.payList.forEach(item => {
              if (this.payType.includes(item.type)) {
                arr.push(item)
              }
            })
            this.payments = arr
          }
        },
        mounted() {
          // 如果广告只有一种收款方式，默认选中
          if (this.payType.length === 1) {
            this.type = this.payType[0]
          }
        },
        methods: {
          getPay(d){
            this.type = d.data.type
            this.currentPayType = d.data
          },
          submit() {
            this.$emit('hidePay', this.currentPayType)
          },
          open() {
            this.show = true
          },
          close() {
            this.show = false
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
                background-image: url("../../../assets/img/icon_checked.png");
                background-position: 6.2rem 0.4rem;
                background-size: 0.4rem;
                background-repeat: no-repeat;
            }
        }
        .disabled {
            color: #6d7fac;
        }
    }
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
