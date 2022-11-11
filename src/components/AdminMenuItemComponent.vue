<template>
  <div class="columns is-mobile is-vcentered">
    <div class="column is-one-quarter-mobile is-one-fifth-tablet">{{ itemData.Name }}</div>
    <div class="column dotted-separator"></div>
    <div
      class="column has-text-right has-text-weight-bold is-one-quarter-mobile is-one-fifth-tablet"
    >
      {{ itemData.PriceMn }} Mn
    </div>
    <div class="p-3 is-flex is-flex-direction-column is-align-items-center">
      <IconComponent
        :icon-name="'edit'"
        @click="onEditClicked"
      />
      <DangerIconComponent
        icon-name="delete"
        @click="onDeleteClicked"
      />
    </div>
  </div>
</template>

<script>
import IconComponent from '@/components/IconComponent.vue';
import DangerIconComponent from '@/components/DangerIconComponent.vue';

export default {
  name: 'AdminMenuItemComponent',
  emits: ['onEditClick', 'onDeleteClick'],
  components: {
    IconComponent,
    DangerIconComponent,
  },
  props: {
    itemData: {
      required: true,
      type: Object,
      default: () => ({
        PriceMn: 'Price',
        Name: 'Product Name',
      }),
    },
  },
  methods: {
    onEditClicked() {
      this.$emit('onEditClick', this.itemData);
    },
    onDeleteClicked() {
      this.$emit('onDeleteClick', this.itemData);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/sass/_colors" as vars;

.columns {
  &:hover {
    background-color: vars.$grey-lightest;
  }
}

</style>
