<template>
  <b-container>
    <h1 class="text-center">Map View</h1>
    <h4 class="text-center">{{ currentServerName }}</h4>
    <hr />
    <enter-rust-maps-key v-if="rustMapsApiKey == ''" />
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

export default
  {
    components: { EnterRustMapsKey },
    computed:
    {
      ...mapGetters(["currentServerName"]),
      ...mapState(["rustMapsApiKey"])
    },
  }
</script>