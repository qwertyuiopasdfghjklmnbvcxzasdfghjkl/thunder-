<template>
    <div class="page">
    	<top-back>
			<template slot="right">
				<div class="tab">
					<!-- <label :class="{'active':tab === 1}" v-tap="{methods:()=>{tab=1}}">{{$t('qotc.flash')}}</label> -->
					<label :class="{'active':tab === 2}" v-tap="{methods:()=>{tab=2}}">{{$t('qotc.self_select')}}</label>
				</div>
			</template>
		</top-back>
		<div>
			<flash style="visibility: hidden;" v-show="tab===1" ref="flash"/>
			<otc-index v-show="tab===2" :pay="pay"/>
			<ad-service></ad-service>
		</div>
    </div>
</template>

<script>


import Flash from "./flash";
import OtcIndex from "../otc/index"
import store from '@/store'
import { MessageBox, Toast } from 'mint-ui'
import adService from './components/ad_service' // 跳转广告和客服

export default {
	components: {
		Flash,
		OtcIndex,
		adService
	},
	data(){
		return {
			tab: 2
		}
	},
	computed:{
		pay(){
			return  null
		}
	},
	watch:{
		pay(e){
			console.log(e)
		}
	},
	beforeRouteEnter (to, from, next) {
		console.log(store.getters.getApiToken)
		if(store.getters.getApiToken && store.getters.getUserInfo.mobileAuthEnable!=1){
			MessageBox.confirm(window.vm.$t('qotc.to_bind_phone'),window.vm.$t('otc_ad.otc_ad_confirm'),{ //未绑定手机号，是否立即前往？
				cancelButtonText:window.vm.$t('home.home37'),
				confirmButtonText:window.vm.$t('otc_ad.otc_ad_confirm'),
			}).then(action => {
				window.vm.$router.push({name:'phoneVerify'})
			})
		} else {
			next()
		}
	},
	methods: {}
}
</script>

<style lang="less" scoped>
.tab{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 0.3rem;
	height: 0.9rem;
	label{
		height: 0.6rem;
		line-height: 0.6rem;
		flex: 1;
		padding: 0 0.3rem;
		background: transparent;
		border-radius:1rem;
		&.active{
			background: #0C6AC9;
		}
	}
}
</style>
