<template>
  <div class="mt-4">
    <canvas id="mapCanvas" width="500" height="500"></canvas>
    <img :src="currentServer.mapStatus.imageUrl" id="mapImage" hidden="true">
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
      img.scaleToHeight(500);
      canvas.add(img);

      this.currentServer.mapStatus.monuments.forEach(monument =>
      {
        if (!(monument.monument.startsWith("Powerline") || monument.monument.startsWith("Tunnel_Entrance") || monument.monument.startsWith("Iceberg") || monument.monument.startsWith("Power_Substation") ||
          monument.monument.startsWith("Swamp")))
        {
          var rect = new fabric.Rect({
            top: ((this.currentServer.mapStatus.size)/2 - monument.y) / this.currentServer.mapStatus.size * 1000 - 5,
            left: monument.x / this.currentServer.mapStatus.size * 1000 - 5,
            width: 10,
            height: 10,
            fill: 'red'
          });
          console.log(rect.top + " - " + rect.left)
          canvas.add(rect);
        }
      })
    }
  }
</script>