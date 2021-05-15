<template>
  <QPage class="flex flex-top column">
    <QBtn label="Naskenovat kartu pojistence" no-caps color="primary" class="q-mx-md" @click="scanId" />
    <RInput v-model="firstName" outlined label="Jméno" class="q-mx-md q-mt-md" />
    <RInput v-model="lastName" outlined label="Příjmení" class="q-mx-md q-mt-md" />
    <QSelect
      v-model="tcProfile.sex"
      emit-value
      :display-value="
        _.get(
          sexOptions.find(item => item.value === tcProfile.sex),
          'label',
        ) || '-'
      "
      outlined
      :options="sexOptions"
      label="Pohlaví"
      class="q-mx-md q-mt-md"
    />
    <RDatetime v-model="tcProfile.birthDate" outlined label="Datum narození" class="q-mx-md q-mt-md" />
    <QSelect
      v-model="tcProfile.tcInsuranceCompany.id"
      emit-value
      :display-value="
        _.get(
          insuranceCompanyOptios.find(item => item.value === tcProfile.tcInsuranceCompany.id),
          'label',
        ) || '-'
      "
      outlined
      :options="insuranceCompanyOptios"
      label="Pojištovna"
      class="q-mx-md q-mt-md"
    />
    <RInput v-model="tcProfile.email" outlined label="Email" class="q-mx-md q-mt-md" />
    <RInput value="" outlined type="password" label="Heslo" class="q-mx-md q-mt-md" />
    <RInput value="" outlined type="password" label="Opakovat heslo" class="q-mx-md q-mt-md" />
    <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Karta pojištěnce</h6>
    <RInput
      v-model="tcProfile.birthNumber"
      :vuelidate="$v.tcProfile.birthNumber"
      outlined
      label="Rodné číslo"
      class="q-mx-md q-mt-md"
    />
    <RInput v-model="tcProfile.insuranceDocumentNumber" outlined label="Číslo průkazu" class="q-mx-md q-mt-md" />
    <RDatetime v-model="tcProfile.insuranceExpiration" outlined label="Platnost do" class="q-mx-md q-mt-md" />
    <!-- <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Doplňující údaje</h6> -->
    <QBtn color="primary" label="Uložit" class="q-ma-md" @click="save" />
  </QPage>
</template>

<script>
import api from '@/services/api'
import { validations } from 'rads'

const { required } = validations

export default {
  validations: {
    tcProfile: {
      birthNumber: { required },
    },
  },

  data() {
    console.log(required)
    const profile = this.$store.state.user.tcProfile

    let lastName = profile.name.split(' ')
    lastName = lastName[lastName.length - 1]

    return {
      tcProfile: _.cloneDeep(profile),
      firstName: profile.name.replace(` ${lastName}`, ''),
      lastName: lastName,
      sexOptions: [
        { value: 'male', label: 'Muž' },
        { value: 'female', label: 'Žena' },
      ],
      insuranceCompanyOptios: [],
    }
  },

  created() {
    this.init()
  },

  methods: {
    async scanId() {
      const picture = await camera.takePicture()
      const blobToUpload = b64toBlob(picture, 'image/png')
      const imageUrl = await azureStorage.upload('medkit', 'image2.jpg', blobToUpload)
      const endpoint = 'https://medkit-vision.cognitiveservices.azure.com/'
      const key = '1579fbce7f904bf6bf42a4e77e709c94'
      const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
        endpoint,
      )
      let result = await computerVisionClient.read(imageUrl, { language: 'cs' })
      const operation = result.operationLocation.split('/').slice(-1)[0]

      // Wait for read recognition to complete
      // result.status is initially undefined, since it's the result of read
      while (result.status !== 'succeeded') {
        await tc.delay(1000)
        result = await computerVisionClient.getReadResult(operation)
      }
      console.log(result)

      return result.analyzeResult.readResults
    },
  },

  safeMethods: {
    async init() {
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
