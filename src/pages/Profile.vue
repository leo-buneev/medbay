<template>
  <QPage class="flex flex-top column">
    <QInput value="" outlined label="Jméno" class="q-mx-md q-mt-md" />
    <QInput value="" outlined label="Příjmení" class="q-mx-md q-mt-md" />
    <QSelect
      v-model="tcProfile.sex"
      :display-value="sexOptios.find(item => item.value === tcProfile.sex).label || ''"
      outlined
      :options="sexOptios"
      label="Pohlaví"
      class="q-mx-md q-mt-md"
    />
    <RDatetime v-model="tcProfile.birthDate" outlined label="Datum narození" class="q-mx-md q-mt-md" />
    <QSelect outlined :value="null" :options="{}" label="Pojištovna" class="q-mx-md q-mt-md" />
    <QInput v-model="tcProfile.email" outlined label="Email" class="q-mx-md q-mt-md" />
    <QInput value="" outlined type="password" label="Heslo" class="q-mx-md q-mt-md" />
    <QInput value="" outlined type="password" label="Opakovat heslo" class="q-mx-md q-mt-md" />
    <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Karta pojištěnce</h6>
    <QInput v-model="tcProfile.birthNumber" outlined label="Rodné číslo" class="q-mx-md q-mt-md" />
    <QInput value="" outlined label="Číslo průkazu" class="q-mx-md q-mt-md" />
    <RDatetime :value="null" outlined label="Platnost do" class="q-mx-md q-mt-md" />
    <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Doplňující údaje</h6>
    <QBtn color="primary" label="Uložit" class="q-ma-md" @click="save" />
  </QPage>
</template>

<script>
export default {
  validations: {},

  data() {
    console.log(this.$store.state.user.tcProfile)
    return {
      tcProfile: _.cloneDeep(this.$store.state.user.tcProfile),
      sexOptios: [
        { value: 'male', label: 'Muž' },
        { value: 'female', label: 'Žena' },
      ],
    }
  },

  safeMethods: {
    async save() {
      await this.$validate()
      await this.$store.dispatch('upsertTcProfile', this.tcProfile)
    },
  },
}
</script>
