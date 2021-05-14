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
  safeMethods: {
    async init() {
      await tc.delay(5000)
    }
  }
}
</script>
