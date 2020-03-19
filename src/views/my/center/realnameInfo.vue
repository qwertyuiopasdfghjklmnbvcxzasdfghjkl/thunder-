<template>
  <div class="page">
    <top-back>{{$t('public0.public75')}}<!--中国大陆地区--></top-back>
    <div class="page-main bg-c-white">
      <form ref="form" onsubmit="return false">
          <div class="item mt30">
             <p class="line">
               <input :placeholder="$t('public0.public77')" type="text" name="firstName" v-model="value.firstName" v-validate="'required'" maxlength="128" autocomplete="off">
             </p>
          </div>
          <div class="item mt40">
            <p class="line">
              <input :placeholder="$t('public0.public79')" type="text" name="idNumber" v-model="value.idNumber" v-validate="'required|IdCard'" maxlength="18" autocomplete="off">
            </p>
          </div>
          <div class="item">
            <p class="msg">（{{$t('account.user_prompt9')}}）<!--请确保您使用本人的真实身份进行认证，我们会保护您的个人信息安全。--></p>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public80')}}<!--本人身份证正面照--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="value.front?getImgSrc(value.front):image.front" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="front" v-validate="'required'" v-model="value.front">
                  <input type="file" @change="uploadImage($event, 'front')">
                </div>
              </div>
              <div class="row-description"><p>{{$t('public0.public81')}}<!--请确保照片内容完整并清晰可见，仅支持JPG、PNG、JPEG、BMP图片格式。--></p></div>
            </div>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public83')}}<!--本人身份证背面照--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="value.back?getImgSrc(value.back):image.back" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="back" v-validate="'required'" v-model="value.back">
                  <input type="file" @change="uploadImage($event, 'back')">
                </div>
              </div>
              <div class="row-description"><p>{{$t('public0.public84')}}<!--请确保照片内容完整并清晰可见，身份证必须在有效期内，仅支持JPG、PNG、JPEG、BMP图片格式。--></p></div></div>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public85')}}<!--本人手持身份证照--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="value.hand?getImgSrc(value.hand):image.hand" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="hand" v-validate="'required'" v-model="value.hand">
                  <input type="file" @change="uploadImage($event, 'hand')">
                </div>
              </div>
              <div class="row-description"><p>{{$t('public0.public86').format(brand)}}<!--请您上传一张手持身份证及写有“{0}”和当天日期的卡片的照片。请确保头像、身份证信息、卡片上“{0}”和当天日期内容清晰可见。--></p></div>
            </div>
          </div>

          <mt-button type="primary" :disabled="locked" size="large" class="mt50" v-tap="{methods:identity1}">{{$t('account.user_complete')}}<!--完成--></mt-button>
      </form>
    </div>
    <uploading v-if="isUploading"/>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import config from '@/api/config'
import utils from '@/assets/js/utils'
import myApi from '@/api/individual'
import diagramFront from '@/assets/img/i_one.png'
import diagramBack from '@/assets/img/i_two.png'
import diagramHand from '@/assets/img/i_three.png'
import uploading from '@/components/uploading'
import photoCompress from '@/assets/js/photoCompress'

export default {
  name: 'realnameInfo',
  components: {
    uploading
  },
  data () {
    return {
      brand: config.brand[0].toUpperCase() + config.brand.substring(1, config.brand.length),
      value: {
        firstName: null,
        idNumber: null,
        front: null,
        back: null,
        hand: null
      },
      image: {
        front: diagramFront,
        back: diagramBack,
        hand: diagramHand
      },
      locked: false,
      isUploading: false,
      isSubmit: false
    }
  },
  computed: {
    msgs () {
      return {
        firstName: {required: this.$t('public0.public88')}, // 请输入姓名
        idNumber: {required: this.$t('public0.public89')}, // 请输入身份证号码
        front: {required: this.$t('public0.public90')}, // 未选择文件
        back: {required: this.$t('public0.public90')}, // 未选择文件
        hand: {required: this.$t('public0.public90')} // 未选择文件
      }
    }
  },
  /*beforeRouteEnter (from, to, next) {
    myApi.getUserState((data) => {
      data.verifyState === 0 ? next() : window.vm.$router.replace({name: 'ucenter'})
    }, (msg) => {
      console.error(msg)
      window.vm.$router.replace({name: 'ucenter'})
    })
  },*/
  methods: {
    getImgSrc(fileObj){
      return URL.createObjectURL(fileObj);
    },
    uploadImage (event, propertyName) {
      let _file = event.target.files[0]
      if (config.imageType.test(_file.name)) {
        photoCompress(_file, {width:1280, height:1280}, (blob)=>{
          this.value[propertyName] = this.image[propertyName] = new window.File([blob], _file.name, {type: _file.type})
        })
      } else {
        Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }
    },
    identity1 () {
      $('input').blur()
      this.$validator.validateAll(this.value).then((res) => {
        if (!res) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        if (this.locked) {
          return
        }
        this.locked = true
        this.isUploading = true
        var formData = new FormData()
        formData.append('firstName', this.value.firstName)
        formData.append('idNumber', this.value.idNumber)
        formData.append('back', this.value.back)
        formData.append('front', this.value.front)
        formData.append('hand', this.value.hand)
        formData.append('countryClass', '1')
        myApi.submitIdentityInfo(formData, (msg) => {
          this.isUploading = false
          this.isSubmit = true
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('public0.public160'), // 您已经提交了实名认证材料（每人仅有三次KYC机会），请耐心等待审核结果。审核结果将第一时间在站内消息中进行通知。
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm'),
            closeOnClickModal: false
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'ucenter'})
            }
          })
        }, (msg) => {
          this.locked = false
          this.isUploading = false
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form-row {
  display: flex;
  position: relative;
  margin-top: .3rem;
  .row-file {
    width: 1.4rem;
    height: 1.4rem;
    &-img {
      width: 100%;
      height: 100%;
      line-height: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 1.4rem;
      height: 1.4rem;
      input {
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
  .row-description {
    flex: 1 1 0;
    padding-left: .4rem;
  }
}

.item{
  font-size: .24rem;
   h1{
     margin-top: .5rem;
     font-size: .3rem;
     color: #333;
   }
   color: #999;
    input{
      background: transparent;
      border: 0;
      font-size: 0.3rem;
      height: 0.5rem;
      width: 100%;
    }
  p.line{
    border-bottom: 1px solid #ddd;
  }
  .msg{
    font-size: .24rem;
    color: #999;
    margin-top: .2rem;
  }
}
</style>
