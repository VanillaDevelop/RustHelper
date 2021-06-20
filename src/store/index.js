import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: []
  },
  mutations: 
  {
    addServer(state, server) 
    {
      state.servers.push(server)
    }
  },
  actions: 
  {
    addServer(context, serverName)
    {
      context.commit('addServer', {name: serverName})
    }
  },
  modules: {
  }
})
