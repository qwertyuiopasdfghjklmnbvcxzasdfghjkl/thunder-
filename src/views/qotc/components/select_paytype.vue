<template>
  <!-- 选择支付方式 -->
  <div class="full bgblock mt20">
      <p class="f26 grey">{{$t('qotc.select_collection_method')}}<!-- 选择收款方式 --></p>
      <ul class="mt25 payments">
          <li v-tap="{methods:()=>{payType = 1}}" class="ui-flex ui-flex-justify" :class="{active:payType==1}" v-if="payments.card_number">
              <span><i class="icon_ check"></i> {{$t(payTrans[1])}}<!--银行卡--></span>
              <span>
                {{payments.card_number}}
                <i v-tap.stop="{methods: handleMoreClick}" class="icon_ icon-right"></i>
              </span>
          </li>

          <li v-tap="{methods:()=>{payType = 2}}" class="ui-flex ui-flex-justify" :class="{active:payType==2}" v-if="payments.alipay_number">
              <span><i class="icon_ check"></i> {{$t(payTrans[2])}}<!--支付宝--></span>
              <span>
                {{payments.alipay_number}}
                <i style="visibility: hidden;" v-tap.stop="{methods: handleMoreClick}" class="icon_ icon-right"></i>
              </span>
          </li>

          <li v-tap="{methods:()=>{payType = 3}}" class="ui-flex ui-flex-justify" :class="{active:payType==3}" v-if="payments.wechat_number">
              <span><i class="icon_ check"></i> {{$t(payTrans[3])}}<!--微信--></span>
              <span>
                {{payments.wechat_number}}
                <i v-tap.stop="{methods: handleMoreClick}" class="icon_ icon-right"></i>
              </span>
          </li>

          <li v-tap="{methods:()=>{payType = 4}}" class="ui-flex ui-flex-justify" :class="{active:payType==4}" v-if="payments.paypal_number">
              <span><i class="icon_ check"></i> {{$t(payTrans[4])}}<!--PayPal--></span>
              <span>
                {{payments.paypal_number}}
                <i v-tap.stop="{methods: handleMoreClick}" class="icon_ icon-right"></i>
              </span>
          </li>

          <router-link v-if="hasAllPays" :to="{name:'set-payway'}" class="active mt20" tag="li">{{$t('qotc.add_collection_method')}}<!-- 添加收款方式 --></router-link>

          <mt-popup class="verify_popup" v-model="show" position="bottom">
            <div class="title">
                <i class="cancel" @click="fbShow = false">
                    <img src="../../../assets/img/off_blank.png"/>
                </i>
                <p>{{$t('public0.public96')}}{{$t('user.userName')}}</p>
            </div>


            <!--银行卡-->
            <section v-for="item of 3" class="account-item" v-tap="{methods: handleClickChange, to: 'bank-pay'}">
              <!-- {{}} -->
              招商银行 234
            </section>

          </mt-popup>
      </ul>
  </div>
</template>
<script>
import otcConfig from '@/assets/js/otcconfig'

export default {
  props: ['payments'],
  data() {
    return {
      show: true,
      payType: ''
    }
  },
  created() {
    this.getPaySettings()
  },
  computed: {
    payTrans(){
        let _payTrans = {}
        for(let item of otcConfig.payments){
            _payTrans[item.id] = item.key
        }
        return _payTrans
    },

  },
  methods: {
    handleMoreClick() {
      this.show = true
    },

    handleClickChange() {

    },

    getPaySettings(){ //获取用户支付方式
        if(!this.getApiToken){
            return
        }
        otcApi.getPaySettings(res=>{
            this.payments = res.data
            if(this.payments.alipay_number){
                this.payType = 2
            }
        })
    },

    hasAllPays(){
      return !this.payments.card_number || !this.payments.alipay_number || !this.payments.wechat_number || !this.payments.paypal_number
    },
  }
}
</script>
<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;
.page-main {padding-bottom: 1.5rem;}

.grey {color: @grey;}
.blue {color: @blue;}


.bgblock { background-color: #151C2C; padding: 0.3rem; }
.payments {
    li {
      line-height: 0.8rem;
      i {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../../assets/img/icon_unchecked.png');}
      &.active {
          color: @blue;
          i.check {background-image: url('../../../assets/img/icon_checked.png');}
      }
      .icon-right {
        margin-left: .3rem;
        width: .2rem;
        height: .32rem;
        background-image: url('../../../assets/img/icon_arrow_right.png');
        background-size: cover;
      }
    }
}


.title {
  font-size: 0.32rem;
  height: 1rem;
  line-height: 1rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  color: #222222;
  text-align: center;
  border-bottom: 0.01rem solid #eeeeee;
  position: relative;
  .cancel{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    position: absolute;
    left: 0;
    top: 0;
    text-align: center;
    img{
      vertical-align: middle;
      width: 0.3rem;
    }
  }
}

.verify_popup{
  width: 100%;
  border-top-left-radius: 0.32rem;
  border-top-right-radius: 0.32rem;
  overflow: hidden;
  .account-item {
    border: 0.01rem solid #eeeeee;
    margin: .32rem;
    color: #222;
    font-size: .3rem;
    border-radius: .1rem;
    text-align: center;
    padding: .12rem 0;
  }
  .account-item.active {
    color: @blue;
  }
}
</style>
