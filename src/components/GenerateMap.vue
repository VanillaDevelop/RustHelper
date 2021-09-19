<template>
  <div>
    <p>
      Your RustMaps.com API Key is already set. You may change it by clicking
      <a v-b-modal.modal-change-api-key>here</a>
      .
    </p>
    <div v-if="currentServer.mapStatus.status == 0">
      <b-alert show variant="warning">
        No map is associated with this server yet. To generate a map, you must enter the associated map size and seed. You can find these through
        services like
        <a target="_blank" href="https://playrust.io">playrust.io</a>
        ,
        <a target="_blank" href="https://just-wiped.net">just-wiped.net</a>
        or
        <a target="_blank" href="https://rustmaps.com">rustmaps.com</a>
      </b-alert>
      <enter-map-data />
    </div>
    <div v-else-if="currentServer.mapStatus.status != 3">
      <map-downloader />
    </div>

    <b-modal id="modal-change-api-key" title="Change RustMaps.com API Key" :hide-footer="true">
      <enter-rust-maps-key @stored="closeModal()" />
    </b-modal>
  </div>
</template>

<style scoped>
a {
  text-decoration: underline !important;
}

.alert a {
  color: #856404 !important;
}
</style>

<script>
import { mapGetters } from 'vuex';
import EnterMapData from './EnterMapData.vue';
import EnterRustMapsKey from './EnterRustMapsKey.vue'
import MapDownloader from './MapDownloader.vue';
export default {
  components: { EnterRustMapsKey, EnterMapData, MapDownloader },
  computed: {
    ...mapGetters(["currentServer"])
  },
  methods:
  {
    closeModal()
    {
      this.$bvModal.hide('modal-change-api-key');
    }
  }

}
</script>