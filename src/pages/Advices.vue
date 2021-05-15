<template>
  <QList>
    <QItem>
      <QItemSection>
        <RDatetime v-model="date" label="haha" />
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
export default {
  data() {
    return {
      advices: null,
      date: new Date().toISOString(),
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
