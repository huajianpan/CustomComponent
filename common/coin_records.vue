<template>
	<view class="container">
		<view class="coin-filter">
			<view class="coin-filter-p2">
				<text>交易类型</text>
				<view class="right" @click="selectRecordType">
					<text>{{record_type}}</text>
					<image src="../../static/img/own/shop/icon_down.png"></image>
				</view>
			</view>
		</view>

		<!-- 按月先划分数据for循环，再根据日期大小排序 ，同一天的分成一个数组来进行for循环 -->
		<scroll-view class="coin-list" @scrolltolower="onScrollBottom" lower-threshold="50"  :scroll-y="true">
			<view class="coin-item" v-for="(item,index) in list" :key="index">
					<view class="month-bar">
						<view class="select-time" @click="selectDatePicker(Object.keys(item)[0])">{{Object.keys(item)[0]}}
							<image src="../../static/img/own/shop/icon_down.png"></image>
						</view>
						<view class="total-count">
							出账：￥{{item[Object.keys(item)[0]].outMonthFlow}} &nbsp;冻结：￥{{item[Object.keys(item)[0]].freezeScore}} &nbsp;入账：￥{{item[Object.keys(item)[0]].inMonthFlow}}
							<view class="statisic" @click="goDetail(Object.keys(item)[0])">统计 <image src="../../static/img/own/shop/icon_down.png"></image></view>
						</view>
					</view>

					<view class="day-loop" v-for="(item2,day) in item[Object.keys(item)[0]].monthList" :key="day">
						<view class="day-bar">
							{{Object.keys(item)[0].split('年')[1]+day}}&nbsp;&nbsp;&nbsp;
							<text>出账：{{item2.outDayFlow}}&nbsp;冻结：{{item2.freezeScore}}&nbsp;入账：{{item2.inDayFlow}}</text>
						</view>
						<view class="count" v-for="(p,index) in item2.dayList" :key="index">
							<view class="coin-item-p">
								<text class="desc">{{p.flowDesc}}</text>
								<text :class="{'amount':true,'orange':p.inoutType=='入账','gray':p.inoutType=='冻结'}">{{p.inoutType=='入账'?'+'+p.flowAmt:'-'+p.flowAmt}}</text>
							</view>
							<view class="coin-item-p">
								<text :class="{'ctype':true,'green':p.inoutType=='解冻','gray':p.inoutType=='冻结'}">{{p.inoutType}}</text>
								<text class="ctime">{{p.createTime| formatDate('hh:mm:ss')}}</text>
							</view>
						</view>
					</view>
			</view>
			<uni-load-more class="loadmore" :status="status" :content-text="contentText" />
		</scroll-view>
		<uni-calendar ref="calendar" :lunar="true" :range="true" @confirm="confirm" @change="change" />
		<date-time-picker ref='date-time' class="month-picker" :indicatorStyle='indicatorStyle' type='year-month' :datestring='dateString'
		 @change='dateTimeChange'></date-time-picker>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="1" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>
	</view>
</template>

<script>
import base from '../../common/base.js'
import config from '../../common/config.js'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue'
import util from '../../common/util.js'

