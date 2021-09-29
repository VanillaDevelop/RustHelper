<template>
  <div>
    <p v-if="currentServer.mapStatus.status == 4">
      In order to generate a new map, please click
      <a @click.prevent="resetMapRequest()" href="#">here to manually reset the map status</a>
      .
    </p>

    <h5>Add a marker</h5>
    <b-row class="mb-3">
      <b-col cols="12" xl="4" lg="11">
        Shape
        <v-select :options="this.shapes" v-model="selected_shape"></v-select>
      </b-col>
      <b-col cols="12" xl="4" lg="11">
        Color
        <v-select :options="this.colors" v-model="selected_color"></v-select>
      </b-col>
      <b-col cols="12" xl="2" lg="2">
        <b-button variant="primary" @click="createNewShape()" class="mt-4">
          <b-icon-plus-circle-fill />
          Add
        </b-button>
      </b-col>
    </b-row>

    <h5>Server Map</h5>
    <img :src="currentServer.mapStatus.imageUrl" id="mapImage" hidden="true" />
    <canvas id="mapCanvas" width="900" height="900"></canvas>
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

.v-select {
  background-color: rgb(255, 255, 255);
}

#mapImage {
  margin-top: 20px;
  height: 100vh;
  width: 100vw;
  display: block;
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
        canvas: null,
        colors: ['red', 'green', 'yellow', 'white', 'black'],
        shapes: ['triangle', 'diamond', 'circle', 'square'],
        selected_color: 'red',
        selected_shape: 'triangle'
      }
    },
    computed:
    {
      ...mapGetters(["currentServer"]),
    },
    methods:
    {
      createNewShape()
      {
        var settings = {
          top: 100,
          left: 100,
          width: 100,
          height: 100,
          fill: this.selected_color,
          opacity: 0.5,
        }
        var canvobject = null
        switch (this.selected_shape)
        {
          case 'triangle':
            canvobject = new fabric.Triangle(settings);
            break;

          case 'diamond':
            canvobject = new fabric.Polygon([{ x: 0, y: 0 },
            { x: 35, y: 50 },
            { x: 0, y: 100 },
            { x: -35, y: 50 }],
              settings);
            break;

          case 'square':
            canvobject = new fabric.Rect(settings);
            break;

          default:
            settings.radius = 100;
            canvobject = new fabric.Circle(settings);
            break;
        }
        this.canvas.add(canvobject)
      },
      deleteActive(e)
      {
        if (e.keyCode === 46)
        {
          this.canvas.getActiveObjects().forEach((obj) =>
          {
            this.canvas.remove(obj)
          });
          this.canvas.discardActiveObject().renderAll()
        }
      },
    },
    mounted()
    {
      this.canvas = new fabric.Canvas('mapCanvas');
      var img = new fabric.Image(document.getElementById('mapImage'), {
        left: 0,
        top: 0,
        selectable: false
      })
      img.scaleToHeight(900);
      this.canvas.add(img);

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
          this.canvas.add(rect);
          var text = new fabric.Text(monument.monument, {
            top: ((this.currentServer.mapStatus.size) / 2 - monument.y) / this.currentServer.mapStatus.size * 1800 + 10,
            left: monument.x / this.currentServer.mapStatus.size * 1800,
            fontSize: 16,
            fontWeight: 'bold',
            selectable: false
          })
          text.left = text.left - text.width / 2
          this.canvas.add(text)
        }
      })

      window.addEventListener('keydown', this.deleteActive)
    }
  }
</script>