<template>
  <QPage class="flex flex-top column">
    <VaccinationCreate />
    <div class="row">
      <div class="col-12">
        <QTable
          title="Očkování"
          :data="data"
          :columns="columns"
          row-key="name"
          title-class="text-primary"
          class="q-mx-md"
        >
          <template #body="props">
            <QTr :props="props" :class="{ 'no-apply': props.row.mandatory === true && props.row.date == null }">
              <QTd key="mandatory" :props="props">
                <QIcon
                  size="sm"
                  :color="props.row.mandatory === true ? 'primary' : 'grey'"
                  name="fas fa-exclamation-triangle"
                />
              </QTd>
              <QTd key="date" :props="props">
                {{ props.row.date }}
              </QTd>
              <QTd key="disease" :props="props">
                <span>
                  {{ props.row.disease }}
                </span>
              </QTd>
              <QTd key="vaccinationName" :props="props">
                <span>
                  {{ props.row.vaccinationName }}
                </span>
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
      </div>
    </div>
  </QPage>
</template>

<script>
import moment from 'moment'
import api from '@/services/api'
import utils from '@/services/utils'
import VaccinationCreate from '@/components/VaccinationCreate.vue'

export default {
  components: { VaccinationCreate },

  data() {
    return {
      columns: [
        { name: 'mandatory', label: 'povinná', field: 'mandatory', align: 'center' },
        { name: 'date', label: 'datum', field: 'date', align: 'left' },
        { name: 'disease', label: 'onemocnění', field: 'disease', align: 'left' },
        { name: 'vaccinationName', label: 'vakcína', field: 'vaccinationName', align: 'left' },
        { name: 'serialNumber', label: 'sériové číslo', field: 'serialNumber', align: 'left' },
        { name: 'dose', label: 'dávka', field: 'dose', align: 'right' },
        { name: 'receipt', label: 'účtenka', field: 'receipt', align: 'center' },
        { name: 'nextDate', label: 'příští aplikace', field: 'nextDate', align: 'right' },
      ],
      mandatoryVaccination: [],
      vaccination: [],
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

      const userVaccinationIds = userVaccination.flatMap(item => item.tcVaccinatedDisease.id)

      return [...userVaccination, ...this.mandatoryVaccination.filter(item => !userVaccinationIds.includes(item.id))]
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
  },
}
</script>

<style lang="scss">
.no-apply {
  background-size: 10px 10px;
  background-image: repeating-linear-gradient(45deg, $negative 0, $negative 1px, transparent 0, transparent 50%);

  & > td span {
    background-color: $negative;
    padding: ($space-x-base * 0.25) ($space-x-base * 0.5);
    color: #fff;
  }

  & > td .q-icon {
    color: $negative !important;
  }
}
</style>
