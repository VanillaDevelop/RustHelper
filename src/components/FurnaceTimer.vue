<template>
  <div class="mx-1">
    <h6 class="mt-2 mb-0">Timer</h6>
    <div v-if="finish_time.valueOf() == 0">
      <div>Output is reached after {{ furnaceTime }}.</div>
      <div class="mt-1">
        <b-button variant="primary" @click="calculateFinishTime()">
          <b-icon-play></b-icon-play>
          Start Timer
        </b-button>
      </div>
    </div>
    <div class="mt-1" v-else>
      <div>{{ finishTimer }}</div>
      <div class="mt-1">
        <b-button variant="primary" @click="abortFurnace()">
          <b-icon-stop></b-icon-stop>
          Stop Timer
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FurnaceTimer",
  props:
  {
    finish_time: Date,
    fuel_burned: Number,
    active_timer: Number,
    serverId: Number,
    furnaceId: Number,
  },
  data: function ()
  {
    return {
      now: Date.now(),
    };
  },
  created()
  {
    var self = this
    setInterval(function ()
    {
      self.now = Date.now()
    }, 1000)

    if (this.finish_time.valueOf() - this.now.valueOf() > 0)
    {
      if (this.active_timer != null)
      {
        clearInterval(this.active_timer);
      }
      this.$store.dispatch("set_active_timer", { serverId: this.serverId, furnaceId: this.furnaceId, timer: setInterval(() => this.updateFinishTime(), 1000) });
    }
    else
    {
      this.$emit('set_finish_time', new Date(null));
    }
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
      if (this.finish_time.valueOf() - this.now.valueOf() > 0)
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
      let ftime = new Date(Date.now());
      ftime.setSeconds(ftime.getSeconds() + this.fuel_burned * 2);
      this.$emit('set_finish_time', ftime);
      this.$store.dispatch("set_active_timer", { serverId: this.serverId, furnaceId: this.furnaceId, timer: setInterval(() => this.updateFinishTime(), 1000) });
    },
    updateFinishTime()
    {
      if (this.finish_time.valueOf() - this.now.valueOf() < 0)
      {
        var audio = new Audio(require('@/assets/ding.mp3'))
        audio.play();
        this.$emit('set_finish_time', new Date(null));
        this.$emit('timer');
        clearInterval(this.active_timer);
      }
    },
    abortFurnace()
    {
        this.$emit('set_finish_time', new Date(null));
        this.$emit('abort');
        clearInterval(this.active_timer);
    }
  },
}
</script>