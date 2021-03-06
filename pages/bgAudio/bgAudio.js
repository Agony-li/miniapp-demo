// pages/audio/audio.js
const bgAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 音频信息
     */
    bgAudio: {
      src: 'https://music.163.com/song/media/outer/url?id=32526653.mp3', // 音频链接
      title: '冰与火之歌', // 标题
      singer: 'Ramin Djawadi' // 作者
    }, // 音频属性
    max: 105, // 后台返回的音频时长 s
    interval: '',
    isPlay: 0, // 播放状态 0:未播放 1:已播放
    duration: '00:00', // 时长 s(秒) 
    value: 0, // 当前时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // 监听音频自然播放至结束的事件
    bgAudioManager.onEnded(() => {
      console.log('音频自然播放结束');
      this.setData({
        value: 0,
        duration: '00:00'
      })
    })
    wx.getBackgroundAudioManager()
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
      success: (res)=>{
        console.log(res);
      },
      fail: (err)=>{
        console.log(err);
      },
    })

    // 音频播放事件
    bgAudioManager.onPlay(() => {
      console.log('播放音频事件')
      this.setData({
        isPlay: 1,
      })
    })
    // 音频暂停事件
    bgAudioManager.onPause(() => {
      console.log('暂停音频事件')
      this.setData({
        isPlay: 0,
      })
    })
    // bgAudioManager.onTimeUpdate(() => {
    //   this.setData({
    //     max: bgAudioManager.duration,
    //   })
    // })
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
    // console.log("倒计时开始"+value)
    var interval = setInterval(function () {
      var value = that.data.value;
      value++;
      that.setData({
        value: value,
        duration: that.timesToMinutesAndTimes(that.data.max - value),
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
  // 秒转换成 分:秒 (需要小时自己扩展)
  timesToMinutesAndTimes(duration){
    if (duration == 0) {
      return '00:00'
    }
    let minutes = parseInt(duration/60) < 10 ? '0'+parseInt(duration/60): parseInt(duration/60)
    let second = parseInt(duration-parseInt(duration/60)*60) < 10 ? '0'+ parseInt(duration-parseInt(duration/60)*60) : parseInt(duration-parseInt(duration/60)*60)
    return minutes+":"+second
  },

  // 播放音频事件
  playAudio() {
    bgAudioManager.src = this.data.bgAudio.src
    bgAudioManager.title = this.data.bgAudio.title
    bgAudioManager.singer = this.data.bgAudio.singer
    if(this.data.value == 0){
      bgAudioManager.play()
    }else{
      bgAudioManager.seek(this.data.value)
      this.setData({
        duration: this.timesToMinutesAndTimes(this.data.max - this.data.value),
      })
    }
    // 开始倒计时
    this.data.isPlay == 0 ? this.startTap():''
  },

  // 暂停音频事件
  playPause() {
    bgAudioManager.pause()
    // 暂停倒计时
    this.data.isPlay == 1 ? this.stopTap():''
  },

  // 拖动进度条
  changeSlider(e){
    let that = this
    let value = e.detail.value
    bgAudioManager.seek(value)
    that.setData({
      value: value,
      duration: that.timesToMinutesAndTimes(that.data.max - value),
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
    // var that = this;
    // that.clearTimeInterval(that)
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