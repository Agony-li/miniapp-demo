const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 秒转换成分秒
const times_to_minutesAndTimes = duration=>{
  let minutes = parseInt(duration/60) < 10 ? '0'+parseInt(duration/60): parseInt(duration/60)
  let second = parseInt(duration-parseInt(duration/60)*60) < 10 ? '0'+ parseInt(duration-parseInt(duration/60)*60) : parseInt(duration-parseInt(duration/60)*60)
  return minutes+":"+second
}

module.exports = {
  formatTime: formatTime,
  times_to_minutesAndTimes: times_to_minutesAndTimes
}
