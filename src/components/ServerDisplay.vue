<template>
  <b-row class="mb-3">
    <b-col offset-lg="2" lg="8">
      <div
        :class="['serverDisplay', isActive ? 'selectedServerDisplay' : '']"
        @click="setActiveServer(server.id)">
        <span class="server-name">{{ this.abbreviatedServerNames()[this.index] }}</span>
        <span :class="isActive ? 'deleteButtonActive' : 'deleteButton'"
          ><b-button variant="danger" v-b-modal.modal-remove-server
            @click.stop="$emit('set-server-delete-id')"><b-icon-trash-fill /> Delete Server</b-button
          ></span>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ServerDisplay",
  props: {
    server: Object,
    isActive: Boolean,
    index: Number
  },
  methods: {
    ...mapGetters(["abbreviatedServerNames"]),
    setActiveServer(serverId) {
      this.$store.dispatch("setSelectedServer", serverId);
    },
  },
};
</script>

<style scoped>
.serverDisplay {
  background-color: rgba(255, 0, 0, 0.452);
  height: 4em;
  border-radius: 10px;
  align-items: center;
  padding-left: 20px;
  display: flex;
}

.selectedServerDisplay {
  border: 2px solid white;
  padding-left: 18px;
}

.server-name {
  font-size:1.2em;
}

.deleteButton {
  margin-left:auto;
}

.deleteButtonActive {
  margin-left:auto;
}

.deleteButton button {
  margin-right:15px;
}

.deleteButtonActive button {
  margin-right:13px;
}
</style>