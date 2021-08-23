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
            <v-select :options="this.build_mats" label="name" v-model="selected_material"></v-select>
          </b-col>
          <b-col cols="12" xl="4" lg="6">
            Tier
            <v-select :options="['Twig', 'Wood', 'Stone', 'Metal', 'HQM']" v-model="selected_tier"></v-select>
          </b-col>
          <b-col cols="12" xl="2" lg="6">
            Quantity
            <br />
            <b-input @change="updateMaterialMaxLength" @keypress="updateInput" v-model="material_qty" />
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
            <v-select :options="this.constructions" label="name" v-model="selected_deployable"></v-select>
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
          <tbody>
            <tr v-for="item in shopping_cart" :key="item.name + ' - ' + item.tier">
              <td>
                {{ item.name }}
                <span v-if="item.tier != ''">- {{ item.tier }}</span>
              </td>
              <td>{{ item.quantity }}</td>
              <td>
                <b-button variant="danger">
                  <b-icon-trash-fill />
                </b-button>
              </td>
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

        this.shopping_cart.forEach(item => 
        {
          for (let cost in item.costs)
          {
            costs[cost] += item.costs[cost];
          }
        })

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
          let index = this.shopping_cart.indexOf(entry)
          entry.quantity += parseInt(this.material_qty);
          this.$set(this.shopping_cart, index, entry);
        }
        else
        {
          let cost = {};
          if (this.selected_tier == "Twig")
            cost["wood"] = Math.ceil(this.selected_material.base_cost / 4)
          else if (this.selected_tier == "Wood")
            cost["wood"] = parseInt(this.selected_material.base_cost);
          else if (this.selected_tier == "Stone")
            cost["stone"] = this.selected_material.base_cost * 1.5;
          else if (this.selected_tier == "Metal")
            cost["mfrags"] = parseInt(this.selected_material.base_cost);
          else if (this.selected_tier == "HQM")
            cost["hqm"] = Math.ceil(this.selected_material.base_cost / 8);


          this.shopping_cart.push({
            name: this.selected_material.name,
            tier: this.selected_tier,
            quantity: parseInt(this.material_qty),
            costs: cost
          })
        }
      }
    },
  }
</script>