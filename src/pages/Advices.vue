<template>
  <QList>
    <QItem>
      <QItemSection>
        <RDatetime v-model="date" :vuelidate="$v.date" label="haha" />
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
import { validations } from 'rads'
const { required } = validations

export default {
  validations: {
    date: { required },
  },
  data() {
    return {
      advices: null,
      date: null,
    }
  },
  created() {
    this.init()
  },
  safeMethods: {
    async init() {
      await this.$validate()
      // this.advices = await api.query({})
    },
  },
}
</script>
