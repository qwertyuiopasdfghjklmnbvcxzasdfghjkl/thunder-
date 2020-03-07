<template>
  <div>
    <p class="grey mt20">{{$t('请使用本人名下的{0}向此账号进行转账汇款，如不一致，卖方可邀请退款或取消订单。').format('支付宝')}}</p>
    <div class="mt50 ui-flex ui-flex-justify">
      <span class="grey"><i class="icon_ orderid"></i> 订单号：215265216621646</span>
      <span class="blue" v-tap="{methods:()=>{dialShow = true}}"><i class="icon_ phone"></i> 联系卖家</span>
    </div>
    <div class="mt30 bgblock">
      <div class="tc f36"><i class="icon_ status pending"></i> 待付款</div>
      <div class="tc f24 grey mt15">请于 <span class="blue">16:00</span> 分钟内付款给卖家</div>
      <div class="price_info ui-flex ui-flex-justify f24 mt40 grey">
        <div>交易金额(CNY)
          <p class="white f32 tc mt30">500</p>
        </div>
        <div>购买数量(USDT)
          <p class="white f32 tc mt30">71.265925</p>
        </div>
        <div>单价(CNY/USDT)
          <p class="white f32 tc mt30">4.56</p>
        </div>
      </div>
      <div class="user_info grey f32">
        <div class="ui-flex ui-flex-justify">
          <span>姓名</span>
          <span class="white">王大头 <i class="icon_ copy"></i></span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>支付宝账号</span>
          <span class="white">54954959@qq.com <i class="icon_ copy"></i></span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>收款二维码</span>
          <span class="white"><i class="icon_ qrcode" v-tap="{methods:()=>{qrShow = true}}"></i></span>
        </div>
        <div class="ui-flex ui-flex-justify">
          <span>备注</span>
          <span class="white">转账时请勿备注任何信息</span>
        </div>
      </div>
      <div class="ui-flex ui-flex-justify" style="margin-top: 2.5rem;">
        <mt-button type="cancel" size="large" v-tap="{methods:()=>{ccShow = true}}">取消交易</mt-button>
        <mt-button type="primary" size="large" class="ml30" v-tap="{methods:()=>{zfShow = true}}">已付款</mt-button>
      </div>
    </div>
    <Dialog :show="qrShow" :title="$t('收款二维码')" :hide="hideQRDialog" :showCancel="false" :submit="hideQRDialog">
        <div class="tc"><img src="../../assets/img/zfb_qrcode.jpg"></div>
        <p class="ft-c-note mt25 f28 tc">长按二维码保存到手机</p>
    </Dialog>
    <Dialog :show="ccShow" :title="$t('确认取消订单')" :cancelText="'我再想想'" :hide="hideCCDialog" :submit="hideCCDialog">
        <p class="ft-c-default f32">取消订单后不会退款，如您已付款，请勿取消订单！</p>
        <p class="ft-c-red f28 mt40">提示：每天累计取消3次，当天无法再使用极速购买功能。</p>
    </Dialog>
    <Dialog :show="zfShow" :title="$t('确认支付订单')" :cancelText="'还未付款'" :showClose="true" :showBtns="false" :hide="hideZFDialog">
        <div class="ft-c-default f32 tc lh17">请确认您已经向买家付款，无需备注任何信息!</div>
        <div class="ft-c-note f24 mt25 tc">提示：恶意点击将你冻结账户</div>
        <div class="payinfo rp mt40">
          <i class="dotmask left"></i><i class="dotmask right"></i>
          <div class="inner">
            <table>
              <tr>
                <td>支付金额</td><td>： <strong class="f40 bold">500.00 CNY</strong></td>
              </tr>
              <tr>
                <td>姓名</td><td>： 王大头</td>
              </tr>
              <tr>
                <td>支付宝账号</td><td>： fla126@qq.com</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="action ui-flex ui-flex-justify">
          <mt-button type="grey" size="large" v-tap="{methods:hideZFDialog}">还未付款</mt-button>
          <mt-button type="primary" size="large" class="ml30" v-tap="{methods:hideZFDialog}">确认</mt-button>
        </div>
    </Dialog>
    <Dialog :show="dialShow" :title="$t('联系卖家')" :showBtns="false" :showClose="true" :hide="hidedDialDialog">
        <p class="ft-c-default f32 tc">使用手机号131****5648拨打</p>
        <p class="ft-c-default f48 mt20 tc">16795951649</p>
        <a class="mint-button mt40 mint-button--primary mint-button--large" style="line-height: 0.9rem;" href="tel:13764567708" v-tap="{methods:hidedDialDialog}">立即呼叫</a>
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import otcApi from '@/api/otc'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import Dialog from '@/components/common/dialog'
import { Toast } from 'mint-ui'


export default {
  components: {
    Dialog,

  },
  data(){
    return {
      qrShow:false,
      ccShow:false,
      zfShow:false,
      dialShow:false,
    }
  },
  created(){
    
  },
  methods:{
    hideQRDialog(){
      this.qrShow = false
    },
    hideCCDialog(){
      this.ccShow = false
    },
    hideZFDialog(){
      this.zfShow = false
    },
    hidedDialDialog(){
      this.dialShow = false
    },
    copySuccess(){
      Toast('复制成功')
    }
  }
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;

.grey {color: @grey;}
.blue {color: @blue;}
.white {color: #fff;}

.orderid {width: 0.22rem; height: 0.25rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_order.png');}
.phone {width: 0.24rem; height: 0.24rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_phone.png');}
.bgblock {background-color: #151C2C; padding: 0.4rem 0.25rem 0.7rem;}
.status {
  width: 0.44rem; height: 0.44rem; margin-right: 0.1rem;
  &.pending {background-image: url('../../assets/img/icon_status_pending.png');}
}
.price_info {padding-top: 0.3rem; padding-bottom: 0.3rem; border-top: 1px solid #1D273C; border-bottom: 1px dashed rgba(12, 106, 201, .8); }
.user_info {
  > div {
    border-bottom: 1px solid #1D273C;
    height: 0.95rem;
    line-height: 0.95rem;
  }
  .icon_ {
    width: 0.3rem; height: 0.3rem; margin-left: 0.15rem;
    &.copy {background-image: url('../../assets/img/icon_copy.png');}
    &.qrcode {background-image: url('../../assets/img/icon_qrcode.png');}
  }
}
.payinfo {
  background-color: #0EB574;
  margin-left: -20px;
  margin-right: -20px;
  .dotmask {
    position: absolute;
    width: 0.36rem;
    height: 0.36rem;
    background-color:#0F141F;
    border-radius: 100%;
    &.left {left: -0.2rem; top: -0.18rem;}
    &.right {right: -0.2rem; top: -0.18rem;}
  }
  .inner {
    border-top: 1px dotted #FFF;
    border-bottom: 1px dotted #FFF;
    padding:0.55rem 0 0.35rem;
    display: flex;
    justify-content: center;
    td {
      line-height: .9;
      &:after {
        display: inline-block;
        width: 100%;
        content: '';
        height: 0;
        line-height: .1;
      }
    }
    td:first-of-type {
      text-align: justify;
    }
  }
}
.action {
  padding: 0.25rem 0 0;
}
</style>
