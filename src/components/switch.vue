<template>
  <div class="cont" :style="switch_size" @click="chang()"
       :class=" switch_value?size:''">
    <p class="switch_bg" :style="`background:${background};opacity:${switch_value?1:0}`">{{openText}}</p>
    <span class="radiu" :style="switch_radius"></span>
  </div>
</template>

<script>
  export default {
    name: 'switch-vi',
    props: {
      value: {
        default: false,
        type: Boolean
      },
      size: {
        default: 'small',
        type: String
      },
      background: {
        default: '#0C6AC9',
        type: String
      },
      openText: null
    },
    data () {
      return {
        switch_value: this.value,
        switch_size: null,
        switch_radius: null
      }
    },
    created () {
      if (this.size === 'small') {
        this.switch_size = `width:32px;height:18px;`
        this.switch_radius = `width:18px;height:18px`
      } else if (this.size === 'leg') {
        this.switch_size = `width:50px;height:22px;`
        this.switch_radius = `width:22px;height:22px`
      } else if (this.size === 'big') {
        this.switch_size = `width:66px;height:30px;`
        this.switch_radius = `width:30px;height:30px`
      }
    },
    methods: {
      chang () {
        this.switch_value = !this.switch_value
        this.$emit('input', this.switch_value)
      }
    }

  }
</script>

<style scoped lang="less">
  .cont {
    width: 32px;
    height: 18px;
    border-radius: 50px;
    background: #ccc;
    position: relative;
    display: inline-block;
    margin: 8px;
    cursor: pointer;
    transition: .3s;
    overflow: hidden;

    &.small {
      .radiu {
        left: 14px;
      }
    }

    &.leg {
      .radiu {
        left: 28px;
      }
    }

    &.big {
      .radiu {
        left: 30px;
      }
    }

    .radiu {
      width: 18px;
      height: 18px;
      position: absolute;
      background: #ffffff;
      border-radius: 50%;
      left: 0;
      top: 0;
      transition: .3s;
    }
  }
  .switch_bg{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transition: 0.3s;
    font-size: 13px;
    display: flex;
    align-items: center;
    text-align: left;
    color: #ffffff;
    text-indent: 5px;
  }
</style>
