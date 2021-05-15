<template>
  <QPage class="flex flex-top column">
    <div class="flex flex-center q-mb-lg">
      <QSelect
        v-model="vaccinationCreate.diseaseId"
        emit-value
        :display-value="
          _.get(
            diseaseOptions.find(item => item.value === diseaseId),
            'label',
          ) || '-'
        "
        outlined
        :options="diseaseOptions"
        label="Onemocnění"
        class="q-mx-md q-mt-md"
      />
      <QSelect
        v-model="vaccinationCreate.vaccination"
        outlined
        :options="vaccinationOptions"
        label="Vakcína"
        class="q-mx-md q-mt-md"
      />
      <QSelect
        v-model="vaccinationCreate.vaccinationDose"
        outlined
        :options="vaccinationDoseOptions"
        label="Dóza"
        class="q-mx-md q-mt-md"
      />
    </div>
    <QTable title="Očkování" :data="data" :columns="columns" row-key="name">
      <template #body="props">
        <QTr :props="props">
          <QTd key="mandatory" :props="props">
            <QIcon :color="props.row.mandatory === true ? 'primary' : 'grey'" name="fas fa-exclamation-triangle" />
          </QTd>
          <QTd key="date" :props="props">
            {{ props.row.date }}
          </QTd>
          <QTd key="disease" :props="props">
            {{ props.row.disease }}
          </QTd>
          <QTd key="vaccine" :props="props">
            {{ props.row.vaccine }}
          </QTd>
          <QTd key="serialNumber" :props="props">
            {{ props.row.serialNumber }}
          </QTd>
          <QTd key="receipt" :props="props">
            {{ props.row.receipt }}
          </QTd>
          <QTd key="nextDate" :props="props">
            {{ props.row.nextDate }}
          </QTd>
        </QTr>
      </template>
    </QTable>
  </QPage>
</template>

<script>
import moment from 'moment'
import api from '@/services/api'

export default {
  data() {
    return {
      columns: [
        { name: 'mandatory', label: 'povinná', field: 'mandatory' },
        { name: 'date', label: 'datum', field: 'date' },
        { name: 'disease', label: 'onemocnění', field: 'disease' },
        { name: 'vaccine', label: 'vakcína', field: 'vaccine' },
        { name: 'serialNumber', label: 'sériové číslo', field: 'serialNumber' },
        { name: 'receipt', label: 'účtenka', field: 'receipt' },
        { name: 'nextDate', label: 'příští aplikace', field: 'nextDate' },
      ],
      mandatoryVaccination: [],
      vaccination: [],
      vaccinationCreate: {
        diseaseId: null,
        vaccination: null,
        vaccinationDose: null,
      },
    }
  },

  computed: {
    data() {
      const userVaccination = (this.$store.state.user.tcProfile.usedBenefits || [])
        .filter(item => item.type === 'vaccination')
        .map(item => ({
          ...item,
          date: moment(item.date).format('L LT'),
          mandatory: item.tcVaccinatedDisease.mandatory,
          disease: item.tcVaccinatedDisease.disease,
        }))

      const userVaccinationIds = userVaccination.flatMap(item => item.tcVaccinatedDisease.id)

      return [...userVaccination, ...this.mandatoryVaccination.filter(item => !userVaccinationIds.includes(item.id))]
    },

    diseaseOptions() {
      return this.vaccination.map(item => ({ value: item.id, label: item.disease }))
    },

    selectedVactination() {
      return this.vaccination.find(item => item.id === this.vaccinationCreate.diseaseId)
    },

    vaccinationOptions() {
      return (this.selectedVactination?.vaccines || []).map(item => item.name)
    },

    vaccinationDoseOptions() {
      const doses = (this.selectedVactination?.vaccines || []).find(
        item => item.name === this.vaccinationCreate.vaccination,
      )?.doseCount

      return (doses != null && new Array(doses).fill(null).map((item, index) => index + 1)) || null
    },
  },

  created() {
    this.init()
  },

  safeMethods: {
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
                }
              }
            }
          }
        `,
      })

      this.vaccination = tcVaccinatedDiseases.nodes || []
      this.mandatoryVaccination = (tcVaccinatedDiseases.nodes || [])
        .filter(item => item.mandatory === true)
        .map(item => ({
          ...item,
          vaccine: item.vaccines.map(vaccine => vaccine.name).join(', '),
        }))

      console.log(this.vaccination)
    },

    async save() {
      await this.$validate()

      this.tcProfile.name = `${this.firstName} ${this.lastName}`

      await this.$store.dispatch('upsertTcProfile', this.tcProfile)
    },
  },
}
</script>
