<template>
  <b-container>
    <div>
      <h1 class="text-center">Rust Helper</h1>
    <hr />
      <b-row class="mb-5">
        <b-col lg="8" offset-lg="2">
          <p class="text-justify">
            Welcome to the Rust Helper! This application is made for the video
            game Rust, to help you keep track of your goals throughout the game.
            The Rust Helper is an unofficial tool and not in any way affiliated
            with Rust or the Rust developers. The code is open source. If you'd
            like to know more about the project itself, feel free to check out
            the "About" page in the top.
          </p>
        </b-col>
      </b-row>
    </div>

    <h3 class="text-center">Features of the Rust Helper</h3>
    <b-row class="mb-5">
      <b-col lg="4">
        <p class="text-center h2">
          <b-icon icon="droplet-half"></b-icon>
        </p>
        <h5 class="text-center">Furnace Tracking</h5>
        <p>
          Ever felt overwhelmed by the 30 furnaces in your home that need to be
          constantly refilled? Track the input and output of all your furnaces
          in real time. Estimate the wood costs and time to refill. Keep your
          production line going.
        </p>
      </b-col>
      <b-col lg="4">
        <p class="text-center h2">
          <b-icon icon="map"></b-icon>
        </p>
        <h5 class="text-center">Map Objectives</h5>
        <p class="text-justify">
          Using this tool, you can mark multiple spots on your map,
          differentiating between friend, foe, or point of interest. Using an
          accurate map of your server, you won't forget that one suspicious
          looking 2 by 1 anymore.
        </p>
      </b-col>
      <b-col lg="4">
        <p class="text-center h2">
          <b-icon icon="door-open"></b-icon>
        </p>
        <h5 class="text-center">Build Cost Calculator</h5>
        <p class="text-justify">
          Often times as a new player, it can be difficult to calculate the cost
          of building or expanding a base in your head. This utility allows you
          to easily estimate the cost of building your base.
        </p>
      </b-col>
    </b-row>

    <b-row class="mb-5">
      <b-col lg="6" offset-lg="3">
        <div v-if="this.serverCount == 0">
          <h3 class="text-center">Getting started</h3>
          <p class="text-justify">
            To get started, add a new server to your server list using the form
            below. Don't worry about the name - it's just a nickname for you to
            remember the server by. You will get the option of generating a map
            image for this server later.
          </p>
        </div>
        <div v-else>
          <h3 class="text-center">Playing on multiple servers?</h3>
          <p class="text-justify">
            You have already added a server, but you can manage multiple servers
            at once, which all have their unique state. To add another server,
            simply enter the server name below and click on submit. Otherwise,
            select your desired server in the top right corner to get started
            using the tool.
          </p>
        </div>
        <h5>Add a new server</h5>
        <b-form>
          <b-form-group
            label="Server Name"
            label-for="input-server"
            description="Input a nickname for you to remember this server by"
          >
            <b-form-input
              id="input-server"
              type="text"
              placeholder="Enter Server Nickname"
              required
              v-model="serverName"
            ></b-form-input>
          </b-form-group>
          <b-button variant="light" @click="addServer()">Submit</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data: function () {
    return {
      serverName: "",
    };
  },
  computed: {
    ...mapGetters(["serverCount"]),
  },
  methods: {
    addServer() {
      this.$store.dispatch("addServer", this.serverName);
      this.serverName = "";
    },
  },
};
</script>