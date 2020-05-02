/**
 * 发现API接口
 */
import api from '@/api'

let domain = ''
// let domain = 'http://linton-dev.lab.ssss.so/'
let incubation = {}

// 获取投票项目列表 type项目类型:1-上币投票，2-映射投票
const findFinances = function (data, success, error) {
  api.post(`${domain}api/v2/account2/financesRebate/findFinances/${data.size}/${data.page}`, (res, all) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg, all)
    }
  }, error)
}
incubation.findFinances = findFinances

// 提交孵息理财
const investFunds = function (data, success, error) {
  api.post(`${domain}api/v2/account2/financesRebate/investFunds`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
incubation.investFunds = investFunds

// 查询孵息订单记录
const financesRecordList = function (data, success, error) {
  api.post(`${domain}api/v2/account2/financesRebate/financesRecordList/${data.size*data.page}/1`, {status:data.status}, (res, all) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg, all)
    }
  }, error)
}
incubation.financesRecordList = financesRecordList

// 查询孵息分发记录
const distributeRecord = function (data, success, error) {
  api.post(`${domain}api/v2/account2/financesRebate/distributeRecord/${data.size*data.page}/1`, {orderId:data.orderId}, (res, all) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg, all)
    }
  }, error)
}
incubation.distributeRecord = distributeRecord

// 提交资金划转
const transfer = function (data, success, error) {
  api.post(`${domain}api/v2/account2/financesRebate/transfer`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
incubation.transfer = transfer

// 查询划转记录
const transferRecord = function (data, success, error) {
  api.post(`${domain}api/v2/account2/financesRebate/transferRecord/${data.size*data.page}/1`, {symbol:data.symbol}, (res, all) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg, all)
    }
  }, error)
}
incubation.transferRecord = transferRecord

// 查询认证奖励
const kycRebate = function (symbol, success, error) {
  api.post(`${domain}api/v2/account2/financesRebate/authenticate/${symbol}`, (res, all) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg, all)
    }
  }, error)
}
incubation.kycRebate = kycRebate

export default incubation
