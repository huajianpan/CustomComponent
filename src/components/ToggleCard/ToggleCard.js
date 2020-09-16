import Vue from 'vue'
import ToggleCard from './ToggleCard.vue'
import ToggleCardComponent from './ToggleCard.vue'

// 添加install方法 （插件方法）
const ToggleCard = {
  install: function (Vue) {
    Vue.component(ToggleCardComponent.name, ToggleCardComponent)
  }
}

// 导出ToggleCard
export default ToggleCard
