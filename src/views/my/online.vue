<template>
    <div class="page">
    	<top-back :backPage="'ucenter'">{{$t('account.online_service')}} <!-- 在线客服 --> </top-back>
    	<div class="page-main">
    		<iframe class="iframe" frameborder="0" height="100%" width="100%" scrolling="yes" marginheight="0" marginwidth="0" src="https://etvcoins.kf5.com/kchat/1039537" ></iframe>
    	</div>
    </div>
</template>

<script>
export default {
    name:'online',
    created(){
    	
    }
}
</script>

<style lang="less" scoped>
.page-main {
	padding-left: 0;
	padding-right: 0;
	overflow: hidden;
}
.iframe {width: 100%; height: 100%;}
</style>