<template>
<div>
  <section :style="{width:width,height:height}">
    <div :class="{'loader':true,'hasTitle':title.trim()!=''}">
      <span v-for="i in 20" :style="{'--g':i}" :key="i"></span>
    </div>
  <div class="text" v-text="title" v-if="title.trim()!=''"></div>
  </section>  
    <div class="mask" :style="{display:visible?'block':'none'}"></div>
  </div>
</template>
<script>
export default {
  name: 'ShowLoading',
  // 传入子组件的参数写到props
  props: {
    color: {
      type: String, // 颜色参数类型
      default: '#000' // 默认黑色
    },
    title: {
      type: String, 
      default: '' 
    },
    width: {
      type: String, 
      default: '120px' 
    },
    height: {
      type: String, 
      default: '120px' 
    }
  },
  data () {
    return {
      visible: 0
    }
  }
}
</script>
<style>
*{
  margin:0;
  padding:0;
  /* box-sizing: border-box; */
}
section{
  z-index: 99999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 0.6em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(25, 50, 0, 0.8);
  animation: animateBg 10s linear infinite;
}
@keyframes animateBg {
  0%{
    filter: hue-rotate(0deg);
  }
  100%{
    filter: hue-rotate(360deg);
  }
}
section .loader{
  position: relative;
  height: 20%;
  width: 20%;
}
.hasTitle{
  /* margin-top: 10%; */
}
section .text{
  position: relative;
  color: transparent;
  margin-top: 20%;
  background-clip: text;
  animation: animateBg 10s linear infinite;
  text-shadow:0 0 0.5px  #00ff0a;
  /* background-image: linear-gradient(90deg,rgba(0, 255, 0, 1),rgb(255, 0, 255,1)); */
}
section .loader span{
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  transform: rotate(calc(18deg*var(--g)))
}
section .loader span::before{
  content:'';
  position: absolute;
  top:0;
  left:0;
  width: 12.5%;
  height:12.5%;
  border-radius:50%;
  background: #00ff0a;
  box-shadow: 0 0 10px  #00ff0a;
              /* 0 0 20px  #00ff0a,
              0 0 40px  #00ff0a,
              0 0 60px  #00ff0a,
              0 0 80px  #00ff0a, */
              /* 0 0 100px  #00ff0a; */
  animation: animate 1.2s linear infinite;
  animation-delay: calc(0.1s)
  /* animation-delay: calc(0.1s * var(--g) ) */
}
@keyframes animate {
  0%,40%{
    transform: scale(1)
  }
  100%{
    transform: scale(0)
  }
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  /* background-color: red; */
  width: 100vw;
  height: 100vh;
}
  /* <button class="btn" :style="{color:color}">
    <slot/>
    <!-- 插槽 -->
  </button> */
</style>

