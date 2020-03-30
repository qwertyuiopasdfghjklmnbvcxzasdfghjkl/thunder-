<template>
    <div class="page">
    	<top-back>
			<template slot="right">
				<div class="tab">
					<label :class="{'active':tab === 1}" v-tap="{methods:()=>{tab=1}}">{{$t('qotc.flash')}}</label>
					<label :class="{'active':tab === 2}" v-tap="{methods:()=>{tab=2}}">{{$t('qotc.self_select')}}</label>
				</div>
			</template>
		</top-back>
		<div>
			<flash v-show="tab===1"/>
			<otc-index v-show="tab===2"/>
		</div>
    </div>
</template>

<script>


import Flash from "./flash";
import OtcIndex from "../otc/index"
export default {
	components: {Flash,OtcIndex},
	data(){
		return {
			tab:1
		}
	},
	created(){

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
