<template>
  <QPage class="flex flex-top column">
    <QInput value="" outlined label="Jméno" class="q-mx-md q-mt-md" />
    <QInput value="" outlined label="Příjmení" class="q-mx-md q-mt-md" />
    <QSelect outlined :value="null" :options="{}" label="Pohlaví" class="q-mx-md q-mt-md" />
    <RDatetime v-model="tcProfile.birthDate" outlined label="Datum narození" class="q-mx-md q-mt-md" />
    <QSelect outlined :value="null" :options="{}" label="Pojištovna" class="q-mx-md q-mt-md" />
    <QInput v-model="tcProfile.email" outlined label="Email" class="q-mx-md q-mt-md" />
    <QInput value="" outlined type="password" label="Heslo" class="q-mx-md q-mt-md" />
    <QInput value="" outlined type="password" label="Opakovat heslo" class="q-mx-md q-mt-md" />
    <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Karta pojištěnce</h6>
    <QInput v-model="tcProfile.birthNumber" outlined label="Rodné číslo" class="q-mx-md q-mt-md" />
    <QInput value="" outlined label="Číslo průkazu" class="q-mx-md q-mt-md" />
    <RDatetime :value="new Date().toISOString()" outlined label="Platnost do" class="q-mx-md q-mt-md" />
    <h6 class="q-mx-md q-mt-lg q-mb-none text-primary">Doplňující údaje</h6>
    <QBtn color="primary" label="Save" class="q-mx-md q-mt-md" @click="save" />
  </QPage>
</template>

<script>
export default {
  validations: {},

  data() {
    console.log(this.$store.state.user.tcProfile)
    return { tcProfile: _.cloneDeep(this.$store.state.user.tcProfile) }
  },

  safeMethods: {
    async save() {
      await this.$validate()
      await this.$store.dispatch('upsertTcProfile', this.tcProfile)
    },
  },
}
</script>
