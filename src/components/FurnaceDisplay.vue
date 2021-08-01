<template>
  <div class="furnaceDisplay d-block pt-3 pl-2 m-1">
    <furnace-input :selected="this.furnace.selected" :quantities="this.furnace.quantities" />
    <furnace-output @fuel="updateFuel" @output="updateOutput" @outputQty="updateOutputQty" :selected="this.furnace.selected" :quantities="this.furnace.quantities" />
    <furnace-timer @timer="setOutputToInput" @set_finish_time="setFinishTime" :fuel_burned="this.furnace.fuel_burned" :finish_time="this.furnace.finish_time"/>
  </div>
</template>

<script>
import FurnaceOutput from './FurnaceOutput.vue';
import FurnaceInput from './FurnaceInput.vue';
import FurnaceTimer from './FurnaceTimer.vue';

export default {
  components: { FurnaceOutput, FurnaceInput, FurnaceTimer },
  name: "FurnaceDisplay",
  props:
  {
    furnace: Object
  },
  methods: 
  {
    setOutputToInput()
    {
      this.furnace.selected = this.furnace.outputs;
      this.furnace.quantities = this.furnace.output_quantities;
    },
    updateOutput(materials)
    {
      this.furnace.outputs = materials;
    },
    updateOutputQty(quantities)
    {
      this.furnace.output_quantities = quantities;
    },
    updateFuel(fuel)
    {
      this.furnace.fuel_burned = fuel;
    },
    setFinishTime(finish_time)
    {
      this.furnace.finish_time = finish_time;
    }
  }
};
</script>

<style scoped>
.furnaceDisplay {
  background-color: rgba(255, 0, 0, 0.452);
  border-radius: 10px;
  border: 1px solid rgb(194, 0, 0);
  align-items: center;
  padding-left: 5px;
  padding-bottom: 15px;
  display: flex;
}
</style>
