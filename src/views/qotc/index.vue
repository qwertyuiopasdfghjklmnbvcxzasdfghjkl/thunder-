<template>
    <div class="page">
    	<top-back></top-back>
    	<div class="page-main">
    		<div class="full bgblock">
	    		<div class="ui-flex ui-flex-justify f32">
	    			<div class="tabs">
	    				<span :class="{active:type=='buy'}" v-tap="{methods:setType, type:'buy'}">极速购买</span>
	    				<span :class="{active:type=='sell'}" v-tap="{methods:setType, type:'sell'}">极速卖出</span>
	    			</div>
	    			<div><span>OTC管理</span></div>
	    		</div>
	    		<swiper :options="swiperOption" class="tokens mt30">
	    		    <!-- 幻灯内容 -->
	    		    <swiper-slide li v-for="(item, index) in tokens" :key="index">
	    		        <div class="token" :class="{active:token==item}" v-tap="{methods:setToken, token:item}">
	    		        	<i class="icon_ checked"></i> {{item}}
	    		        </div>
	    		    </swiper-slide>
	    		    <div class="swiper-pagination" slot="pagination"></div>
	    		</swiper>
	    		<div class="mt40 amount-container">
	    			<transition enter-active-class="animated short slideInLeft" leave-active-class="animated short slideOutLeft">
	    			  	<div class="ui-flex ui-flex-justify" v-show="isToken">
	    			  		<input type="number" name="amount" v-model="amount" class="ui-flex-1" :placeholder="type=='buy'?'请输入购买数量':'请输入卖出数量'">
	    			  		<span class="f30 grey">{{token}}</span>
	    			  		<span class="f30 blue ml20" v-show="type=='sell'" v-tap="allIn">{{'全部'}}</span>
	    			  	</div>
	    			</transition>
	    			<transition enter-active-class="animated short slideInRight" leave-active-class="animated short slideOutRight">
	    				<div class="ui-flex ui-flex-justify" v-show="!isToken">
	    					<span class="f52">￥ </span>
	    			  		<input type="number" name="amount" v-model="amount" class="ui-flex-1" :placeholder="type=='buy'?'请输入购买金额':'请输入卖出金额'">
	    			  		<span class="f30 blue" v-show="type=='sell'" v-tap="allIn">{{'全部'}}</span>
	    			  	</div>
	    			</transition>
	    		</div>
	    		<div class="mt25 ui-flex ui-flex-justify f26">
	    			<span class="grey">参考价格 7.15 CNY</span>
	    			<span class="blue" v-tap="{methods:()=>{isToken = !isToken}}">{{type=='buy'?(isToken?'按金额购买':'按数量购买'):(isToken?'按金额卖出':'按数量卖出')}} <i class="icon_exchange"></i></span>
	    		</div>
	    		<div class="mt10 grey f26" v-if="getApiToken">账户余额 0.00000000 {{token}}</div>
    		</div>
    		<div class="full bgblock mt20" v-show="getApiToken && type=='sell'">
    			<p class="f26 grey">选择收款方式</p>
    			<ul class="mt25 payments">
    				<li v-for="(item, index) in payments" v-tap="{methods:()=>{payType = item}}" class="ui-flex ui-flex-justify" :class="{active:payType==item}">
    					<span><i class="icon_"></i> {{item}}</span>
    					<span>fla126@qq.com</span>
    				</li>
    				<router-link v-if="!payments.length" :to="{name:'set-payway'}" class="active" tag="li">{{'添加收款方式'}}</router-link>
    			</ul>
    		</div>
    	</div>
    	<span class="icon_ add-advertisement" v-tap="{methods:addAdvertisement}"></span>
    	<span class="icon_ online-service" v-tap="{methods:goOnlineService}"></span>
    	<div class="bottom-layer">
    		<template v-if="getApiToken">
	    		<mt-button type="primary" size="large" v-show="type=='buy'">立即购买</mt-button>
	    		<mt-button type="primary" size="large" v-show="type=='sell'">立即卖出</mt-button>
    		</template>
    		<template v-else>
    			<mt-button type="primary" size="large" v-tap="{methods:$root.routeTo, to:'login', query:{curl:$route.fullPath}}">请登录</mt-button>
    		</template>
    	</div>
    	<Dialog :show="isShow" :title="$t('昵称设置')" :modal="true" :hide="hideDialog" :submit="modifyNickname">
            <nike-name-form ref="nikeNameForm" :nikename="getUserInfo.nickname" @hide="hideDialog"></nike-name-form>
        </Dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/qotc'
