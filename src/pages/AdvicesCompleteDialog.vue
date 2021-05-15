<template>
  <QCard style="min-width: 300px;">
    <VaccinationCreate :vaccinated-disease-id="vaccinatedDiseaseId" grid="col-xs-12" @save="save" />
  </QCard>
</template>

<script>
import VaccinationCreate from '@/components/VaccinationCreate.vue'

export default {
  components: { VaccinationCreate },

  props: ['benefit'],

  computed: {
    vaccinatedDiseaseId() {
      return this.benefit.tcVaccinatedDisease.id
    },
  },

  methods: {
    save() {
      this.$hideTopDialog()
    },
  },
}
</script>
