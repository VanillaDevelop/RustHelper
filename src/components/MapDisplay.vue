<template>
  <div id="mapHolder">
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
        <b-button variant="primary" @click="createShapeFromSelection()" class="mt-4">
          <b-icon-plus-circle-fill />
          Add
        </b-button>
      </b-col>
    </b-row>
    <b-button variant="danger" @click="removeAllMarkers()" class="mb-2">
      <b-icon-x-circle-fill />
      Remove all markers
    </b-button>

    <h5>Server Map</h5>
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
        selected_shape: 'triangle',
        previousWidth: 0,
        canvasWidth: 0,
        image: null
      }
    },
    computed:
    {
      ...mapGetters(["currentServer"]),
    },
    methods:
    {
      createShapeFromSelection()
      {
        this.createNewShape(this.selected_shape, this.selected_color, 100, 100, 100, 100, 100, 0, 1, 1);
      },
      createNewShape(shape, color, top, left, width, height, radius, angle, scaleX, scaleY)
      {
        var settings = {
          top: top,
          left: left,
          width: width,
          height: height,
          radius: radius,
          fill: color,
          angle: angle,
          opacity: 0.5,
          scaleX: scaleX,
          scaleY: scaleY
        }
        var canvobject = null
        switch (shape)
        {
          case 'triangle':
            canvobject = new fabric.Triangle(settings);
            break;

          case 'diamond':
          case 'polygon':
            canvobject = new fabric.Polygon([{ x: 0, y: 0 },
            { x: 35, y: 50 },
            { x: 0, y: 100 },
            { x: -35, y: 50 }],
              settings);
            break;

          case 'square':
          case 'rect':
            canvobject = new fabric.Rect(settings);
            break;

          default:
            canvobject = new fabric.Circle(settings);
            break;
        }
        this.canvas.add(canvobject)
        this.updateCustomMapObjects();
      },
      updateMapObjectsMouse()
      {
        this.updateCustomMapObjects()
      },
      removeAllMarkers()
      {
        //update all custom map objects
        this.canvas.getObjects().forEach((obj) =>
        {
          if (obj.selectable) this.canvas.remove(obj)
        });
        this.$store.dispatch('set_custom_map_icons', []);
      },
      resetMapRequest()
      {
        this.$store.dispatch('reset_map_request_status')
      },
      updateCustomMapObjects()
      {
        //update all custom map objects
        var customObjects = []
        this.canvas.getObjects().forEach((obj) =>
        {
          if (obj.selectable) customObjects.push({ width: obj.width, radius: obj.radius, height: obj.height, top: obj.top, left: obj.left, angle: obj.angle, type: obj.type, color: obj.fill, scaleX: obj.scaleX, scaleY: obj.scaleY });
        });
        this.$store.dispatch('set_custom_map_icons', customObjects);
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
          this.updateCustomMapObjects()
        }
      },
      resizeCanvas()
      {
        this.redrawCanvas();
      },
      redrawIcons()
      {
        this.canvas.clear()
        this.canvas.setDimensions({ width: this.canvasWidth, height: this.canvasWidth });

        if (this.image != null) 
        {
          this.image.scaleToHeight(this.canvasWidth)
          this.canvas.add(this.image);
        }
        
        this.currentServer.mapStatus.monuments.forEach(monument =>
        {
          if (!(monument.monument.startsWith("Powerline") || monument.monument.startsWith("Tunnel_Entrance") || monument.monument.startsWith("Iceberg") || monument.monument.startsWith("Power_Substation") ||
            monument.monument.startsWith("Swamp")))
          {
            var rect = new fabric.Circle({
              top: ((this.currentServer.mapStatus.size) / 2 - monument.y) / this.currentServer.mapStatus.size * this.canvasWidth * 2 - 10,
              left: monument.x / this.currentServer.mapStatus.size * this.canvasWidth * 2 - 10,
              radius: 10,
              fill: 'red',
              opacity: 0.5,
              selectable: false
            });
            this.canvas.add(rect);
            var text = new fabric.Text(monument.monument, {
              top: ((this.currentServer.mapStatus.size) / 2 - monument.y) / this.currentServer.mapStatus.size * this.canvasWidth * 2 + 10,
              left: monument.x / this.currentServer.mapStatus.size * this.canvasWidth * 2,
              fontSize: 16,
              fontWeight: 'bold',
              selectable: false
            })
            text.left = text.left - text.width / 2
            this.canvas.add(text)
          }
        })

        this.currentServer.customMapIcons.forEach(icon =>
        {
          this.createNewShape(icon.type, icon.color, icon.top, icon.left, icon.width, icon.height, icon.radius, icon.angle, icon.scaleX, icon.scaleY)
        })
      },
      redrawCanvas()
      {
        this.canvasWidth = document.getElementById('mapHolder').clientWidth;

        if (this.canvas == null)
          this.canvas = new fabric.Canvas('mapCanvas');
        if (this.image == null)
        {
          new fabric.Image.fromURL(this.currentServer.mapStatus.imageUrl, image =>
          {
            this.image = image;
            this.image.scaleToHeight(this.canvasWidth)
            this.canvas.add(this.image)
            this.canvas.sendToBack(this.image)
          }, {
            left: 0,
            top: 0,
            selectable: false
          })
        }
        this.redrawIcons()
      }
    },
    mounted()
    {
      this.redrawCanvas();
      window.addEventListener('keydown', this.deleteActive)
      window.addEventListener('mouseup', this.updateMapObjectsMouse)
      window.addEventListener('resize', this.resizeCanvas)
    },
  }
</script>