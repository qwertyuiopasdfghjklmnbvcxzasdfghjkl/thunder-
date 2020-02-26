const state = {
  otcSocketEvents: [],
}
const getters = {
  getOtcSocketEvents (state) {
    return state.otcSocketEvents
  },
}

const mutations = {
  addOtcSocketEvent (state, ev) {
    state.otcSocketEvents.push(ev)
  },
  removeOtcSocketEvent (state, ev) {
    let events = state.otcSocketEvents
    for (let i = 0; i < events.length; i++) {
      let cev = events[i]
      if (cev === ev) {
        events.splice(i, 1)
        break
      }
    }
  },
}

const actions = {
  addOtcSocketEvent (context, ev) {
    context.commit('addOtcSocketEvent', ev)
  },
  removeOtcSocketEvent (context, ev) {
    context.commit('removeOtcSocketEvent', ev)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
