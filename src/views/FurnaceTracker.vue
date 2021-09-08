<template>
  <b-container>
    <h1 class="text-center">Furnace Calculator</h1>
    <h4 class="text-center">{{ this.currentServer.name }}</h4>
    <hr />
    <b-row class="mb-3">
      <b-col lg="8" offset-lg="2" class="text-center mb-2">
        <b-button variant="primary" @click="addFurnaceToServer()">
          <b-icon-plus-circle-fill />
          Add new
        </b-button>
      </b-col>
    </b-row>
    <b-row v-for="furnace in this.currentServer.furnaces" :key="furnace.id">
      <b-col offset-xl="3" xl="6" offset-lg="2" lg="8">
        <furnace-display :furnace="furnace" :serverId="currentServer.id" @set-furnace-delete-id="furnaceDeletionId = furnace.id" />
      </b-col>
    </b-row>
    <b-modal id="modal-remove-furnace" title="Remove Furnace">
      <p>Are you sure you wish to delete this furnace? This action cannot be undone.</p>
      <template #modal-footer="{ close }">
        <b-button
          variant="light"
          @click="
            deleteFurnace();
            close();
          "
        >
          Delete
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<style>
.modal-header button {
  color: white;
}
</style>

<script>
import { mapGetters } from "vuex";
import FurnaceDisplay from '../components/FurnaceDisplay.vue';

export default {
  components: { FurnaceDisplay },
  data: function ()
  {
    return {
      furnaceDeletionId: -1,
    }
  },
  computed:
  {
    ...mapGetters(["currentServer"])
  },
  methods:
  {
    addFurnaceToServer()
    {
      this.$store.dispatch("addFurnaceToServer");
    },
    deleteFurnace()
    {
      this.$store.dispatch("deleteFurnace", {furnaceId: this.furnaceDeletionId});
      this.furnaceDeletionId = -1;
    }
  }
}
</script>