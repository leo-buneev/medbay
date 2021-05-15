<template>
  <div>
    <QDialog
      v-for="m of modals"
      :key="`modal-${m.id}`"
      ref="modal"
      :minimized="m.minimized"
      :maximized="m.maximized"
      :no-backdrop-dismiss="m.noBackdropDismiss"
      :skip-open-notification="m.skipOpenNotification"
      @hide="m.onHide"
    >
      <Component :is="m.component" v-bind="m.props" v-on="m.listeners" />
    </QDialog>
  </div>
</template>

<script>
import { QDialog } from 'quasar'
import { dialog } from 'rads'

export default {
  compoennts: { QDialog },
  data() {
    return {
      modals: [],
    }
  },
  mounted() {
    const showComponentDialogHandler = ({
      component,
      props,
      listeners,
      maximized,
      minimized,
      noBackdropDismiss,
      skipOpenNotification,
      onHide,
    }) => {
      const newModal = {
        id: createGuid(),
        component,
        props,
        listeners,
        maximized,
        minimized,
        noBackdropDismiss,
        skipOpenNotification,
        onHide: () => {
          this.modals = this.modals.filter(m => m.id !== newModal.id)
          onHide()
        },
      }
      this.modals.push(newModal)
      this.$nextTick(() => {
        this.$refs.modal[this.modals.length - 1].show()
      })
    }
    dialog.showComponentDialogHandler = showComponentDialogHandler
  },
  beforeDestroy() {
    dialog.showComponentDialogHandler = undefined
  },
}
</script>
