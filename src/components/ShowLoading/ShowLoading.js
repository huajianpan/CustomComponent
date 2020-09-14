import ShowLoadingComponent from './ShowLoading.vue'

// 添加install方法 （插件方法）
const ShowLoading = {
  install: function (Vue) {
    Vue.component(ShowLoadingComponent.name, ShowLoadingComponent)
  }
}

// 导出Button
export default ShowLoading
