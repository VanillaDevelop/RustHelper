<template>
  <b-container>
    <h1 class="text-center">Server Overview</h1>
    <b-row class="mb-3">
      <b-col lg="8" offset-lg="2" class="text-center mb-2">
        <b-button variant="primary" v-b-modal.modal-add-server
          ><b-icon-plus-circle-fill /> Add new</b-button
        >
      </b-col>
    </b-row>

    <div v-if="serverCount == 0" class="mt-5">
      <h4 class="text-center">You have not added any servers yet :(</h4>
      <b-row class="mb-5">
        <b-col lg="6" offset-lg="3">
          <p class="text-justify">
            Adding a server allows you to store server-specific info, such as
            the current map, as well as the last and upcoming wipe time. Add a
            new server by using the button above.
          </p>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <h4 class="text-center mb-4">Your servers</h4>
      <server-display v-for="server in this.servers" :server="server" :key="server.id" :isActive="server.id == selectedServerIndex"/>
    </div>

    <b-modal id="modal-add-server" title="Add new server">
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
      </b-form>
      <template #modal-footer="{ close }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button variant="light" @click="addServer(); close()">Submit</b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<style>
.modal-header button
{
  color:white;
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
import ServerDisplay from '../components/ServerDisplay.vue';

export default 
{
  name: "Overview",
  components: {ServerDisplay},
  data: function() {
    return {
      serverName: "",
    };
  },
  computed: {
    ...mapGetters(["serverCount"]),
    ...mapState(["servers", "selectedServerIndex"])
  },
  methods: {
    addServer() {
      this.$store.dispatch("addServer", this.serverName);
      this.serverName = "";
    },
  },
};
</script>