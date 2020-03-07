<template>
    <div class="page">
        <top-back :back-page="'ucenter'">
            <span>{{$t('user.center')}}<!--个人中心--></span>
        </top-back>
        <div class="page-main">
            <div class="mt20 full box">
                <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
                <div class="bar hr">
                    <p>{{$t('account.user_center_avatar')}}<!--头像-->
                        <font class="f24 ft-c-lightGray" v-if="!getUserInfo.headerImagePath">
                            （{{$t('account.user_center_change')}}）<!--修改--></font>
                    </p>
                    <img src="../../../assets/img/user_img@2x.png" v-if="!getUserInfo.headerImagePath">
                    <img :src="orignal+getUserInfo.headerImagePath" @error="setDefaultIcon($event)" v-else>
                    <form class="imgform" ref="form">
                      <input type="file" name="source" title=" " accept="image/*" capture="camera" @change="uploadImage"/>
                    </form>
                </div>
                <!--<rail-bar :item="data4" class="hr"></rail-bar>-->
                <!-- <rail-bar :item="data5" class="hr"></rail-bar> -->
                <!--<rail-bar :item="data3" class="hr"></rail-bar>-->
            </div>

            <div class="out">
                <mt-button type="primary" size="large" v-tap="{methods: loginOut}">{{$t('home.home18')}}</mt-button>
            </div>
        </div>
        <Dialog :show="isShow" :title="$t('public0.public40')" :modal="true" :hide="hideDialog" :submit="modifyNickname">
            <nike-name-form ref="nikeNameForm" :nikename="getUserInfo.nickname" @hide="hideDialog"></nike-name-form>
        </Dialog>
    </div>
</template>

