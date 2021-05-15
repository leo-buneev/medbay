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
      <QTabPanels v-model="tab" animated swipeable>
        <QTabPanel name="advice"><Advices /></QTabPanel>
        <QTabPanel name="vaccination"><Vaccination /></QTabPanel>
        <QTabPanel name="profile"><Profile /></QTabPanel>
      </QTabPanels>
    </QPageContainer>
    <!-- <QPageContainer>
      <Transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <RouterView :key="$route.path" />
      </Transition>
    </QPageContainer> -->

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
        <QTab icon="fas fa-exclamation" name="advice">Doporučení</QTab>
        <QTab icon="fas fa-syringe" name="vaccination">Očkování</QTab>
        <QTab icon="fas fa-id-card" name="profile">Profil</QTab>
      </QTabs>
    </QFooter>
  </QLayout>
</template>

<script>
import Advices from '@/pages/Advices.vue'
import Profile from '@/pages/Profile.vue'
import Vaccination from '@/pages/Vaccination.vue'

// const linksData = [
//   {
//     title: 'Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev',
//   },
//   {
//     title: 'Github',
//     caption: 'github.com/quasarframework',
//     icon: 'code',
//     link: 'https://github.com/quasarframework',
//   },
//   {
//     title: 'Discord Chat Channel',
//     caption: 'chat.quasar.dev',
//     icon: 'chat',
//     link: 'https://chat.quasar.dev',
//   },
//   {
//     title: 'Forum',
//     caption: 'forum.quasar.dev',
//     icon: 'record_voice_over',
//     link: 'https://forum.quasar.dev',
//   },
//   {
//     title: 'Twitter',
//     caption: '@quasarframework',
//     icon: 'rss_feed',
//     link: 'https://twitter.quasar.dev',
//   },
//   {
//     title: 'Facebook',
//     caption: '@QuasarFramework',
//     icon: 'public',
//     link: 'https://facebook.quasar.dev',
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev',
//   },
// ]

export default {
  name: 'MainLayout',
  components: { Profile, Advices, Vaccination },
  data() {
    return {
      tab: 'advice',
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
    width: 50%;
  }
}
</style>
