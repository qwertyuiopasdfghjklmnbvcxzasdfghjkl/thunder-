<template>
  <div class="loading" :class="{full:maskSize=='large'}" :style="`background-color:${bgColor}; min-width:${size}rem; min-height:${size}rem;`">
    <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.0" :width="`${size}rem`" :height="`${size}rem`" viewBox="0 0 128 128" xml:space="preserve">
      <g>
        <circle cx="16" cy="64" r="16" :fill="color" fill-opacity="1"/>
        <circle cx="16" cy="64" r="14.344" :fill="color" fill-opacity="1" transform="rotate(45 64 64)"/>
        <circle cx="16" cy="64" r="12.531" :fill="color" fill-opacity="1" transform="rotate(90 64 64)"/>
        <circle cx="16" cy="64" r="10.75" :fill="color" fill-opacity="1" transform="rotate(135 64 64)"/>
        <circle cx="16" cy="64" r="10.063" :fill="color" fill-opacity="1" transform="rotate(180 64 64)"/>
        <circle cx="16" cy="64" r="8.063" :fill="color" fill-opacity="1" transform="rotate(225 64 64)"/>
        <circle cx="16" cy="64" r="6.438" :fill="color" fill-opacity="1" transform="rotate(270 64 64)"/>
        <circle cx="16" cy="64" r="5.375" :fill="color" fill-opacity="1" transform="rotate(315 64 64)"/>
        <animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 0.6
    },
    color: {
      type: String,
      default: '#999'
    },
    bgColor: {
      type: String,
      default: 'transparent'
    },
    maskSize:{
      type:String,
      default:'small'
    }
  }
}
</script>

<style lang="less" scoped>
.loading{
  position: absolute;
  left: 0;
  top: 0;
  right:0;
  bottom:0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index:1;
  &.full {
    position: fixed;
  }
  svg {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
