<template>
	<div class="page">
		<top-back>{{$t('referral.invitation_code')}} <!-- Invitation Code --> </top-back>
		<div class="page-main poster">
			<div class="bottom">
				<p class="f30"><strong>邀请好友到Thunder交易所</strong></p>
				<p class="f24 mt15">一起赚取Thunder,最高获得30%交易手续费返佣！</p>
				<div class="qrcode">
					<div ref="qrcode"></div>
					<i class="logo"></i>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import utils from '@/assets/js/utils'
export default {
	mounted(){
		utils.qrcode(this.$refs.qrcode, {
		    text: this.$route.query.url || '',
		    width: 150,
		    height: 150
		})
	}
}
</script>

<style lang="less" scoped="">
.poster {background: url('../../assets/img/invite_bg.jpg') #fff no-repeat center top / cover;}
.bottom {
	position: absolute; bottom: 0; left: 0; right: 0; height: 1.8rem; background-color: #fff;
	padding-left: 0.3rem; padding-right: 0.3rem; padding-top: 0.25rem;
	p {max-width: 5.1rem; line-height: 1.5;}
	.qrcode {
		position: absolute; right: 0.3rem; top: 0.25rem; width: 1.3rem; height: 1.3rem;
		/deep/ canvas {max-width: 100%;}
		.logo {
			 position: absolute;
			 width: 0.3rem;
			 height: 0.3rem;
			 left: 50%;
			 top: 50%;
			 background: url('../../assets/img/logo.png') #fff no-repeat center/contain;
			 border: 0.06rem solid #fff;
			 border-radius: 4px;
			 margin-top: -0.15rem;
			 margin-left: -0.15rem;
			 z-index: 1;
		}
	}
}
</style>
