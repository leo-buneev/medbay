<template>
  <div id="q-app">
    <RouterView />
  </div>
</template>
<script>
export default {
  name: 'App',
  created() {
    this.init()
  },
}
</script>
