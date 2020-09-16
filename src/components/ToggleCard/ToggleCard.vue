<template>
  <!-- <p class="ToggleCard">{{value}}</p> -->
    <!-- 制作一个类似扑克牌正面翻向背面的效果，讲解当中 4 个开发要点：
    1. 使用 position: absolute 将两个 div (正面与背面) 重叠
    2. 使用 transform: rotateY() 旋转 div
    3. 使用 backface-visibility 隐藏背面
    4. 使用 perspective 设定立体的透视深度 -->

    <div class="card-container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <slot name="face" class="cover"></slot>
        <slot name="back" class="back"></slot>
        <!-- <img class="cover" src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1580310333,1339746621&fm=111&gp=0.jpg" alt="">
        <img class="back" src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=499867931,385512168&fm=111&gp=0.jpg" alt=""> -->
    </div>

    <!-- <div class="card-container">
        <img class="cover" src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1580310333,1339746621&fm=111&gp=0.jpg" alt="">
        <img class="back" src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=499867931,385512168&fm=111&gp=0.jpg" alt="">
    </div>

    <div class="card-container">
        <img class="cover" src="https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1580310333,1339746621&fm=111&gp=0.jpg" alt="">
        <img class="back" src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=499867931,385512168&fm=111&gp=0.jpg" alt="">
    </div> -->
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
        body{
            height: 100vh;
            display: flex;
            justify-content: space-evenly;
            /* justify-content: space-around; */
            align-items: center;
            flex-wrap: wrap;

        }
        .card-container{
            min-width:300px;
            height:450px;
            position:relative;
            /* 3D立体透视深度属性设置在容器上 */
            perspective: 1000px;
            background: linear-gradient(to right, #a8c0ff, #3f2b96);
            overflow: hidden;
        }
        .cover,.back{
            z-index: -1;
            width:100%;
            height:100%;
            position: absolute;
            backface-visibility: hidden;
            transition: transform .3s ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, .2);
        }
        .cover{
            background-color: blue;
            transform:rotateY(0deg)
        }
        .back{
            background-color: red;
            transform:rotateY(-180deg)
        }
        .card-container:hover .cover{
            transform:rotateY(180deg)
        }
        .card-container:hover .back{
            transform:rotateY(0deg)
        }
</style>
