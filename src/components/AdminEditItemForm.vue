<template>
  <form>
    <div class="field">
      <label class="label">Nombre del producto:</label>
      <div class="control has-icons-left">
        <input
          class="input is-rounded"
          type="text"
          placeholder="Nombre del producto"
          v-model="Name"
          @input="formHandle"
        >
        <span class="icon is-small is-left">
          <IconComponent icon-name="inventory_2" />
        </span>
      </div>
      <p class="help">Edite el nombre del producto</p>
    </div>
    <div class="field">
      <label class="label">Precio del producto (Moneda nacional):</label>
      <div class="control has-icons-left">
        <input
          class="input is-rounded"
          type="number"
          min="0"
          placeholder="Precio del producto"
          v-model="PriceMn"
          @input="formHandle"
        >
        <span class="icon is-small is-left">
          <IconComponent icon-name="attach_money" />
        </span>
      </div>
      <p class="help">Edite el precio del producto</p>
    </div>
  </form>
</template>

<script>
import IconComponent from '@/components/IconComponent.vue';

export default {
  components: { IconComponent },
  emits: ['formChanges'],
  name: 'AdminEditItemForm',
  props: {
    nameData: String,
    priceData: Number,
  },
  data() {
    return {
      Name: this.nameData,
      PriceMn: this.priceData,
    };
  },
  methods: {
    formHandle() {
      this.$emit('formChanges', { ...this.$data });
    },
  },
};
</script>
