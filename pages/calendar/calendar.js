// pages/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear: new Date().getFullYear(), // 当前年
    currentMonth: new Date().getMonth() + 1, // 当前月
    lastMonth: '', // 上一个月
    nextMonth: '', // 下一个月
    allDateArr: [], // 当前月所有的数据
    currentDateArr: [], // 当前月有效数据
    lastInvalidDaysArr: [], // 当前月之前无效日期
    nextInvalidDaysArr: [], // 当前月之后无效日期

    chooseDateArr: [
      '2020-12-13'
    ], // 当前月选中的日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    this.getCurrentMonthDateArr()
  },

  // 将选中的日期状态改为choose
  updateCurrentDateArr(currentDateArr){
    let chooseDateArr = this.data.chooseDateArr
    // 改变选中日期的状态
    for (let i = 0; i < currentDateArr.length; i++) {
      for (let j = 0; j < chooseDateArr.length; j++) {
        if(currentDateArr[i].date == new Date(chooseDateArr[j]).getDate()){
          currentDateArr[i].choose = 'choose'
        }
      }
    }
  },

  // 初始化数据
  initData(){
    let lastMonth = this.data.currentMonth - 1 < 1 ? 12 : this.data.currentMonth - 1
    let nextMonth = this.data.currentMonth + 1 > 12 ? 1 : this.data.currentMonth + 1
    this.setData({
      lastMonth,
      nextMonth,
    })
  }, 

  // 切换上一个月
  cutLastMonth(){
    let year = this.data.currentYear
    let month = this.data.currentMonth
    if (month == 1) {
      this.setData({
        currentYear: --year,
        currentMonth: 12
      })
    } else {
      this.setData({
        currentYear: year,
        currentMonth: --month
      })
    }
    this.initData()
    this.getCurrentMonthDateArr()
  },

  // 切换下一个月
  cutNextMonth(){
    let year = this.data.currentYear
    let month = this.data.currentMonth
    if (month == 12) {
      this.setData({
        currentYear: ++year,
        currentMonth: 1
      })
    } else {
      this.setData({
        currentYear: year,
        currentMonth: ++month
      })
    }
    this.initData()
    this.getCurrentMonthDateArr()
  },
  

  // 1. 计算某年某月的天数
  getMonthDays(year, month) {
    console.log('计算某年某月的天数', new Date(year, month, 0).getDate())
    return new Date(year, month, 0).getDate()
  },

  // 2. 获取某月一号是周几
  getFirstDayWeek(year, month){
    console.log('获取某月一号是周几', new Date(year, month-1, 1).getDay())
    return new Date(year, month-1, 1).getDay()
  },

  // 3. 获取当月数据
  getCurrentDateArr(){
    // 获取当月的天数
    let currentMonthDays = this.getMonthDays(this.data.currentYear, this.data.currentMonth)
    let currentDateArr = []
    // 选中的日期
    for (let i = 1; i < currentMonthDays + 1; i++) {
      currentDateArr.push({month: 'valid', date: i, choose: ''}) // 当月的有效数据
    }
    this.updateCurrentDateArr(currentDateArr)
    this.setData({
      currentDateArr
    })
    // 返回当前月数据
    return currentDateArr
  },

  // 上月 年、月
  preMonth(year, month) { 
    if (month == 1) {
      return {
        year: --year,
        month: 12
      }
    } else {
      return {
        year: year,
        month: --month
      }
    }
  },



  // 4. 获取这个月中上个月的无效数据
  getLastInvalidDaysArr(){
    // 当前1号是周几 就是上个月无效天数(从周日开始的)
    let lastInvalidDays = this.getFirstDayWeek(this.data.currentYear, this.data.currentMonth)
    let lastInvalidDaysArr = []
    if (lastInvalidDays > 0) {
      let { year, month } = this.preMonth(this.data.currentYear, this.data.currentMonth) // 获取上月 年、月
      let date = this.getMonthDays(year, month) // 获取上月天数
      for (let i = 0; i < lastInvalidDays; i++) {
        lastInvalidDaysArr.unshift({month: 'invalid', date: date})
        date--
      }
    }
    this.setData({
      lastInvalidDaysArr
    })
    return lastInvalidDaysArr
  },

  // 5. 获取这个月中下个月的无效数据
  getNextInvalidDaysArr(){
    let nextInvalidDays = 42 - this.getLastInvalidDaysArr().length - this.getCurrentDateArr().length
    
    let nextInvalidDaysArr = []
    if (nextInvalidDays > 0) {
      for (let i = 1; i < nextInvalidDays+1; i++) {
        nextInvalidDaysArr.push({month: 'invalid', date: i})
      }
    }
    this.setData({
      nextInvalidDaysArr
    })
    return nextInvalidDaysArr
  },




  // 6. 整合整个月的天数
  getCurrentMonthDateArr(){
    // 获取这个月中上个月的无效数据
    let lastInvalidDaysArr = this.getLastInvalidDaysArr()
    // 获取当月数据
    let currentDateArr = this.getCurrentDateArr()
    // 获取这个月中上下个月的无效数据
    let nextInvalidDaysArr = this.getNextInvalidDaysArr()
    let allDateArr = [...lastInvalidDaysArr, ...currentDateArr, ...nextInvalidDaysArr]
    this.setData({
      allDateArr
    })
  },

  


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})