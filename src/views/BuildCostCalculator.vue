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
    <b-button variant="primary" @click="resetBaseMaterials()" class="mt-2">
      <b-icon-x-circle-fill />
      Clear All
    </b-button>

    <b-row>
      <b-col cols="12" xl="7">
        <h4 class="mt-4">Add Materials</h4>
        <b-row>
          <b-col cols="12" xl="6" lg="12">
            Item
            <v-select :options="this.build_mats" label="name" :model="this.selected_material"></v-select>
          </b-col>
          <b-col cols="12" xl="4" lg="6">
            Tier
            <v-select :options="['Twig', 'Wood', 'Stone', 'Metal', 'HQM']" :model="this.selected_tier"></v-select>
          </b-col>
          <b-col cols="12" xl="2" lg="6">
            Quantity
            <br />
            <b-input @change="updateMaterialMaxLength" @keypress="updateInput" :model="material_qty" />
          </b-col>
        </b-row>
        <b-button variant="primary" @click="addMaterialToCart()" class="mt-2">
          <b-icon-plus-circle-fill />
          Add to Resources
        </b-button>

        <h4 class="mt-4">Add Tools and Deployables</h4>
        <b-row>
          <b-col cols="12" md="6">
            Item
            <v-select :options="this.constructions" label="name" v-model="this.selected_deployable"></v-select>
          </b-col>
          <b-col cols="12" md="6">
            Quantity
            <br />
            <b-input @change="updateDeployableMaxLength" @keypress="updateInput" v-model="deployable_qty" />
          </b-col>
        </b-row>
        <b-button variant="primary" @click="addMaterialToCart()" class="mt-2">
          <b-icon-plus-circle-fill />
          Add to Resources
        </b-button>
      </b-col>
      <b-col cols="12" xl="5">
        <h4 class="mt-4">Resource List</h4>
        <table class="table table-light table-striped">
          <thead class="thead-dark">
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<style>
h4 {
  margin-bottom: 10px;
}

.v-select {
  background-color: rgb(255, 255, 255);
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
export default
  {
    data: function ()
    {
      return {
        shopping_cart: [],
        material_qty: 0,
        deployable_qty: 0,
        selected_material: null,
        selected_tier: "",
        selected_deployable: ""
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

        /*for (let i = 0; i < this.shopping_cart.length; i++)
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
        }*/

        return costs;
      }
    },
    methods:
    {
      resetBaseMaterials()
      {
        this.shopping_cart = [];
      },
      updateInput(event)
      {
        if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode !== 8)
        {
          event.preventDefault();
        }
      },
      updateDeployableMaxLength()
      {
        if (this.deployable_qty > 999)
        {
          this.deployable_qty = 999;
        }
      },
      updateMaterialMaxLength()
      {
        if (this.material_qty > 999)
        {
          this.material_qty = 999;
        }
      },
      addMaterialToCart()
      {
        if (this.selected_material.name === "" || this.selected_tier === "" || this.material_qty == 0) return;

        let entry = this.shopping_cart.find(element => element.name == this.selected_material.name && element.tier == this.selected_tier)
        if (entry != null)
        {
          entry.quantity += this.material_qty;
        }
        else
        {
          let cost = {};
          if (this.selected_tier == "Twig")
            cost["wood"] = Math.ceil(this.selected_material.base_cost / 4)
          else if (this.selected_tier == "Wood")
            cost["wood"] = this.selected_material.base_cost;
          else if (this.selected_tier == "Stone")
            cost["stone"] = this.selected_material.base_cost * 1.5;
          else if (this.selected_tier == "Metal")
            cost["mfrags"] = this.selected_material.base_cost;
          else if (this.selected_tier == "HQM")
            cost["hqm"] = Math.ceil(this.selected_material.base_cost / 8);


          this.shopping_cart.push({
            name: this.selected_material,
            tier: this.selected_tier,
            quantity: this.material_qty,
            costs: cost
          })
        }
      }
    },
    mounted: function ()
    {
      this.resetBaseMaterials();
    },
  }
</script>