const state = {
  voteSb: [],
  voteYs: [],
}
const getters = {
  getVoteSb (state) {
    return state.voteSb
  },
  getVoteYs (state) {
    return state.voteYs
  },
}

const mutations = {
  updateVoteSb (state, data) {
    state.voteSb = data
  },
  updateVoteYs (state, data) {
    state.voteYs = data
  },
}

const actions = {
  setVoteSb ({commit}, data) {
    commit('updateVoteSb', data)
  },
  setVoteYs ({commit}, data) {
    commit('updateVoteYs', data)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
