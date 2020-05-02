import JsCookies from 'js-cookie'
import numUtils from '@/assets/js/numberUtils'
let userWallets = JSON.parse(localStorage.userWallets || '[]')
let incubatedWallets = JSON.parse(localStorage.incubatedWallets || '[]')
let btcPrice = JSON.parse(localStorage.btcPrice || '{}')
const state = {
  btcValuation: 0,
  USDCNY: {},
  btcPrice: btcPrice,
  networkSignal: 0,
  btcValues: {},
  userWallets: userWallets, 
  incubatedWallets:incubatedWallets, //孵息账户
  symbol: localStorage.symbol,
  sysParams:{} //System params
}
const getters = {
  getSysParams(state){
    return state.sysParams
  },
  getBTCValuation (state) {
    return state.btcValuation
  },
  getUSDCNY (state) {
    if (state.lang === 'en') {
      return state.USDCNY && state.USDCNY.USD
    } else {
      return state.USDCNY && state.USDCNY.CNY
    }
  },
  getUSDTBTC (state) {
    return state.USDCNY && state.USDCNY.USDT
  },
  getCoinSign (state) {
    return state.lang === 'en' ? '$' : '¥'
  },
  getNetworkSignal (state) {
    return state.networkSignal
  },
  getBtcValues (state) {
    return state.btcValues
  },
  getUserWallets (state) {
    return state.userWallets
  },
  getIncubatedWallets (state) {
    return state.incubatedWallets
  },
  getUsdRate (state) {
    if (state.USDCNY && state.USDCNY.USD && state.USDCNY.CNY) {
      return numUtils.div(state.USDCNY.USD, state.USDCNY.CNY).toFixed(2)
    } else {
      return 0
    }
  },
  getSymbol (state){
    return state.symbol
  },
  getBtcPrice (state){
    return state.btcPrice
  }
}

const mutations = {
  updateSysParams (state, sysParams) {
    state.sysParams = sysParams
  },
  updateBTCValuation (state, btcValuation) {
    state.btcValuation = btcValuation
  },
  updateUSDCNY (state, USDCNY) {
    state.USDCNY = USDCNY
  },
  updateNetworkSignal (state, signal) {
    state.networkSignal = signal
  },
  updateBtcValues (state, btcValues) {
    state.btcValues = btcValues
  },
  updateUserWallets (state, userWallets) {
    state.userWallets = userWallets
    localStorage.userWallets = JSON.stringify(userWallets)
  },
  updateIncubatedWallets (state, incubatedWallets) {
    state.incubatedWallets = incubatedWallets
    localStorage.incubatedWallets = JSON.stringify(incubatedWallets)
  },
  updateSymbol(state, symbol){
    state.symbol = symbol
    localStorage.symbol = symbol
  },
  updateBtcPrice(state, btcPrice){
    state.btcPrice = btcPrice
    localStorage.btcPrice = JSON.stringify(btcPrice)
  }
}

const actions = {
  setSysParams (context, sysParams) {
    context.commit('updateSysParams', sysParams)
  },
  setBTCValuation (context, btcValuation) {
    context.commit('updateBTCValuation', btcValuation)
  },
  setUSDCNY (context, USDCNY) {
    context.commit('updateUSDCNY', USDCNY)
  },
  setNetworkSignal (context, signal) {
    context.commit('updateNetworkSignal', signal)
  },
  setBtcValues (context, data) {
    let btcValues = {}
    data.forEach((item) => {
      // if (item.baseSymbol === 'BTC') {
        btcValues[item.currencySymbol] = item.lastPrice
      // }
    })
    // console.log(btcValues)
    context.commit('updateBtcValues', btcValues)
  },
  setUserWallets (context, userWallets) {
    context.commit('updateUserWallets', userWallets)
  },
  setIncubatedWallets (context, incubatedWallets) {
    context.commit('updateIncubatedWallets', incubatedWallets)
  },
  setSymbol(context, symbol){
    context.commit('updateSymbol',symbol)
  },
  setBtcPrice (context, btcPrice) {
    context.commit('updateBtcPrice', btcPrice)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
