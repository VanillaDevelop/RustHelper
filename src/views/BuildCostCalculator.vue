<template>
  <b-container>
    <h1 class="text-center">Build Cost Calculator</h1>
    <h4 class="text-center">{{ this.currentServer.name }}</h4>
    <b-row>
      <b-col cols="12" xl="8">
        <h4>Base Construction</h4>
        <table id="table-baseconstructions" class="table table-light table-striped">
          <thead class="thead-dark">
            <tr>
              <th>Item</th>
              <th>Twig</th>
              <th>Wood</th>
              <th>Stone</th>
              <th>Metal</th>
              <th>HQM</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ build_mats[index][0] }}</td>
              <td><b-form-input v-model="item[0]" type="number" min="0" step="1" /></td>
              <td><b-form-input v-model="item[1]" type="number" min="0" step="1" /></td>
              <td><b-form-input v-model="item[2]" type="number" min="0" step="1" /></td>
              <td><b-form-input v-model="item[3]" type="number" min="0" step="1" /></td>
              <td><b-form-input v-model="item[4]" type="number" min="0" step="1" /></td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col cols="12" xl="4">
        <h4>Deployables</h4>
        <table class="table table-light table-striped">
          <thead class="thead-dark">
            <tr>
              <th>Item</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in deployables" :key="index">
              <td>{{ constructions[index]["name"] }}</td>
              <td><b-form-input v-model="deployables[index]" type="number" min="0" step="1" /></td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <h3>Build Costs</h3>
    <div v-for="item in output" :key="item[0]">
      {{item}}
    </div>
  </b-container>
</template>

<style>
h4 {
  margin-bottom: 10px;
}

#table-baseconstructions {
  min-width: 690px !important;
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
export default
  {
    data: function ()
    {
      return {
        //placeholder arrays because the real array can only be computed once computed properties are available
        items: [0],
        deployables: [0],
      }
    },
    computed:
    {
      ...mapGetters(["currentServer"]),
      ...mapState(["build_mats", "constructions"]),
      output()
      {
        let costs =
        {
          "wood": 0,
          "stone": 0,
          "mfrags": 0,
          "hqm": 0
        }

        //this prevents errors in indexing before mounted is run
        if (this.items.length == 1)
          return costs;

        for (let i = 0; i < this.items.length; i++)
        {
          costs["wood"] += Math.ceil(this.items[i][0] * this.build_mats[i][1] / 4);
          costs["wood"] += this.items[i][1] * this.build_mats[i][1];
          costs["stone"] += this.items[i][2] * this.build_mats[i][1] * 1.5;
          costs["mfrags"] += this.items[i][3] * this.build_mats[i][1];
          costs["hqm"] += Math.ceil(this.items[i][4] * this.build_mats[i][1] / 8);
        }
        return costs;
      }
    },
    mounted: function ()
    {
      this.items = Array(Object.keys(this.build_mats).length).fill().map(() => Array(5).fill(0))
      this.deployables = Array(this.constructions.length).fill(0);
    }
  }
</script>