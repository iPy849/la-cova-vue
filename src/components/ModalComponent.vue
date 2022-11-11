<template>
  <div class="modal is-active" v-if="active">
    <div
      class="modal-background"
    ></div>
    <div class="modal-card p-3">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <!-- Title ... -->
          <slot name="title"></slot>
        </p>
        <button
          v-show="!isDialog"
          class="delete"
          aria-label="close"
          @click="sendClose"
        ></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <slot name="content"></slot>
      </section>
      <footer class="modal-card-foot is-flex is-justify-content-space-evenly">
        <button
          class="button is-success"
          :disabled="isBlocked"
          @click="sendPostive"
        >
          <!-- Positive ... -->
          <slot name="positive"></slot>
        </button>
        <button
          class="button is-danger"
          @click="sendNegative"
          v-if="!isDialog"
        >
          <!-- Negative ... -->
          <slot name="negative"></slot>
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalComponent',
  emits: ['onModalClose', 'onModalPositiveClick', 'onModalNegativeClick'],
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    isDialog: {
      type: Boolean,
      default: () => false,
    },
    isBlocked: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    sendClose() {
      this.$emit('onModalClose');
    },
    sendPostive() {
      this.$emit('onModalPositiveClick');
    },
    sendNegative() {
      this.$emit('onModalNegativeClick');
    },
  },
};
</script>

<style scoped>

</style>