<script>
import railBar from '../../../components/RailBar'
import {MessageBox} from 'mint-ui'
import { mapActions, mapGetters } from 'vuex'
import userApi from '@/api/user'
import userUtils from '@/api/individual'
import nikeNameForm from './nikeNameForm' // 修改昵称
import Dialog from '@/components/common/dialog'
import avatar from '@/assets/img/user_img@2x.png'
import utils from '@/assets/js/utils'
import config from '@/api/config'
export default {
    name: 'myInfo',
    components: {
        railBar,
        Dialog,
        nikeNameForm
    },
    data () {
        return {
            isShow:false,
            state: null,
            orignal:config.domain==='etvcoins.com'?config.url+'/ceph-data/produ-etv/user/':config.url+'/ceph-data/dev/user/',
            data1: [
                {
                    name: this.$t('account.user_center_account'),
                    small:'',
                    rightIcon:true,
                    disabled:true,
                },
                {
                    name: this.$t('public0.public190'),
                    small:'',
                    rightIcon:true,
                    disabled:true,
                    action:null
                }
            ],
            // data3:{
            //     route: 'kyc',
            //     name: this.$t('home.home16'),
            //     icon: require('@/assets/img/kyc.png'),
            //     disabled:true,
            // },
            // data4:{
            //     name:this.$t('business.LEVEL'),
            //     disabled:true,
            //     rightIcon:true,
            //     small:''
            // },
            data5:{
                route: 'resetPW',
                name:this.$t('user.changePassword'),
            }
        }
    },
    computed:{
        ...mapGetters(['getUserInfo']),
    },
    created () {
        this.getKYCstate()
        this.initData()
        this.getUserLevel()
        console.log(this.orignal+this.getUserInfo.headerImagePath)
    },
    methods: {
        ...mapActions(['setApiToken','setUserInfo']),
        setDefaultIcon(e){
          let tar = e.currentTarget
          tar.src = avatar
        },
        getInfo() {
            userApi.getUserInfo(res => {
                res.headerImagePath = res.headerImagePath +'?_t='+Math.random(1000000)
                this.setUserInfo(res)
                this.initData()
            })
        },
        getUserLevel() {
            userApi.getUserLevel(res => {
                // this.data4.small = `<span class="ft-c-lightGray">${res==='0B'?'0T':res}</span>`
            })
        },
        initData(){
            this.data1[0].small = `<span class="ft-c-lightGray">${this.getUserInfo.username}</span>`
            if(this.getUserInfo.nickname){
                this.data1[1].small = `<span class="ft-c-lightGray">${this.getUserInfo.nickname}</span>`
                this.data1[1].action = null
            } else {
                this.data1[1].small = `<a>${this.$t('public0.public40')}</a>`
                this.data1[1].action = this.showDialog
            }
        },
        modifyNickname(){
            this.$refs.nikeNameForm.submit()
        },
        showDialog(){
            this.isShow = true
        },
        hideDialog(key){
            if(key===true){
                this.getInfo()
            }
            this.isShow = false
        },
        getKYCstate(){
            this.state = this.KYCstate(this.getUserInfo.kycState)
            // this.data3.small = `<span style="color:#999">${this.$t(this.state)}</span>`
            // this.data3.disabled = this.getUserInfo.kycState!==1?false:true
            // console.log(this.state, this.getUserInfo)
        },
        KYCstate(i){
            let As ={
                "0": "public0.public39",
                "1": "public0.public38", // 已通过
                "-1": "public0.public151",
                "-2": "account.user_fail",
                "-3": "account.user_fail",
            }
            return As[i]
        },
        uploadImage (e) {
          // 上传头像
          var target = e.target
          if (config.imageType.test(target.files.item(0).name) === false) {
            return Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
          }
          let isTrue = utils.limitUploadImage(target, (msg) => {
            Tip({type: 'danger', message: this.$t(msg)})
          }, 3)
          if (!isTrue) {
            target.value = ''
            return
          }
          var formData = new FormData(this.$refs.form)
          console.log(formData.getAll('source'))
          userUtils.uploadHeader(formData, (msg) => {
            this.getInfo()
            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        },
        loginOut () {
            // 确认退出当前帐号吗？
            MessageBox({
                title: this.$t('public0.public242'),
                message: this.$t('account.user_center_logout_confirm'),
                confirmButtonText: this.$t('public0.ok'),
                showCancelButton: true,
                cancelButtonText: this.$t('public0.no')
            }).then(action => {
                if (action === 'confirm') {
                    // userApi.logout(res=>{
                        this.setApiToken(null);
                        localStorage.removeItem('userInfo')
                        localStorage.removeItem('headerImg')
                        this.$router.replace({name:'home'})
                        this.$nextTick(()=>{
                            window.location.reload()
                        })
                    // }, msg=>{
                    //     console.log(msg)
                    // })
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
.out{
    text-align: center;
    position: absolute;
    bottom: .5rem;
    left: 0.3rem;
    right: 0.3rem;
}
.hr {
    position: relative;

    &:after {
        content: '';
        display: block;
        position: absolute;
        z-index: 9;
        bottom: 0;
        right: 0.3rem;
        left:0.3rem;
        /*background: #eee;*/
        height: 0.02rem;
    }

    &:last-child:after {
        display: none;
    }
}
.userImg {border: 1px solid #eee; border-radius: 100%; overflow: hidden;}
.imgform {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 9999999;
    opacity: 0;
    input {font-size: 0.6rem; width: 100%; height: 100%;}
}

.bar {
    /*background: #fff;*/
    padding: 0.22rem 0.32rem;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    height: 0.92rem;
    line-height: 0.48rem;
    position: relative;
    p {
        flex-shrink: 1;
        flex-grow: 1;
        font-size: 0.3rem;
        /*padding-left: 0.2rem;*/
    }

    &>img {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.2rem;
        object-fit: contain;
    }

    span {
        margin-right: 0.2rem;
    }

    i {
        height: 0.48rem;
        img {
            width: 0.14rem;
            height: 0.24rem
        }
    }
    /*&.disabled p { color: #999; }*/
}
.small {
    color: #fff;
    display: inline-block;
    border-radius: 50%;
    width: 0.2rem;
    height: 0.2rem;
    background: #4AC6C3;
}
</style>
