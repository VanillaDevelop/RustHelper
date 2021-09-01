<template>
  <div>
    <h3 class="text-center">Enter RustMaps API Key</h3>
    <b-row>
      <b-col class="text-justify" lg="8" offset-lg="2">
        The Rust Helper Map View is currently powered by the RustMaps.com API. Because the Rust Helper is a local application with no server
        infrastructure, you will need to use your own API key in order to generate maps. Your API key will be stored in local storage and is not
        communicated to any external server other than the RustMaps API calls themselves. To find your API Key, log in at
        <a href="https://rustmaps.com/user/profile" target="_blank">RustMaps.com</a>
        using your steam account and copy your API key into the field below. RustMaps is providing an exceptional service free of charge and with a
        comprehensive API, so consider
        <a href="https://www.buymeacoffee.com/hoppel" target="_blank">supporting them</a>
        if you use this feature a lot.

        <div class="mt-4">
          <b-alert show variant="danger" v-if="keyError">
            The entered string does not match the RustMaps.com API Key format. Please make sure you have copied the right key. Your key should be in
            the same format as the following (non functional) example key:
            <strong>abc123de-ab45-cd67-ef89-1234abcdef56</strong>.
          </b-alert>
          <b-form-group label="RustMaps API Key">
            <b-input v-model="rustApiKey" />
          </b-form-group>
          <b-button variant="primary" @click="storeApiKey()">Store API Key</b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped>
a {
  color: white !important;
  text-decoration: underline;
}
</style>

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
        }
      }
    }
  }
</script>