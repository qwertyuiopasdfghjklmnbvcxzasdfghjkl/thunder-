<template>
  <div class="page">
    <top-back>{{$t('public0.public76')}}<!--其他地区--></top-back>

    <div class="page-main bg-c-white">
      <form ref="form" onsubmit="return false">
          <div class="item mt30">
            <p class="line">
              <input :placeholder="$t('public0.public77')" type="text" name="firstName" v-validate="'required'" maxlength="128" autocomplete="off">
            </p>
          </div>
          <div class="item mt30">
            <p class="line">
              <!-- <input :placeholder="$t('public0.public93')"> -->
              <select class="row-select" name="sex" v-model="value.sex" v-validate="'required'">
                <option value="" disabled>{{$t('public0.public93')}}<!--性别--></option>
                <option v-for="(item, index) in list.sex" :value="item.id" :key="index">{{$t(item.key)}}</option>
              </select>
            </p>
          </div>
          <div class="item mt30">
            <p class="line">
              <!-- <input placeholder="国家/地区"> -->
              <select class="row-select" name="country" v-model="value.country" v-validate="'required'">
                <option value="" disabled>{{$t('public0.public95')}}<!--国家及地区--></option>
                <option v-for="(item, index) in list.country" :value="item.id" :key="index">{{$t(`countrys.${item.code}`)}}</option>
              </select>
            </p>
          </div>
          <div class="item mt30">
            <p class="line">
              <!-- <input placeholder="证件"> -->
              <select class="row-select" name="credential" v-model="value.credential" v-validate="'required'">
                <option value="" disabled>{{$t('public0.public216')}}<!--证件--></option>
                <option v-for="(item, index) in list.credential" :value="item.id" :key="index">{{$t(item.key)}}</option>
              </select>
            </p>
          </div>
          <div class="item mt30">
            <p class="line">
              <input :placeholder="$t('public0.public97')" name="idNumber" type="text" v-validate="'required'" maxlength="18" autocomplete="off">
            </p>
          </div>
          <div class="item">
            <p class="msg">（{{$t('public0.public91')}}）<!--请确保您使用本人的真实身份进行认证，我们会保护您的个人信息安全。仅用于港澳台和国际用户的验证。--></p>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public98')}}<!--证件封面--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="image.front" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="front" aria-required="true" aria-invalid="false" value="" style="display:none;">
                  <input type="file" title=" " @change="uploadImage($event, 'front')" style="display:none;">
                  <input type="file" data-key="2" title=" " @change="uploadImage($event, 'front')"></div>
              </div>
              <div class="row-description"><p>{{$t('public0.public99')}}<!--请您上传证件封面照片，请确保照片内容完整并清晰可见，仅支持JPG、PNG、JPEG、BMP图片格式。--></p></div>
            </div>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public100')}}<!--证件个人信息页--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="image.back" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="front" aria-required="true" aria-invalid="false" value="" style="display:none;">
                  <input type="file" title=" " @change="uploadImage($event, 'back')" style="display:none;">
                  <input type="file" data-key="2" title=" " @change="uploadImage($event, 'back')"></div>
              </div>
              <div class="row-description"><p>{{$t('public0.public101')}}<!--请您上传个人信息页照片，请确保照片内容完整并清晰可见，证件必须在有效期内，仅支持JPG、PNG、JPEG、BMP图片格式。--></p></div>
            </div>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public102')}}<!--本人手持证件信息页--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="image.hand" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="front" aria-required="true" aria-invalid="false" value="" style="display:none;">
                  <input type="file" title=" " @change="uploadImage($event, 'hand')" style="display:none;">
                  <input type="file" data-key="2" title=" " @change="uploadImage($event, 'hand')"></div>
              </div>
              <div class="row-description"><p>{{$t('public0.public103').format(brand)}}<!--请您上传一张手持证件及写有“{0}”和当天日期的卡片的照片。请确保头像、证件内容、卡片上“{0}”和当天日期内容清晰可见。--></p></div>
            </div>
          </div>

          <mt-button type="primary" :disabled="locked" size="large" class="mt50 mb50" v-tap="{methods:identity2}">{{$t('account.user_complete')}}<!--完成--></mt-button>
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
export default {
  name: 'page-otherRealnameInfo',
  components: {
    uploading
  },
  data () {
    return {
      brand: config.brand[0].toUpperCase() + config.brand.substring(1, config.brand.length),
      value: {
        firstName: null,
        sex: '',
        country: '',
        credential: '',
        idNumber: null,
        front: null,
        back: null,
        hand: null
      },
      list: {
        sex: [
          {id: 0, key: 'public0.public105', name: '女'},
          {id: 1, key: 'public0.public104', name: '男'}
        ],
        country: [],
        credential: [
          {id: 0, key: 'certificate.Drli', name: '驾照'},
          {id: 1, key: 'certificate.Papot', name: '护照'},
          {id: 2, key: 'certificate.NaId', name: '国民身份证'}
        ]
      },
      image: {
        front: diagramFront,
        back: diagramBack,
        hand: diagramHand
      },
      isShowUpload: {
        front: true,
        back: true,
        hand: true
      },
      locked: false,
      isUploading: false,
      isSubmit: false
    }
  },
  computed: {
    msgs () {
      return {
        firstName: {required: this.$t('public0.public88')}, // 请输入名字
        sex: {required: this.$t('public0.public106')}, // 请选择性别
        country: {required: this.$t('public0.public108')}, // 请输入国家
        credential: {required: this.$t('public0.public217')}, // 请输入证件
        idNumber: {required: this.$t('public0.public107')}, // 请输入护照ID
        front: {required: this.$t('public0.public90')}, // 未选择文件
        back: {required: this.$t('public0.public90')}, // 未选择文件
        hand: {required: this.$t('public0.public90')} // 未选择文件
      }
    }
  },
  beforeRouteEnter (from, to, next) {
    myApi.getUserState((data) => {
      data.verifyState === 0 ? next() : window.vm.$router.replace({name: 'ucenter'})
    }, (msg) => {
      console.error(msg)
      window.vm.$router.replace({name: 'ucenter'})
    })
  },
  created () {
    myApi.getAreas((res) => {
      this.list.country = res
    })
  },
  methods: {
    uploadImage (event, propertyName) {
      let isTrue = false
      if (config.imageType.test(event.target.value)) {
        isTrue = utils.limitUploadImage(event.target, (msg) => {
          Tip({type: 'danger', message: this.$t(msg)})
        }, 4)
      } else {
        isTrue = false
        Tip({type: 'danger', message: this.$t('public0.public43')})
      }
      if (isTrue) {
        this.value[propertyName] = this.image[propertyName] = window.URL.createObjectURL(event.target.files[0])
        event.target.name = propertyName
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
    },
    identity2 () {
      $('input').blur()
      this.$validator.validateAll().then((res) => {
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
        var formData = new FormData(this.$refs.form)
        formData.append('countryClass', '2')
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
    select{
      width: 100%;
      height: .5rem;
      font-size: .3rem;
      background-color: transparent;
      border: none;
    }
  }
  .msg{
    font-size: .24rem;
    color: #999;
    margin-top: .2rem;
  }
}
</style>
