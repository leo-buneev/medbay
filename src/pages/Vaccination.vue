<template>
  <QPage class="flex flex-top column">
    <QTable title="Očkování" :data="data" :columns="columns" row-key="name">
      <template #body="props">
        <QTr :props="props">
          <QTd key="mandatory" :props="props">
            <QIcon v-if="props.row.mandatory === true" color="primary" name="fas fa-exclamation-triangle" />
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
    }
  },

  computed: {
    data() {
      const userVaccination = (this.$store.state.user.tcProfile.usedBenefits || [])
        .filter(item => item.type === 'vaccination')
        .map(item => ({ ...item, date: moment(item.date).format('L LT'), disease: item.name }))

      return [...userVaccination, ...this.mandatoryVaccination]
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
            tcVaccinatedDiseases(where: { mandatory: true }) {
              nodes {
                id
                disease
                mandatory
                vaccines {
                  name
                }
              }
            }
          }
        `,
      })

      this.mandatoryVaccination = (tcVaccinatedDiseases.nodes || []).map(item => ({
        ...item,
        vaccine: item.vaccines.map(vaccine => vaccine.name).join(', '),
      }))
    },

    async save() {
      await this.$validate()

      this.tcProfile.name = `${this.firstName} ${this.lastName}`

      await this.$store.dispatch('upsertTcProfile', this.tcProfile)
    },
  },
}
</script>
