<template>
  <p class="Message">{{value}}</p>
</template>

<script>
export default {
  data () {
    return {
      value: '我是一个弹框'
    }
  }
}
</script>

<style>
.Message {
  position: fixed;
  bottom: 30px;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 10px;
  left: 50%;
  transform: translateX(-50%);
  line-height: 30px;
  text-align: center;
  font-size: 15px;
  animation: messageFade 3s 1;
}
/* 加个简单动画 */
@keyframes messageFade {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-50%, 80%, 0);
    transform: translate3d(-50%, 80%, 0);
  }
  16% {
    opacity: 1;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
  84% {
    opacity: 1;
    -webkit-transform: translate3d(-50%, 0, 0);
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    opacity: 0;
    -webkit-transform: translate3d(-50%, 80%, 0);
    transform: translate3d(-50%, 80%, 0);
  }
}
</style>
