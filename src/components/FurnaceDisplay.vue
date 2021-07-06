<template>
  <b-row class="mb-3">
    <b-col offset-lg="2" lg="8">
      <div class="furnaceDisplay">
        <span v-for="n in 5" :key="n">
          <div class="mx-1">
            <b-dropdown
              id="dropdown-1"
              text="Dropdown Button"
              class="m-md-2"
              variant="light"
              ><template slot="button-content">
                <img :src="require('@/assets/wood.png')" width="30" />
              </template>
              <b-dropdown-item
                ><img :src="require('@/assets/wood.png')" width="40"
              /></b-dropdown-item>
              <b-dropdown-item
                ><img :src="require('@/assets/metal.png')" width="40"
              /></b-dropdown-item>
              <b-dropdown-item
                ><img :src="require('@/assets/sulfur.png')" width="40"
              /></b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="mx-1 mt-1">
            <b-form-input
              v-model="text"
              placeholder="Qty."
              style="width: 70px"
            ></b-form-input>
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
      materials: {
        wood: "",
      },
    };
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