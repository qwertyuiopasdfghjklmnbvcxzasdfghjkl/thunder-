<template>
  <div class="page">
    <top-back>{{$t('发布广告')}}<!--发布广告--></top-back>
    <div class="pl30 pr30">
      <mt-navbar v-model="type" class="mt100">
        <mt-tab-item id="buy">购买</mt-tab-item>
        <mt-tab-item id="sell">出售</mt-tab-item>
      </mt-navbar>
    </div>
    <div class="page-main">
      <div class="f30 mt40">币种</div>
      <div class="kuan">
        <select v-model="formData.token">
          <option v-for="(item,index) in tokens" :value="item">{{item}}</option>
        </select>
      </div>
      <div class="f30 mt40">价格</div>
      <div class="kuan ui-flex ui-flex-justify">
        <numberbox :class="{error: errors.has('price')}" v-model="formData.price"  :size="13" :accuracy="2" v-validate="'required|intOrDecimal'" data-vv-name="price" placeholder="交易价格"/>
        <span class="grey">CNY</span>
      </div>
      <p class="grey f26 mt10">市场参加价：7.12CNY</p>
      <div class="f30 mt40">数量</div>
      <div class="kuan ui-flex ui-flex-justify">
        <numberbox :class="{error: errors.has('amount')}" v-model="formData.amount" :size="13"  v-validate="'required|intOrDecimal'" data-vv-name="amount" placeholder="请输入交易数量"/>
        <span class="grey">{{formData.token}}</span>
      </div>
      <div class="f30 mt40">付款期限</div>
      <div class="kuan">
        <select v-model="formData.pay_limit_time" v-validate="'required'" data-vv-name="pay_limit_time">
          <option value="15">15 {{$t('otc_ad.otc_ad_minute')}}<!--分钟--></option>
          <option value="20">20 {{$t('otc_ad.otc_ad_minute')}}<!--分钟--></option>
          <option value="30">30 {{$t('otc_ad.otc_ad_minute')}}<!--分钟--></option>
        </select>
      </div>
      <div class="f30 mt40">单笔限额</div>
      <div class="ui-flex ui-flex-justify">
        <div class="kuan ui-flex-1">
          <numberbox :class="{error: errors.has('min_amount')}" v-model="formData.min_amount" :size="13"  v-validate="'required|intOrDecimal'" data-vv-name="min_amount" placeholder="最小单笔限额"/>
        </div>
        <span class="f30 grey mt10 ml20 mr20" style="line-height: 0.9rem;"> ~ </span>
        <div class="kuan ui-flex-1">
          <numberbox :class="{error: errors.has('max_amount')}" v-model="formData.max_amount" :size="13"  v-validate="'required|intOrDecimal'" data-vv-name="max_amount" placeholder="最大单笔限额"/>
        </div>
      </div>
      <div class="f30 mt40">付款方式</div>
      <ul class="mt10 payments">
        <li v-for="(item, index) in payments" v-tap="{methods:()=>{payType = item}}" class="ui-flex ui-flex-justify" :class="{active:payType==item}">
          <span><i class="icon_"></i> {{item}}</span>
          <span>fla126@qq.com</span>
        </li>
        <router-link v-if="!payments.length" :to="{name:'set-payway'}" class="active" tag="li">{{'添加收款方式'}}</router-link>
      </ul>
      <div class="f26 mt60 grey agreement" :class="{active:agree}" v-tap="{methods:()=>{agree = !agree}}">
        <i class="icon_"></i> 我已阅读并同意<a href="#" class="blue">《交易规则》</a>
      </div>
      <div class="mt40 pb90">
        <mt-button type="primary" size="large">发布</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import otcApi from '@/api/qotc'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import numberbox from '@/components/numberInput'
import Dialog from '@/components/common/dialog'


export default {
  components: {
    numberbox,
    Dialog
  },
  data(){
    return {
      type:'buy',
      payType:'支付宝',
      tokens:['USDT', 'ETH', 'BTC', 'KOALL', 'CDCC', 'NTON', 'AFA', 'WDDF'],
      payments:['支付宝','微信支付'],
      agree:true,
      formData:{
        token:'USDT',
        price:'',
        amount:'',
        pay_limit_time: 15,
      }
    }
  },
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;

.page-main {top: 1.6rem;}
.grey {color: @grey;}
.blue {color: @blue;}
.kuan {
  margin-top: 0.1rem;
  border: 1px solid @grey;
  border-radius:4px;
  height: 0.9rem;
  line-height: 0.7rem;
  padding: 0.1rem 0.2rem;
  font-size: 0.3rem;
  color: #fff;
}
select, input {
  border: none;
  width: 100%;
  height: 100%;
  font-size: inherit;
  background-color: transparent;
  color: inherit;
  option {
    color: @blue;
  }
}
.payments {
  li {
    line-height: 0.6rem;
    i {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_unchecked.png');}
    &.active {
      color: @blue;
      i {background-image: url('../../assets/img/icon_checked.png');}
    }
  }
}
.agreement i {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_unchecked.png');}
.agreement.active {
  i {background-image: url('../../assets/img/icon_checked.png');}
}
/deep/ .mint-navbar {
  background-color: transparent;
  .mint-tab-item {
      height: 0.64rem;
      color: @grey;
      padding: 0;
      border:1px solid @grey;
      border-radius:4px;
      &:first-of-type {border-right: none; border-top-right-radius: 0; border-bottom-right-radius: 0; }
      &:last-of-type {border-left: none; border-top-left-radius: 0; border-bottom-left-radius: 0; }

      &.is-selected {
          color: #FFF;
          margin-bottom: 0;
          background-color:@blue;
          border-color:@blue;

          .mint-tab-item-label span {
              border-bottom: 2px solid #3B48C8;
              margin-bottom: -2px;
          }
      }

      .mint-tab-item-label {
          font-size: 0.3rem;
          line-height: 0.64rem;

          span {
              display: inline-block;
              height: 100%;
          }
      }
  }
}
</style>
