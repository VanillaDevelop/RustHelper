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
        <b-button variant="primary" @click="addDeployableToCart()" class="mt-2">
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
              <th style="width: 50px">Amount</th>
              <th style="width: 50px">Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in shopping_cart" :key="item.name + ' - ' + item.tier">
              <td>{{ item.name }} - {{ item.tier }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-center">
                <b-button variant="danger" size="sm" @click="removeItem(item)">
                  <b-icon-trash-fill />
                </b-button>
              </td>
            </tr>
            <tr v-for="item in shopping_cart_deployable" :key="item.name">
              <td>
                {{ item.name }}
              </td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-center">
                <b-button variant="danger" size="sm" @click="removeDeployable(item)">
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

.vs__dropdown-toggle {
  height: 38px;
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
export default
  {
    data: function ()
    {
      return {
        material_qty: 0,
        deployable_qty: 0,
        selected_material: null,
        selected_tier: "",
        selected_deployable: null
      }
    },
    computed:
    {
      ...mapGetters(["currentServer"]),
      ...mapState(["build_mats", "constructions"]),
      shopping_cart()
      {
        return this.currentServer.shopping_cart;
      },
      shopping_cart_deployable()
      {
        return this.currentServer.shopping_cart_deployable;
      },
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
            costs[cost] += item.costs[cost] * item.quantity;
          }
        });

        this.shopping_cart_deployable.forEach(item => 
        {
          for (let cost in item.costs)
          {
            costs[cost] += item.costs[cost] * item.quantity;
          }
        })

        return costs;
      }
    },
    methods:
    {
      resetBaseMaterials()
      {
          this.$store.dispatch("reset_server_items");
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
        if (this.selected_material == null || this.selected_tier === "" || this.material_qty == 0) return;

        this.selected_material.tier = this.selected_tier
        this.selected_material.quantity = this.material_qty
        this.$store.dispatch("add_item_to_server", this.selected_material);     

        this.selected_material = null;
        this.selected_tier = "";
        this.material_qty = 0;
      },
      addDeployableToCart()
      {
        if (this.selected_deployable == null || this.deployable_qty == 0) return;

        this.selected_deployable.quantity = this.deployable_qty
        this.$store.dispatch("add_deployable_to_server", this.selected_deployable);     

        this.selected_deployable = null;
        this.deployable_qty = 0;
      },
      removeItem(item)
      {
        this.$store.dispatch("remove_item", item)
      },
      removeDeployable(item)
      {
        this.$store.dispatch("remove_deployable", item)
      }
    },
  }
</script>