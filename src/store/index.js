import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    selectedServerIndex: -1
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
      context.commit('addServer', {name: serverName, id: this.state.servers.length})
    }
  },
  getters: {
    currentServerName: state => {
      if(state.selectedServerIndex < 0)
        return "None"
      else
        return state.servers[state.selectedServerIndex].name
    },
    serverCount: state => { 
      return state.servers.length;
    }
  },
  modules: {
  }
})
