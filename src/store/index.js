import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    selectedServerIndex: -1,
    maxServerId: -1,
    //static data
    materials: ["wood", "metal", "sulfur", "hqm", "charcoal", "mfrags", "sfrags", "hqmfrags"],
    transformations: {
      wood: "charcoal",
      metal: "mfrags",
      sulfur: "sfrags",
      hqm: "hqmfrags"
    },
    reverse_transformations: {
      charcoal: "wood",
      mfrags: "metal",
      sfrags: "sulfur",
      hqmfrags: "hqm"
    },
    //wood cost to transform a source material into its byproduct
    woodCost: {
      wood: 4 / 3,
      metal: 5,
      sulfur: 2.5,
      hqm: 10
    },
  },
  mutations: 
  {
    addServer(state, server) 
    {
      state.maxServerId += 1;
      server.id = state.maxServerId;
      server.furnaces = [];
      state.servers.push(server);
    },
    addFurnace(state, serverId)
    {
      let serverById = state.servers.find((x) => x.id == serverId);

      let furnaceState = {
        selected: ["", "", "", "", "", ""],
        quantities: [0, 0, 0, 0, 0, 0],
        outputs: ["", "", "", "", "", ""],
        output_quantities: [0, 0, 0, 0, 0, 0],
        fuel_burned: 0,
        finish_time: 0,
      }
      serverById.furnaces.push(furnaceState);
    },
    setServerId(state, id)
    {
      state.selectedServerIndex = id;
    },
    removeServer(state, id)
    {
      let serverById = state.servers.find((x) => x.id == id);
      state.servers.splice(state.servers.indexOf(serverById), 1);
      state.selectedServerIndex = -1;
    }
  },
  actions: 
  {
    addServer(context, serverName)
    {
      context.commit('addServer', {name: (serverName.length > 56) ? serverName.substring(0,56) : serverName})
    },
    deleteServer(context, serverId)
    {
      context.commit('removeServer', serverId)
    },
    setSelectedServer(context, serverId)
    {
      context.commit('setServerId', serverId)
    },
    addFurnaceToServer(context, serverId)
    {
      context.commit('addFurnace', serverId)
    }
  },
  getters: {
    abbreviatedServerNames: state => {
      return state.servers.map(x => {
        if (x.name.length > 25)
        {
            return (x.name.substring(0,20) + "...");
        }
        else
          return x.name;
      })
    },
    currentServerName: (state, getters) => {
      if(state.selectedServerIndex < 0)
        return "None"
      else
      {
        return getters.abbreviatedServerNames[state.servers.indexOf(state.servers.find((x) => x.id == state.selectedServerIndex))];
      }
    },
    currentServer: state => {
      if(state.selectedServerIndex < 0)
      return null;
      else
      {
        return state.servers.find((x) => x.id == state.selectedServerIndex);
      }
    },
    serverCount: state => { 
      return state.servers.length;
    }
  },
  modules: {
  },
  plugins: [createPersistedState()],
})
