import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    selectedServerIndex: -1,
    maxServerId: -1,
    maxFurnaceId: -1,
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
    build_mats: [
      ["Square Foundation", 200],
      ["Triangle Foundation", 100],
      ["Foundation Stairs", 100],
      ["Square Floor", 100],
      ["Triangle Floor", 50],
      ["Wall", 200],
      ["Half Wall", 200],
      ["Low Wall", 100],
      ["Doorway", 140],
      ["Window", 140],
      ["Wall Frame", 100],
      ["Floor Frame", 100],
      ["Stairs", 200],
      ["Roof", 200]],
    constructions: [
      {
        name: "Sheet Metal Double Door",
        icon: "sheetdouble",
        cost:
        {
          "mfrags": 200
        }
      },
      {
        name: "Wood Double Door",
        icon: "wooddouble",
        cost:
        {
          "wood": 350,
        }
      },
      {
        name: "Wooden Door",
        icon: "wooddoor",
        cost:
        {
          "wood": 300,
        }
      },
      {
        name: "Tool Cupboard",
        icon: "tc",
        cost:
        {
          "wood": 1000
        }
      },
      {
        name: "Sheet Metal Door",
        icon: "sheetdoor",
        cost:
        {
          "mfrags": 150
        }
      },
      {
        name: "Building Plan",
        icon: "bp",
        cost:
        {
          "wood": 20
        }
      },
      {
        name: "Hammer",
        icon: "hammer",
        cost:
        {
          "wood": 100
        }
      },
      {
        name: "Code Lock",
        icon: "codelock",
        cost:
        {
          "mfrags": 100
        }
      },
      {
        name: "Key Lock",
        icon: "keylock",
        cost:
        {
          "wood": 75
        }
      },
      {
        name: "Metal Shop Front",
        icon: "shopfront",
        cost:
        {
          "mfrags": 250
        }
      }
    ],
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
      state.maxFurnaceId = state.maxFurnaceId + 1;

      let furnaceState = {
        id: state.maxFurnaceId,
        selected: ["", "", "", "", "", ""],
        quantities: [0, 0, 0, 0, 0, 0],
        outputs: ["", "", "", "", "", ""],
        output_quantities: [0, 0, 0, 0, 0, 0],
        fuel_burned: 0,
        finish_time: new Date(null),
        active_timer: null,
        has_resolved: true
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
    },
    removeFurnace(state, payload)
    {
      let serverById = state.servers.find((x) => x.id == payload.serverId);
      let furnaceById = serverById.furnaces.find((x) => x.id == payload.furnaceId);
      if(furnaceById.active_timer != null)
      {
        clearInterval(furnaceById.active_timer);
      }
      serverById.furnaces.splice(serverById.furnaces.indexOf(furnaceById), 1);
    },
    setTimer(state, payload)
    {
      let serverById = state.servers.find((x) => x.id == payload.serverId);
      let furnaceById = serverById.furnaces.find((x) => x.id == payload.furnaceId);
      furnaceById.active_timer = payload.timer;
      furnaceById.has_resolved = false;
    },
    setResolvedState(state, payload)
    {
      let serverById = state.servers.find((x) => x.id == payload.serverId);
      let furnaceById = serverById.furnaces.find((x) => x.id == payload.furnaceId);
      furnaceById.has_resolved = payload.has_resolved;
    }
  },
  actions: 
  {
    addServer(context, serverName)
    {
      context.commit('addServer', {name: (serverName.length > 56) ? serverName.substring(0,56) : serverName});
    },
    deleteServer(context, serverId)
    {
      context.commit('removeServer', serverId);
    },
    deleteFurnace(context, payload)
    {
      context.commit('removeFurnace', payload);
    },
    setSelectedServer(context, serverId)
    {
      context.commit('setServerId', serverId)
    },
    addFurnaceToServer(context, serverId)
    {
      context.commit('addFurnace', serverId)
    },
    set_active_timer(context, payload)
    {
      context.commit('setTimer', payload)
    },
    set_resolved_state(context, payload)
    {
      context.commit('setResolvedState', payload)
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
