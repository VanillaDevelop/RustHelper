<template>
  <div class="mt-4">
      <p>The map ID ({{this.currentServer.mapStatus.mapId}} for this server has been generated at {{this.currentServer.mapStatus.timestamp}}</p>
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
export default
  {
    computed: 
    {
      ...mapGetters["currentServer"]
    }
  }
</script>