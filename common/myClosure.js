const $ = (function (window, func) {
  return {
    /**
         * @description 获取某月的最后一天日期，某月有多少天
         * @param {Number} year
         * @param {Number} month
         */
    getMonthDays (year, month) {
      return new Date(year, month, 0).getDate()
      console.log(a)
    },
    update () {
      a = 2
    }
  }
})(window, () => {})
$.b()
$.update()
$.b()
