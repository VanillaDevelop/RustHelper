<template>
  <div>
    <p v-if="currentServer.mapStatus.status == 4">
      In order to generate a new map, please click
      <a @click.prevent="resetMapRequest()" href="#">here to manually reset the map status</a>
      .
    </p>
    <canvas id="mapCanvas" width="900" height="900"></canvas>
    <img :src="currentServer.mapStatus.imageUrl" id="mapImage" hidden="true" />
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
  margin-top: 20px;
}
</style>

<script>
import { mapGetters } from 'vuex';
import { fabric } from 'fabric';

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
      var canvas = new fabric.Canvas('mapCanvas');
      var img = new fabric.Image(document.getElementById('mapImage'), {
        left: 0,
        top: 0,
        selectable: false
      })
      img.scaleToHeight(900);
      canvas.add(img);

      this.currentServer.mapStatus.monuments.forEach(monument =>
      {
        if (!(monument.monument.startsWith("Powerline") || monument.monument.startsWith("Tunnel_Entrance") || monument.monument.startsWith("Iceberg") || monument.monument.startsWith("Power_Substation") ||
          monument.monument.startsWith("Swamp")))
        {
          var rect = new fabric.Circle({
            top: ((this.currentServer.mapStatus.size) / 2 - monument.y) / this.currentServer.mapStatus.size * 1800 - 10,
            left: monument.x / this.currentServer.mapStatus.size * 1800 - 10,
            radius: 10,
            fill: 'red',
            opacity: 0.5,
            selectable: false
          });
          canvas.add(rect);
          var text = new fabric.Text(monument.monument, {
            top: ((this.currentServer.mapStatus.size) / 2 - monument.y) / this.currentServer.mapStatus.size * 1800 + 10,
            left: monument.x / this.currentServer.mapStatus.size * 1800,
            fontSize: 16,
            fontWeight: 'bold',
            selectable: false
          })
          text.left = text.left - text.width/2
          canvas.add(text)
        }
      })
    }
  }
</script>