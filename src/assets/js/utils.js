import Vue from 'vue'
import store from 'vuex'
import QRCode from './qrcode'
import config from '@/api/config'
import userApi from '@/api/user'


Vue.prototype.$publish = publish
Vue.prototype.$subscribe = subscribe
// 发布订阅
let eventHub = new Vue()
function publish(key, ...args) {
  console.log(...args)
  eventHub.$emit(key, ...args)
  return this
}
function subscribe(key, callback) {
  eventHub.$on(key, callback.bind(this))
  return this
}


String.prototype.trim = function(){
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.format = function () {
  var args = arguments
  return this.replace(/{(\d+)}/g, function (m, i) {
    return args[i] || ''
  })
}

String.prototype.toMoney = function () {
  let s = this.split('.')
  let s0 = s[0]
  let end = s0.length % 3
  let arr = []
  if (end != 0) {
    arr.push(s0.substring(0, end))
  }
  let count = Math.floor(s0.length / 3)
  if (count > 0) {
    s0 = s0.substring(end)
    do {
      arr.push(s0.substring(0, 3))
      s0 = s0.substring(3)
    } while (s0.length)
  }
  s[0] = arr.join(',')
  return s.join('.')
}

Date.prototype.format = function (format) {
  format = format || 'yyyy-MM-dd HH:mm:ss'
  let f = function (m) {
    return m < 10 ? `0${m}` : m
  }
  let str = format.replace('yyyy', this.getFullYear())
  str = str.replace('MM', f(this.getMonth() + 1))
  str = str.replace('dd', f(this.getDate()))
  str = str.replace('HH', f(this.getHours()))
  str = str.replace('mm', f(this.getMinutes()))
  str = str.replace('ss', f(this.getSeconds()))
  return str
}

let utils = {
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)
}

const setDialog = function (component, opts) {
  opts = opts || {}
  if (opts.id && document.getElementById(opts.id)) {
    return
  }
  let i18n = window.$i18n
  const DialogComponent = Vue.extend(component)
  var dialogComponent = new DialogComponent({
    store,
    i18n,
    el: document.createElement('div'),
    propsData: opts
  })
  opts.component = dialogComponent
  dialogComponent.$dialog = Vue.$koallDialog(opts)
  dialogComponent.$on('okCallback', opts.okCallback || function () {})
  dialogComponent.$on('errCallback', opts.errCallback || function () {})
  dialogComponent.$on('removeDialog', dialogComponent.$dialog.removeDialog)
  return dialogComponent
}
utils.setDialog = setDialog


const qrcode = function (dom, opts) {
  if (!dom) {
    return
  }
  dom.innerHTML = ''
  opts = opts || {}
  opts.width = opts.width || 120
  opts.height = opts.height || 120
  var qrcode = new QRCode(dom, opts)
  return qrcode
}
utils.qrcode = qrcode

const isPlainEmpty = function (obj) {
  let bool = true
  for (var i in obj) {
    bool = false
    break
  }
  return bool
}
utils.isPlainEmpty = isPlainEmpty

/**
 * 图片等比缩放
 */
const imgZoom = function (dom, url, width, height, callback) {
  var image = new Image()
  image.src = url
  var cw = dom.clientWidth || width
  var ch = dom.clientHeight || height
  image.onload = function () {
    var w = this.width
    var h = this.height
    let r = Math.max(w / cw, h / ch)
    this.width = w / r
    this.height = h / r
    dom.appendChild(image)
  }
}
utils.imgZoom = imgZoom

// 转化时间
const formatDate = function (val) {
  let reg = /(\d+)-(\d+)-(\d+)[ |T]?(\d+):(\d+):(\d+)/
  var mts = val.match(reg)
  return new Date(Number(mts[1]), Number(mts[2]) - 1, Number(mts[3]), Number(mts[4]), Number(mts[5]), Number(mts[6]))
}
utils.formatDate = formatDate

// 倒计时
const countDown = function (t, callbackFun) {
  var db = function (m) {
    return m < 10 ? '0' + m : m
  }
  function a () {
    t = Math.max(t - 1, 0)
    t <= 0 && clearInterval(interval)
    let m = db(Math.floor(t / 60))
    let s = db(Math.floor(t % 60))
    if (typeof callbackFun === 'function') {
      callbackFun(`${m}:${s}`)
    }
  }
  a()
  let interval = setInterval(a, 1000)
  return interval
}
utils.countDown = countDown

// 获取支付类型ICON
const getPayType = function (payType) {
  if (payType === 1) {
    return 'icon-bank'
  } else if (payType === 2) {
    return 'icon-alipay'
  } else if (payType === 3) {
    return 'icon-wechat'
  }
}
utils.getPayType = getPayType

