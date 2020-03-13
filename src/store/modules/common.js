import JsCookies from 'js-cookie'
import numUtils from '@/assets/js/numberUtils'

let userInfo = null, quickLoginInfo = null
try {
  userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
} catch (ex) {}

const state = {
  lang: window.localStorage.getItem('lang') || 'zh-CN', //语言包
  api_token: JsCookies.get('api_token'),
  userInfo: userInfo || {},
  version: '1.0.0',
  userState: {}
}
const getters = {
  getLang (state){
    return state.lang
  },
  getApiToken (state) {
    return state.api_token
  },
  getUserInfo (state) {
    return state.userInfo
  },
  getVersion (state) {
    return state.version
  },
  getUserState (state){
    return state.userState
  }
}

const mutations = {
  updateLang (state, lang){
    state.lang = lang
  },
  updateApiToken (state, apiToken) {
    state.api_token = apiToken
  },
  updateUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  updateVersion (state, version) {
    state.version = version
  },
  updateUserState (state, userState) {
    state.userState = userState
  },
}

const actions = {
  setLang ({commit}, lang){
    window.localStorage.setItem('lang', lang)
    commit('updateLang',lang)
  },
  setApiToken (context, apiToken) {
    if (apiToken) {
      JsCookies.set('api_token', apiToken, { expires: 365*100 })
      localStorage.setItem('isFirstLogin', true)
    } else {
      window.localStorage.removeItem('userInfo')
      JsCookies.remove('api_token')
    }
    context.commit('updateApiToken', apiToken)
  },
  setUserInfo (context, userInfo) {
    if (userInfo) {
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
    } else {
      window.localStorage.removeItem('userInfo')
    }
    context.commit('updateUserInfo', userInfo)
  },
  setVersion ({commit}, version){
    commit('updateVersion',version)
  },
  setUserState (context, userState){
    context.commit('updateUserState',userState)
  }
}

export default {
  getters,
  state,
  mutations,
  actions
}
