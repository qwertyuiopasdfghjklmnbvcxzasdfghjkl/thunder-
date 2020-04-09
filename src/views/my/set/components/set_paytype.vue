<template>
    <mt-popup class="verify_popup" v-model="fbShow" position="bottom">
      <div class="title">
          <i class="cancel" @click="fbShow = false">
              <img src="../../../../assets/img/off_blank.png"/>
          </i>
          <p>{{$t('qotc.add_collection_method')}}</p>
      </div>


      <!--银行卡-->
      <section class="item block" v-tap="{methods: handleClickChange, to: 'bank-pay'}">
        <img :src="bankimg">
        <span class="right-name">{{$t('otc_legal.oyc_legal_Bank_card')}}</span>
      </section>

      <!--支付宝-->
      <section class="item block" v-tap="{methods: handleClickChange, to:'alipay-pay'}">
        <img :src="alipayimg">
        <span class="right-name">{{$t('public0.public199')}}</span>
      </section>

      <!-- <div class="desc ft-c-default mt30 pl30 pr30 lh15">* 每种收款方式最多添加 3 条记录</div> -->

    </mt-popup>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      fbShow: false,
      bankimg: require("@/assets/img/icon-bank-big.png"),
      alipayimg: require("@/assets/img/icon-alipay-big.png"),
    }
  },
  watch:{
    show() {
      this.fbShow = true
    }
  },
  methods: {
    handleClickChange(args) {
      this.$emit('onChange', args)
      this.fbShow = false
    }
  }


}
</script>

<style lang="less" scoped>
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

.item{
  &+.item{
    margin-top: .2rem;
  }

  img{
    width: .4rem;
    height: .4rem;
    margin-right: .2rem;
    vertical-align: top;
    object-fit: contain;
  }

  .right-name {
    color: red;
    font-size: .3rem;
    color: #222;
  }
}

.verify_popup{
  width: 100%;
  border-top-left-radius: 0.32rem;
  border-top-right-radius: 0.32rem;
  overflow: hidden;
  .desc {
    margin-bottom: .3rem;
  }
}

</style>
