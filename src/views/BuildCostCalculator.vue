<template>
  <b-container>
    <h1 class="text-center">Build Cost Calculator</h1>
    <h4 class="text-center">{{ this.currentServer.name }}</h4>
    <div>
      <table class="table">
        <thead>
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
            <td>{{build_mats[index][0]}}</td>
            <td>{{item[0]}}</td>
            <td>{{item[1]}}</td>
            <td>{{item[2]}}</td>
            <td>{{item[3]}}</td>
            <td>{{item[4]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
    mounted: function () {
        this.items = Array(Object.keys(this.build_mats).length).fill().map(() => Array(5).fill(0))
    }
  }
</script>