import userApi from '@/api/user'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import numberbox from '@/components/numberInput'
import { Toast } from 'mint-ui'
import Dialog from '@/components/common/dialog'
import nikeNameForm from '@/views/my/center/nikeNameForm' // 修改昵称

export default {
	components: {
        Dialog,
        nikeNameForm
    },
	data(){
		return {
			type:'',
			token:'USDT',
			amount:'',
			isToken:true, //输入金额类型
			payType:'支付宝',
			tokens:['USDT', 'ETH', 'BTC', 'KOALL', 'CDCC', 'NTON', 'AFA', 'WDDF'],
			payments:['支付宝','微信支付'],
			swiperOption: {
                // 所有配置均为可选（同Swiper配置）
                observer: true,
                resistanceRatio:0,
                slidesPerView: 'auto',
                spaceBetween: 15,
      			freeMode: true
            },
            isShow:false,
		}
	},
	computed:{
		...mapGetters(['getApiToken','getSysParams','getUserInfo']),
	},
	created(){
		this.type = this.$route.params.type || 'buy'
		let otcTokens = this.getSysParams.otcTokens && this.getSysParams.otcTokens.value
		if(otcTokens && otcTokens.length){
			this.token = otcTokens[0]
		}
	},
	methods:{
		...mapActions(['setUserInfo']),
		setToken(args){
			this.token = args.token
		},
		setType(args){
			this.type = args.type
		},
		allIn(){

		},
		goOnlineService(){

		},
		addAdvertisement(){

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
        modifyNickname(){
            this.$refs.nikeNameForm.submit()
        },
        getInfo() {
            userApi.getUserInfo(res => {
                this.setUserInfo(res)
            })
        },
	}
}
</script>

<style lang="less" scoped>
@grey:#4B5875;
@blue:#0C6AC9;
.page-main {padding-bottom: 1.5rem;}

.grey {color: @grey;}
.blue {color: @blue;}
.tabs {
	color: @grey;
	font-weight: 600;
	span {
		display: inline-block;
		&.active {color: #FFFFFF; font-size: 0.44rem;}
	}
	span + span {margin-left: 0.3rem;}
}
.tokens {
	/deep/ .swiper-slide {width: auto;}
	.token {height: 0.6rem; padding-left: 0.24rem; padding-right: 0.24rem; line-height: 0.6rem; background-color: #212A40; color: @grey; border-radius: 0.28rem;}
	.token.active {color: @blue;}
	.icon_ {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_unchecked.png');}
	.token.active .icon_ {background-image: url('../../assets/img/icon_checked.png');}
}
.amount-container {
	position: relative;
	height: 0.7rem;
	padding-bottom: 0.2rem;
	border-bottom:1px solid #273246;
	line-height: 0.5rem;
	> div {position: absolute; left: 0; right: 0;}
	input {color: #fff; border: none; background-color: transparent; font-size: 0.48rem; vertical-align: middle;}
}
.icon_exchange {width: 0.32rem; height: 0.34rem; background-image: url('../../assets/img/icon_exchange.png');}
.bgblock { background-color: #151C2C; padding: 0.3rem; }
.payments {
	li {
		line-height: 0.6rem;
		i {width: 0.3rem; height: 0.32rem; margin-right: 0.1rem; background-image: url('../../assets/img/icon_unchecked.png');}
		&.active {
			color: @blue;
			i {background-image: url('../../assets/img/icon_checked.png');}
		}
	}
}
.bottom-layer {
	position:absolute;
	left: 0.3rem;
	right: 0.3rem;
	bottom:0.6rem;
}
.online-service {
	position: absolute;
	bottom:2.16rem;
	right: 0.3rem;
	width: 0.9rem;
	height: 0.9rem;
	z-index: 9999;
	background-image: url('../../assets/img/icon_service.png');
}
.add-advertisement {
	position: absolute;
	bottom:3.36rem;
	right: 0.3rem;
	width: 0.9rem;
	height: 0.9rem;
	z-index: 9999;
	background-image: url('../../assets/img/icon_add_advertisement.png');
}
</style>