// 移除结尾0
const removeEndZero = function (str) {
  // str = Number(str)
  str = str.toString().split('.')
  if (str[1]) {
    str[1] = str[1].replace(/[0]+$/, '')
  }
  return str[1] && str[1].length ? str.join('.') : str.join('')
}
utils.removeEndZero = removeEndZero

// 限制上传图片大小，默认2M
const limitUploadImage = function (file, error, size) {
  let imgSize = 2 // 设置图片默认大小
  let limitSize = (size || imgSize) * 1024 * 1024
  if (file.nodeName !== 'INPUT' && file.name && file.size) {
    if (file.size > limitSize) {
      typeof error === 'function' && error(`error_code.IMAGE_EXCEED_`)
      return false
    } else {
      return true
    }
  }
  let files = file.length ? file : file.files
  for (let i = 0; i < files.length; i++) {
    let f = files.item(i)
    if (f.size > limitSize) {
      typeof error === 'function' && error(`error_code.IMAGE_EXCEED_`)
      return false
    }
  }
  return true
}
utils.limitUploadImage = limitUploadImage

// 获取URL参数
const getUrlParams = function () {
  let search = location.search
  if (!search) {
    return {}
  }
  let ps = search.substring(1)
  if (!ps) {
    return {}
  }
  ps = ps.split('&')
  let params = {}
  for (let i = 0; i < ps.length; i++) {
    let p = ps[i].split('=')
    if (p[0]) {
      params[p[0]] = p[1] || ''
    }
  }
  return params
}
utils.getUrlParams = getUrlParams

// 获取URL参数
const getUrlHashParams = function () {
  let hash = location.hash
  if (!hash) {
    return {}
  }
  if (hash.indexOf('?') === -1) {
    return {}
  }
  let ps = hash.substring(hash.indexOf('?') + 1)
  if (!ps) {
    return {}
  }
  ps = ps.split('&')
  let params = {}
  for (let i = 0; i < ps.length; i++) {
    let p = ps[i].split('=')
    if (p[0]) {
      params[p[0]] = p[1] || ''
    }
  }
  return params
}
utils.getUrlHashParams = getUrlHashParams

// 获取光标位置
const getCursortPosition = function (dom) {
  var cursorPos = 0
  if (document.selection) {
    // IE Support
    dom.focus()
    var selectRange = document.selection.createRange()
    selectRange.moveStart ('character', -dom.value.length)
    cursorPos = selectRange.text.length;
  } else if (dom.selectionStart || dom.selectionStart == '0') {
    // Firefox support
    cursorPos = dom.selectionStart;
  }
  return cursorPos
}
utils.getCursortPosition = getCursortPosition

// 设置光标位置
const setCursortPosition = function (dom, pos) {
  if (dom.setSelectionRange) {
    // IE Support
    dom.focus()
    dom.setSelectionRange(pos, pos)
  } else if (dom.createTextRange) {
    // Firefox support
    var range = dom.createTextRange()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
  }
}
utils.setCursortPosition = setCursortPosition

const uploadImage = function (e, size) {
  var target = e.target
  if (!target.value) {
    return
  }
  let imgCon = target.parentNode.previousElementSibling
  var imageUrl = null
  if (config.imageType.test(target.files.item(0).name) === false) {
    Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
    target.value = ''
    return
  }
  let isTrue = utils.limitUploadImage(target, (msg) => {
    Tip({type: 'danger', message: this.$t(msg)})
  }, size)
  if (!isTrue) {
    target.value = ''
    return
  }
  this[target.name.replace('1', '')] = target.value
  this.showObj[target.name.replace('1', '')] = true
  let cloneNode = target.cloneNode(true)
  if (target.nextElementSibling) {
    target.parentNode.removeChild(target.nextElementSibling)
  }
  cloneNode.name = target.name.replace('1', '')
  cloneNode.style.display = 'none'
  target.parentNode.appendChild(cloneNode)
  imgCon.innerHTML = ''
  utils.imgZoom(imgCon, window.URL.createObjectURL(target.files.item(0)))
}
utils.uploadImage = uploadImage

const formatSystemMessage = function (msg, isI18n) {
  if (isI18n === false) {
    return msg
  }
  msg = (msg || '').split(' ')
  let joinSplit = ' '

  let order = msg[1]

  if (msg.length === 1) {
    joinSplit = ''
  } else if (msg.length >= 2) {
    msg.splice(1, 1)
  }

  msg.forEach((item, index) => {
    msg[index] = this.$t('error_code.' + msg[index])
  })

  if (msg.length >= 2) {
    msg.splice(1, 0, order)
  }

  return msg.join(joinSplit)
}
utils.formatSystemMessage = formatSystemMessage


