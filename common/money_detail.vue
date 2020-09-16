<template>
	<view class="container">
		<view class="content">
			<zzx-tabs
				:items="items"
				:current="current"
				lineTop="0px"
				lineWidth="65%"
				lineHeight="2px"
				defaultColor="#e0dcd7"
				activeColor="#ffffff"
				@clickItem="onClickItem"
				ref="mytabs"
			></zzx-tabs>

			<view class="top" v-show="current === 0">
				<view class="filter">
					<text class="select-time" @click="selectDatePicker(0)">{{ selectedTime0 || '今日' }}</text>
					<view class="type-btns">
						<view :class="{ 'type-btn': true, 'btn-selected': selected0 == 1 }" @click="selected0 = 1">出账</view>
						<view :class="{ 'type-btn': true, 'btn-selected': selected0 == 3 }" @click="selected0 = 3">入账</view>
					</view>
				</view>
				<text class="count">共{{ selected0 == 1 ? '出账' : '入账' }}{{ totalCount0 }}笔,合计</text>
				<text class="amount">￥{{ amount0 }}</text>
				<text class="compare">{{ '较上' + items[current].slice(0, 1) + (upOrDown0 >= 0 ? '增加' : '减少') + Math.abs(upOrDown0) + '元' }}</text>
				<view class="chart">
					<text class="title">{{ selected0 == 1 ? '出账' : '入账' }}统计表</text>
					<view class="chart-container">
						<view class="qiun-columns">
							<view class="qiun-charts">
								<canvas
									canvas-id="canvasColumn0"
									id="canvasColumn0"
									class="charts"
									disable-scroll="true"
									@touchstart="touchStartA"
									@touchmove="touchMoveA"
									@touchend="touchEndA"
								></canvas>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="top" v-show="current === 1">
				<view class="filter">
					<text class="select-time" @click="selectDatePicker(1)">{{ selectedTime1 || '本月' }}</text>
					<view class="type-btns">
						<view :class="{ 'type-btn': true, 'btn-selected': selected1 == 1 }" @click="selected1 = 1">出账</view>
						<view :class="{ 'type-btn': true, 'btn-selected': selected1 == 3 }" @click="selected1 = 3">入账</view>
					</view>
				</view>
				<text class="count">共{{ selected1 == 1 ? '出账' : '入账' }}{{ totalCount1 }}笔,合计</text>
				<text class="amount">￥{{ amount1 }}</text>
				<text class="compare">{{ '较上' + items[current].slice(0, 1) + (upOrDown1 >= 0 ? '增加' : '减少') + Math.abs(upOrDown1) + '元' }}</text>
				<view class="chart">
					<text class="title">{{ selected1 == 1 ? '出账' : '入账' }}统计表</text>
					<view class="chart-container">
						<view class="qiun-columns">
							<view class="qiun-charts">
								<canvas
									canvas-id="canvasColumn1"
									id="canvasColumn1"
									class="charts"
									disable-scroll="true"
									@touchstart="touchStartA"
									@touchmove="touchMoveA"
									@touchend="touchEndA"
								></canvas>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="top" v-show="current === 2">
				<view class="filter">
					<text class="select-time" @click="selectDatePicker(2)">{{ selectedTime2 || '本年' }}</text>
					<view class="type-btns">
						<view :class="{ 'type-btn': true, 'btn-selected': selected2 == 1 }" @click="selected2 = 1">出账</view>
						<view :class="{ 'type-btn': true, 'btn-selected': selected2 == 3 }" @click="selected2 = 3">入账</view>
					</view>
				</view>
				<text class="count">共{{ selected2 == 1 ? '出账' : '入账' }}{{ totalCount2 }}笔,合计</text>
				<text class="amount">￥{{ amount2 }}</text>
				<text class="compare">{{ '较上' + items[current].slice(0, 1) + (upOrDown2 >= 0 ? '增加' : '减少') + Math.abs(upOrDown2) + '元' }}</text>
				<view class="chart">
					<text class="title">{{ selected2 == 1 ? '出账' : '入账' }}统计表</text>
					<view class="chart-container">
						<view class="qiun-columns">
							<view class="qiun-charts">
								<canvas
									canvas-id="canvasColumn2"
									id="canvasColumn2"
									class="charts"
									disable-scroll="true"
									@touchstart="touchStartA"
									@touchmove="touchMoveA"
									@touchend="touchEndA"
								></canvas>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<date-time-picker ref="date-time0" class="month-picker" :indicatorStyle="indicatorStyle" type="date" :datestring="dateString" @change="dateTimeChange"></date-time-picker>
		<date-time-picker
			ref="date-time1"
			class="month-picker"
			:indicatorStyle="indicatorStyle"
			type="year-month"
			:datestring="dateString"
			@change="dateTimeChange"
		></date-time-picker>
		<date-time-picker ref="date-time2" class="month-picker" :indicatorStyle="indicatorStyle" type="year" :datestring="dateString" @change="dateTimeChange"></date-time-picker>
	</view>
