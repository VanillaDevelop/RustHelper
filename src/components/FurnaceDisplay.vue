<template>
  <b-row class="mb-3">
    <b-col offset-lg="3" lg="6">
      <div class="furnaceDisplay d-block pt-3">
        <div class="w-100 d-flex">
          <span v-for="n in 5" :key="n">
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
                </span>
              </span>
            </div>
            <div class="alert alert-warning mt-2" v-if="result_type == 'failure'">
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
      materials: ["wood", "metal", "sulfur", "hqm", "charcoal", "mfrags", "sfrags", "hqmfrags"],
      transformations: {
        wood: "charcoal",
        metal: "mfrags",
        sulfur: "sfrags",
        hqm: "hqmfrags",
      },
      selected: ["", "", "", "", ""],
      quantities: [0, 0, 0, 0, 0],
      output: ["", "", "", "", ""],
      output_quantities: [0, 0, 0, 0, 0],
      result: "",
      result_type: "",
    };
  },
  methods: {
    updateMaterial(idx, material) {
      this.$set(this.selected, idx, material);
      this.processFurnace();
    },
    fixQty(idx) {
      if (this.quantities[idx] > 1000) {
        this.$set(this.quantities, idx, 1000);
      } else if (this.quantities[idx] < 0) {
        this.$set(this.quantities, idx, 0);
      }
      this.$set(this.quantities, idx, Math.trunc(this.quantities[idx]));
      this.processFurnace();
    },
    processFurnace() {

      //first, copy the slots and quantities from the input
      let output = [...this.selected];
      let output_qty = [...this.quantities];

      this.result_type = "success";

      //second, reserve an output slot for every type of material if there is not one already
      for (var i = 0; i < 5; i++) {
        let input = this.selected[i];
        if (
          Object.keys(this.transformations).indexOf(input) > -1 &&
          !output.includes(this.transformations[input])
        ) {
          //find first empty index
          let idx = output.indexOf("");
          if (idx == -1) {
            this.result =
              "Furnace will stop immediately due to lack of space for byproduct of " +
              input +
              ".";
            this.result_type = "failure";
            break;
          } else {
            //add the byproduct to this index
            output[idx] = this.transformations[input];
          }
        }
      }

      this.output_quantities = [...output_qty];
      this.output = [...output];
    },
  },
};
</script>

<style scoped>
.furnaceDisplay {
  background-color: rgba(255, 0, 0, 0.452);
  border-radius: 10px;
  align-items: center;
  padding: 15px 15px 10px 15px;
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