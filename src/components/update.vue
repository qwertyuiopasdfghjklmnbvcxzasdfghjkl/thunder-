<template>
	<mask-layer :show="show" :isgray="true">
		<div class="update-container">
			<div class="top"></div>
			<div class="content">
				<p class="f36 ft-c-deepGray text-center">{{$t('update.findUpdate')}}</p>
				<p class="mt15 f24 ft-c-deepGray text-center">{{$t('update.version')}} V{{version}}</p>
				<div class="log ft-c-gray" v-html="updateIntro"></div>
			</div>
			<div class="bottom">
				<mt-button type="default"  class="circle" v-tap="{methods:()=>{show = false}}">{{$t('public0.no')}}</mt-button>
				<mt-button type="primary"  class="circle ml50" v-tap="{methods:update}">{{$t('update.update')}}</mt-button>
			</div>
		</div>
	</mask-layer>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Config from '@/api/config'
import { MessageBox } from 'mint-ui'
export default {
	name:'update',
	data(){
		return {
			show: false,
			platform: this.$root.getPhonePlatform() === 'android' ? 'android' : 'apple'
		}
	},
	computed:{
		...mapGetters(['getLang','getVersion','getSysParams']),
		info(){
		    let _obj = {} 
		    for(let item in this.getSysParams){
		        _obj[item] = this.getSysParams[item].value
		    }
		    return _obj
		},
		version(){
			return this.info[`${this.platform}Version`] || ''
		},
		url(){
			return (this.platform==='android'?`${Config.url}${this.info.androidPath}`:this.info.appleUrl) || ''
		},
		updateIntro(){
			let lang = this.getLang==='zh-CN'?'zh':this.getLang
			let intro = JSON.parse(this.info[`${this.platform}UpdateIntro`] || '{}')
			return intro[lang]
		},
		promptUpdate(){
			return this.info[`${this.platform}PromptUpdate`]==='1'
		}
	},
	methods:{
		checkChcpUpdate(){
		  // 检测热更新
		  if (window.chcp) {
		    console.log('--chcp ready--');
		    let chcp = window.chcp;
		    // 检测更新
		      chcp.fetchUpdate((error, data) => {
		      // 表示没有更新版本，或者其他错误，详情的信息参考上面的chcp error链接
		      if (error) {
		        console.log('--fetchUpdate error--', error.code, error.description);
		        Tip({type:'success', message:this.$t('update.latestVersion')})
		        return;
		      }
		      // 这次更新的版本信息
		      console.log('--fetchUpdate--', data, data.config);
		      // 检测是否是否可以进行安装了，双重判断吧，有时候会出现有更新版本但是暂时无法安装的情况（也可以去掉这一层）
		      chcp.isUpdateAvailableForInstallation((error, data) => {
		        if (error) {
		          console.log('No update was loaded => nothing to install');
		        } else {
		          // 询问用户是否更新 检测到新版本，是否更新?
		            let lang = this.getLang
		            MessageBox.confirm(lang==='zh-CN'?'检测到新版本，是否更新？':'New version detected. Is it updated?',lang==='zh-CN'?'提示':'Tip',{
		              confirmButtonText: lang==='zh-CN'?'确定':'Yes',
		              cancelButtonText: lang==='zh-CN'?'取消':'No'
		            }).then(action => {
		              // 更新中
		              chcp.installUpdate((error) => {
		                if (error) {
		                  // 更新失败
		                  window.localStorage.setItem('appUpdated', 'false')
		                  console.log('Failed to install the update with error code: ' + error.code);
		                  console.log(error.description);
		                } else {
		                  // 更新成功
		                  window.localStorage.setItem('appUpdated', 'true')
		                  console.log('Update installed!');
		                }
		              });
		            }, () =>{})
		          // 对比版本号
		          console.log('Current content version: ' + data.currentVersion);
		          console.log('Ready to be installed:' + data.readyToInstallVersion);
		        }
		      });
		    });
		  }
		},
		getLatestVersion(key){
			if(!window['cordova']){
			  return
			}
			//检测全量版本更新
			if(this.promptUpdate && this.version>this.getVersion){
				this.show = true
			} else if(key) {
				//检测热更新
				this.checkChcpUpdate()
				// Tip({type:'success', message:this.$t('update.latestVersion')})
			}
		},
		cancel(){
			this.show = false
		},
		update(){
			if(this.platform==='android'){
				window['AppUpdate'] && window.AppUpdate.downloadAndInstallApk(msg=>{
					Tip({type:'success', message:msg})
				}, msg=>{
					Tip({type:'error', message:msg})
				}, this.url);
			} else if(this.platform==="apple"){
				if(/\.apple$/.test(this.url)){
					// location.href="itms-services://?action=download-manifest&url="+this.url;
					this.$root.openURL(this.url)
				} else {
					this.$root.openURL(this.url)
				}
			}else {
				this.$root.openURL(this.url)
			}
			this.show = false
		}
	}
}
</script>

<style lang="less" scoped="">
.update-container {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 6rem;
	background-color: #fff;
	transform: translate(-50%, -50%);
	border-radius: 4px;
	.top {
		height: 2.32rem;
		background: url('../assets/img/updata_bg.png') no-repeat center top;
		background-size:100% auto;
	}
	.bottom {
		padding-top:0.4rem;
		padding-bottom: 0.9rem;
		padding-left:0.72rem;
		padding-right:0.72rem;
		display: flex;
		justify-content: space-between;
		/deep/ button {flex: 1;}
	}
	.content {
		padding-left:0.72rem;
		padding-right:0.72rem;
		margin-top: 0.2rem;
		.log {
			margin-top: 0.2rem;
			line-height: 0.48rem;
			max-height: calc(~'100vh - 7.24rem');
			overflow-y: auto;
		}
	}
}
</style>
