<template>
  <b-row class="mb-3">
    <b-col offset-lg="3" lg="6">
      <div class="furnaceDisplay d-block pt-3">
        <div class="w-100 d-flex">
          <span v-for="n in 6" :key="n">
            <div class="mx-1">
              <b-dropdown
                id="dropdown-1"
                class="m-md-2"
                style="width: 80px; height: 40px"
                variant="light"
              >
                <template slot="button-content">
                  <span v-if="selected[n - 1] == ''"> </span>
                  <span v-else>
                    <img
                      :src="require('@/assets/' + selected[n - 1] + '.png')"
                      width="30"
                    />
                  </span>
                </template>
                <b-dropdown-item :key="''" @click="updateMaterial(n - 1, '')"
                  >None</b-dropdown-item
                >
                <b-dropdown-item
                  v-for="material in materials"
                  :key="material"
                  @click="updateMaterial(n - 1, material)"
                  ><img
                    :src="require('@/assets/' + material + '.png')"
                    width="40"
                /></b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="mx-1 mt-1">
              <b-form-input
                placeholder="Qty."
                style="width: 80px"
                v-model="quantities[n - 1]"
                :number="true"
                type="number"
                min="0"
                max="1000"
                step="1"
                @change="fixQty(n - 1)"
              />
            </div>
          </span>
        </div>
        <div class="d-block mt-3 mx-1">
          <div v-if="result_type == ''">Waiting for input...</div>
          <div v-else>
            <div>
              <span v-for="(mat, idx) in output" :key="idx">
                <span v-if="mat != ''">
                  <img :src="require('@/assets/' + mat + '.png')" width="30" />
                  {{ output_quantities[idx] }}
                </span>
              </span>
            </div>
            <div>Output is reached after {{ furnaceTime }}</div>
            <div
              class="alert alert-warning mt-2"
              v-if="result_type == 'failure'"
            >
              <strong>Warning: </strong>{{ result }}
            </div>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "FurnaceDisplay",
  data: () => {
    return {
      materials: [
        "wood",
        "metal",
        "sulfur",
        "hqm",
        "charcoal",
        "mfrags",
        "sfrags",
        "hqmfrags",
      ],
      transformations: {
        'wood': "charcoal",
        'metal': "mfrags",
        'sulfur': "sfrags",
        'hqm': "hqmfrags",
      },
      reverse_transformations: {
        'charcoal': "wood",
        'mfrags': "metal",
        'sfrags': "sulfur",
        'hqmfrags': "hqm",
      },
      //wood cost to transform a source material into its byproduct
      woodCost: {
        wood: 4 / 3,
        metal: 5,
        sulfur: 2.5,
        hqm: 10,
      },
      selected: ["", "", "", "", "", ""],
      quantities: [0, 0, 0, 0, 0, 0],
      output: ["", "", "", "", "", ""],
      output_quantities: [0, 0, 0, 0, 0, 0],
      result: "",
      fuelBurned: 0,
      result_type: "",
    };
  },
  methods: {
    updateMaterial(idx, material) {
      this.$set(this.selected, idx, material);
      if(material == '') this.$set(this.quantities, idx, 0);
      this.processFurnace();
    },
    fixQty(idx) {
      if (this.quantities[idx] > 1000) {
        this.$set(this.quantities, idx, 1000);
      } else if (this.quantities[idx] < 0) {
        this.$set(this.quantities, idx, 0);
      }

      if(this.selected[idx] == '') this.$set(this.quantities, idx, 0);

      this.$set(this.quantities, idx, Math.trunc(this.quantities[idx]));
      this.processFurnace();
    },
    processFurnace() {
      let [output, output_qty, fuel_burned, result_type] =
        this.calculateFurnaceBreakpoint(this.selected, this.quantities, 0);

      this.output_quantities = [...output_qty];
      this.output = [...output];
      this.result_type = result_type;
      this.fuelBurned = fuel_burned;
    },
    //recursive method which for a given furnace input and quantity, outputs the furnace output and output quantities of the next breakpoint
    calculateFurnaceBreakpoint(inputs, quantities, fuel_burned) {
      let result_type = "success";

      //copy the arrays
      let outputs = [...inputs];
      let output_qty = [...quantities];

      //holds the minimum quantity to reduce
      let distributeQty = {
        wood: 1001,
        metal: 1001,
        sulfur: 1001,
        hqm: 1001,
      };

      //holds the speed multiplier (i.e. how many stacks of each input material there are)
      //for example, if metal is in 2 slots, it will generate output materials twice as fast
      let distributeMultiplier = {
        wood: 0,
        metal: 0,
        sulfur: 0,
        hqm: 0,
      };

      //holds the output slot for given input material
      let outputSlots = {
        wood: -1,
        metal: -1,
        sulfur: -1,
        hqm: -1,
      };

      //remove all values which have 0 as a quantity
      for(let i = 0; i < 6; i++)
      {
        if(output_qty[i] == 0) outputs[i] = '';
      }


      //get the max wood stack (==> fuel burned) and the MINIMUM stack for each input material
      let fuelBurned = 0;
      for (let i = 0; i < 6; i++) {
        if (outputs[i] == "wood") {
          if(output_qty[i] > fuelBurned) fuelBurned = output_qty[i];
        }
        if (Object.keys(distributeQty).indexOf(outputs[i]) > -1) {
          distributeMultiplier[outputs[i]]++;
          if (distributeQty[outputs[i]] > output_qty[i]) {
            distributeQty[outputs[i]] = output_qty[i];
          }
        }
      }

      //if max wood is 0, the end of iteration is reached => return success
      if (fuelBurned == 0) return [outputs, output_qty, fuelBurned, result_type];

      //find the output slot for each input material
      for (let i = 0; i < 6; i++) {
        let input = outputs[i];
        //if there is no output slot for this input material
        if (
          Object.keys(this.transformations).indexOf(input) > -1 &&
          !outputs.includes(this.transformations[input])
        ) {
          //find first empty index
          let idx = outputs.indexOf("");
          if (idx == -1) {
            result_type = "failure";
            break;
          } else {
            //add the byproduct to this index
            outputs[idx] = this.transformations[input];
            outputSlots[input] = idx;
          }
          //if there already is an output slot for this material
        } else if (Object.keys(this.transformations).indexOf(input) > -1) 
        {
          let outputSlot = -1;
          //find an output slot with less than 1000 qty in it
          while(outputSlot < 6)
          {
            let new_slot = outputs.indexOf(this.transformations[input], outputSlot > -1 ? outputSlot : 0);
            //there is no further slot ==> failure
            if(new_slot == -1)
            {
              result_type = "failure";
              break;
            }
            if(output_qty[new_slot] < 1000)
            {
              //this slot works
              outputSlots[input] = new_slot
              break;
            }
            //iteration has not changed the slot, so there is no remaining free slot
            if(new_slot == outputSlot)
            {
              result_type = "failure";
              break;
            }
            //otherwise the output slot that was found is full => keep iterating
          }
        }
        //if a failure point has been reached while assigning slots, stop iteration
        if(result_type == 'failure') return [outputs, output_qty, fuelBurned, result_type];
      }

      //if there is no immediate failure or success point, the next step is to find the minimum amount of fuel steps that can be processed before a breakpoint is reached (no wood, an empty input slot, or full output slot)
      //baseline minimum is the amount of fuel total
      let minFuel = fuelBurned
      for(let i = 0; i < 6; i++)
      {
        //for wood, the array distributeQty can simply be checked for the smallest wood stack
        if(outputs[i] == 'wood')
        {
          minFuel = distributeQty['wood']
        }
        //for an input material
        else if(Object.keys(distributeQty).indexOf(outputs[i]) > -1)
        {
          //breakpoint is reached if all material is burned, which is number of material * wood required to process 1
          if(output_qty[i] * this.woodCost[outputs[i]] < minFuel) minFuel = Math.round(output_qty[i] * this.woodCost[outputs[i]]);
        }
        //for an output material
        else if(outputs[i] != '')
        {
          let material = this.reverse_transformations[outputs[i]]
          //check if we can process the current multiplier without reaching 1000 in the stack
          if(output_qty[i] + (distributeQty[material] * distributeMultiplier[material]) < 1000)
          {
            //if yes, the breakpoint we need to check against is the amount of fuel required to process this stack
            if(distributeQty[material] * this.woodCost[material] < minFuel) 
              minFuel = Math.round(distributeQty[material] * this.woodCost[material])
          }
          else
          {
            //if no, the breakpoint we need to check against is the amount of fuel required to fill the stack
            let stackFill = (1000 - output_qty[i]);
            if(stackFill * (this.woodCost[material] / distributeMultiplier[material]) < minFuel) minFuel = Math.round(stackFill * (this.woodCost[material] / distributeMultiplier[material]))
          }
        }
      } 

      //we should now be able to safely burn minFuel amount of wood and send the results to the next iteration
      //these results are not rounded to preserve partially processed materials until return
      for(let i = 0; i < 6; i++)
      {
        //for wood
        if(outputs[i] == 'wood')
        {
          //just remove minFuel stacks
          output_qty[i] = output_qty[i] - minFuel;
        }
        //for an input material
        else if(Object.keys(distributeQty).indexOf(outputs[i]) > -1)
        {
          //remove material steps equivalent to wood burned
          output_qty[i] = output_qty[i] - minFuel / this.woodCost[outputs[i]]
        }
        //for an output material
        else
        {
          //add material steps equivalent to wood burned
          let material = this.reverse_transformations[outputs[i]]
          output_qty[i] = output_qty[i] + minFuel / this.woodCost[material] * distributeMultiplier[material]
        }
      }

      //call recursively
      return this.calculateFurnaceBreakpoint(outputs, output_qty, fuel_burned + minFuel);
    },
  },
  computed: {
    furnaceTime() {
      var date = new Date(null);
      date.setSeconds(this.fuelBurned * 2);
      return date.toISOString().substr(11, 8);
    },
  },
};
</script>

<style scoped>
.furnaceDisplay {
  background-color: rgba(255, 0, 0, 0.452);
  border-radius: 10px;
  align-items: center;
  padding-left: 5px;
  padding-bottom: 15px;
  display: flex;
}

.calculateButton {
  margin-left: auto;
}

.calculateButton button {
  margin-right: 15px;
}

.m-md-2 {
  margin: 0 !important;
}
</style>