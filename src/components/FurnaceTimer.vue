<template>
  <div class="mx-1">
    <h6 class="mt-2 mb-0">Timer</h6>
    <div v-if="finish_time == 0">
      <div>Output is reached after {{ furnaceTime }}.</div>
      <div class="mt-1">
        <b-button variant="primary" @click="calculateFinishTime()">
          <b-icon-play></b-icon-play>
          Start Timer
        </b-button>
      </div>
    </div>
    <div class="mt-1" v-else>
      {{ finishTimer }}
    </div>
  </div>
</template>

<script>
export default {
  name: "FurnaceTimer",
  data: function ()
  {
    return {
      now: Date.now(),
      finish_time: 0,
      timeUpdateInterval: null
    };
  },
  created()
  {
    var self = this
    setInterval(function ()
    {
      self.now = Date.now()
    }, 1000)
  },
  props:
  {
    fuel_burned: Number
  },
  computed:
  {
    furnaceTime()
    {
      var date = new Date(null);
      date.setSeconds(this.fuel_burned * 2);
      return date.toISOString().substr(11, 8);
    },

    finishTimer()
    {
      if (this.finish_time - this.now > 0)
      {
        var date = new Date(this.finish_time - this.now);
        return date.toISOString().substr(11, 8);
      }
      return new Date(0).toISOString().substr(11, 8);
    }
  },
  methods:
  {
    calculateFinishTime()
    {
      this.finish_time = new Date(Date.now());
      this.finish_time.setSeconds(this.finish_time.getSeconds() + this.fuel_burned * 2);
      this.timeUpdateInterval = setInterval(() => this.updateFinishTime(), 1000)
    },
    updateFinishTime()
    {
      if (this.finish_time - this.now < 0)
      {
        var audio = new Audio(require('@/assets/ding.mp3'))
        audio.play();
        this.finish_time = 0;
        this.$emit('timer');

        clearInterval(this.timeUpdateInterval);
      }
    }
  },
}
</script>