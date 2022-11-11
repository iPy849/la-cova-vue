<template>
  <span
    :style="{
        background: bg,
        color: color
    }"
    class="icon">
    <span class="material-icons">{{ iconName }}</span>
  </span>
</template>

<script>
export default {
  name: 'IconComponent',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    bg: String,
    color: String,
  },
};
</script>

<style lang="scss" scoped>
.icon {
  border-radius: 100%;
  padding: 1rem;
  transition: .2s transform;

  &:hover {
    transform: scale(1.2);
  }
}
</style>
