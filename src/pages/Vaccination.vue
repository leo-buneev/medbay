<template>
  <QPage class="flex flex-top column">
    <div class="row">
      <div class="col-4">
        <QSelect
          v-model="vaccinationCreate.diseaseId"
          emit-value
          :display-value="
            _.get(
              diseaseOptions.find(item => item.value === vaccinationCreate.diseaseId),
              'label',
            ) || '-'
          "
          outlined
          :options="diseaseOptions"
          label="Onemocnění"
          class="q-mx-md q-mt-md"
        />
      </div>
      <div class="col-4">
        <QSelect
          v-model="vaccinationCreate.vaccination"
          outlined
          :options="vaccinationOptions"
          label="Vakcína"
          class="q-mx-md q-mt-md"
        />
      </div>
      <div class="col-4">
        <QSelect
          v-model="vaccinationCreate.vaccinationDose"
          outlined
          :options="vaccinationDoseOptions"
          label="Dóza"
          class="q-mx-md q-mt-md"
        />
      </div>
      <div class="col-4">
        <RInput v-model="vaccinationCreate.serialNumber" outlined label="Sériové číslo" class="q-mx-md q-mt-md" />
      </div>
      <div class="col-4">
        <RDatetime v-model="vaccinationCreate.date" outlined label="Datum aplikace" class="q-mx-md q-mt-md" />
      </div>
      <div class="col-12 text-right">
        <QBtn color="primary" label="Přidat" class="q-ma-md" @click="complete" />
      </div>
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
          <QTd key="vaccinationName" :props="props">
            {{ props.row.vaccinationName }}
          </QTd>
          <QTd key="serialNumber" :props="props">
            {{ props.row.serialNumber }}
          </QTd>
          <QTd key="dose" :props="props">
            {{ props.row.dose }}
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
import utils from '@/services/utils'

export default {
  data() {
    return {
      columns: [
        { name: 'mandatory', label: 'povinná', field: 'mandatory' },
        { name: 'date', label: 'datum', field: 'date' },
        { name: 'disease', label: 'onemocnění', field: 'disease' },
        { name: 'vaccinationName', label: 'vakcína', field: 'vaccinationName' },
        { name: 'serialNumber', label: 'sériové číslo', field: 'serialNumber' },
        { name: 'dose', label: 'dávka', field: 'dose' },
        { name: 'receipt', label: 'účtenka', field: 'receipt' },
        { name: 'nextDate', label: 'příští aplikace', field: 'nextDate' },
      ],
      mandatoryVaccination: [],
      vaccination: [],
      vaccinationCreate: {
        diseaseId: null,
        vaccination: null,
        vaccinationDose: null,
        serialNumber: null,
        date: null,
      },
    }
  },

  computed: {
    data() {
      const userVaccination = (this.$store.state.user.tcProfile.usedBenefits || [])
        .filter(item => item.type === 'vaccination')
        .map(item => {
          const intervalDays = utils.getIntervalDays(item, this.vaccination)

          return {
            ...item,
            date: moment(item.date).format('L'),
            mandatory: utils.getMandatory(item, this.vaccination),
            disease: utils.getDisease(item, this.vaccination),
            ...(intervalDays > 0 && {
              nextDate: moment(item.date)
                .add(intervalDays, 'days')
                .format('L'),
            }),
          }
        })

      console.log(userVaccination)

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

  watch: {
    'vaccinationCreate.diseaseId'() {
      this.vaccinationCreate.vaccination = null
      this.vaccinationCreate.vaccinationDose = null
    },

    'vaccinationCreate.vaccination'() {
      this.vaccinationCreate.vaccinationDose = null
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
      this.mandatoryVaccination = (tcVaccinatedDiseases.nodes || [])
        .filter(item => item.mandatory === true)
        .map(item => ({
          ...item,
          vaccinationName: item.vaccines.map(vaccine => vaccine.name).join(', '),
        }))
    },

    async complete(benefit) {
      const { tcProfile } = this.$store.state.user

      await this.$store.dispatch('upsertTcProfile', {
        ...tcProfile,
        usedBenefits: [
          ...tcProfile.usedBenefits,
          {
            name: this.diseaseOptions.find(item => item.value === this.vaccinationCreate.diseaseId).label,
            date: new Date(this.vaccinationCreate.date).toISOString(),
            vaccinationName: this.vaccinationCreate.vaccination,
            serialNumber: this.vaccinationCreate.serialNumber,
            dose: this.vaccinationCreate.vaccinationDose,
            tcVaccinatedDisease: {
              id: this.vaccinationCreate.diseaseId,
            },
            type: 'vaccination',
          },
        ],
      })
    },
  },
}
</script>
