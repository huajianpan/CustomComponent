<template>
  <div class="about">
    <h1>This is an echart page</h1>
    <Button  color="red">12</Button>

    <Button color="blue" @click.native="alertmsg">我是全局按钮</Button>
    <ShowLoading style="width:150px;height:150px;"/>
  </div>
</template>
<script>
// @ is an alias to /src
import Button from '@/components/Button/Button.vue'
export default {
  name: 'About',
  props: {
    msg: String
  },
  data () {
    return {}
  },
  methods: {
    alertmsg () {
      // 4. 使用构造组件
      this.$message({ value: '我是构造组件' })
    }
  },
  components: {
    Button
  }
}
</script>
<style scoped>
h1{
  width: 500px;
}
</style>
