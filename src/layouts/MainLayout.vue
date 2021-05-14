<template>
  <QLayout view="lHh Lpr lFf" class="main-layout">
    <QHeader elevated>
      <QToolbar>
        <QBtn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <QToolbarTitle>
          MedBay
        </QToolbarTitle>
      </QToolbar>
    </QHeader>

    <QDrawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <QList>
        <QItemLabel header class="text-grey-8">
          Essential Links
        </QItemLabel>
        <!-- <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" /> -->
      </QList>
    </QDrawer>

    <QPageContainer>
      <QTabPanels v-model="tab" animated>
        <QTabPanel name="advices"><AdvicePage /></QTabPanel>
        <QTabPanel name="profile">Profil</QTabPanel>
        <QTabPanel name="history">Archiv</QTabPanel>
      </QTabPanels>
    </QPageContainer>

    <QFooter>
      <QTabs
        v-model="tab"
        class="main-layout__tabs text-grey-5"
        no-caps
        indicator-color="transparent"
        active-color="white"
        align="center"
        shrink
      >
        <QTab icon="fas fa-exclamation" name="advices">Doporučení</QTab>
        <QTab icon="fas fa-id-card" name="profile">Profil</QTab>
        <QTab icon="fas fa-history" name="history">Archiv</QTab>
      </QTabs>
    </QFooter>
  </QLayout>
</template>

<script>
import AdvicePage from '@/pages/AdvicePage.vue'

export default {
  name: 'MainLayout',
  components: { AdvicePage },
  data() {
    return {
      tab: 'advices',
      leftDrawerOpen: false,
    }
  },
  created() {
    this.init()
  },
  safeMethods: {
    async init() {
      await this.$store.dispatch('init')
    },
  },
}
</script>

<style lang="scss">
.main-layout__tabs {
  .q-tab {
    width: 33%;
  }
}
</style>
