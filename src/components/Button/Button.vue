<template>
  <button class="btn" :style="{color:color}">
    <slot/>
    <!-- 插槽 -->
  </button>
</template>
<script>
export default {
  name: 'Button',
  // 传入子组件的参数写到props
  props: {
    color: {
      type: String, // 颜色参数类型
      default: '#000' // 默认黑色
    }
  }
}
</script>

<style scoped>
.btn {
  width: 110px;
  height: 60px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
}
</style>
