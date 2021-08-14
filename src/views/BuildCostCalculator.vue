<template>
  <b-container>
    <h1 class="text-center">Build Cost Calculator</h1>
    <h4 class="text-center">{{ this.currentServer.name }}</h4>
    <b-row>
      <b-col cols="12" lg="8">
        <table class="table table-light table-striped">
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
      <b-col cols="12" lg="4">
        <table class="table table-light table-striped"></table>
      </b-col>
    </b-row>
  </b-container>
</template>

<style>
.modal-header button {
  color: white;
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
export default
  {
    data: function ()
    {
      return {
        //placeholder array because the real array can only be computed once computed properties are available
        items: [0]
      }
    },
    computed:
    {
      ...mapGetters(["currentServer"]),
      ...mapState(["build_mats"])
    },
    mounted: function ()
    {
      this.items = Array(Object.keys(this.build_mats).length).fill().map(() => Array(5).fill(0))
    }
  }
</script>