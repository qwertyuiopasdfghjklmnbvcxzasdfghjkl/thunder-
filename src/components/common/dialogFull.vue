<template>
  <transition enter-active-class="animated short slideInRight" leave-active-class="animated short slideOutRight">
    <div class="page" v-show="show">
        <top-back :back="false">
            <span class="btn-back" @click="hide"></span>
            {{title}}
            <slot name="title"></slot>
        </top-back>
        <div class="page-main">
            <slot></slot>
        </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name:'mydialog',
  props:{
    show:{
      type: Boolean,
      default:false
    },
    hide:{ //关闭事件
      type: Function
    },
    title:{ //弹窗标题
      type: String,
      default:''
    },
  },
  data(){
    return {
      
    }
  },
  computed:{
    ...mapGetters([]),
  },
  watch:{
    
  },
  methods:{
    
  },
}

</script>
<style lang="less" scoped="">
.page {position: fixed;}
.btn-back {
    position: absolute;
    width: 15vw;
    height: 0.5rem;
    left: 0;
    background: url('../../assets/img/icon_back_b@3x.png') no-repeat 0.3rem center;
    background-size: 0.2rem auto;
}
</style>