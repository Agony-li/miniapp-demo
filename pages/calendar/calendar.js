// pages/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear: new Date().getFullYear(), // 当前年
    currentMonth: new Date().getMonth() + 1, // 当前月
    lastYearMonth: '', // 上一个月
    nextYearMonth: '', // 下一个月
    allDateArr: [], // 当前月所有的数据
    currentDateArr: [], // 当前月有效数据
    lastInvalidDaysArr: [], // 当前月之前无效日期
    nextInvalidDaysArr: [], // 当前月之后无效日期

    mindate: '2020-12-07',
    maxdate: '2021-07-07',
    chooseDateArr: [
      '2020-12-13',
      '2020-12-01',
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
        // 对比年 月 日
        // let currentYear = new Date(currentDateArr[i].date).getFullYear()
        let currentYear = this.data.currentYear // 当前年
        let currentMonth = this.data.currentMonth // 当前月
        let chooseYear = new Date(chooseDateArr[j]).getFullYear() // 选中的年
        let chooseMonth = new Date(chooseDateArr[j]).getMonth() + 1 // 选中的年
        if(currentYear == chooseYear && currentMonth==chooseMonth && currentDateArr[i].dateNum == new Date(chooseDateArr[j]).getDate()){
          currentDateArr[i].choose = 'choose'
        }
      }
    }
  },

  // 初始化数据
  initData(){
    let lastMonth = this.data.currentMonth - 1 < 1 ? 12 : this.data.currentMonth - 1
    let nextMonth = this.data.currentMonth + 1 > 12 ? 1 : this.data.currentMonth + 1
    let lastYearMonth = lastMonth == 12 ? (this.data.currentYear-1) + '-12':this.data.currentYear+'-'+ lastMonth
    let nextYearMonth = nextMonth == 1 ? (this.data.currentYear+1) + '-' + nextMonth : this.data.currentYear+'-'+nextMonth
    console.log('lastYearMonth: '+lastYearMonth);
    console.log('nextYearMonth: '+nextYearMonth);
    console.log('mindate: '+this.data.mindate);
    console.log('maxdate: '+this.data.maxdate);
    this.setData({
      lastYearMonth: this.isHaveLastMonth(lastYearMonth, this.data.mindate) ? lastYearMonth : '',
      nextYearMonth: this.isHaveNextMonth(nextYearMonth, this.data.maxdate) ? nextYearMonth : '',
    })
  }, 

  // 是否含有上个月
  isHaveLastMonth(oneDate, twoDate){
    let oneTimes = new Date(this.fillZero(oneDate)).getTime()
    let twoTimes = new Date(this.fillZero(twoDate)).getTime()
    return oneTimes >= twoTimes
  },
  // 是否含有下个月
  isHaveNextMonth(oneDate, twoDate){
    let oneTimes = new Date(this.fillZero(oneDate)).getTime()
    let twoTimes = new Date(this.fillZero(twoDate)).getTime()
    return oneTimes <= twoTimes
  },
  
  // 日期补0操作 (兼容有的月份不带有0, 无法进行对比)
  fillZero(date){
    let year = new Date(date).getFullYear()
    let month = new Date(date).getMonth() + 1
    return year+'-'+ (month < 10 ? '0'+month : month)
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
    console.log('获取某 月一号是周几', new Date(year, month-1, 1).getDay())
    return new Date(year, month-1, 1).getDay()
  },

  // 3. 获取当月数据
  getCurrentDateArr(){
    // 获取当月的天数
    let currentMonthDays = this.getMonthDays(this.data.currentYear, this.data.currentMonth)
    let currentDateArr = []
    // 选中的日期
    for (let i = 1; i < currentMonthDays + 1; i++) {
      currentDateArr.push({
        month: 'valid', 
        dateNum: i, 
        date: this.data.currentYear+'-'+this.data.currentMonth+'-'+i,
        choose: ''
      }) // 当月的有效数据
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
        lastInvalidDaysArr.unshift({month: 'invalid', dateNum: date})
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
        nextInvalidDaysArr.push({month: 'invalid', dateNum: i})
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