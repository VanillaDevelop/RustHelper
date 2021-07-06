<template>
  <b-container>
    <h1 class="text-center">Furnace Tracker</h1>
    <h4 class="text-center">{{this.currentServerName}}</h4>
    <b-row>
        <b-col>
            <furnace-display />
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import FurnaceDisplay from '../components/FurnaceDisplay.vue';

export default {
  components: { FurnaceDisplay },
    computed:
    {
        ...mapGetters(["currentServerName"])
    }
}
</script>