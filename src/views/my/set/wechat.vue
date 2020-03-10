<template>
  <div class="page">
    <top-back>{{$t('otc_legal.otc_legal_WeChat_receivables')}}<!--微信收款--></top-back>

    <div class="page-main">
      <form ref="wechatForm" class="block mt20">
        <div class="item-section">
          <p class="line">
            <input name="wechat_name" :placeholder="$t('otc_legal.otc_legal_Payee_Name')" :value="wechatData.wechat_name" readonly>
          </p>
        </div>
        <div class="item-section">
          <p class="line">
            <input name="wechat_number" :placeholder="$t('otc_legal.otc_legal_Wechat_number')" v-model="wechatData.wechat_number" maxlength="32" autocomplete="off">
          </p>
        </div>
        <div class="item-section">
          <span>{{$t('otc_legal.otc_legal_WeChat_code')}}<!--微信收款码--></span>
            <div class="tc mt10">
              <div class="form-upload">
                <img class="form-upload-img" v-if="wechatData.wechat_QRcode" :src="wechatData.wechat_QRcode"/>
                <span class="form-upload-span" v-if="!wechatData.wechat_QRcode">{{$t('otc_legal.otc_legal_Upload_payment')}}<!--点击上传收款码--></span>
                <input type="hidden" v-model="wechatData.wechat_QRcode" data-vv-name="wechat_QRcode"/>
                <input class="form-upload-file" type="file" title=" " data-key="1" v-show="isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>
                <input class="form-upload-file" type="file" name="source" title=" " data-key="2" v-show="!isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>
              </div>
              <p class="mt30 ft-c-lightGray">{{$t('otc_legal.otc_legal_Upload_payment')}}<!--点击上传收款码--></p>
              <p class="ft-c-main mt10">（{{$t('account.user_center_QRcode_warn')}}）<!--请务必上传真实的二维码--></p>
            </div>
        </div>
      </form>

      <mt-button type="primary" size="large" class="mt50" @click="saveSettings(3)">{{$t('otc_legal.otc_legal_save')}}</mt-button>
    </div>
  </div>
</template>

<script>
import config from '@/api/config'
import utils from '@/assets/js/utils'
import otcApi from '@/api/otc'
import { mapGetters } from 'vuex'
export default {
  name: 'wechat',
  data () {
    return {
      wechatData: {
        wechat_name: '',
        wechat_number: '',
        wechat_QRcode: ''
      },
      isShowUpload: {
        wechat_QRcode: true,
        alipay_QRcode: true
      },
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      otcApi.getPaySettings((res) => {
        console.log(res)
        // 微信
        this.wechatData = {
          wechat_name: this.getUserInfo.userRealName,
          wechat_number: res.data.wechat_number,
          wechat_QRcode: res.data.wechat_image_path
        }
      }, (res) => {
        if (res.msg === 'NO_PAY_TYPE') {
          // 微信
          this.wechatData.wechat_name = res.real_name
        } else {
          console.error(res.msg)
        }
      })
    },
    saveSettings (type) { // 提交保存
      if (!this.$root.trim(this.wechatData.wechat_number, 1)) {
        Tip({type: 'danger', message: this.$t('otc_legal.otc_legal_input_WeChat_number')}) // 请输入微信账号
        $('input[name=wechat_number]').focus()
        return
      }
      if (this.wechatData.wechat_QRcode) {
        let formData = new FormData(this.$refs.wechatForm)
        Indicator.open('Loading...')
        otcApi.savePaySettings(type, formData, (msg) => {
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          this.$router.replace({name: 'set-payway'})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      } else {
        Tip({type: 'danger', message: this.$t('public0.public90')})
      }
    },
    uploadImage (event, type) { // 上传图片
      let objectName = null
      let propertyName = null
      if (type === 3) {
        objectName = 'wechatData'
        propertyName = 'wechat_QRcode'
      } else {
        return
      }

      let isTrue = false
      if (config.imageType.test(event.target.value)) {
        isTrue = utils.limitUploadImage(event.target, (msg) => {
           Tip({type: 'danger', message: this.$t(msg)}) // 图片不能超过1M
        }, 1)
      } else {
        isTrue = false
        Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }

      if (isTrue) {
        this[objectName][propertyName] = window.URL.createObjectURL(event.target.files[0])
        event.target.name = 'source'
        if (parseInt(event.target.getAttribute('data-key')) === 1) {
          event.target.nextElementSibling.name = ''
          event.target.nextElementSibling.value = null
          this.isShowUpload[propertyName] = false
        } else {
          event.target.previousElementSibling.name = ''
          event.target.previousElementSibling.value = null
          this.isShowUpload[propertyName] = true
        }
      } else {
        event.target.value = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .form-upload{display: flex;align-items: center;justify-content: center;position: relative;width: 3.5rem;height: 3.5rem;border: 1px solid #ddd;left: 24%;}
  .form-upload.error{border-color: #3B48C8;}
  .form-upload-span{color: #999;text-align: center;}
  .form-upload-img{width: 100%;height: 100%;}
  .form-upload-file{position: absolute;top: 0;left: 0;width: 100%!important;height: 100%!important;opacity: 0;cursor: pointer;}
  .form-upload + .form-error{align-self: flex-end;}

.item-section{
  &+.item-section {margin-top: 0.3rem;}
    input{
      background: transparent;
      border: 0;
      height: .8rem;
      width: 100%;
    }
    p.line{
      border-bottom: .01rem solid #ddd;
  }
}
</style>
