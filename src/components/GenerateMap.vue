<template>
  <div>
    <p>
      Your RustMaps.com API Key is already set. You may change it by clicking
      <a v-b-modal.modal-change-api-key>here</a>
      .
    </p>
    <b-modal id="modal-change-api-key" title="Change RustMaps.com API Key" :hide-footer="true">
      <enter-rust-maps-key @stored="closeModal()"/>
    </b-modal>
  </div>
</template>

<style scoped>
a {
  text-decoration: underline !important;
}
</style>

<script>
import EnterRustMapsKey from './EnterRustMapsKey.vue'
export default {
  components: { EnterRustMapsKey },
  methods: 
  {
      closeModal()
      {
          this.$bvModal.hide('modal-change-api-key');
      }
  }

}
</script>