<template>
  <mask-layer :isgray="true" :show="show" @hide="hideDialog">
    <div class="dialog mint-msgbox-wrapper" style="position: absolute; z-index: 2015;">
      <div class="mint-msgbox" style="">
        <div class="mint-msgbox-header rp">
          <div class="mint-msgbox-title">
            {{title}}
            <slot name="title"></slot>
          </div>
          <i class="close icon-cross" v-if="showClose" @click="hide"></i>
        </div>
        <div class="mint-msgbox-content">
          <slot></slot>
        </div>
        <div class="mint-msgbox-btns" v-if="showBtns">
          <button class="mint-msgbox-btn mint-msgbox-cancel" v-if="showCancel" @click="hide">{{cancelText}}<!-- 取消 --></button>
          <button class="mint-msgbox-btn mint-msgbox-confirm" @click="submit?submit():hide()">{{confirmText}}<!-- 确定 --></button>
        </div>
      </div>
    </div>
  </mask-layer>
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
    showClose:{ //是否显示右上角关闭X按钮
      type: Boolean,
      default:false
    },
    showBtns:{ //是否显示按钮组
      type: Boolean,
      default:true
    },
    showCancel:{ //是否显示取消按钮
      type: Boolean,
      default:true
    },
    modal:{ //是否无法点击灰色背景关闭窗口
      type: Boolean,
      default:false
    },
    hide:{ //关闭事件
      type: Function
    },
    submit:{ //提交事件
      type: Function
    },
    title:{ //弹窗标题
      type: String,
      default:''
    },
    cancelText:{
      type: String,
      default:vm.$t('public0.no')
    },
    confirmText:{
      type: String,
      default:vm.$t('public0.ok')
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
    hideDialog(){
      if(!this.modal){
        this.hide()
      }
    }
  },
}

</script>
<style lang="less" scoped="">
.dialog .mint-msgbox-header {
    padding: 15px 0 10px;
    border-bottom: 1px solid #ddd;
}
.close {position: absolute; right: 0.25rem; top: 50%; transform: translateY(-40%); color: #333; font-size: 20px;}
</style>