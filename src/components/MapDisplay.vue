<template>
  <div class="mt-4">
    <img id="mapImage" :src="currentServer.mapStatus.imageUrl" />
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

#mapImage {
    width:100%;
    height: 100%;
    margin-top:20px;
}
</style>

<script>
import { mapGetters } from 'vuex';
import * as markerjs2 from 'markerjs2';

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
    },
    methods:
    {

    },
    mounted()
    {
        let markerArea = new markerjs2.MarkerArea(document.getElementById('mapImage'))
        markerArea.show();
    }
  }
</script>