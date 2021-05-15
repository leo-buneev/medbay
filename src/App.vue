<template>
  <div id="q-app">
    <RouterView />
    <AppGlobalDialog />
  </div>
</template>
<script>
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import AppGlobalDialog from './AppGlobalDialog'

export default {
  name: 'App',
  components: { AppGlobalDialog },
}
defineCustomElements(window)
</script>
