<template>
  <div class="page">
    <top-back>{{$t('otc_legal.otc_legal_currency')}}<!--收款方式设置--></top-back>

    <div class="page-main">
      <div class="mt20">
        <!--1-1已设置银行卡-->
        <section v-if="bankData.card_number" class="item block" v-tap="{methods: checkVerifyState, to: 'bank-pay'}">
            <h3><img :src="bankimg">{{$t('otc_legal.oyc_legal_Bank_card')}}<!--银行卡--><span class="right-icon"></span></h3>
            <p> <span>{{$t('otc_legal.otc_legal_Name')}}：<!--姓名--></span><span>{{bankData.card_name}}</span></p>
            <p><span>{{$t('otc_legal.otc_legal_Bank')}}：<!--开户行--></span><span>{{bankData.card_bank}}</span></p>
            <p><span>{{$t('otc_legal.otc_legal_Bank_number')}}：<!--银行卡号--></span><span>{{bankData.card_number}}</span></p>
        </section>
        <!--1-2未设置银行卡-->
        <section v-if="!bankData.card_number" class="item block" v-tap="{methods: checkVerifyState, to: 'bank-pay'}">
            <h3><img :src="bankimg">{{$t('otc_legal.oyc_legal_Bank_card')}}<!--银行卡--><span class="right-icon"></span></h3>
            <p><span>{{$t('public0.public196')}}</span><!--请设置银行卡信息--><span></span></p>
        </section>

        <!--2-1已设置微信-->
        <section v-if="wechatData.wechat_number" class="item block" v-tap="{methods:checkVerifyState, to:'wechat-pay'}">
            <h3><img :src="wechatimg">{{$t('public0.public198')}}<!--微信--><span class="right-icon"></span></h3>
            <p><span>{{$t('otc_legal.otc_legal_Payee_Name')}}：<!--收款人姓名--></span><span>{{wechatData.wechat_name}}</span></p>
            <p><span>{{$t('otc_legal.otc_legal_Wechat_number')}}：<!--微信账号--></span><span>{{wechatData.wechat_number}}</span></p>
        </section>
        <!--2-2未设置微信-->
        <section v-if="!wechatData.wechat_number" class="item block" v-tap="{methods:checkVerifyState, to:'wechat-pay'}">
            <h3><img :src="wechatimg">{{$t('public0.public198')}}<!--微信--><span class="right-icon"></span></h3>
            <p><span>{{$t('public0.public197')}}<!--请设置微信账号及收款码，收付款更便捷--></span><span></span></p>
        </section>

        <!--3-1已设置支付宝-->
        <section v-if="alipayData.alipay_number" class="item block" v-tap="{methods:checkVerifyState, to:'alipay-pay'}">
            <h3><img :src="alipayimg">{{$t('public0.public199')}}<!--支付宝--><span class="right-icon"></span></h3>
            <p><span>{{$t('otc_legal.otc_legal_Payee_Name')}}：<!--收款人姓名--></span><span>{{alipayData.alipay_name}}</span></p>
            <p><span>{{$t('otc_legal.otc_legal_Alipay_number')}}：<!--支付宝账号--></span><span>{{alipayData.alipay_number}}</span></p>
        </section>
        <!--3-2未设置支付宝-->
        <section v-if="!alipayData.alipay_number" class="item block" v-tap="{methods:checkVerifyState, to:'alipay-pay'}">
            <h3><img :src="alipayimg">{{$t('public0.public199')}}<!--支付宝--><span class="right-icon"></span></h3>
            <p><span>{{$t('public0.public261')}}<!--请设置支付宝账号及收款码，收付款更便捷--></span><span></span></p>
        </section>

        <!--4-1已设置PayPal-->
        <section v-if="paypalData.paypal_number" class="item block" v-tap="{methods:checkVerifyState, to:'paypal-pay'}">
            <h3><img :src="paypalimg">{{$t('public0.public219')}}<!--PayPal--><span class="right-icon"></span></h3>
            <p><span>{{$t('otc_legal.otc_legal_Payee_Name')}}：<!--收款人姓名--></span><span>{{paypalData.paypal_name}}</span></p>
            <p><span>{{$t('public0.public221')}}：<!--PayPal账号--></span><span>{{paypalData.paypal_number}}</span></p>
        </section>
        <!--4-2未设置PayPal-->
        <section v-if="!paypalData.paypal_number" class="item block" v-tap="{methods:checkVerifyState, to:'paypal-pay'}">
            <h3><img :src="paypalimg">{{$t('public0.public219')}}<!--PayPal--><span class="right-icon"></span></h3>
            <p><span>{{$t('public0.public220')}}<!--请设置PayPal信息--></span><span></span></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import utils from '@/assets/js/utils'
