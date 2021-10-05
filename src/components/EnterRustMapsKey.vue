<template>
  <div class="mt-4">
    <b-alert show variant="danger" v-if="keyError" class="text-justify">
      The entered string does not match the RustMaps.com API Key format. Please make sure you have copied the right key. Your key should be in the
      same format as the following (non functional) example key:
      "<strong>abc123de-ab45-cd67-ef89-1234abcdef56</strong>"
      .
    </b-alert>
    <b-form-group label="RustMaps API Key">
      <b-input v-model="rustApiKey" />
    </b-form-group>
    <b-button variant="primary" @click="storeApiKey()">Store API Key</b-button>
  </div>
</template>

<script>
let regex_string = new RegExp("^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$");

export default
  {
    data: function ()
    {
      return {
        rustApiKey: '',
        keyError: false
      }
    },
    methods:
    {
      storeApiKey()
      {
        if (!regex_string.test(this.rustApiKey))
        {
          this.keyError = true
        }
        else
        {
          this.keyError = false
          this.$store.dispatch('set_api_key', this.rustApiKey)
          this.$emit('stored')
        }
      }
    }
  }
</script>