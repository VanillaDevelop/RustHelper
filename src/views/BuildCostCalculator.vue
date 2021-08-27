<template>
  <b-container>
    <h1 class="text-center">Build Cost Calculator</h1>
    <h4 class="text-center">{{ this.currentServerName }}</h4>
    <hr />

    <base-costs />
    <b-button variant="primary" @click="resetBaseMaterials()" class="mt-2">
      <b-icon-x-circle-fill />
      Clear All
    </b-button>

    <b-row>
      <b-col cols="12" xl="7">
        <add-base-materials />
      </b-col>
      <b-col cols="12" xl="5">
        <base-resource-list />
      </b-col>
    </b-row>
  </b-container>
</template>

<style>
h4 {
  margin-bottom: 10px;
}
</style>

<script>
import { mapGetters } from "vuex";
import AddBaseMaterials from '../components/AddBaseMaterials.vue';
import BaseCosts from '../components/BaseCosts.vue';
import BaseResourceList from '../components/BaseResourceList.vue';
export default
  {
    components: { BaseCosts, AddBaseMaterials, BaseResourceList },
    computed:
    {
      ...mapGetters(["currentServerName"]),
    },
    methods:
    {
      resetBaseMaterials()
      {
        this.$store.dispatch("reset_server_items");
      }
    },
  }
</script>