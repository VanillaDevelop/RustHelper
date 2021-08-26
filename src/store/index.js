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
      {
        name: "Square Foundation",
        base_cost: 200
      },
      {
        name: "Triangle Foundation",
        base_cost: 100
      },
      {
        name: "Foundation Stairs",
        base_cost: 100
      },
      {
        name: "Square Floor",
        base_cost: 100
      },
      {
        name: "Triangle Floor",
        base_cost: 50
      },
      {
        name: "Wall",
        base_cost: 200
      },
      {
        name: "Half Wall",
        base_cost: 200
      },
      {
        name: "Low Wall",
        base_cost: 100
      },
      {
        name: "Doorway",
        base_cost: 140
      },
      {
        name: "Window",
        base_cost: 140
      },
      {
        name: "Wall Frame",
        base_cost: 100
      },
      {
        name: "Floor Frame",
        base_cost: 100
      },
      {
        name: "Stairs",
        base_cost: 200
      },
      {
        name: "Roof",
        base_cost: 200
      }],
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
      server.shopping_cart = [];
      server.shopping_cart_deployable = [];
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
    },
    addItemToServer(state, payload)
    {
      let currentServer = state.servers.find((x) => x.id == state.selectedServerIndex);
      let selected_material = payload
      let entry = currentServer.shopping_cart.find(element => element.name == selected_material.name && element.tier == selected_material.tier)
      if (entry != null)
      {
        let index = currentServer.shopping_cart.indexOf(entry)
        entry.quantity += parseInt(selected_material.quantity);
        currentServer.shopping_cart.splice(index, 1, entry);
      }
      else
      {
        let cost = {};
        if (selected_material.tier == "Twig")
          cost["wood"] = Math.ceil(selected_material.base_cost / 4)
        if (selected_material.tier == "Wood")
          cost["wood"] = parseInt(selected_material.base_cost);
        else if (selected_material.tier == "Stone")
          cost["stone"] = selected_material.base_cost * 1.5;
        else if (selected_material.tier == "Metal")
          cost["mfrags"] = parseInt(selected_material.base_cost);
        else if (selected_material.tier == "HQM")
          cost["hqm"] = Math.ceil(selected_material.base_cost / 8);


        currentServer.shopping_cart.push({
          name: selected_material.name,
          tier: selected_material.tier,
          quantity: parseInt(selected_material.quantity),
          costs: cost,
          twig_cost: Math.ceil(selected_material.base_cost / 4)
        })
      }
    },
    resetServerItems(state)
    {
      let currentServer = state.servers.find((x) => x.id == state.selectedServerIndex);
      currentServer.shopping_cart = [];
      currentServer.shopping_cart_deployable = [];
    },
    addDeployableToServer(state, payload)
    {
      let currentServer = state.servers.find((x) => x.id == state.selectedServerIndex);
      let selected_deployable = payload
      let entry = currentServer.shopping_cart_deployable.find(element => element.name == selected_deployable.name)
      if (entry != null)
      {
        let index = currentServer.shopping_cart_deployable.indexOf(entry)
        entry.quantity += parseInt(selected_deployable.quantity);
        currentServer.shopping_cart_deployable.splice(index, 1, entry);
      }
      else
      {
        currentServer.shopping_cart_deployable.push({
          name: selected_deployable.name,
          quantity: parseInt(selected_deployable.quantity),
          costs: selected_deployable.cost
        })
      }
    },
    removeItem(state, payload)
    {
      let currentServer = state.servers.find((x) => x.id == state.selectedServerIndex);
      let entry = currentServer.shopping_cart.find(element => element.name == payload.name && element.tier == payload.tier)
      if(entry != null)
      {
        currentServer.shopping_cart.splice(currentServer.shopping_cart.indexOf(entry), 1)
      }
    },
    removeDeployable(state, payload)
    {
      let currentServer = state.servers.find((x) => x.id == state.selectedServerIndex);
      let entry = currentServer.shopping_cart_deployable.find(element => element.name == payload.name)
      if(entry != null)
      {
        currentServer.shopping_cart_deployable.splice(currentServer.shopping_cart_deployable.indexOf(entry), 1)
      }
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
    },
    add_item_to_server(context, payload)
    {
      context.commit('addItemToServer', payload)
    },
    add_deployable_to_server(context, payload)
    {
      context.commit('addDeployableToServer', payload)
    },
    reset_server_items(context)
    {
      context.commit('resetServerItems')
    },
    remove_item(context, payload)
    {
      context.commit('removeItem', payload)
    },
    remove_deployable(context, payload)
    {
      context.commit('removeDeployable', payload)
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
