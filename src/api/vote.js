/**
 * 发现API接口
 */
import api from '@/api'

let domain = ''
// let domain = 'http://linton-dev.lab.ssss.so/'
let vote = {}

// 获取投票项目列表 type项目类型:1-上币投票，2-映射投票
const getVoteList = function (_type, success, error) {
  api.get(`${domain}api/v2/account2/linton/vote/items?type=${_type}`, (res) => {
    if (res.rst === 1) {
      success && success(res.timestamp, res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getVoteList = getVoteList

// 获取投票项目详情
const getVoteDetail = function (id, success, error) {
  api.get(`${domain}api/v2/account2/linton/vote/symbols/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.timestamp, res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getVoteDetail = getVoteDetail

// 获取项目投票记录
const getVoteRecord = function (id, success, error) {
  api.get(`${domain}api/v2/account2/linton/vote/record/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getVoteRecord = getVoteRecord

// 获取已推介的朋友数量
const getInviteUsers = function (success, error) {
  api.get(`${domain}api/v5/user/invite/users`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getInviteUsers = getInviteUsers

// 获取邀请获得的佣金
const getInviteCommission = function (success, error) {
  api.get(`${domain}api/v5/user/invite/commission`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getInviteCommission = getInviteCommission

// 获取被邀请的用户
const getInvitedUsers = function (data, success, error) {
  api.get(`${domain}api/v5/user/invite/invitedUsers/`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.total, res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getInvitedUsers = getInvitedUsers


// 币种投票
/*"id":"228592192124354560",
"voting": 5,
"secondaryValidateDTO":{
  "googleCode":"xxx",
  "type":1,
  "password":"xxx",
  "smsCode":"xxx",
  "rsaPublicKey":"xxx"
}*/
const putVote = function (data, success, error) {
  api.post(`${domain}api/v2/account2/linton/vote/req`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.putVote = putVote

// 映射记录
const getMappingList = function (success, error) {
  api.get(`${domain}api/v2/account2/mapping/list`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getMappingList = getMappingList

// 我的映射
const getMyMapping = function (success, error) {
  api.get(`${domain}api/v2/account2/mapping/mymapping`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getMyMapping = getMyMapping

// 获取支持的映射币
const getMappingSymbolList = function (success, error) {
  api.get(`${domain}api/v2/account2/mapping/listsymbol`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getMappingSymbolList = getMappingSymbolList

// 我要映射-映射地址
const getMappingAddress = function (success, error) {
  api.get(`${domain}api/v2/account2/mapping/address`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
vote.getMappingAddress = getMappingAddress

export default vote
