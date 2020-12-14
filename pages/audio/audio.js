// pages/audio/audio.js
const util = require('../../utils/util.js')
const audioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    max: '',
    interval: '',
    /**
     * 音频信息
     */
    isPlay: 0, // 播放状态 0:未播放 1:已播放
    duration: 0, // 时长 s(秒) 
    value: 0, // 当前时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    audioContext.src = "https://m10.music.126.net/20201211155742/87788631fca77989e0753524fc0e848f/ymusic/075a/0f53/510c/0046f03b288990652a63ff79f9136840.mp3"
  },
  // 初始化数据
  init(that) {
    var interval = ""
    that.clearTimeInterval(that)
    that.setData({
      interval: interval,
      isPlay: 0
    })
  },
  /**
   * 清除interval
   * @param that
   */
  clearTimeInterval: function (that) {
    var interval = that.data.interval;
    clearInterval(interval)
  },
  /**
   * 重新倒计时
   */
  restartTap: function () {
    var that = this;
    that.init(that);
    console.log("倒计时重新开始")
    that.startTap()
  },
  /**
   * 暂停倒计时
   */
  stopTap: function () {
    var that = this;
    console.log("倒计时暂停")
    that.clearTimeInterval(that)
  },

  /**
   * 开始倒计时
   */
  startTap: function () {
    var that = this;
    that.init(that); //这步很重要，没有这步，重复点击会出现多个定时器
    var value = that.data.value;
    console.log("倒计时开始"+value)
    var interval = setInterval(function () {
      value++;
      that.setData({
        value: value
      })
      if (value >= that.data.max) { //归0时回到60
        console.log('初始化数据')
        that.setData({
          value: 0,
          isPlay: 0
        })
        that.init(that)
      }
    }, 1000)
    that.setData({
      interval: interval
    })
  },

  // 播放音频事件
  playAudio() {
    audioContext.play()
    audioContext.onPlay(() => {
      this.setData({
        isPlay: 1
      })
    })
    audioContext.onTimeUpdate(() => {
      let timeDuration = util.times_to_minutesAndTimes(audioContext.duration)
      this.setData({
        duration: timeDuration,
        max: audioContext.duration
      })

    })
    // 开始倒计时
    this.startTap()
  },
  // 暂停音频事件
  playPause() {
    audioContext.pause()
    audioContext.onPause(() => {
      this.setData({
        isPlay: 0
      })
    })
    // 暂停倒计时
    this.stopTap()
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
    var that = this;
    that.clearTimeInterval(that)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    that.clearTimeInterval(that)
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