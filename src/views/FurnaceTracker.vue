<template>
  <b-container>
    <h1 class="text-center">Furnace Calculator</h1>
    <h4 class="text-center">{{ this.currentServer.name }}</h4>
    <b-row class="mb-3">
      <b-col lg="8" offset-lg="2" class="text-center mb-2">
        <b-button variant="primary" @click="addFurnaceToServer()">
          <b-icon-plus-circle-fill />
          Add new
        </b-button>
      </b-col>
    </b-row>
    <b-row v-for="(furnace, id) in this.currentServer.furnaces" :key="id">
      <b-col offset-xl="3" xl="6" offset-lg="2" lg="8">
        <furnace-display />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import FurnaceDisplay from '../components/FurnaceDisplay.vue';

export default {
  components: { FurnaceDisplay },
  computed:
  {
    ...mapGetters(["currentServer"])
  },
  methods:
  {
    addFurnaceToServer()
    {
      this.$store.dispatch("addFurnaceToServer", this.currentServer.id);
    }
  }
}
</script>