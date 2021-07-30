<template>
  <div class="mt-3 mx-1">
    <h6 class="mb-0">Output</h6>
    <div v-if="!producesOutput">Waiting for input...</div>
    <div v-else>
      <div>
        <span v-for="(mat, idx) in output[0]" :key="idx">
          <span v-if="mat != ''" class="mr-3">
            <img :src="require('@/assets/' + mat + '.png')" width="30" class="border" />
            {{ output[1][idx] }}
          </span>
          <span v-else class="mr-3">
            <img :src="require('@/assets/nothing.png')" width="30" class="border" />
            0
          </span>
        </span>
      </div>
      <div class="alert alert-warning mt-2 mr-2" v-if="output[3] != ''">
        <strong>Warning:</strong>
        {{ output[3] }}
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "FurnaceOutput",
  props: {
    selected: Array,
    quantities: Array
  },
  data: () =>
  {
    return {
      materials: ["wood", "metal", "sulfur", "hqm", "charcoal", "mfrags", "sfrags", "hqmfrags"],
      transformations: {
        wood: "charcoal",
        metal: "mfrags",
        sulfur: "sfrags",
        hqm: "hqmfrags"
      },
      reverse_transformations: {
        charcoal: "wood",
        mfrags: "metal",
        sfrags: "sulfur",
        hqmfrags: "hqm"
      },
      //wood cost to transform a source material into its byproduct
      woodCost: {
        wood: 4 / 3,
        metal: 5,
        sulfur: 2.5,
        hqm: 10
      },
    };
  },
  computed:
  {
    output()
    {
      let fixed_qtys = [...this.quantities]

      for (let i = 0; i < 6; i++)
      {
          if(fixed_qtys[i] > 1000) fixed_qtys[i] = 1000;
          if(fixed_qtys[i] < 0) fixed_qtys[i] = 0;
          fixed_qtys[i] = Math.round(fixed_qtys[i]);
      }

      let [output, qty, fuel, message] = this.calculateFurnaceBreakpoint(this.selected, fixed_qtys, 0);

      for (let i = 0; i < 6; i++)
      {
        qty[i] = Math.floor(qty[i]);
      }

      this.$emit('output', output);
      this.$emit('outputQty', qty);
      this.$emit('fuel', fuel);

      return [output, qty, fuel, message]
    },
    producesOutput()
    {
      return !this.output[0].every(item => item == 0);
    },
  },
  methods:
  {
    //recursive method which for a given furnace input and quantity, outputs the furnace output and output quantities of the next breakpoint
    calculateFurnaceBreakpoint(inputs, quantities, fuel_burned)
    {
      let warning_message = "";

      //copy the arrays
      let outputs = [...inputs];
      let output_qty = [...quantities];

      //holds the minimum quantity to reduce
      let distributeQty = {
        wood: -1,
        metal: -1,
        sulfur: -1,
        hqm: -1
      };

      //holds the speed multiplier (i.e. how many stacks of each input material there are)
      //for example, if metal is in 2 slots, it will generate output materials twice as fast
      let distributeMultiplier = {
        wood: 0,
        metal: 0,
        sulfur: 0,
        hqm: 0
      };

      //holds the output slot for given input material
      let outputSlots = {
        wood: -1,
        metal: -1,
        sulfur: -1,
        hqm: -1
      };

      //remove all values which have 0 as a quantity
      for (let i = 0; i < 6; i++)
      {
        if (output_qty[i] == 0) outputs[i] = "";
      }

      //first iteration to get the wood burned, get the MINIMUM (non-0) stack for each input material
      for (let i = 0; i < 6; i++)
      {
        let material = outputs[i]

        //for every input material, add the multiplier, find an output slot, store the smallest quantity
        if (Object.keys(distributeQty).indexOf(material) > -1)
        {
          //add the multiplier
          distributeMultiplier[material]++;

          //if quantity is smaller than minimum quantity to burn for this material, set this as the quantity
          if (distributeQty[material] > output_qty[i] || distributeQty[material] == -1)
            distributeQty[material] = output_qty[i];

          //if there is no output slot for this material
          if (!outputs.includes(this.transformations[material]))
          {
            //find first empty index
            let idx = outputs.indexOf("");
            //if there is no empty index, set result to failure
            if (idx == -1)
              warning_message = "Furnace will stop due to lack of space for byproduct of " + material + ".";
            //otherwise
            else
            {
              //set this slot as the output slot for this material
              outputs[idx] = this.transformations[material];
              outputSlots[material] = idx;
            }
          }
          //if there already is at least one output slot for this input material
          else if (Object.keys(this.transformations).indexOf(material) > -1)
          {
            //find empty slot if available
            let slot = outputs.indexOf("");
            //try to find an output slot with less than 1000 qty in it
            for (let j = 0; j < 6; j++)
            {
              //if there is a suitable slot, overwrite the previous slot and break
              if (outputs[j] == this.transformations[material] && output_qty[j] < 1000)
              {
                slot = j;
                break;
              }
            }
            if (slot == -1)
            {
              warning_message = "Furnace will stop due to lack of space for byproduct of " + material + ".";
            }
            else
            {
              outputSlots[material] = slot;
              outputs[slot] = this.transformations[material];
            }
          }
        }
      }

      //if min wood is 0 or -1, there is nothing to be done, so we can just return what we initially got
      if (distributeQty["wood"] < 1)
      {
        //make sure no empty slots are left over
        let empty_removed = [...inputs];
        for (let i = 0; i < 6; i++)
        {
          if (quantities[i] == 0) empty_removed[i] = '';
        }
        return [empty_removed, quantities, fuel_burned, ""];
      }

      //if a failure point has been reached while assigning slots, stop iteration
      if (warning_message != "")
        return [inputs, quantities, fuel_burned, warning_message];

      //if not, we need to determine how many fuel steps can be processed before a breakpoint is reached (no wood, an empty input slot, or full output slot)
      //we can set an arbitrary "minimum" of 10.000, because this value must be overwritten at least once due to previous checks if we can burn anything.
      let minFuel = 10000;
      //we need to check each input type
      for (const [key, value] of Object.entries(distributeQty))
      {
        //distributeQty stores the minimum stack before the multiplier changes for this input material
        //if distributeMultiplier is 0, this means there is no stack of this material, so we can ignore it
        if (distributeMultiplier[key] == 0)
          continue;

        //otherwise, we check the quantity of the input material
        //if the material is wood, we copy it to minFuel 1:1
        if (key == "wood" && minFuel > value)
          minFuel = value;
        //if the material is another input material
        else
        {
          //the minimum fuel to process this stack is the integer value of wood required to burn this stack (rounded up to completely burn it)
          let timeToBurn = Math.ceil(this.woodCost[key] * value);
          if (minFuel > timeToBurn)
            minFuel = timeToBurn;
        }

        //we now also need to check the corresponding output slot (which must exist, otherwise we would not have reached this point)
        let slot = outputSlots[key]

        //the fuel to fill this stack is the amount of available space in the stack times the wood burned to produce one material divided by the stacks burned simultaneously
        let availableSpace = 1000 - output_qty[slot]
        let timeToBurn = Math.ceil(availableSpace * this.woodCost[key] / distributeMultiplier[key])
        if (minFuel > timeToBurn)
          minFuel = timeToBurn;
      }

      //we should now be able to safely burn minFuel amount of wood and send the results to the next iteration
      //these results are not rounded to preserve partially processed materials until return
      for (let i = 0; i < 6; i++)
      {
        //for wood
        if (outputs[i] == "wood")
        {
          //just remove minFuel stacks
          output_qty[i] = output_qty[i] - minFuel;
        }
        //for an input material
        else if (Object.keys(distributeQty).indexOf(outputs[i]) > -1)
        {
          //remove material steps equivalent to wood burned
          output_qty[i] = output_qty[i] - minFuel / this.woodCost[outputs[i]];
          if(output_qty[i] < 0) output_qty[i] = 0;
        }
        //for an output material which corresopnds to the input material
        else if (outputSlots[this.reverse_transformations[outputs[i]]] == i)
        {
          //add material steps equivalent to wood burned
          let material = this.reverse_transformations[outputs[i]];
          output_qty[i] = output_qty[i] + (minFuel / this.woodCost[material]) * distributeMultiplier[material];
        }
      }

      //call recursively
      return this.calculateFurnaceBreakpoint(outputs, output_qty, fuel_burned + minFuel);
    }
  }
};
</script>

<style scoped>
.border {
  border-radius: 5px;
}
</style>