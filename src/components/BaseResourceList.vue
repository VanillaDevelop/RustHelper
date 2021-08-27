<template>
  <div>
    <h4 class="mt-4">Resource List</h4>
    <table class="table table-light table-striped">
      <thead class="thead-dark">
        <tr>
          <th>Item</th>
          <th class="col-small">Amount</th>
          <th class="col-small">Remove</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in shopping_cart" :key="item.name + ' - ' + item.tier">
          <td>{{ item.name }} - {{ item.tier }}</td>
          <td class="text-center">{{ item.quantity }}</td>
          <td class="text-center">
            <b-button variant="danger" size="sm" @click="removeItem(item)">
              <b-icon-trash-fill />
            </b-button>
          </td>
        </tr>
        <tr v-for="item in shopping_cart_deployable" :key="item.name">
          <td>
            {{ item.name }}
          </td>
          <td class="text-center">{{ item.quantity }}</td>
          <td class="text-center">
            <b-button variant="danger" size="sm" @click="removeDeployable(item)">
              <b-icon-trash-fill />
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.col-small {
  width: 50px;
}
</style>

<script>
import { mapGetters } from "vuex";
export default
  {
    computed:
    {
      ...mapGetters(["currentServer"]),
      shopping_cart()
      {
        return this.currentServer.shopping_cart;
      },
      shopping_cart_deployable()
      {
        return this.currentServer.shopping_cart_deployable;
      },
    },
    methods:
    {
      removeItem(item)
      {
        this.$store.dispatch("remove_item", item)
      },
      removeDeployable(item)
      {
        this.$store.dispatch("remove_deployable", item)
      }
    },
  }
</script>
