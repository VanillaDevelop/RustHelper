<template>
  <div class="furnaceDisplay d-block pt-3 pl-2">
    <furnace-input @materials="updateMaterials" @quantities="updateQuantities" :selected="this.selected" :quantities="this.quantities" />
    <furnace-output @fuel="updateFuel" @output="updateOutput" @outputQty="updateOutputQty" :selected="this.selected" :quantities="this.quantities" />
    <furnace-timer @timer="setOutputToInput" :fuel_burned="this.fuel_burned" />
  </div>
</template>

<script>
import FurnaceOutput from './FurnaceOutput.vue';
import FurnaceInput from './FurnaceInput.vue';
import FurnaceTimer from './FurnaceTimer.vue';

export default {
  components: { FurnaceOutput, FurnaceInput, FurnaceTimer },
  name: "FurnaceDisplay",
  data: () =>
  {
    return {
      selected: ["", "", "", "", "", ""],
      quantities: [0, 0, 0, 0, 0, 0],
      outputs: ["", "", "", "", "", ""],
      output_quantities: [0, 0, 0, 0, 0, 0],
      fuel_burned: 0,
    };
  },
  methods: {
    setOutputToInput()
    {
      this.selected = this.outputs;
      this.quantities = this.output_quantities;
    },
    updateMaterials(materials)
    {
      this.selected = materials;
    },
    updateOutput(materials)
    {
      this.outputs = materials;
    },
    updateOutputQty(quantities)
    {
      this.output_quantities = quantities;
    },
    updateQuantities(quantities)
    {
      this.quantities = quantities;
    },
    updateFuel(fuel)
    {
      this.fuel_burned = fuel;
    },
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
