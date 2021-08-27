<template>
  <div>
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
  </div>
</template>

<style scoped>
.v-select {
  background-color: rgb(255, 255, 255);
}

.vs__dropdown-toggle {
  height: 38px;
}
</style>

<script>

import { mapState } from "vuex";
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
      ...mapState(["build_mats", "constructions"]),
    },
    methods:
    {
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
    },
  }
</script>
