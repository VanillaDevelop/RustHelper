<template>
  <b-container>
    <h1 class="text-center">Build Cost Calculator</h1>
    <h4 class="text-center">{{ this.currentServer.name }}</h4>
    <hr />

    <h3>Current Build Costs</h3>
    <div class="border rounded p-2">
      <span v-for="(value, name) in output" :key="name">
        <img :src="require('@/assets/' + name + '.png')" width="40" />
        {{ value }}
      </span>
    </div>
    <h3 class="text-center mt-3">Base Resources</h3>
    <div class="text-center">
      <b-button variant="primary" @click="resetBaseMaterials()">
        <b-icon-x-circle />
        Clear All
      </b-button>
    </div>
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
              <td v-for="n in [0, 1, 2, 3, 4]" :key="n">
                <b-form-input
                  v-model="item[n]"
                  type="number"
                  min="0"
                  step="1"
                  @keypress="(e) => updateInput(e, index, n)"
                  @input="(e) => updateMaxlength(index, n)"
                />
              </td>
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
              <td><img :src="require('@/assets/' + constructions[index]['icon'] + '.png')" width="40" /></td>
              <td><b-form-input v-model="deployables[index]" type="number" min="0" step="1" /></td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
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
        for (let i = 0; i < this.deployables.length; i++)
        {
          if (this.deployables[i] > 0)
          {
            for (let [key, value] of Object.entries(this.constructions[i]["cost"]))
            {
              costs[key] += value * this.deployables[i]
            }
          }
        }

        return costs;
      }
    },
    methods:
    {
      resetBaseMaterials()
      {
        this.items = Array(Object.keys(this.build_mats).length).fill().map(() => Array(5).fill(0));
        this.deployables = Array(this.constructions.length).fill(0);
      },
      updateInput(event)
      {
        if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode !== 8)
        {
          event.preventDefault();
        }
      },
      updateMaxlength(i, j)
      {
        //this doesnt force component updates because 999 value doesn't change for long enough (?) to cause a rerender
        //really annoying bug ngl
        if (this.items[i][j] > 999) 
        {
          let fixRow = [...this.items[i]];
          fixRow.splice(j,1,999)
          this.$set(this.items, i, fixRow);
        }
      }
    },
    mounted: function ()
    {
      this.resetBaseMaterials();
    }
  }
</script>