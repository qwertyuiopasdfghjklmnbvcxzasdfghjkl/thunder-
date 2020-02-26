<template>
  <div class="page">
    <top-back>{{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉--></top-back>

    <div class="box one">
      <div class="inner">
        <div class="title">{{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉--></div>
        <div class="caption">
          <p>{{$t('public0.public183')}}<!--（1）错误的申诉会导致发起人好评率下降。申诉在受理前，发起人可根据需要主动取消申诉。--></p>
          <p>{{$t('public0.public184')}}<!--（2）针对已经标记为已付款的订单，一方提交申诉后，交易双方可继续沟通释放数字币。--></p>
          <p>{{$t('public0.public185')}}<!--（3）申诉一旦受理，系统将根据申诉内容，判断双方的欺诈行为，对欺诈方做出冻结、封禁等处理。--></p>
        </div>
        <select v-model="formData.type" v-validate="'required'" data-vv-name="type">
          <option v-for="(item, index) in appealType" :key="index" :value="parseInt(item.appeal_type_id)">{{$t(`otc_exchange.otc_exchange_${item.type_key}`)}}</option>
        </select>
        <textarea v-model="formData.description" v-validate="formData.type === 5 ? 'required' : null" data-vv-name="description" :placeholder="formData.type === 5 ? $t('public0.public236') : $t('public0.public237')" maxlength="255" autocomplete="off"></textarea>
        <mt-button :class="{disabled: isLock}" type="primary" size="large" v-tap="{methods: submitAppeal}">{{$t('public0.public207')}}<!--提交申诉--></mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import otcApi from '@/api/otc'
import Tip from '@/assets/js/tip'
export default {
  name: 'otc-appeal',
  data () {
    return {
      appealType: [],
      formData: {
        order_number: this.$route.params.orderNumber,
        type: null,
        description: null
      },
      isLock: false
    }
  },
  computed: {
    msgs () {
      return {
        type: {required: this.$t('public0.public8')}, // 请输入问题类型
        description: {required: this.$t('public0.public9')} // 请输入问题描述
      }
    }
  },
  created () {
    this.getAppealType()
  },
  methods: {
    getAppealType () {
      otcApi.appealTtpe((data) => {
        this.appealType = data
      }, (msg) => {
        console.error(msg)
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    submitAppeal () {
      this.$validator.validateAll().then((action) => {
        if (action) {
          this.isLock = true
          otcApi.createAppeal(this.formData, (msg) => {
            this.isLock = false
            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
            this.$router.go(-1)
          }, (msg) => {
            this.isLock = false
            console.error(msg)
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        } else {
          if (this.errors.items.length) {
            let field = this.errors.items[0].field
            let msg = this.msgs[field][this.errors.firstRule(field)] || this.errors.items[0].msg
            Tip({type: 'danger', message: msg})
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.box{height: calc(100% - 2rem);}
.box .inner{display: flex;flex-direction: column;height: 100%;padding: 0.3rem;color: #8089a3;}
.inner .title{height: .6rem;font-size: .36rem;line-height: .6rem;color: #fff;}
.inner .caption{margin-top: .2rem;}
.inner .caption p{font-size: .24rem;color: #cbd4ec;line-height: .4rem;}
select{height: .8rem;margin-top: .2rem;text-indent: .3rem;background-color: #161f2f;}
textarea{flex: 1;padding: .3rem;font-size: .24rem;color: #cbd4ec;background-color: #1B1C21;border-width: 0;resize: none;}
button{margin-top: .2rem;}
button.disabled{background-color: #999;}
</style>