import DateTimePicker from '../../components/bory-dateTimePicker/bory-dateTimePicker.vue'
export default {
  filters: {
    /**
			 * @param {Number} time	时间戳
			 * @param {String} format 格式
			 */
    formatDate (time, format) {
      const date = new Date(time)
      return util.formatDate(date, format)
    }
  },
  components: {
    uniLoadMore,
    uniCalendar,
    mpvuePicker,
    DateTimePicker
  },
  data () {
    return {
      list: [],
      startTime: '2018-01-01',
      selectedStartTime: '',
      status: 'loading',
      contentText: {
        contentdown: '上拉加载更多',
        contentrefresh: '加载中',
        contentnomore: '没有更多'
      },
      page: 1,
      themeColor: '#007AFF',
      mode: '',
      pickerValueDefault: [0],
      pickerValueArray: [],
      record_type: '全部',
      record_type_id: 0,
      // 用于绑定第一次年月打开时选择的值，内部存储组件的data中的dateTime
      dateString: '',
      // 加载更多交易记录，加再一次最多加载三个月的空记录
      loadTime: 0,
      // 是否锁住下拉时触发加载函数，以比便触底加载和下拉加载同时进行导致冲突
      lock: false
    }
  },
  onShow () {
    // 加载交易类型列表
    this.loadTypeList()
  },
  onLoad (event) {
    // 获取当前月份
    var day = new Date()
    const y = day.getFullYear()
    let m = day.getMonth() + 1
    m = m < 10 ? '0' + m : m
    this.selectedStartTime = y + '-' + m
    this.startTime = y + '-' + m
    const o = this

    this.loadList('selectedMonth')
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
    },
    /**
			 * @description 计算 交易记录数
			 */
    calcLength () {
      let length = 0
      this.list.forEach(value => {
        for (const monthObj of Object.values(value)) {
          for (const dayObj of Object.values(monthObj.monthList)) {
            length += dayObj.dayList.length
          }
        }
      })
      return length
    }
  },
  methods: {
    /**
			 * @description 交易类型选择框确定按钮触发事件
			 * @param {Object} e 组件对象
			 */
    onConfirm (e) {
      if (e.index.length == 1) {
        this.record_type = e.label
        this.record_type_id = e.value[0]
        this.loadList('selectedMonth')
      }
    },
    /**
			 * @description 显示交易类型选取列表
			 */
    selectRecordType () {
      // selector 表示单列
      this.mode = 'selector'
      this.$refs.mpvuePicker.show()
    },
    /**
			 * @description 获取交易类型数据
			 */
    loadTypeList () {
      var o = this
      base.api(config.host + '/rest/dataDictionary/list', {
        code: 'bus_type'
      }, function (res) {
        if (res.data.success == true) {
          const list = []
          list.push({
            label: '全部',
            value: 0
          })
          for (var i in res.data.obj) {
            var item = res.data.obj[i]
            var temp = {}
            temp.label = item.typename
            temp.value = item.typecode
            list.push(temp)
          }
          o.pickerValueArray = list
        }
      })
    },
    /**
			 * @description 显示日期选取框
			 */
    open () {
      this.$refs.calendar.open()
    },
    /**
			 * @description 读取交易记录信息
			 * @param {Boolean} fresh 是否清空并重获列表数据
			 * @param {String} 下三
			 * 'beforeMonth',往前获取1个月的数据 时间，page=1
			 * 'nextPage',获取选中月份后一页的数据 page++
			 * 'selectedMonth' 获取选中月份的第一页 list={}，page=1
			 * 'afterMonth'
			 */
    loadList (fresh) {
      const o = this

      const timeArr = o.startTime.split('-')
      // 根据此次操作类型初始化参数
      switch (fresh) {
        case 'selectedMonth':
          o.list = []
          o.startTime = o.selectedStartTime
          o.page = 1
          break
        case 'beforeMonth':
          o.page = 1
          o.startTime = o.calcDate(o.startTime, 0)
          break
        case 'afterMonth':
          o.page = 1

          // 获取现在的时间
          let m = new Date().getMonth() + 1
          const y = new Date().getFullYear()
          m = m < 10 ? '0' + m : '' + m

          const topTime = Object.keys(o.list[0])[0].split('月')[0].split('年').join('-')
          o.list = []

          if (topTime === (y + '-' + m)) {
            o.selectedStartTime = y + '-' + m
            o.startTime = o.selectedStartTime
          } else {
            o.selectedStartTime = o.calcDate(topTime, 1)
            o.startTime = o.selectedStartTime
          }
          break
        default:
          if (o.calcLength == 0) {
            // 如果是o.list中没有日交易记录，获取下个月的记录清空掉空记录即月统计头，并且页数赋值为1
            o.list = []
            o.startTime = o.calcDate(o.startTime, 0)
            o.page = 1
          } else {
            o.page++
          }
          break
      }
      o.status = 'loading'
      // 请求进行前判断是否锁，防止下拉和触底同时加载
      if (o.lock) {
        o.status = 'more'
        return
      }
      o.lock = true
      // 积分记录
      base.api(config.host + '/rest/getCommissionFlowList', {
        page: this.page,
        rows: 8,
        startTime: o.startTime,
        type: this.record_type_id
      }, function (res) {
        // 请求结束时解锁
        o.lock = false
        if (res.data.ok == true) {
          var ls = res.data.data.list
          // 或得到的记录数
          let getCount = 0
          if (Object.values(ls[0])[0]) {
            const keys = Object.keys(Object.values(ls[0])[0].monthList)
            for (const key of Object.keys(Object.values(ls[0])[0].monthList)) {
              getCount += Object.values(ls[0])[0].monthList[key].dayList.length
            }
          }
          if (getCount == 8) {
            o.listMerge(o.list, ls)
            o.status = 'more'
          } else if (getCount < 8 && getCount > 0) {
            // 如果当前显示的数据不足以充满手机屏幕，则继续请求前一个月数据的第一页数据进行追加
            if (o.calcLength < 8) {
              o.listMerge(o.list, ls)
              o.loadList('beforeMonth')
            } else {
              // 本次请求数据不足，但列表内容充足，无需再请求
              o.listMerge(o.list, ls)
              o.status = 'more'
            }
          } else {
            // 请求到的数据为空
            if (o.calcLength == 0) {
              // 且页面内无数据
              const emptyObj = {}
              emptyObj[`${o.startTime.split('-')[0]}年${o.startTime.split('-')[1]}月`] = {
                outMonthFlow: 0,
                inMonthFlow: 0,
                freezeScore: 0,
                monthList: {}
              }
              // 添加一条空数据后用来显示月份选择框，然后继续请求下个月
              o.list.push(emptyObj)
              o.status = 'noMore'
            } else {
              // 原数据列表不为空，请求的数据为空，继续往前请求一个月数据,直到18年之前都没有数据就不再请求
              if (timeArr[0] - 0 > 2017) {
                // 数据为空 可限制往前加载loadTime次（月），不然一直往前加载会显得很卡
                if (o.loadTime < 999) {
                  o.loadTime++
                  o.loadList('beforeMonth')
                } else {
                  o.loadTime = 0
                  o.status = 'more'
                }
              } else {
                o.status = 'noMore'
              }
            }
          }
        } else {
          o.status = 'more'
        }
      })
    },
    /**
			 * @description 下滑刷新列表事件
			 */
    onPullDownRefresh () {
      if (!this.lock) {
        this.loadList('afterMonth')
      }
      uni.stopPullDownRefresh()
    },
    /**
			 * @description 上滑获取更多数据
			 */
    onReachBottom () {
      this.status = 'more'
      this.loadList('nextPage')
    },
    /**
			 * @description 滚动容器元素触底
			 */
    onScrollBottom (event) {
      this.status = 'more'
      this.loadList('nextPage')
    },
    /**
			 * @description 显示时间选择器
			 * @tutorial https://ext.dcloud.net.cn/plugin?id=2400
			 * @param {String} time = ["2020-04"]
			 */
    selectDatePicker (time) {
      this.dateString = time.split('月')[0].split('年').join('-')
      this.$refs['date-time'].show()
    },
    /**
			 * @param {String} value  YYYY-MM
			 * isShowToolBar：true 点击确定获取数值
			 * isShowToolBar：false 滑动获取返回数据
			 */
    dateTimeChange (value) {
      this.startTime = value
      this.selectedStartTime = value
      this.loadList('selectedMonth')
    },
    /**
			 * @description 前往统计页面
			 * @param {String} time = ["2020年05月"]
			 */
    goDetail (time) {
      const t = time.split('月')[0].split('年').join('-')
      uni.navigateTo({
        url: '/pages/my/coin_detail?time=' + t
      })
    },
    /**
			 * @description  对当前月份进行加减处理
			 * @param  {Number}  type 1 加一个月 0 减少一个月
			 * @param {String} time  '2020-08',月份要补0
			 */
    calcDate (time, type) {
      let arr = time.split('-')
      if (type) {
        arr = (arr[1] - 0 == 12) ? [arr[0] - 0 + 1, '1'] : [arr[0], arr[1] - 0 + 1]
      } else {
        arr = (arr[1] - 0 == 1) ? [arr[0] - 1, '12'] : [arr[0], arr[1] - 1]
      }
      // 处理后的arr月份可能会缺0
      arr[1] = arr[1] < 10 ? '0' + arr[1] : arr[1]
      return arr[0] + '-' + arr[1]
    },
    /**
			 * @description  列表数据合并
			 * @param {Arr} list this.list
			 * @param {Arr} newlist   ls=res.data.data.list
			 */
    listMerge (list, newlist) {
      if (Object.keys(newlist[0]).length == 0) return
      let isFinded = false
      list.forEach(value => {
        // 月份对上了,则把日期最 *靠前* 的日列表数据和之前拼接起来  例如返回了25日,26日的数据，那么只可能是25的数据断掉了,然后再次赋值
        if (Object.keys(value)[0] == Object.keys(newlist[0])[0]) {
          value[Object.keys(value)[0]].inMonthFlow = Object.values(newlist[0])[0].inMonthFlow
          value[Object.keys(value)[0]].outMonthFlow = Object.values(newlist[0])[0].outMonthFlow
          // 获取当前月数据列表中已有的天列表数据的个数，然后找到最后一天，判断最后一天的是不是等于请求到的日列表数据的第一天，
          // 是则把当前的剩余...dayList记录push已有数据的dayList数组中去，否则就把刚 {  "26日": {"freezeScore": 0,"inDayFlow": 0,"dayList": [{...},],"outDayFlow": 18.04 }} 用assign添加到monthList对象中
          isFinded = true
          const endKey = Object.keys(value[Object.keys(value)[0]].monthList).pop()
          if (endKey == Object.keys(Object.values(newlist[0])[0].monthList)[0]) {
            // 该月 已有数据的最后一天 等于 请求到的数据第一天 则第一天的记录push到已有数据相应日期的daylist中，剩余数据全部assign到monthList对象中
            value[Object.keys(value)[0]].monthList[endKey].dayList.push(...Object.values(Object.values(newlist[0])[0].monthList)[
              0].dayList)
            // 去掉已经添加进去的第一天
            const Obj = Object.values(newlist[0])[0].monthList
            delete Obj[endKey]
            Object.assign(value[Object.keys(value)[0]].monthList, Obj)
          } else {
            Object.assign(value[Object.keys(value)[0]].monthList, Object.values(newlist[0])[0].monthList)
          }
        }
      })
      if (!isFinded) {
        list.push(newlist[0])
      }
    }
  }
}
</script>

