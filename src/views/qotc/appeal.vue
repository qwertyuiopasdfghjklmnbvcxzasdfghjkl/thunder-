<template>
  <div class="page">
    <top-back>{{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉--></top-back>
    <div class="page-main">
      <div class="mt40 ui-flex lh80">
        <div class="ui-flex-2 f32">{{$t('gcox_otc.complaint_type')}}<!-- 申诉类型 --></div>
        <div class="ui-flex-3 kuan">
          <select v-model="formData.type" v-validate="'required'" data-vv-name="type">
            <option v-for="(item, index) in appealType" :key="index" :value="parseInt(item.appeal_type_id)">{{$t(`otc_exchange.otc_exchange_${item.type_key}`)}}</option>
          </select>
        </div>
      </div>
      <div class="f32 mt50">{{$t('appeal.appeal_reason')}}<!--申诉原因--></div>
      <div class="mt25 kuan">
        <textarea v-model="formData.description" v-validate="formData.type === 5 ? 'required' : null" data-vv-name="description" :placeholder="formData.type === 5 ? $t('appeal.appeal_desc') : $t('public0.public237')" maxlength="255" autocomplete="off"><!-- 请填写申诉原因及详情描述... --></textarea>
      </div>
      <div class="mt20 grey f24">{{$t('appeal.appeal_add_proof').format('jpg.png.jpeg.bmp')}}<!-- 添加相关转账证明或证明资料(仅支持jpg.png.jpeg.bmp格式) --></div>
      <div class="thumbs mt40">
        <div v-for="(item,index) in files">
          <div>
            <img :src="getImgSrc(item)" v-tap="{methods:showAlbum, index:index}">
          </div>
        </div>
        <div v-show="files.length<maxFiles">
          <div>
            <i class="icon-plus"></i>
            <input id="uploaderInput" type="file" multiple="multiple" :capture="capture" @change="filesChange">
          </div>
        </div>
      </div>
      <div class="mt80 pb50">
        <mt-button :class="{disabled: isLock}" type="primary" size="large" v-tap="{methods: submitAppeal}">{{$t('public0.public207')}}<!--提交申诉--></mt-button>
      </div>
    </div>
    <Dialog :show="isShow" :title="$t('appeal.img_preview')" :hide="()=>{isShow = false}"><!-- 图片预览 -->
        <swiper :options="swiperOption" ref="swiper">
            <!-- 幻灯内容 -->
            <swiper-slide v-for="(item,index) in files" :key="index">
                <img :src="getImgSrc(item)">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <i class="icon-trash" v-tap="{methods:delImg}"></i>
    </Dialog>
  </div>
</template>

<script>
import otcApi from '@/api/otc'
import userApi from '@/api/user'
import Dialog from '@/components/common/dialogFull'
import photoCompress from '@/assets/js/photoCompress'
import config from '@/api/config'


export default {
  name: 'otc-appeal',
  components: {
    Dialog,
  },
  data () {
    return {
      appealType: [],
      files:[],
      maxFiles:9,
      formData: {
        order_number: this.$route.params.orderNumber,
        type: 5,
        description: null,
        imagePath:''
      },
      swiperOption: {
          initialSlide :0,
          observer: true,
          pagination: {
              el: '.swiper-pagination',
          },
      },
      isLock: false,
      isShow:false
    }
  },
  computed: {
    msgs () {
      return {
        type: {required: this.$t('public0.public8')}, // 请输入问题类型
        description: {required: this.$t('public0.public9')} // 请输入问题描述
      }
    },
    capture(){
      return this.$root.getPhonePlatform()=='ios'?false:'camera' //兼容ios,android 均调用相册
    },
    swiper(){
      return this.$refs.swiper.swiper
    }
  },
  created () {
    this.getAppealType()
  },
  methods: {
    delImg(){
      this.files.splice(this.swiper.activeIndex,1)
    },
    showAlbum(args){
      this.swiper.slideTo(args.index)
      this.isShow = true
    },
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
          if(!this.files.length){
            Tip({type: 'danger', message: this.$t(`appeal.appeal_add_proof`).format('jpg.png.jpeg.bmp')}) //添加相关转账证明或证明资料(仅支持{0}格式)
            return
          }
          this.isLock = true
          this.uploadImgs().then(imgPath=>{
            this.formData.imagePath = imgPath
            otcApi.createAppeal(this.formData, (msg) => {
              this.isLock = false
              Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
              this.$router.go(-1)
            }, (msg) => {
              this.isLock = false
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            })
          })
        } else {
          if (this.errors.items.length) {
            let field = this.errors.items[0].field
            let msg = this.msgs[field][this.errors.firstRule(field)] || this.errors.items[0].msg
            Tip({type: 'danger', message: msg})
          }
        }
      })
    },
    getImgSrc(fileObj){
      return URL.createObjectURL(fileObj);
    },
    filesChange(e){
      let _files = e.target.files;
      if(_files.length > this.maxFiles){ //一次最多上传9张图片
        Tip({type:'error', message:this.$t('appeal.max_upload_tip').format(this.maxFiles)}); //一次最多上传{0}张图片,请重新选择!
        return;
      }
      if((this.files.length + _files.length) > this.maxFiles){ //判断所选的总图片数是否不大于9, 大于9张不能上传
        Tip({type:'error', message:this.$t('appeal.max_total_upload_tip').format(this.maxFiles)}); //所选图片总数超过{0}张,请重新选择!
        return;
      }
      for(let file of _files){
        if (config.imageType.test(file.name)) {
          photoCompress(file, {width:1080, height:1080}, (blob)=>{
            this.files.push(new window.File([blob], file.name, {type: file.type}))
          })
        }
      }
    },
    uploadImgs(){
      return new Promise((resolve, reject)=>{
        let _data = new FormData()
        _data.append('imageSoure', 'otcAppeal')
        this.files.forEach((file)=>{
          _data.append('files', file)
        })
        userApi.imageUpload(_data, res=>{
          resolve(this.files.map(file=>{
            return res+file.name
          }).join(','))
        }, msg=>{
          resolve(null)
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}

</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;
@error:#ef4f4f;
.grey {color: @grey;}
.blue {color: @blue;}
.lh80 {line-height: 0.8rem;}
.kuan {
  border: 1px solid @grey;
  border-radius:4px;
  min-height: 0.8rem;
  line-height: 0.6rem;
  padding: 0.1rem 0.2rem;
  font-size: 0.32rem;
  color: #fff;
  &.error {border-color: @error;}
}
select, textarea {
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
textarea {
  font-size: 0.28rem;
  padding: 0.1rem 0;
  height: 3.6rem;
}
.thumbs {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.15rem;
  margin-right: -0.15rem;
  > div {
    min-width: 0;
    width: 33.3%;
    padding-left: 0.15rem;
    padding-right: 0.15rem;
    margin-bottom: 0.3rem;
    > div {
      position: relative;
      padding-bottom: 73%;
      border:1px dashed @grey;
      overflow: hidden;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
      .icon-plus {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.48rem;
        color: @grey;
      }
      input[type=file] {
        position: absolute;
        font-size: 1.08rem;
        opacity: 0;
        z-index: 1;
      }
    }
  }
}

.icon-trash {
  position: absolute;
  left: 50%;
  bottom:1.1rem;
  font-size: 0.48rem;
  transform: translate(-50%,-50%);
  z-index: 1;
}

/deep/ .swiper-container {
    margin-left: -0.3rem;
    margin-right: -0.3rem;
    height: 100%;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }
}

/deep/ .swiper-pagination-bullet {
    background: #fff;
    border-radius: 8px;
    transition: all ease-out 300ms;
}

/deep/ .swiper-pagination-bullet-active {
    opacity: 0.8;
}
</style>
