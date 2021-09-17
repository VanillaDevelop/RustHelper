<template>
  <div class="mt-4">
    <b-form-group label="Map Size">
      <b-input v-model="mapSize" />
    </b-form-group>
    <b-form-group label="Map Seed">
      <b-input v-model="mapSeed" />
    </b-form-group>
    <b-button variant="primary" @click="sendMapRequest()">Generate Map Image</b-button>
  </div>
</template>

<style scoped>
a {
  color: white !important;
  text-decoration: underline;
}
</style>

<script>
import { mapState } from 'vuex';
export default
  {
    data: function ()
    {
      return {
        mapSize: '',
        mapSeed: '',
      }
    },
    computed: 
    {
      ...mapState["selectedServerIndex"]
    },
    methods:
    {
      sendMapRequest()
      {
        this.keyError = false;
        this.$store.dispatch('process_map_request', {mapSize: this.mapSize, mapSeed: this.mapSeed, serverId: this.selectedServerIndex});
        this.$emit('stored');
      }
    }
  }
</script>