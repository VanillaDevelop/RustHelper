<template>
  <div>
    <h3>Current Build Costs</h3>
    <div class="border rounded p-2">
      <span v-for="(value, name) in output" :key="name">
        <img :src="require('@/assets/' + name + '.png')" width="40" />
        {{ value }}
      </span>
    </div>
  </div>
</template>

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
      output()
      {
        let costs =
        {
          "wood": 0,
          "stone": 0,
          "mfrags": 0,
          "hqm": 0
        }

        this.shopping_cart.forEach(item => 
        {
          for (let cost in item.costs)
          {
            costs[cost] += item.costs[cost] * item.quantity;
          }
        });

        this.shopping_cart_deployable.forEach(item => 
        {
          for (let cost in item.costs)
          {
            costs[cost] += item.costs[cost] * item.quantity;
          }
        })

        return costs;
      }
    },
  }
</script>