import otcApi from '@/api/otc'
export default {
  name: 'set-payway',
  data () {
    return {
      bankimg: require("@/assets/img/icon-bank-big.png"),
      wechatimg: require("@/assets/img/icon-wechat-big.png"),
      alipayimg: require("@/assets/img/icon-alipay-big.png"),
      paypalimg: require("@/assets/img/icon-paypal-big.png"),
      bankData: { // 银行卡信息
        card_name: '',
        card_bank: '',
        card_number: ''
      },
      wechatData: { // 微信
        wechat_name: '',
        wechat_number: '',
        wechat_QRcode: ''
      },
      alipayData: { // 支付宝
        alipay_name: '',
        alipay_number: '',
        alipay_QRcode: ''
      },
      paypalData: { // PayPal
        paypal_name: '',
        paypal_number: ''
      }
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData (callback) {
      otcApi.getPaySettings((res) => {
        res.real_name = this.getUserInfo.userRealName
        // 银行卡
        this.bankData = {
          card_name: res.real_name,
          card_bank: res.data.card_bank,
          card_number: res.data.card_number
        }
        // 支付宝
        this.alipayData = {
          alipay_name: res.real_name,
          alipay_number: res.data.alipay_number,
          alipay_QRcode: res.data.alipay_image_path
        }
        // 微信
        this.wechatData = {
          wechat_name: res.real_name,
          wechat_number: res.data.wechat_number,
          wechat_QRcode: res.data.wechat_image_path
        }
        // PayPal
        this.paypalData = {
          paypal_name: res.real_name,
          paypal_number: res.data.paypal_number
        }
        // 回调方法
        callback && callback(res.real_name)
      }, (res) => {
        if (res.msg === 'NO_PAY_TYPE') {
          // 银行卡
          this.bankData.card_name = res.real_name
          // 支付宝
          this.alipayData.alipay_name = res.real_name
          // 微信
          this.wechatData.wechat_name = res.real_name
          // PayPal
          this.paypalData.paypal_name = res.real_name
        } else {
          console.error(res.msg)
        }
        callback && callback(res.real_name)
      })
    },
    checkVerifyState (args) {
      this.loadData((realName) => {
        if (realName) {
          this.$root.routeTo(args)
        } else {
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm')
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'page-realname'})
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.item{
	&+.item{
	  margin-top: .2rem;
	}
	p{
	  margin-top: .2rem;
	  span:first-child{
	    font-size: .24rem;
	    color: #999;
	  }
	  span:last-child{
	    font-size: .28rem;
      color: #333;
	  }
	}
	h3{
	  height: .4rem;
	  font-size: .32rem;
	  line-height: .4rem;
	  img{
	    width: .4rem;
	    height: .4rem;
	    margin-right: .2rem;
	    vertical-align: top;
	    object-fit: contain;
	  }
	  span{
	    float: right;
	    width: .25rem;
	    height: .25rem;
	    margin-top: .06rem;
	    background: url('../../../assets/img/nav_right.png') no-repeat center center / 100% auto;
	  }
	}
}
</style>
