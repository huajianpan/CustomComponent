import ButtonComponent from './Button.vue'

// 添加install方法 （插件方法）
const Button = {
  install: function (Vue) {
    Vue.component(ButtonComponent.name, ButtonComponent)
  }
}

// 导出Button
export default Button
