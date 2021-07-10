<template>
  <div id="app">
    <div>
      <b-navbar
        toggleable="lg"
        type="dark"
        variant="dark"
        class="mb-5"
        id="nav"
      >
        <b-navbar-brand to="/">Rust Helper</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/overview">Overview</b-nav-item>
            <b-nav-item to="/about">About</b-nav-item>
            <b-nav-item to="/furnaces" v-if="selectedServerIndex != -1"
              >Furnace Calculator</b-nav-item
            >
            <b-nav-item to="/about" v-if="selectedServerIndex != -1"
              >Map</b-nav-item
            >
            <b-nav-item to="/about" v-if="selectedServerIndex != -1"
              >Build Cost Calculator</b-nav-item
            >
          </b-navbar-nav>
          <b-navbar-nav
            class="ml-auto server-selector-mobile"
            v-if="this.serverCount > 0"
          >
            <b-nav-item-dropdown :text="this.currentServerName" right>
              <b-dropdown-item
                @click="setActiveServer(server.id)"
                :key="server.id"
                v-for="server in servers"
                >{{ server.name }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>

        <b-navbar-nav
          class="ml-auto server-selector"
          v-if="this.serverCount > 0"
        >
          <b-nav-item-dropdown
            :text="'Currently Selected Server (' + this.currentServerName + ')'"
            right
          >
            <b-dropdown-item
              @click="setActiveServer(server.id)"
              :key="server.id"
              v-for="server in servers"
              >{{ server.name }}</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </div>

    <router-view />
  </div>
</template>

<style lang="css">
@import url("https://fonts.googleapis.com/css2?family=Raleway&display=swap");

body {
  background-color: #ce422b;
  color: white;
  overflow-x:hidden;
}

#nav {
  font-family: "Raleway";
  background-color: #1e2020 !important;
}

.text-muted {
  color: white !important;
}

.modal-content {
  background-color: #ce422b !important;
}

.server-selector {
  display: none;
}

.server-selector-mobile {
  display: block;
}

@media (min-width: 992px) {
  .server-selector {
    display: block;
    display: none;
  }
}
</style>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapGetters(["currentServerName", "serverCount"]),
    ...mapState(["servers", "selectedServerIndex"]),
  },
  methods: {
    setActiveServer(serverId) {
      this.$store.dispatch("setSelectedServer", serverId);
    },
  },
};
</script>