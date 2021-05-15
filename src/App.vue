<template>
  <div id="q-app">
    <RouterView />
  </div>
</template>
<script>
import { defineCustomElements } from '@ionic/pwa-elements/loader'

export default {
  name: 'App',
}
defineCustomElements(window)
</script>
