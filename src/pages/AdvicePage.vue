<template>
  <QList>
    <QItem>Test</QItem>
  </QList>
</template>

<script>
import api from '@/services/api'
export default {
  data() {
    return {
      advices: null,
    }
  },
  created() {
    this.init()
  },
  safeMethods: {
    async init() {
      // this.advices = await api.query({})
    },
  },
}
</script>
