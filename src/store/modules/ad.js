// 保存发布广告的表单数据，添加支付方式返回后自动填充
const state = {
  adFormData: null
}

const getters = {
  getAdFormData(state) {
    return state.adFormData
  }
}

const mutations = {
  CHANGE_AD_DATA: (state, data) => {
    state.adFormData = data
  }
}

const actions = {
  changeAdData({ commit }, data) {
    commit('CHANGE_AD_DATA', data)
  }
}

export default {
  getters,
  state,
  mutations,
  actions
}
