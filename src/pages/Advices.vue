<template>
  <QList>
    <QItem v-for="b of advices" :key="b.name">
      <QItemSection side>
        <QIcon name="fas fa-syringe" />
      </QItemSection>
      <QItemSection>
        {{ b.name }}
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
import moment from 'moment'
export default {
  computed: {
    advices() {
      const { tcProfile } = this.$store.state.user
      const benefits = tcProfile?.tcInsuranceCompany?.benefits
      if (!benefits) return []

      const age = moment().diff(tcProfile.birthDate, 'years')
      return benefits.filter(b => {
        if (b.condition.minAge && age < b.condition.minAge) return false
        if (b.condition.maxAge && age > b.condition.maxAge) return false
        if (b.condition.sex && tcProfile.sex && tcProfile.sex !== b.condition.sex) return false
        return true
      })
    },
  },
}
</script>