</template>

<script>
import base from '../../common/base.js'
import config from '../../common/config.js'
import util from '../../common/util.js'
import tabs from '@/components/zzx-tabs/zzx-tabs.vue' // https://ext.dcloud.net.cn/plugin?id=1736

import DateTimePicker from '../../components/bory-dateTimePicker/bory-dateTimePicker.vue'
import uCharts from '../../components/u-charts/u-charts/u-charts.js'
var _self
var canvaColumnArr = [null, null, null]
export default {
  components: {
    DateTimePicker,
    tabs
  },
  data () {
    return {
      items: ['日账单', '月账单', '年账单'],
      current: 1,
      // 分别对应三个账单的删选时间
      selectedTime0: '',
      selectedTime1: '',
      selectedTime2: '',
      // 分别对应三个三个账单的选中类型
      selected0: 1,
      selected1: 1,
      selected2: 1,
      // 日月年对应的查询条数
      totalCount0: 0,
      totalCount1: 0,
      totalCount2: 0,
      // 日月年对应的同比增减幅度
      upOrDown0: 0,
      upOrDown1: 0,
      upOrDown2: 0,
      // 日月年查询到的总金额
      amount0: 0,
      amount1: 0,
      amount2: 0,
      // 当前打开的时间选择器
      pickerIndex: 1,
      // 列表点击序号
      index: 0,

      // 用于绑定第一次年月打开时选择的值，内部存储组件的data中的dateTime
      dateString: '',
      // 上次滚动加载数据的时间,滚动加载锁，滚动加载间隔最多300+毫秒执行一次加载
      lastLoadTime: Date.now(),
      scrollLock: false,
      loadInterval: 50,

      // Echart
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      // 列表显示的列数
      range: 7,
      uchartData0: {
        animation: false,
        color: '#D4C29C',
        scrollPosition: 'current',
        categories: [],
        series: [
          {
            data: []
          }
        ]
      },
      uchartData1: {
        animation: false,
        color: '#D4C29C',
        scrollPosition: 'current',
        categories: [],
        series: [
          {
            data: []
          }
        ]
      },
      uchartData2: {
        animation: false,
        color: '#D4C29C',
        scrollPosition: 'current',
        categories: [],
        series: [
          {
            data: []
          }
        ]
      }
    }
  },
  watch: {
    selected0 (val, oldVal) {
      this.typeChange()
    },
    selected1 (val, oldVal) {
      this.typeChange()
    },
    selected2 (val, oldVal) {
      this.typeChange()
    }
  },
  onShow () {},
  onLoad (option) {
    // 浏览器回退并不会销毁window变量
    canvaColumnArr = [null, null, null]

    _self = this
    this.cWidth = uni.upx2px(750)
    this.cHeight = uni.upx2px(500)

    // 赋予初始时间
    const now = new Date()
    let y, m
    if (option.time) {
      y = option.time.split('-').shift()
      m = option.time.split('-').pop()
    } else {
      y = now.getFullYear()
      m = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
    }

    const d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    this.selectedTime0 = y + '-' + m + '-' + d
    this.selectedTime1 = y + '-' + m
    this.selectedTime2 = y + ''

    // 1、生成并渲染画布   2、请求数据 3、添加画布监听器
    this.showColumn('canvasColumn' + 1, this.uchartData1)
    this.getEchartData(this.timeDefer(this.selectedTime1, this.range), this.range, 0, this.current)
    this.addListener(1)
  },
  computed: {
    /**
		 * @description 时间选择器自定义indicator样式
		 */
    indicatorStyle () {
      return {
        background: 'rgba(0,0,0,.05)',
        height: '40px'
      }
    }
  },
  methods: {
    /**
		 * @description 时间如果在某时间前，则返回后者时间
		 * @param {String} timeString=["2020-05","2020-05-06"]
		 *
		 */
    timeDefer (timeString, range) {
      const t = timeString.split('-')
      t.pop()
      t.push('0' + range)
      const time = timeString.split('-').pop() - 0 < range ? t.join('-') : timeString
      return time
    },
    typeChange () {
      // 清空数据，获取新数据，再更新canvas
      this['uchartData' + this.current].categories = []
      this['uchartData' + this.current].series = [{ data: [] }]
      this['uchartData' + this.current].animation = false
      this['uchartData' + this.current].scrollPosition = 'right'
      this.getEchartData(this.timeDefer(this['selectedTime' + this.current], this.range), this.range, 0, this.current)
    },
    onClickItem (e) {
      if (this.current !== e.currentIndex) {
        // 切换页面
        this.current = e.currentIndex
        // 如果画布为空，即首次加载
        if (canvaColumnArr[e.currentIndex] == null) {
          // 1、生成并渲染画布 2、请求数据   3、添加画布监听器
          this.showColumn('canvasColumn' + e.currentIndex, this['uchartData' + e.currentIndex])
          this.getEchartData(this.timeDefer(this['selectedTime' + this.current], this.range), this.range, 0, this.current)
          this.addListener(e.currentIndex)
        }
      }
    },
    /**
		 * @description 显示时间选择器
		 * @tutorial https://ext.dcloud.net.cn/plugin?id=2400
		 */
    selectDatePicker (index) {
      this.dateString = this['selectedTime' + index]
      this.pickerIndex = index
      this.$refs['date-time' + index].show()
    },
    /**
		 * @param {String} value  YYYY-MM
		 * isShowToolBar：true 点击确定获取数值
		 * isShowToolBar：false 滑动获取返回数据
		 */
    dateTimeChange (value) {
      console.log(value)

      // 清空数据，获取新数据，再更新canvas
      this['uchartData' + this.current].categories = []
      this['uchartData' + this.current].series = [{ data: [] }]
      this['uchartData' + this.current].scrollPosition = 'right'
      this['selectedTime' + this.pickerIndex] = value
      // 判断所选时间之前的数据是否足以填充画布的列数

      const t = value.split('-')
      t.pop()
      t.push('0' + this.range)
      const time = value.split('-').pop() - 0 < this.range ? t.join('-') : value
      this.getEchartData(time, this.range, 0, this.current)
    },
    /**
		 * @description 获取后台数据
		 * @param {Number} UpDown = [1,0]  1 获取指定时间之后的数据,0 获取之前的数据
		 * @param {Number} tabIndex = [0,1,2] 日,月,年
		 */
    getEchartData (queryTime, range, UpDown, tabIndex) {
      const o = this
      uni.showLoading({
        title: '请稍等',
			    mask: true
      })
      base.api(
        config.host + '/rest/getTransactionFlowReport',
        {
          queryTime: o.current == 2 ? new Date().getFullYear() + '' : queryTime,
          queryType: this['selected' + tabIndex], // Number 1 出账 ，2 冻结 ，3 入账
          // range: o.current == 2 ? new Date().getFullYear() - 2019 : range,
          range: o.current == 2 ? new Date().getFullYear() - 2019 : 31,
          timeUpDown: UpDown
        },
        function (res) {
          if (res.statusCode !== 200) {
            uni.showToast({
              icon: 'loading',
              title: '请稍后重试'
            })
            return
          }

          const data = res.data.data.chartData.series

          data.forEach((item, i) => {
            if (item.date == o['selectedTime' + tabIndex]) {
              o['totalCount' + tabIndex] = item.totalCount
              o['upOrDown' + tabIndex] = item.upOrDown
              o['amount' + tabIndex] = item.value
              item.color = '#cfa762'
            }
          })

          res.data.data.chartData.categories.forEach((value, index) => {
            if (UpDown) {
              o['uchartData' + tabIndex].categories.unshift(value.split('-').pop() + o.items[o.current].slice(0, 1))
            } else {
              o['uchartData' + tabIndex].categories.push(value.split('-').pop() + o.items[o.current].slice(0, 1))
            }
          })
          UpDown ? o['uchartData' + tabIndex].series[0].data.unshift(...data) : o['uchartData' + tabIndex].series[0].data.push(...data)
          canvaColumnArr[tabIndex].updateData(o['uchartData' + tabIndex])

          o.loadMore(queryTime, 1)

          // 请求结果返回后解锁
          // o.lastLoadTime = Date.now();
          // uni.hideLoading()
        }
      )
    },
    // echart
    showColumn (canvasId, chartData) {
      canvaColumnArr[canvasId.slice(12, 13)] = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: 'column',
        legend: {
          // 是否显示图标下方标题即name属性
          show: false,
          // hiddenColor:'#000000',
          float: 'left'
        },
        colors: ['#D4C29C'],
        fontSize: _self.cWidth * 0.035,
        // fontSize: 11 ,
        padding: [25, 15, 15, 15],
        background: '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        enableScroll: true, // 开启图表拖拽功能
        animation: false,
        duration: 100,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
          // 配合enableScroll
          type: 'grid',
          gridType: 'dash',
          itemCount: this.range, // x轴单屏显示数据的数量，默认为5个
          // scrollShow: true, //新增是否显示滚动条，默认false
          scrollAlign: 'left', // 滚动条初始位置
          scrollBackgroundColor: '#F7F7FF', // 默认为 #EFEBEF
          scrollColor: '#DEE7F7', // 默认为 #A6A6A6

          axisLine: true, // 显示坐标轴线
          axisLineColor: '#D4C29C',
          // fontSize:默认同上级fontSize
          fontSize: _self.cWidth * 0.03,
          fontColor: '#949494'
        },
        yAxis: {
          disabled: true, // 去除纵坐标
          disableGrid: true, // 去除y横线
          format: val => {
            return val.toFixed(0) + '元'
          } // 格式化Y轴刻度
        },
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio * 0.95,
        height: _self.cHeight * _self.pixelRatio * 0.95,
        extra: {
          column: {
            type: 'group',
            // width: (_self.cWidth * _self.pixelRatio * 0.2) / chartData.categories.length
            width: 25 * _self.pixelRatio
          },
          tooltip: {
            showBox: true, // 是否显示半透明黑色的提示区域
            bgColor: '#000000', // 主体背景颜色
            bgOpacity: 0.7, // 背景颜色透明度
            gridColor: '#1890ff', // 辅助线颜色
            fontColor: '#ffffff' // 主体文字颜色
          }
        }
      })
    },
    /**
		 * @description 按下canvas触发
		 * @param {Object} e 事件对象
		 */
    touchStartA (e) {
      canvaColumnArr[this.current].scrollStart(e)
    },
    /**
		 * @description 拖动canvas时触发
		 * @param {Object} e 事件对象
		 */
    touchMoveA (e) {
      canvaColumnArr[this.current].scroll(e)
    },
    /**
		 * @description 按下canvas，抬起时触发
		 * @param {Object} e 事件对象
		 */
    touchEndA (e) {
      canvaColumnArr[this.current].scrollEnd(e)
      const o = this
      const index = canvaColumnArr[o.current].getCurrentDataIndex(e) // 获取点击的数据索引
      // 获取对应节点的数据
      canvaColumnArr[o.current].showToolTip(e, {
        format: function (item, category) {
          // 点击标题改变筛选时间，并提示对应数据的时间

          o['uchartData' + o.current].series[0].data.forEach((v, i) => {
            v.color = '#D4C29C'
          })

          o['selectedTime' + o.current] = item.data.date
          o['totalCount' + o.current] = item.data.totalCount
          o['amount' + o.current] = item.data.value
          item.data.color = '#cfa762'

          // 差值获取同比增长
          o['upOrDown' + o.current] = item.data.upOrDown
          return item.data.date + ' : ￥' + item.data.value + '元'
        }
      })
    },
    /**
		 * @description 添加画布操作事件监听器
		 * @param {Number}  i = [0,1] 画布序号
		 */
    addListener (i) {
      // 渲染完成时触发
      canvaColumnArr[i].addEventListener('scrollRight', () => {
        const list = this['uchartData' + i].series[0].data
        // 说明没数据
        if (list.length == 0) return
        if (Date.now() - this.lastLoadTime > this.loadInterval) {
          // 最后一条数据的时间
          const timeArr = list[list.length - 1].date.split('-')
          // 滑动到右边 获取之后的时间数据获取最后一条数据的时间
          if (i == 0) {
            // 如果最后一条数据是当月最后一天,直接return
            if (new Date(timeArr[0], timeArr[1], 0).getDate() == timeArr[2]) return
          } else if (i == 1) {
            // 如果最后一条数据是当年最后一月,直接return
            if (timeArr[1] == 12) return
          } else {
            return // 最后一年不需要滑动
          }
          // 向后加载一条数据，传入最后一条是数据的时间
          this.loadMore(list[list.length - 1].date, 1)
        }
      })
      canvaColumnArr[i].addEventListener('scrollLeft', () => {
        const list = this['uchartData' + i].series[0].data
        // 说明本月没数据
        if (list.length == 0) return

        // 距离上次加载相隔0.15s
        if (Date.now() - this.lastLoadTime > this.loadInterval) {
          // 如果第一列数据的日期已经是1号,或者是1月那么就不获取数据，直接返回
          if (this['uchartData' + i].series[0].data[0].date.split('-').pop() - 0 == 1) return
          // 左滑动 获取之前的时间数据,传入第一条数据的时间
          this.loadMore(list[0].date, 0)
        }
      })
    },
    // 加载数据
    loadMore (queryTime, UpDown) {
      const timeArr = queryTime.split('-')
      if (this.current == 2) { uni.hideLoading(); return };
      if (this.current == 0) { if (timeArr[2] == new Date(timeArr[0] - 0, timeArr[1] - 0, 0).getDate()) { uni.hideLoading(); return } }
      if (this.current == 1) { if (timeArr[1] == 12) { uni.hideLoading(); return } }
      // if (this.scrollLock == true) return;
      // this.scrollLock = true;
      const o = this
      base.api(
        config.host + '/rest/getTransactionFlowReport',
        {
          queryTime: queryTime,
          queryType: this['selected' + o.current],
          range: UpDown == 0 ? 2 : 31,
          timeUpDown: UpDown
        },
        function (res) {
          if (res.statusCode !== 200) return
          const data = res.data.data.chartData.series

          if (UpDown) {
            // 获取的第二条数据为新数据
            if (data.length > 1) {
              data.shift()
              // 存数据
              o['uchartData' + o.current].series[0].data.push(...data)
              for (var j = 0; j < data.length; j++) {
                // 存放日期
                o['uchartData' + o.current].categories.push(data[j].date.split('-').pop() + o.items[o.current].slice(0, 1))
              }
            } else {
              return
            }
          } else {
            if (data.length > 1) {
              data.pop() // 被传入的重复时间对象去除
              // 存数据
              o['uchartData' + o.current].series[0].data.unshift(...data)
              data.reverse()
              // 存日期
              for (var k = 0; k < data.length; k++) {
                o['uchartData' + o.current].categories.unshift(data[k].date.split('-').pop() + o.items[o.current].slice(0, 1))
              }
            } else {
              return
            }
          }
          o['uchartData' + o.current].scrollPosition = 'current'
          canvaColumnArr[o.current].updateData(o['uchartData' + o.current])
          // 请求结果返回后解锁
          // o.lastLoadTime = Date.now();
          // o.scrollLock = false;
          uni.hideLoading()
        }
      )
    }
  }
}
</script>

