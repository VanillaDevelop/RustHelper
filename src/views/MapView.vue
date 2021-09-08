<template>
  <b-container>
    <h1 class="text-center">Map View</h1>
    <h4 class="text-center">{{ currentServerName }}</h4>
    <hr />
    <div v-if="rustMapsApiKey == ''">
      <h3 class="text-center">Enter RustMaps API Key</h3>
      <b-row>
        <b-col class="text-justify" lg="8" offset-lg="2">
          The Rust Helper Map View is currently powered by the RustMaps.com API. Because the Rust Helper is a local application with no server
          infrastructure, you will need to use your own API key in order to generate maps. Your API key will be stored in local storage and is not
          communicated to any external server other than the RustMaps API calls themselves. To find your API Key, log in at
          <a href="https://rustmaps.com/user/profile" target="_blank">RustMaps.com</a>
          using your steam account and copy your API key into the field below. RustMaps is providing an exceptional service free of charge and with a
          comprehensive API, so consider
          <a href="https://www.buymeacoffee.com/hoppel" target="_blank">supporting them</a>
          if you use this feature a lot.

          <enter-rust-maps-key v-if="rustMapsApiKey == ''" />
        </b-col>
      </b-row>
    </div>
    <generate-map v-else />
  </b-container>
</template>

<style>
h4 {
  margin-bottom: 10px;
}
</style>

<script>
import { mapGetters, mapState } from 'vuex';
import EnterRustMapsKey from '../components/EnterRustMapsKey.vue';
import GenerateMap from '../components/GenerateMap.vue';

export default
  {
    components: { EnterRustMapsKey, GenerateMap },
    computed:
    {
      ...mapGetters(["currentServerName"]),
      ...mapState(["rustMapsApiKey"])
    },
  }
</script>