<template>
  <QCard style="min-width: 300px;">
    <QCardSection>
      <QSelect v-model="vaccine" :options="vaccineOptions" label="Vyberte vyrobce vasi vakciny" />
    </QCardSection>
    <QCardActions class="text-right"><QBtn flat label="Ulozit" @click="save" /></QCardActions>
  </QCard>
</template>

<script>
export default {
  props: ['benefit'],
  data() {
    return {
      vaccine: null,
    }
  },
  computed: {
    vaccineOptions() {
      return this.benefit.tcVaccinatedDisease.vaccines.map(v => v.name).map(x => ({ label: x, value: x }))
    },
  },
  methods: {
    save() {
      this.$emit('input', this.vaccine?.value)
      this.$hideTopDialog()
    },
  },
}
</script>