<style lang="less">
page {
	background-color: #cfa762;
	height: 100%;
	font-size: 28rpx;
	line-height: 1.8;
	display: flex;
	flex-direction: column;
}

.container {
	flex: 1;
	height: 100%;
	padding-left: 20rpx;
	padding-right: 20rpx;

	.content {
		display: flex;
		flex-direction: column;
		height: 100%;

		.zzb-tabs {
			flex: 0 0 56rpx;
			font-family: SourceHanSansCN-Regular;
			font-size: 50px;
			font-weight: normal;
			font-stretch: normal;
			line-height: 60px;
			letter-spacing: 300px;
		}

		.top {
			flex: 1;
			display: flex;
			flex-direction: column;
			position: relative;

			.filter {
				flex: 0 0 24rpx;
				display: flex;
				flex-direction: row;
				margin-top: 45rpx;
				justify-content: space-between;

				.select-time {
					flex: 1;
					width: 128rpx;
					height: 24rpx;
					font-family: SourceHanSansCN-Regular;
					font-size: 26rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 1rpx;
					color: #ffffff;
				}

				.select-time::after {
					display: inline-block;
					margin-left: 10rpx;
					content: '';
					border-bottom: 0rpx solid transparent;
					border-top: 15rpx solid white;
					border-left: 8.5rpx solid transparent;
					border-right: 8.5rpx solid transparent;
					position: relative;
					top: -4rpx;
				}

				.type-btns {
					flex: 1;
					display: flex;
					flex-direction: row;
					justify-content: flex-end;

					.type-btn {
						display: inline-block;
						width: 70rpx;
						height: 29rpx;
						margin-left: 21rpx;
						font-family: SourceHanSansCN-Regular;
						font-size: 21rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 29rpx;
						letter-spacing: 1rpx;
						text-align: center;
						color: #e2e2e2;
					}

					.btn-selected {
						border-radius: 14rpx;
						border: 1rpx solid white;
						color: #ffffff;
					}
				}
			}

			.count {
				margin-top: 46rpx;
				margin-bottom: 30rpx;
				flex: 0 0 21rpx;
				font-family: SourceHanSansCN-Regular;
				font-size: 19rpx;
				letter-spacing: 1rpx;
				color: #ffffff;
			}

			.amount {
				flex: 0 0 43rpx;
				font-family: SourceHanSansCN-Medium;
				font-size: 56rpx;
				font-weight: bold;
				font-stretch: normal;
				line-height: 56rpx;
				letter-spacing: 3rpx;
				color: #ffffff;
			}

			.amount::first-letter {
				font-size: 35rpx;
				line-height: 42rpx;
				letter-spacing: 2rpx;
			}

			.compare {
				margin-top: 23rpx;
				margin-bottom: 39rpx;
				flex: 0 0 21rpx;
				font-family: SourceHanSansCN-Regular;
				font-size: 19rpx;
				letter-spacing: 1rpx;
				color: #ffffff;
			}

			.chart {
				flex: 1;
				width: 100%;
				background-color: white;
				position: relative;
				left: -28rpx;
				display: flex;
				flex-direction: column;
				padding: 49rpx 28rpx 0 28rpx;

				.title {
					flex: 0 0 26rpx;
					font-family: SourceHanSansCN-Regular;
					font-size: 30rpx;
					line-height: 42rpx;
					letter-spacing: 1rpx;
					color: #282828;
				}

				.chart-container {
					flex: 1;
					width: 100%;
					margin-top: 86rpx;
				}
			}
		}
	}
}

.loadmore {
	text-align: center;
	clear: both;
	width: 100%;
}

image {
	width: 15rpx;
	height: 8rpx;
	margin-left: 10rpx;
	margin-bottom: 4rpx;
	transform: rotateZ(-90deg);
}

.qiun-columns {
	flex: 1;
	display: flex;
	flex-direction: column !important;
}

.qiun-charts {
	width: 100%;
	height: 500upx;
	background-color: #ffffff;
}

.charts {
	width: 100%;
	height: 500upx;
	background-color: #ffffff;
}
</style>
