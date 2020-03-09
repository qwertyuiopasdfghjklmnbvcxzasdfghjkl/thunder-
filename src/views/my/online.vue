<template>
    <div class="page">
    	<!--<top-back :backPage="'ucenter'">{{$t('account.online_service')}} &lt;!&ndash; 在线客服 &ndash;&gt; </top-back>-->
    	<div class="page-main">
    		<iframe class="iframe" frameborder="0" height="100%" width="100%" scrolling="yes" marginheight="0" marginwidth="0" src="https://tb.53kf.com/code/client/5d9d654eba5aef268d95ed0116f0cec05/1" ></iframe>
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
	top: 0;
}
.iframe {width: 100%; height: 100%;}
</style>
