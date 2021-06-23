import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    selectedServerIndex: -1,
    maxServerId: -1
  },
  mutations: 
  {
    addServer(state, server) 
    {
      state.maxServerId += 1
      server.id = state.maxServerId
      state.servers.push(server)
    },
    setServerId(state, id)
    {
      state.selectedServerIndex = id
    }
  },
  actions: 
  {
    addServer(context, serverName)
    {
      context.commit('addServer', {name: serverName})
    },
    setSelectedServer(context, serverId)
    {
      context.commit('setServerId', serverId)
    }
  },
  getters: {
    currentServerName: state => {
      if(state.selectedServerIndex < 0)
        return "None"
      else
        return state.servers.find((x) => x.id == state.selectedServerIndex).name
    },
    serverCount: state => { 
      return state.servers.length;
    }
  },
  modules: {
  }
})
