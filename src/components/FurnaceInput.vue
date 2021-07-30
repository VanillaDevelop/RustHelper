<template>
  <div class="row furnaceInput">
    <div v-for="n in 6" :key="n" class="col singleInput px-1">
      <b-dropdown class="m-0 dditem" variant="light">
        <template slot="button-content">
          <span v-if="selected[n - 1] == ''">
            <img :src="require('@/assets/nothing.png')" class="ddimg" />
          </span>
          <span v-else>
            <img :src="require('@/assets/' + selected[n - 1] + '.png')" class="ddimg" />
          </span>
        </template>
        <b-dropdown-item :key="''" @click="updateMaterial(n - 1, '')">None</b-dropdown-item>
        <b-dropdown-item v-for="material in materials" :key="material" @click="updateMaterial(n - 1, material)">
          <img :src="require('@/assets/' + material + '.png')" width="40" />
        </b-dropdown-item>
      </b-dropdown>
      <div class="mt-1">
        <b-form-input
          placeholder="Qty."
          class="dditem"
          v-model="quantities[n - 1]"
          :number="true"
          type="number"
          min="0"
          max="1000"
          step="1"
          @change="fixQty(n - 1)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default
  {
    name: "FurnaceInput",
    props:
    {
      selected: Array,
      quantities: Array
    },
    data: () =>
    {
      return {
        materials: ["wood", "metal", "sulfur", "hqm", "charcoal", "mfrags", "sfrags", "hqmfrags"],
        selected: ["", "", "", "", "", ""],
        quantities: [0, 0, 0, 0, 0, 0],
      }
    },
    methods:
    {
      updateMaterial(idx, material)
      {
        this.$set(this.selected, idx, material);
        if (material == "") this.$set(this.quantities, idx, 0);
        this.$emit('materials', this.selected)
      },

      fixQty(idx)
      {
        if (this.quantities[idx] > 1000)
        {
          this.$set(this.quantities, idx, 1000);
        } else if (this.quantities[idx] < 0)
        {
          this.$set(this.quantities, idx, 0);
        }

        if (this.selected[idx] == "") this.$set(this.quantities, idx, 0);

        this.$set(this.quantities, idx, Math.trunc(this.quantities[idx]));
        this.$emit('quantities', this.quantities)
      },
    }
  }
</script>

<style scoped>

.furnaceInput {
  padding: 0;
  padding-left: 15px;
  width: 100%;
}

.singleInput {
  padding: 0;
}

.dditem {
  width: 100%;
  padding: 0;
  height: 40px;
}

.ddimg {
  width: 25px;
}

@media (min-width: 768px) {
  .ddimg {
    width: 30px;
  }
}
</style>
