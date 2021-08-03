<template>
  <div class="furnaceDisplay d-block pt-3 pl-2 m-1">
    <furnace-input :selected="this.furnace.selected" :quantities="this.furnace.quantities" />
    <furnace-output
      @fuel="updateFuel"
      @output="updateOutput"
      @outputQty="updateOutputQty"
      :selected="this.furnace.selected"
      :quantities="this.furnace.quantities"
    />
    <furnace-timer
      @timer="setOutputToInput"
      @set_finish_time="setFinishTime"
      :fuel_burned="this.furnace.fuel_burned"
      :finish_time="this.finishTimeDate"
      :active_timer="this.furnace.active_timer"
      :serverId="this.serverId"
      :furnaceId="this.furnaceId"
    />
    <b-button variant="danger" v-b-modal.modal-remove-furnace @click.stop="$emit('set-furnace-delete-id')" class="deleteBtn">
      <b-icon-trash-fill />
    </b-button>
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
    furnace: Object,
    serverId: Number,
  },
  created()
  {
    //if a timer expired offscreen, set the input to the output accordingly
    if(this.furnace.has_resolved == false && this.furnace.finish_time.valueOf() < Date.now().valueOf())
    {
      this.setOutputToInput();
    }
  },
  methods:
  {
    setOutputToInput()
    {
      this.furnace.selected = this.furnace.outputs;
      this.furnace.quantities = this.furnace.output_quantities;
      this.$store.dispatch('set_resolved_state', {serverId: this.serverId, furnaceId: this.furnaceId, has_resolved: true})
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
  },
  computed:
  {
    finishTimeDate()
    {
      if (this.furnace.finish_time instanceof Date)
        return this.furnace.finish_time;
      else
      {
        return new Date(this.furnace.finish_time);
      }
    },
    furnaceId()
    {
      return this.furnace.id;
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

.deleteBtn {
  position: absolute;
  right: 30px;
  bottom: 15px;
}
</style>
