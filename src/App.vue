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
          </b-navbar-nav>
        </b-collapse>

        <b-navbar-nav class="ml-auto" v-if="this.serverCount > 0">
          <b-nav-item-dropdown :text="'Currently Selected Server (' + this.currentServerName + ')'" right>
            <b-dropdown-item :key="server.id" v-for="server in servers">{{server.name}}</b-dropdown-item>
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
}

#nav {
  font-family: "Raleway";
  background-color: #1e2020 !important;
}

.text-muted {
  color: white !important;
}
</style>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "currentServerName",
      "serverCount"
    ]),
    ...mapState(['servers'])
  },
};
</script>