utils.operateDepth = function (datas) {
  let aar = {asks: [], bids: []}
  datas.forEach((item) => {
    if ((item.direction || '').toString() === '1') { // 买
      item.newtotal = 0
      aar.bids.push(item)
    } else if ((item.direction || '').toString() === '2') { // 卖
      item.newtotal = 0
      aar.asks.push(item)
    }
  })
  return aar
}

/* 数字三位用豆号隔开 */
Vue.filter('numbean', function (n) {
  var b = parseInt(n).toString();
  var len = b.length;
  if (len <= 3) {return b;}
  var r = len % 3;
  return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
});

// 获取时间范围
const getCheckedTimeRange = function (unit, quantity, callback) {
  let currentDate = new Date()
  let start = {
    date: currentDate,
    year: null,
    month: null,
    day: null
  }
  let end = {
    date: currentDate,
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate()
  }
  let getlastDay = (year, month) => new Date(year, month, 0).getDate() // 获取当月最后一天
  let getTimeRange = (startObj, endObj) => {
    let getStartDate = () => { // 根据当天计算开始日期
      quantity = unit === 'year' ? quantity * 12 : quantity
      let endMonthLastDay = getlastDay(endObj.year, endObj.month)
      let toDay = endObj.day
      startObj.date.setDate(1)
      startObj.date.setMonth(endObj.month - quantity - 1)
      if (toDay === endMonthLastDay && quantity % 12 !== 0) {
        // 如果是最后一天，设置为当月的第一天
        startObj.date.setMonth(startObj.date.getMonth() + 1)
      } else {
        // 如果不是最后一天，设置为当月最后一天和当天中的最小值
        let startMonthLastDay = getlastDay(startObj.date.getFullYear(), startObj.date.getMonth() + 1)
        startObj.date.setDate(Math.min(startMonthLastDay, toDay))
      }
    }
    switch (unit) {
      case 'day':
        startObj.date.setDate(endObj.day - quantity)
        break
      case 'month':
      case 'year':
        getStartDate()
        break
      default:
        console.error('日期单位错误')
        return false
    }
    startObj.year = startObj.date.getFullYear()
    startObj.month = startObj.date.getMonth() + 1
    startObj.day = startObj.date.getDate()
  }
  getTimeRange(start, end)
  let dateRange = {
    startDate: `${start.year}-${start.month < 10 ? '0' + start.month : start.month}-${start.day < 10 ? '0' + start.day : start.day}`,
    endDate: `${end.year}-${end.month < 10 ? '0' + end.month : end.month}-${end.day < 10 ? '0' + end.day : end.day}`
  }
  callback && callback(dateRange)
}
utils.getCheckedTimeRange = getCheckedTimeRange

/**
 * 极速验证
 * @param {*} okCallback
 */
