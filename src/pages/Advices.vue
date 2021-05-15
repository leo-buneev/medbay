<template>
  <QList>
    <QItem v-for="b of notifications" :key="b.name">
      <QItemSection side class="q-pl-sm">
        <QIcon :name="getIcon(b)" />
      </QItemSection>
      <QItemSection>
        <QItemLabel>
          {{ b.name }}
        </QItemLabel>
        <QItemLabel v-if="b.type !== 'info'" caption :class="getPriceClass(b)">
          {{ getPrice(b) }}
        </QItemLabel>
        <QItemLabel v-else caption>
          {{ b.nextDate }}
        </QItemLabel>
      </QItemSection>
      <QItemSection side>
        <div class="row">
          <div v-if="b.url" class="col-auto">
            <QBtn round dence icon="far fa-question-circle" flat @click="openUrl(b.url)" />
          </div>
          <div class="col-auto">
            <QBtn round dence icon="fas fa-check" flat @click="complete(b)" />
          </div>
          <div class="col-auto">
            <QBtn round dence icon="fas fa-times" flat @click="discard(b)" />
          </div>
        </div>
      </QItemSection>
    </QItem>
    <h6>Uplatněné nabídky</h6>
    <QItem v-for="b of usedAdvices" :key="b.name">
      <QItemSection side class="q-pl-sm">
        <QIcon :name="getIcon(b)" />
      </QItemSection>
      <QItemSection>
        <QItemLabel>
          {{ b.name }}
        </QItemLabel>
        <QItemLabel caption>
          {{ formatDate(b.date) }}
        </QItemLabel>
      </QItemSection>
    </QItem>
    <h6>Odmítnuté nabídky</h6>
    <QItem v-for="b of discardedAdvices" :key="b.name">
      <QItemSection side class="q-pl-sm">
        <QIcon :name="getIcon(b)" />
      </QItemSection>
      <QItemSection>
        <QItemLabel>
          {{ b.name }}
        </QItemLabel>
        <QItemLabel caption>
          {{ formatDate(b.date) }}
        </QItemLabel>
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
import moment from 'moment'
import api from '@/services/api'
import utils from '@/services/utils'

export default {
  data() {
    return {
      vaccinations: [],
    }
  },

  computed: {
    usedAdvices() {
      const { tcProfile } = this.$store.state.user
      const { usedBenefits } = tcProfile
      const benefits = tcProfile?.tcInsuranceCompany?.benefits
      return usedBenefits.map(db => ({ date: db.date, ...benefits.find(x => x.name === db.name) }))
    },
    discardedAdvices() {
      const { tcProfile } = this.$store.state.user
      const { discardedBenefits } = tcProfile
      const benefits = tcProfile?.tcInsuranceCompany?.benefits
      return discardedBenefits.map(db => ({ date: db.date, ...benefits.find(x => x.name === db.name) }))
    },
    advices() {
      const { tcProfile } = this.$store.state.user
      const benefits = tcProfile?.tcInsuranceCompany?.benefits

      const age = moment().diff(tcProfile.birthDate, 'years')
      return benefits.filter(b => {
        if (tcProfile.discardedBenefits.some(db => db.name === b.name)) return false
        if (b.condition.minAge && age < b.condition.minAge) return false
        if (b.condition.maxAge && age > b.condition.maxAge) return false
        if (b.condition.sex && tcProfile.sex && tcProfile.sex !== b.condition.sex) return false

        const usedBenefits = tcProfile.usedBenefits.filter(ub => ub.name === b.name)
        const usedBenefit = _.maxBy(usedBenefits, 'date')
        if (usedBenefit) {
          const { minIntervalDays } = b
          if (!minIntervalDays) return false
          if (moment().diff(usedBenefit.date, 'days') < minIntervalDays) return false
        }

        return true
      })
    },
    userVaccinations() {
      return (this.$store.state.user.tcProfile.usedBenefits || [])
        .filter(item => item.type === 'vaccination')
        .map(item => {
          const intervalDays = utils.getIntervalDays(item, this.vaccinations)

          return {
            type: 'info',
            name: utils.getDisease(item, this.vaccinations),
            ...(intervalDays > 0 && {
              nextDate: moment(item.date)
                .add(intervalDays, 'days')
                .format('L'),
            }),
          }
        })
        .filter(item => item.nextDate != null)
    },
    notifications() {
      return [...this.advices, ...this.userVaccinations]
    },
  },

  created() {
    this.init()
  },

  methods: {
    getIcon(benefit) {
      const icons = {
        default: 'fas fa-briefcase-medical',
        vaccination: 'fas fa-syringe',
        practitionerCheckup: 'fas fa-user-md',
        dentistCheckup: 'fas fa-tooth',
        info: 'fas fa-info-circle',
      }
      return icons[benefit.type] || icons['default']
    },
    getPrice(benefit) {
      const { subsidy } = benefit
      if (!subsidy) return 'Zdarma'
      return `Příspěvek ${subsidy}CZK`
    },
    getPriceClass(benefit) {
      const { subsidy } = benefit
      if (!subsidy) return 'text-positive'
      return ''
    },
    formatDate(date) {
      if (!date) return '-'
      return moment(date).fromNow()
    },
    openUrl(url) {
      window.open(url, '_blank')
    },
  },

  safeMethods: {
    async complete(benefit) {
      const { tcProfile } = this.$store.state.user

      const newBenefit = { name: benefit.name, date: new Date().toISOString(), type: benefit.type }
      if (benefit.tcVaccinatedDisease?.id != null)
        newBenefit.tcVaccinatedDisease = {
          id: benefit.tcVaccinatedDisease.id,
        }

      await this.$store.dispatch('upsertTcProfile', {
        ...tcProfile,
        usedBenefits: [...tcProfile.usedBenefits, newBenefit],
      })
    },
    async discard(benefit) {
      const { tcProfile } = this.$store.state.user
      await this.$store.dispatch('upsertTcProfile', {
        ...tcProfile,
        discardedBenefits: [...tcProfile.discardedBenefits, { name: benefit.name }],
      })
    },

    async init() {
      console.log('this')
      const { tcVaccinatedDiseases } = await api.query({
        query: gql`
          query {
            tcVaccinatedDiseases {
              nodes {
                id
                disease
                mandatory
                vaccines {
                  name
                  doseCount
                  doseInterval {
                    afterDose
                    intervalDays
                  }
                }
              }
            }
          }
        `,
      })

      this.vaccinations = tcVaccinatedDiseases.nodes || []
    },
  },
}
</script>

<style lang="scss">
h6 {
  padding-left: 10px;
  margin-bottom: 0;
  margin-top: 15px;
  font-weight: normal;
  color: $primary;
}
</style>
