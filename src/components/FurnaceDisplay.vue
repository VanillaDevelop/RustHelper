<template>
  <b-row class="mb-3">
    <b-col offset-lg="2" lg="8">
      <div class="furnaceDisplay">
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
        <span class="calculateButton"
          ><b-button variant="danger"><b-icon-arrow-right-square /></b-button
        ></span>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "FurnaceDisplay",
  data: () => {
    return {
      materials: ["wood", "metal", "sulfur", "hqm", "charcoal"],
      selected: ["", "", "", "", ""],
      quantities: [0, 0, 0, 0, 0],
    };
  },
  methods: {
    updateMaterial(idx, material) {
      this.$set(this.selected, idx, material);
    },
    fixQty(idx) {
      if (this.quantities[idx] > 1000) {
        this.$set(this.quantities, idx, 1000);
      }
      else if (this.quantities[idx] < 0) {
        this.$set(this.quantities, idx, 0)
      }
      this.$set(this.quantities, idx, Math.trunc(this.quantities[idx]))
    },
  },
};
</script>

<style scoped>
.furnaceDisplay {
  background-color: rgba(255, 0, 0, 0.452);
  height: 8em;
  border-radius: 10px;
  align-items: center;
  padding-left: 20px;
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