let isGtDialogOpen = false
let gtCaptcha = null
let gtOkCallback = null
let gtEndCallback = null
let gtIsInitTip = false
const gtValidate = function (okCallback, endCallback) {
  if (isGtDialogOpen) {
    if (!gtCaptcha) {
      gtIsInitTip = true
      // 请耐心等待滑块初始化完成。
      // Tip({type: 'danger', message: window.$i18n.t('public0.public277')})
      Indicator.open()
    }
    typeof endCallback === 'function' && endCallback()
    return
  }
  gtOkCallback = okCallback
  gtEndCallback = endCallback
  isGtDialogOpen = true
  if (okCallback && gtCaptcha) {
    gtCaptcha.verify()
    return
  }
  const handler = function (captcha) {
    typeof captcha.onReady === 'function' && captcha.onReady(() => {
      isGtDialogOpen = false
      utils.gtCaptcha = gtCaptcha = captcha
      if (gtOkCallback) {
        gtCaptcha.verify()
      } else {
        typeof gtEndCallback === 'function' && gtEndCallback()
      }
      if (gtIsInitTip) {
        gtIsInitTip = false
        // 滑块初始化完成，请点击重试。
        Tip({type: 'danger', message: window.$i18n.t('public0.public277')})
      }
    })
    typeof captcha.onSuccess === 'function' && captcha.onSuccess(() => {
      isGtDialogOpen = false
      typeof gtEndCallback === 'function' && gtEndCallback()
      let gtParams = captcha.getValidate()
      if (typeof gtOkCallback === 'function') {
        gtOkCallback({
          geetestChallenge: gtParams.geetest_challenge,
          geetestValidate: gtParams.geetest_validate,
          geetestSeccode: gtParams.geetest_seccode
        })
      }
    })
    typeof captcha.onClose === 'function' && captcha.onClose(() => {
      isGtDialogOpen = false
      typeof gtEndCallback === 'function' && gtEndCallback()
    })
    typeof captcha.onError === 'function' && captcha.onError((error) => {
      isGtDialogOpen = false
      if (error && error.code === 'error_21') {
        $('.geetest_wind.geetest_panel').remove()
        gtCaptcha = null
        gtValidate(gtOkCallback, gtEndCallback)
      } else {
        typeof gtEndCallback === 'function' && gtEndCallback()
      }
    })
  }
  // 调用 initGeetest 初始化参数
  // 参数1：配置参数
  // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
  let lang = window.localStorage.getItem('lang') || 'zh-CN'
  if (lang === 'zh-CN') {
    lang = 'zh-cn'
  } else if (lang === 'cht') {
    lang = 'zh-tw'
  } else {
    lang = 'en'
  }
  gtCaptcha = null
  gtIsInitTip = false
  userApi.getGtInfo((res) => {
    Indicator.close()
    res = JSON.parse(res)
    window.initGeetest({
      protocol: config.http, // config.http
      gt: res.gt,
      challenge: res.challenge,
      offline: !res.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
      new_captcha: false,
      product: 'bind', // 产品形式，包括：float，popup
      width: '260px',
      height: '44px',
      lang: lang
    }, handler)
  }, () => {
    Indicator.close()
    isGtDialogOpen = false
    typeof gtEndCallback === 'function' && gtEndCallback()
    Tip({type: 'danger', message: window.$i18n.t('error_code.SERVER_ERROR')})
  })
}
utils.gtValidate = gtValidate


/**
 * 加密密码
 * @param {*} pwd 密码
 * @param {*} okCallback 成功回调函数
 */
const encryptPwd = function (publickey, pwd) {
  var encrypt = new JSEncrypt()
  encrypt.setPublicKey(publickey)
  pwd = encrypt.encrypt(pwd)
  return pwd
}
utils.encryptPwd = encryptPwd

const getPhonePlatform = () => {
  var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1;
  if (isAndroid) {
      return 'android';
  }
  var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isiOS) {
      return 'ios';
  }
  return false;
}
utils.getPhonePlatform = getPhonePlatform

// 复制
const copyText = (str) => {
  if (getPhonePlatform() !== 'ios') {
      var save = function (e) {
          e.clipboardData.setData('text/plain', str);
          e.preventDefault();
      }
      document.addEventListener('copy', save);
      document.execCommand('copy');
      document.removeEventListener('copy', save);
      return;
  }
  var copyDOM = document.createElement("div");
  copyDOM.id = "copy_clipboard";
  copyDOM.innerHTML = str;
  document.body.appendChild(copyDOM);
  var range = document.createRange();
  range.selectNode(copyDOM);
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  document.body.removeChild(copyDOM);
}
utils.copyText = copyText

// 数字人性化显示
const humanNum = (number) =>  {
  try {
    let _n = parseFloat(number), rst, unit = '';
    if (_n / 1000000000000 > 1) {
      rst = _n / 1000000000000;
      unit = '万亿';
    } else if (_n / 100000000000 > 1) {
      rst = _n / 100000000000;
      unit = '千亿';
    } else if (_n / 10000000000 > 1) {
      rst = _n / 10000000000;
      unit = '百亿';
    } else if (_n / 100000000 > 1) {
      rst = _n / 100000000;
      unit = '亿';
    } else if (_n / 10000000 > 1) {
      rst = _n / 10000000;
      unit = '千万';
    } else if (_n / 1000000 > 1) {
      rst = _n / 1000000;
      unit = '百万';
    } else if (_n / 10000 > 1) {
      rst = _n / 10000;
      unit = '万';
    } else {
      rst = _n;
    }
    return rst.toFixed(2) + unit;
  } catch (e) {
    return number;
  }
}
utils.humanNum = humanNum

// 保留小数位，非四舍五入
const toFixed = function(data, num){
  data = Number(data).toFixed(10)
  data = data.substring(0, data.lastIndexOf(".") + num + 1);
  return data
}
utils.toFixed = toFixed

//部分加密
const encryptStr = function(value, start, end) {
  value = value + ''
  var _s = value.substring(0, start||3)
  var _e = value.substring(value.length - end||3, value.length)
  return `${_s}****${_e}`
}
utils.encryptStr = encryptStr

export default utils
