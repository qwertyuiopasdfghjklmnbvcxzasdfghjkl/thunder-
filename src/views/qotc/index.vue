<template>
    <div class="page">
    	<top-back></top-back>
    	<div class="page-main">
    		<div class="full bgblock">
	    		<div class="ui-flex ui-flex-justify f32">
	    			<div class="tabs">
	    				<span :class="{active:type==1}" v-tap="{methods:setType, type:1}">极速购买</span>
	    				<span :class="{active:type==2}" v-tap="{methods:setType, type:2}">极速卖出</span>
	    			</div>
	    			<div><span>OTC管理</span></div>
	    		</div>
	    		<swiper :options="swiperOption" class="tokens mt30">
	    		    <!-- 幻灯内容 -->
	    		    <swiper-slide li v-for="(item, index) in tokens" :key="index">
	    		        <div class="token" :class="{active:token==item.symbol}" v-tap="{methods:setToken, token:item.symbol}">
	    		        	<i class="icon_ checked"></i> {{item.symbol}}
	    		        </div>
	    		    </swiper-slide>
	    		    <div class="swiper-pagination" slot="pagination"></div>
	    		</swiper>
	    		<div class="mt50 amount-container">
	    			<transition enter-active-class="animated short slideInLeft" leave-active-class="animated short slideOutLeft">
	    			  	<div class="ui-flex ui-flex-justify" v-show="isToken">
	    			  		<input type="number" name="amount" v-model="amount" class="ui-flex-1" :placeholder="type==1?'请输入购买数量':'请输入卖出数量'">
	    			  		<span class="f30 grey">{{token}}</span>
	    			  		<span class="f30 blue ml20" v-show="type==2" v-tap="{methods:allIn}">{{'全部'}}</span>
	    			  	</div>
	    			</transition>
	    			<transition enter-active-class="animated short slideInRight" leave-active-class="animated short slideOutRight">
	    				<div class="ui-flex ui-flex-justify" v-show="!isToken">
	    					<span class="f52">￥ </span>
	    			  		<input type="number" name="amount" v-model="currencyCount" class="ui-flex-1" :placeholder="type==1?'请输入购买金额':'请输入卖出金额'">
	    			  		<span class="f30 blue" v-show="type==2" v-tap="{methods:allIn}">{{'全部'}}</span>
	    			  	</div>
	    			</transition>
	    		</div>
	    		<div class="mt25 ui-flex ui-flex-justify f26">
	    			<span class="grey">参考价格 {{refPrice}} {{currency}}</span>
	    			<span class="blue" v-tap="{methods:()=>{isToken = !isToken}}">{{type==1?(isToken?'按金额购买':'按数量购买'):(isToken?'按金额卖出':'按数量卖出')}} <i class="icon_exchange"></i></span>
	    		</div>
	    		<div class="mt10 grey f26" v-if="getApiToken">账户余额 {{balance}} {{token}}</div>
    		</div>
    		<div class="full bgblock mt20" v-show="getApiToken && type==2">
    			<p class="f26 grey">选择收款方式</p>
    			<ul class="mt25 payments">
    				<li v-tap="{methods:()=>{payType = 1}}" class="ui-flex ui-flex-justify" :class="{active:payType==1}" v-if="payments.card_number">
    					<span><i class="icon_"></i> {{$t('otc_legal.oyc_legal_Bank_card')}}<!--银行卡--></span>
    					<span>{{payments.card_number}}</span>
    				</li>
    				<li v-tap="{methods:()=>{payType = 2}}" class="ui-flex ui-flex-justify" :class="{active:payType==2}" v-if="payments.alipay_number">
    					<span><i class="icon_"></i> {{$t('public0.public199')}}<!--支付宝--></span>
    					<span>{{payments.alipay_number}}</span>
    				</li>
    				<li v-tap="{methods:()=>{payType = 3}}" class="ui-flex ui-flex-justify" :class="{active:payType==3}" v-if="payments.wechat_number">
    					<span><i class="icon_"></i> {{$t('public0.public198')}}<!--微信--></span>
    					<span>{{payments.wechat_number}}</span>
    				</li>
    				<li v-tap="{methods:()=>{payType = 4}}" class="ui-flex ui-flex-justify" :class="{active:payType==4}" v-if="payments.paypal_number">
    					<span><i class="icon_"></i> {{$t('public0.public219')}}<!--PayPal--></span>
    					<span>{{payments.paypal_number}}</span>
    				</li>

    				<router-link v-if="hasAllPays" :to="{name:'set-payway'}" class="active" tag="li">{{'添加收款方式'}}</router-link>
    			</ul>
    		</div>
    	</div>
    	<router-link class="icon_ add-advertisement" v-if="'有权限发布广告'" tag="span" :to="{name:'qotcAddOrUpdate'}"></router-link>
    	<span class="icon_ online-service" v-tap="{methods:goOnlineService}"></span>
    	<div class="bottom-layer">
    		<template v-if="getApiToken">
	    		<mt-button type="primary" size="large" :disabled="locked" v-tap="{methods:buyOrSell}">{{type==1?'立即购买':'立即卖出'}}</mt-button>
    		</template>
    		<template v-else>
    			<mt-button type="primary" size="large" v-tap="{methods:$root.routeTo, to:'login', query:{curl:$route.fullPath}}">请登录</mt-button>
    		</template>
    	</div>
    	<Dialog :show="isShow" :title="$t('昵称设置')" :modal="true" :hide="hideDialog" :submit="modifyNickname">
            <nike-name-form ref="nikeNameForm" :nikename="getUserInfo.nickname" @hide="hideDialog"></nike-name-form>
        </Dialog>
        <Dialog :show="notMatched" :title="$t('提示')" :showBtns="false" :hide="hideMTDialog">
            <p class="tc ft-c-default f28 lh17">未匹配成功，建议您分多笔小额下单，更容易匹配成功。</p>
        </Dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'
