<template>
  <div>
    server {{ serverName }}
  </div>
</template>

<script>
export default {
  name: 'ServerDisplay',
  props: {
    serverName: String
  }
}
</script>