<template>
  <div class="mt-4">
    <p>
      The map ID ({{ currentServer.mapStatus.mapId }}) for this server has been generated {{ formattedDate }}. Click
      <a @click.prevent="resetMapData()" href="#">here</a>
      to reset all map data related to this server.
    </p>

    <p>
      Currently there is
      <span v-if="currentServer.mapStatus.status < 3">no outgoing request for map data. One will be created soon.</span>
      <span v-else-if="currentServer.mapStatus.status == 3">an outgoing request for map data. Please hold on.</span>
    </p>
    <p v-if="currentServer.mapStatus.lastCreationState != null">
      The last state for this map was <strong>{{currentServer.mapStatus.lastCreationState}}</strong>
    </p>
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
    data: function ()
    {
      return {

      }
    },
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
      },
      updateMapDownloader()
      {
        //send a request to get the map image if none is active
        if (this.currentServer.mapStatus.status < 3)
        {
          this.$store.dispatch('update_map_request')
        }
      }
    },
    created()
    {
      this.interval = setInterval(() => this.updateMapDownloader(), 5000);
    },
    destroyed: function ()
    {
      clearInterval(this.interval);
    }
  }
</script>