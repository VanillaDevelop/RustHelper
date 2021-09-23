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
  margin-top: 20px;
}
</style>

<script>
import { mapGetters } from 'vuex';
import * as mjslive from 'markerjs-live';

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
      let config_markers = [];
      this.currentServer.mapStatus.monuments.forEach(monument => {
        if(!(monument.monument.startsWith("Powerline") || monument.monument.startsWith("Tunnel_Entrance") || monument.monument.startsWith("Iceberg") || monument.monument.startsWith("Power_Substation") ||
                monument.monument.startsWith("Swamp")))
        {
          config_markers.push(
            {
                  fillColor: "transparent",
                  strokeColor: "#FFFF00",
                  strokeWidth: 3,
                  strokeDasharray: "3",
                  opacity: 1,
                  left: monument.x - 25,
                  top: (this.currentServer.mapStatus.size)/2 - monument.y - 25,
                  width: 50,
                  height: 50,
                  rotationAngle: 0,
                  visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                  containerTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                  typeName: "EllipseFrameMarker",
                  state: "select"
            }
          )
        }
      })

      let config = {
        width: this.currentServer.mapStatus.size/2,
        height: this.currentServer.mapStatus.size/2,
        markers: config_markers
      }
      let target = document.getElementById('mapImage');
      let markerView = new mjslive.MarkerView(target);
      markerView.show(config);
    }
  }
</script>