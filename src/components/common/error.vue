<template>
  <div class="error" :class="{full:size=='large'}">
    <section>
      <div class="title">{{$t('error_code.REQUEST_ERROR')}}</div>
      <div class="content f24">
        <p v-for="item in error">
          {{item[0]}}：<span>{{item[1]}}</span>
        </p>
      </div>
      <div class="tc pt10 pb30">
        <mt-button type="danger" size="small" v-tap="{methods:retry}">{{$t(`public0.click_to_retry`)}}</mt-button>
      </div>
    </section>
    
  </div>
</template>

<script>
export default {
  props: {
    error:{
      type:Array,
      default:[]
    },
    size:{
      type:String,
      default:'small'
    }

  },
  methods:{
    retry(){
      this.$emit('retry')
    }
  }
}
</script>

<style lang="less" scoped>
.error{
  position: absolute;
  left: 0;
  top: 0;
  right:0;
  bottom:0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color:rgba(0,0,0,.3);
  z-index: 1;
  &.full {
    position: fixed;
  }
  section {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
    background-color:#fff;
    border-radius: 4px;
    .title {
      color: #333;
      text-align: center;
      padding: 15px 0.3rem 10px;
      border-bottom: 1px solid #ddd;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.content {
  padding: 0.3rem 0.5rem; 
  line-height: 1.7;
  max-height: 50vh;
  overflow-y: auto;
  color: #666;
  p {word-break: break-all;}
  span {color: #333;}
}
</style>
