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
      The last state for this map was
      <strong>{{ currentServer.mapStatus.lastCreationState }}</strong>
    </p>

    <b-alert show variant="warning" v-if="currentServer.mapStatus.status == 3 && dateDiffGreaterTenSeconds">
      The last outgoing request for map data happened longer than 10 seconds ago without a recorded response. You may
      <a @click.prevent="resetMapRequest()" href="#">manually reset the map status</a>
      to start a new request for map data, or choose to wait for a response.
    </b-alert>
  </div>
</template>

<style scoped>
a {
  color: white !important;
  text-decoration: underline;
}

.alert a {
  color: #856404 !important;
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
        now: Date.now(),
      }
    },
    computed:
    {
      ...mapGetters(["currentServer"]),
      formattedDate()
      {
        return moment(this.currentServer.mapStatus.timestamp).fromNow();
      },
      dateDiffGreaterTenSeconds()
      {
        return (this.now - this.currentServer.mapStatus.timestamp) / 1000 > 10
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
      },
      resetMapRequest()
      {
        this.$store.dispatch('reset_map_request_status')
      }
    },
    created()
    {
      var self = this

      this.interval = setInterval(() => this.updateMapDownloader(), 5000);
      setInterval(function ()
      {
        self.now = Date.now()
      }, 1000)
    },
    destroyed: function ()
    {
      clearInterval(this.interval);
    }
  }
</script>