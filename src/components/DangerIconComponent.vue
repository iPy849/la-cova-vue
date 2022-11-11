<template>
  <IconComponent :icon-name="iconName"/>
</template>

<script>
import IconComponent from '@/components/IconComponent.vue';

export default {
  components: { IconComponent },
  name: 'DangerIconComponent',
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/sass/_colors" as vars;

.icon {
  background-color: vars.$danger;
  background-repeat: no-repeat;
  color: vars.$light;
}
</style>
