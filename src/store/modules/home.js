const state = {
  banners:[],
  notice:[]
}
const getters = {
  getBanners (state){
    return state.banners
  },
  getNotice (state){
    return state.notice
  },
}

const mutations = {
  updateBanners (state, Banners){
    state.banners = Banners
  },
  updateNotice (state, Notice){
    state.notice = Notice
  },
}

const actions = {
  setBanners ({commit}, Banners){
    commit('updateBanners',Banners)
  },
  setNotice ({commit}, Notice){
    commit('updateNotice',Notice)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
