<template>
  <span class="spinner"></span>
  <p class="has-text-centered" v-if="message">{{ message }}</p>
</template>

<script>
export default {
  name: 'SpinnerComponent',
  props: {
    message: String,
  },
};
</script>

<style scoped>

</style>