<style lang="less">
	page {
		background-color: #f5f5f5;
		height: 100%;
		font-size: 28rpx;
		line-height: 1.8;
	}

	.loadmore {
		text-align: center;
		clear: both;
		width: 100%;
	}

	.container {
		width: 100vw;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.coin-filter {
		padding: 0rpx 30rpx;
		background-color: #FFFFFF;
		flex: 0 0 100rpx;

		.coin-filter-p2 {
			height: 100rpx;
			line-height: 100rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;

			.right image {
				width: 14rpx;
				height: 8rpx;
				margin-left: 10rpx;

			}
		}
	}

	.coin-list {
		height: 0;
		flex: 1;
		background-color: rgb(242, 242, 242);
		display: flex;
		flex-direction: column;

		.coin-item {
			width: 100%;
			background-color: white;
			display: flex;
			flex-direction: column;

				.month-bar {
					background-color: rgb(242, 242, 242);
					display: flex;
					flex-direction: column;
					padding-left: 20rpx;
					padding-top: 28rpx;
					padding-bottom: 28rpx;
					position: sticky;
					top: 0;

					.select-time {
						flex: 0 0 23rpx;
						font-size: 25rpx;
						line-height: 42rpx;
						letter-spacing: 0rpx;
						color: #000000;
						font-family: SourceHanSansCN-Regular;

						image {
							width: 14rpx;
							height: 8rpx;
							margin-left: 10rpx;
							margin-bottom: 4rpx;
						}
					}

					.total-count {
						font-family: SourceHanSansCN-Regular;
						font-size: 25rpx;
						padding-top: 12rpx;
						width: 100%;
						height: 22rpx;
						font-size: 22rpx;
						line-height: 42rpx;
						letter-spacing: 0rpx;
						color: #aaaaaa;
						position: relative;

						.statisic {
							display: inline-block;
							font-family: SourceHanSansCN-Regular;
							position: absolute;
							right: 24rpx;

							image {
								width: 15rpx;
								height: 8rpx;
								margin-left: 10rpx;
								margin-bottom: 4rpx;
								transform: rotateZ(-90deg);
							}
						}
					}

				}

				.day-loop {
					display: flex;
					flex-direction: column;
					padding: 0rpx 30rpx;
					border-top: #dddddd 1px solid;

					.day-bar {
						width: 100%;
						box-sizing: border-box;
						height: 62rpx;
						font-size: 22rpx;
						line-height: 22rpx;
						letter-spacing: 0rpx;
						padding-top: 21rpx;
						padding-bottom: 18rpx;
						color: #a9a9a9;

						text {
							float: right;
						}
					}

					.count {
						display: flex;
						flex-direction: column;
						box-sizing: border-box;
						padding-top: 24rpx;
						padding-bottom: 37rpx;
						border-top: #dddddd 1px solid;
						width: 100%;

						.coin-item-p {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							font-family: SourceHanSansCN-Regular;
							font-size: 28rpx;
							width: 100%;

							.desc {
								font-family: SourceHanSansCN-Medium;
								font-size: 28rpx;
								font-weight: normal;
								font-stretch: normal;
								letter-spacing: 0rpx;
								color: #000000;

							    width:80%;
							    word-break:break-all;
							    display:-webkit-box;
							    -webkit-line-clamp:2;
							    -webkit-box-orient:vertical;
							    overflow:hidden;
							}
							.amount{
								width: 20%;
								height: 22rpx;
								font-family: SourceHanSansCN-Regular;
								font-size: 28rpx;
								font-weight: normal;
								font-stretch: normal;
								line-height: 42rpx;
								letter-spacing: 0rpx;
								text-align: right;
							}
							.ctype {
								color: #ff7924;
								flex: 1 0 60rpx;
								height: 23rpx;
								font-family: SourceHanSansCN-Regular;
								font-size: 25rpx;
								font-weight: normal;
								font-stretch: normal;
								line-height: 42rpx;
								letter-spacing: 4rpx;
								text-align: left;
							}

							.ctime {
								text-align: right;
								flex: 1 0 116rpx;
								height: 19rpx;
								font-family: SourceHanSansCN-Regular;
								font-size: 25rpx;
								font-weight: normal;
								font-stretch: normal;
								line-height: 42rpx;
								letter-spacing: 3rpx;
								color: #8a8a8a;
							}

							.orange {
								color: #ff6b00;
							}
							.gray {
								color: #676767;
							}

						}

						.coin-item-p:last-child {
							margin-top: 45rpx;

							.green {
								color: #349e54;
							}
						}

					}
				}
		}
	}
</style>
