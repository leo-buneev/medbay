<template>
  <QPage class="flex flex-top column">
    <QInput v-model="firstName" outlined label="Jméno" class="q-mx-md q-mt-md" />
    <QInput v-model="lastName" outlined label="Příjmení" class="q-mx-md q-mt-md" />
    <QSelect
      v-model="tcProfile.sex"
      emit-value
      :display-value="sexOptios.find(item => item.value === tcProfile.sex).label || ''"
      outlined
      :options="sexOptios"
      label="Pohlaví"
      class="q-mx-md q-mt-md"
    />
    <RDatetime v-model="tcProfile.birthDate" outlined label="Datum narození" class="q-mx-md q-mt-md" />
    <QSelect
      v-model="tcProfile.tcInsuranceCompany.id"
      emit-value
      :display-value="insuranceCompanyOptios.find(item => item.value === tcProfile.tcInsuranceCompany.id).label || ''"
      outlined
      :options="insuranceCompanyOptios"
      label="Pojištovna"
      class="q-mx-md q-mt-md"
    />
    <QInput v-model="tcProfile.email" outlined label="Email" class="q-mx-md q-mt-md" />
    <QInput value="" outlined type="password" label="Heslo" class="q-mx-md q-mt-md" />
    <QInput value="" outlined type="password" label="Opakovat heslo" class="q-mx-md q-mt-md" />
    <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Karta pojištěnce</h6>
    <QInput v-model="tcProfile.birthNumber" outlined label="Rodné číslo" class="q-mx-md q-mt-md" />
    <QInput v-model="tcProfile.insuranceDocumentNumber" outlined label="Číslo průkazu" class="q-mx-md q-mt-md" />
    <RDatetime v-model="tcProfile.insuranceExpiration" outlined label="Platnost do" class="q-mx-md q-mt-md" />
    <!-- <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Doplňující údaje</h6> -->
    <QBtn color="primary" label="Uložit" class="q-ma-md" @click="save" />
  </QPage>
</template>

<script>
import api from '@/services/api'

export default {
  validations: {},

  data() {
    const profile = this.$store.state.user.tcProfile

    let lastName = profile.name.split(' ')
    lastName = lastName[lastName.length - 1]

    return {
      tcProfile: _.cloneDeep(profile),
      firstName: profile.name.replace(` ${lastName}`, ''),
      lastName: lastName,
      sexOptios: [
        { value: 'male', label: 'Muž' },
        { value: 'female', label: 'Žena' },
      ],
      insuranceCompanyOptios: [],
    }
  },

  created() {
    this.init()
  },

  safeMethods: {
    async init() {
      console.log('this')
      const { tcInsuranceCompanies } = await api.query({
        query: gql`
          query {
            tcInsuranceCompanies {
              nodes {
                id
                name
                code
              }
            }
          }
        `,
      })

      this.insuranceCompanyOptios = tcInsuranceCompanies.nodes.map(item => ({
        value: item.id,
        label: `${item.code} - ${item.name}`,
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
