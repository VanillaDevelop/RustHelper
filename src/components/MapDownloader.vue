<template>
  <div class="mt-4">
      <p>The map ID ({{ currentServer.mapStatus.mapId }}) for this server has been generated {{formattedDate}}. Click <a @click.prevent="resetMapData()" href="#">here</a> to reset all map data related to this server.</p>
  </div>
</template>

<style scoped>
a {
  color: white !important;
  text-decoration: underline;
}
</style>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default
  {
    computed:
    {
      ...mapGetters(["currentServer"]),
      formattedDate()
      {
        return moment(this.currentServer.mapStatus.timestamp).fromNow();
      }
    },
    methods:
    {
      resetMapData()
      {
        this.$store.dispatch('reset_map_status')
      }
    }
  }
</script>