import walletApi from '@/api/wallet'
import userApi from '@/api/user'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import numberbox from '@/components/numberInput'
import { Toast, MessageBox } from 'mint-ui'
import Dialog from '@/components/common/dialog'
import nikeNameForm from '@/views/my/center/nikeNameForm' // 修改昵称

export default {
	components: {
        Dialog,
        nikeNameForm
    },
	data(){
		return {
			type:1,
			token:'USDT',
			amount:'',
			currencyCount:'',
			currency:'CNY',
			isToken:true, //输入金额类型
			payType:null, //pay_type: "1" 银行卡； "2" 支付宝； "3"微信支付； "4" Paypal；
			tokens:[],
			payments:{},
			refPrice: 0, // 参考价格
			swiperOption: {
                // 所有配置均为可选（同Swiper配置）
                observer: true,
                resistanceRatio:0,
                slidesPerView: 'auto',
                spaceBetween: 15,
      			freeMode: true
            },
            isShow:false,
            notMatched:false,
            locked:false
		}
	},
	computed:{
		...mapGetters(['getApiToken','getUserInfo', 'getUserWallets']),
		hasAllPays(){
			return !this.payments.card_number || !this.payments.alipay_number || !this.payments.wechat_number || !this.payments.paypal_number
		},
		hasPay(){
			return this.payments.card_number || this.payments.alipay_number || this.payments.wechat_number || this.payments.paypal_number
		},
		balance(){
			let _balance = 0
			for(let item of this.getUserWallets){
				if(item.symbol==this.token && item.type==1){
					_balance = item.availableBalance
					break;
				}
			}
			return _balance
		},
		benchSymbolParams () {
		  return {
		    ad_type: this.type,
		    symbol: this.token,
		    currency: this.currency,
		    bench_marking_id: 2
		  }
		},
	},
	watch:{
		benchSymbolParams() {
		  this.getBenchSymbolInfo()
		},
		isToken(){
			this.amount = ''
			this.currencyCount = ''
		}
	},
	created(){
		this.type = this.$route.params.type || 1
		this.getOtcTokens()
		this.getPaySettings()
		this.getBenchSymbolInfo()
	},
	methods:{
		...mapActions(['setUserInfo', 'setUserWallets']),
		buyOrSell(){

			if(!this.getUserInfo.nickname){
				this.isShow = true
				return
			}
			if(this.getUserInfo.kycState !== 1) {
			    MessageBox.confirm(this.$t('home.home66'), this.$t('实名认证'), {
			    	cancelButtonText: this.$t('public0.no'),
			        confirmButtonText: this.$t('前往认证')
			    }).then(action => {
			        if (action === 'confirm') {
			            this.$router.push({name: 'kyc'})
			        }
			    })
			    return
			}
			if(this.type==2 && !this.payType){ //如果是卖需添加收款支付方式
				this.hasPay?Tip({type:'error', message:'请选择收款方式'}):Tip({type:'error', message:'请添加收款方式'})
				return
			}
			if(this.isToken && Number(this.amount==0)){ //币种模式则币种不能为空
				Tip({type:'error', message:this.type==1?'请输入购买数量':'请输入卖出数量'})
				return
			}
			if(!this.isToken && Number(this.currencyCount==0)){ //币种模式则总金额不能为空
				Tip({type:'error', message:this.type==1?'请输入购买金额':'请输入卖出金额'})
				return
			}
			if(this.type==2 && numUtils.BN(this.balance).lt(this.isToken?this.amount:numUtils.div(this.currencyCount, this.refPrice))){
				Tip({type:'error', message:this.token+'账户余额不足'})
				return
			}
			this.quickMatch()
		},
		quickMatch(){
			this.locked = true
			let _data = {
	          currency: this.currency,
	          symbol: this.token,
	          direction: this.type,
	          currencyCount: this.currencyCount
	        }
	        if(this.type==2){
	        	_data.payType = this.payType
	        }
	        if(this.isToken){
	        	_data.amount = this.amount
	        	_data.currencyCount = utils.toFixed(numUtils.mul(this.amount, this.refPrice), 2)
	        } else {
	        	_data.currencyCount = this.currencyCount
	        	_data.amount = utils.toFixed(numUtils.div(this.currencyCount, this.refPrice), 8)
	        }
	        otcApi.quickMatchAndCreate(_data, orderId=>{
	        	this.locked = false
	        	if(this.type==2){ //卖币成功刷新用户余额
	        		this.getAssets()
	        	}
	        	this.$router.replace({name:'orderDetail', params:{orderId:orderId}})
	        },msg=>{
	        	this.locked = false
	        	if(msg=='AD_NO_ELIGIBLE'){ //未匹配成功提示
	        		this.notMatched = true
	        		window._matchTimer = setTimeout(()=>{
	        			this.notMatched = false
	        		},4000)
	        	}
	        })
		},
		getOtcTokens(){
			otcApi.getCoinsList((data) => { // 获取币种信息
			  this.tokens = data
			  if(data.length){
			  	this.token = this.tokens[0]['symbol']
			  }
			}, (msg) => {
			  console.error(msg)
			})
		},
		setToken(args){
			this.token = args.token
		},
		setType(args){
			this.type = args.type
		},
		allIn(){
			if(this.isToken){
				this.amount = this.balance
			} else {
				this.currencyCount = utils.toFixed(numUtils.mul(this.balance, this.refPrice), 2)
			}
		},
		goOnlineService(){

		},
        hideDialog(key){
            if(key===true){
                this.getInfo()
            }
            this.isShow = false
        },
        hideMTDialog(){
        	this.notMatched = false
        	window._matchTimer && clearTimeout(window._matchTimer)
        },
        modifyNickname(){
            this.$refs.nikeNameForm.submit()
        },
        getInfo() {
            userApi.getUserInfo(res => {
                this.setUserInfo(res)
            })
        },
        getBenchSymbolInfo () { // 获取对标交易所币种价格
          otcApi.getBenchSymbolInfo(this.benchSymbolParams, (res) => {
            this.refPrice = numUtils.BN(res.cur_price || 0).toFixed(2)
          })
        },
        getPaySettings(){ //获取用户支付方式
        	if(!this.getApiToken){
        		return
        	}
        	otcApi.getPaySettings(res=>{
        		this.payments = res.data
        		if(this.payments.alipay_number){
        			this.payType = 2
        		}
        	})
        },
        getAssets() {
            walletApi.myAssets({}, (res) => {
                res = res.filter(item => {
                    return item.type === 1
                })
                res.forEach((item) => {
                    item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
                })
                this.setUserWallets(res)
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
		line-height: 0.7rem;
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