/**
 * 发现API接口
 */
import api from '@/api'

let domain = ''
let home = {}

// banaer
const getBanner = function (data, success, error) {
  api.get(`${domain}api/v2/individual/promotionActivity`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
home.getBanner = getBanner

// 公告
const getCmsList = function (data, success, error) {
  api.post(`${domain}/api/v1/cms/list`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
home.getCmsList = getCmsList

// 获取cms详情
const getCmsDetail = function (id, success, error) {
  api.get(`${domain}/api/v1/cms/detail/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
home.getCmsDetail = getCmsDetail

export default home
