<template>
  <QItem clickable tag="a" target="_blank" :href="link">
    <QItemSection v-if="icon" avatar>
      <QIcon :name="icon" />
    </QItemSection>

    <QItemSection>
      <QItemLabel>{{ title }}</QItemLabel>
      <QItemLabel caption>
        {{ caption }}
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },
}
</script>
