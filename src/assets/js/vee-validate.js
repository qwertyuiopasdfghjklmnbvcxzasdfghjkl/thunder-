import { Validator } from 'vee-validate'
import reg from './regex'
import config from '@/api/config'

Validator.extend('email', {
  getMessage: (field, args) => {
    return 'public0.emailFormatError' // 邮箱格式错误
  },
  validate: (value, args) => {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value )
  }
})

Validator.extend('password', {
  getMessage: (field, args) => {
    return 'login_register.lintonPWReg' // 密码至少8位，包括大、小写字母及数字
  },
  validate: (value, args) => {
    return /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value)
  }
})

Validator.extend('passwordAgain', {
  getMessage: (field, args) => 'public0.public124', // 密码不匹配，请重新输入
  validate: (value, args) => {
    return value === document.querySelector('input[uid="common-password"]').value
  }
})

Validator.extend('IdCard', {
  getMessage: (field, args) => 'public0.InvalidIDNumber', // 请输入有效的身份证号码
  validate: (value, args) => {
    if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
      return false
    } else {
      let dateArray = value.substring(6, 14).match(/^(\d{4})(\d{2})(\d{2})$/)
      let year = parseInt(dateArray[1])
      let month = parseInt(dateArray[2]) - 1
      let day = parseInt(dateArray[3])
      let date = new Date(year, month, day)
      return date <= new Date() && date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    }
  }
})

Validator.extend('imageFormat', {
  getMessage: (field, args) => 'public0.noSupportFileType', // 请上传支持格式的文件
  validate: (files, args) => {
    if (typeof files === 'string') {
      return config.imageType.test(files)
    }
    return config.imageType.test(files[0].name)
  }
})

Validator.extend('passport', {
  getMessage: (field, args) => 'public0.public127', // 请输入有效的护照
  validate: (value, args) => {
    return !/[\u4e00-\u9fa5]/.test(value)
  }
})

Validator.extend('telphone', {
  getMessage: (field, args) => 'public0.public128', // 请输入有效的手机号码
  validate: (value, args) => {
    return /^\d{8,11}$/.test(value)
  }
})

Validator.extend('pnNumber', {
  getMessage: (field, args) => 'public0.public129', // 请输入有效的正负数.
  validate: (value, args) => {
    return reg.pnNumber.test(value)
  }
})

Validator.extend('intOrDecimal', {
  getMessage: (field, args) => 'public0.public130', // 请输入有效的数字.
  validate: (value, args) => {
    if (!value) {
      return true
    }
    return reg.intOrDecimal.test(value)
  }
})

Validator.extend('pInteger', {
  getMessage: (field, args) => 'public0.public131', // 请输入整数
  validate: (value, args) => {
    return reg.pInteger.test(value)
  }
})

Validator.extend('minamount', {
  getMessage: (field, args) => 'public0.public132', // 最小限额不能大于最大限额
  validate: (value, args) => {
    var max = document.getElementById('ads_max_amount').value
    if (!max) {
      return true
    }
    return parseFloat(value) <= parseFloat(max)
  }
})

Validator.extend('maxamount', {
  getMessage: (field, args) => 'public0.public133', // 最大限额不能小于最小限额
  validate: (value, args) => {
    var min = document.getElementById('ads_min_amount').value
    if (!min) {
      return true
    }
    return parseFloat(value) >= parseFloat(min)
  }
})

Validator.extend('premiumPriceValid', {
  getMessage: (field, args) => 'public0.public134', // 溢价限制最低-50%最高100%
  validate: (value, args) => {
    return parseFloat(value) >= -50 && parseFloat(value) <= 100
  }
})

Validator.extend('ratingValid', {
  getMessage: (field, args) => 'public0.public162', // 好评率最低0最高100
  validate: (value, args) => {
    return parseFloat(value) >= 0 && parseFloat(value) <= 100
  }
})

// 银行卡账号验证
Validator.extend('bankCardValid', {
  getMessage: (field, args) => `public0.public135`, // 请输入有效的银行卡号
  validate: (value, args) => {
    return /^[0-9\- ]+$/.test(value)
  }
})

// 请输入整数1~5
Validator.extend('otcProcessNumValid', {
  getMessage: (field, args) => 'public0.public163', // 请输入整数1~5
  validate: (value, args) => {
    return parseFloat(value) >= 1 && parseFloat(value) <= 5
  }
})

// 最大值为{0}
Validator.extend('maxInputValue', {
  getMessage: (field, args) => {
    return window.$i18n.t(args[1] || 'public0.public257').format(args[0])
  }, // 最大值为{0}
  validate: (value, args) => {
    return parseFloat(value) <= parseFloat(args[0])
  }
})
