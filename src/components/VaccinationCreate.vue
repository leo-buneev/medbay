<template>
  <div class="row">
    <div :class="colClass">
      <QSelect
        v-model="diseaseId"
        emit-value
        :display-value="
          _.get(
            diseaseOptions.find(item => item.value === diseaseId),
            'label',
          ) || '-'
        "
        outlined
        :options="diseaseOptions"
        :disable="vaccinatedDiseaseId != null"
        label="Onemocnění"
        class="q-mx-md q-mt-md"
      />
    </div>
    <div :class="colClass">
      <QSelect
        v-model="vaccinationName"
        outlined
        :options="vaccinationOptions"
        label="Vakcína"
        class="q-mx-md q-mt-md"
      />
    </div>
    <div :class="colClass">
      <QSelect
        v-model="vaccinationDose"
        outlined
        :options="vaccinationDoseOptions"
        label="Dóza"
        class="q-mx-md q-mt-md"
      />
    </div>
    <div :class="colClass">
      <RInput v-model="serialNumber" outlined label="Sériové číslo" class="q-mx-md q-mt-md" />
    </div>
    <div :class="colClass">
      <RDatetime v-model="date" outlined label="Datum aplikace" class="q-mx-md q-mt-md" />
    </div>
    <div class="col-12 text-right">
      <QBtn color="primary" label="Přidat" class="q-ma-md" @click="complete" />
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  props: ['vaccinatedDiseaseId', 'grid'],

  data() {
    return {
      vaccination: [],
      diseaseId: null,
      vaccinationName: null,
      vaccinationDose: null,
      serialNumber: null,
      date: null,
    }
  },

  computed: {
    diseaseOptions() {
      return this.vaccination.map(item => ({ value: item.id, label: item.disease }))
    },

    selectedVactination() {
      return this.vaccination.find(item => item.id === this.diseaseId)
    },

    vaccinationOptions() {
      return (this.selectedVactination?.vaccines || []).map(item => item.name)
    },

    vaccinationDoseOptions() {
      const doses = (this.selectedVactination?.vaccines || []).find(item => item.name === this.vaccinationName)
        ?.doseCount

      return (doses != null && new Array(doses).fill(null).map((item, index) => index + 1)) || null
    },

    colClass() {
      return this.grid || 'col-xs-12 col-md-4'
    },
  },

  watch: {
    diseaseId() {
      this.vaccinationName = null
      this.vaccinationDose = null
    },

    vaccinationName() {
      this.vaccinationDose = null
    },

    vaccinatedDiseaseId(value) {
      if (value != null) this.diseaseId = value
    },
  },

  created() {
    this.init()
  },

  safeMethods: {
    async init() {
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

      this.vaccination = tcVaccinatedDiseases.nodes || []

      if (this.vaccinatedDiseaseId != null) this.diseaseId = this.vaccinatedDiseaseId
    },

    async complete(benefit) {
      const { tcProfile } = this.$store.state.user

      await this.$store.dispatch('upsertTcProfile', {
        ...tcProfile,
        usedBenefits: [
          ...tcProfile.usedBenefits,
          {
            name: this.diseaseOptions.find(item => item.value === this.diseaseId).label,
            date: new Date(this.date).toISOString(),
            vaccinationName: this.vaccinationName,
            serialNumber: this.serialNumber,
            dose: this.vaccinationDose,
            tcVaccinatedDisease: {
              id: this.diseaseId,
            },
            type: 'vaccination',
          },
        ],
      })

      this.$emit('save')
    },
  },
}
</script>
