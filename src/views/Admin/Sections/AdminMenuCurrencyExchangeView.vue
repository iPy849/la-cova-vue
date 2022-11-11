<template>
  <ModalComponent
    :is-blocked="isLoading || !newCurrencyName || !newCurrencyValue"
    :active="newCurrencyModal"
    :is-dialog="isLoading"
    @onModalClose="closeModal"
    @onModalNegativeClick="closeModal"
    @onModalPositiveClick="createCurrency"
  >
    <template #title>Adición de moneda</template>
    <template #content>
      <SpinnerComponent v-if="isLoading"/>
      <form v-else>
        <label class="label">Nombre de la moneda:</label>
        <div class="control has-icons-left">
          <input
            v-model="newCurrencyName"
            class="input"
            type="text"
            placeholder="Nombre de la nueva moneda"
            maxlength="3"
            required
          >
          <span class="icon is-small is-left">
            <IconComponent icon-name="attach_money" />
          </span>
        </div>
        <label class="label">Equivalencia en moneda en Mn:</label>
        <div class="control has-icons-left">
          <input
            v-model.number="newCurrencyValue"
            class="input"
            type="number"
            min="0"
            max="9999"
            placeholder="Equivalencia en Mn"
            required
          >
          <span class="icon is-small is-left">
            <IconComponent icon-name="paid" />
          </span>
        </div>
      </form>
    </template>
    <template #positive>Guardar</template>
    <template #negative>Cancelar</template>
  </ModalComponent>

  <SpinnerComponent v-if="isLoading" message="Cargando"/>
  <form @submit.prevent v-else>
    <h1 class="title ">
      Tasas de cambio:
    </h1>

    <div
      class="columns"
      v-if="this.currencies.length"
      v-for="(currency, index) in currencies"
      :key="index"
    >
      <div class="control column is-flex is-align-items-center">
          <label class="label pr-3 mb-0">{{ currency.Name }}:</label>
          <input
            v-model.number="currency.Value"
            class="input is-rounded"
            type="number"
            placeholder="Equivalencia"
            maxlength="4"
            minlength="0"
            min="0"
            max="9999"
          >
        <IconComponent
          class="ml-3"
          icon-name="save"
          @click="editCurrency(index)"
        />
        <DangerIconComponent
          class="ml-3"
          icon-name="delete"
          @click="deleteCurrency(index)"
        />
      </div>
    </div>
    <p v-else class="has-text-centered pb-5">No hay tasas de cambios registradas</p>

    <div class="field has-text-centered">
      <input
        @click="openModal"
        class="button is-success control"
        type="submit"
        value="Agregar moneda">
    </div>
  </form>
</template>

<script>
import ModalComponent from '@/components/ModalComponent.vue';
import IconComponent from '@/components/IconComponent.vue';
import DangerIconComponent from '@/components/DangerIconComponent.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import services from '@/services';
import UINotification from '@/models/notifications';

export default {
  name: 'AdminMenuMoneyExchangeView',
  components: {
    ModalComponent,
    SpinnerComponent,
    IconComponent,
    DangerIconComponent,
  },
  watch: {
    newCurrencyValue(newVal, oldVal) {
      if (newVal > 9999) {
        this.newCurrencyValue = oldVal;
      } else if (newVal <= 0) {
        this.newCurrencyValue = 1;
      }
    },
  },
  data() {
    return {
      newCurrencyModal: false,
      newCurrencyName: null,
      newCurrencyValue: null,
      isLoading: false,
      currencies: [],
      currencyEdition: null,
    };
  },
  async created() {
    this.isLoading = true;
    this.currencies = await services.getAllCurrencyExchange();
    this.isLoading = false;
  },
  methods: {
    openModal() {
      this.newCurrencyModal = true;
    },
    closeModal() {
      this.newCurrencyName = null;
      this.newCurrencyValue = null;
      this.newCurrencyModal = false;
    },
    async createCurrency() {
      this.isLoading = true;
      const result = await services.addCurrencyExchange(
        this.newCurrencyName.toUpperCase(),
        this.newCurrencyValue,
      );
      if (result) {
        const newCurrency = {
          id: result,
          Name: this.newCurrencyName.toUpperCase(),
          Value: this.newCurrencyValue,
        };
        this.currencies.push(newCurrency);
        this.newCurrencyValue = null;
        this.newCurrencyName = null;
        const notification = new UINotification(
          'Moneda agregada con éxito',
          UINotification.notificationLevels.SUCCESS,
        );
        this.$store.commit('addNotification', notification);
      } else {
        const notification = new UINotification(
          'No se ha podido agregar la nueva moneda',
          UINotification.notificationLevels.ERROR,
        );
        this.$store.commit('addNotification', notification);
      }
      this.isLoading = false;
      this.closeModal();
    },
    async editCurrency(index) {
      this.isLoading = true;
      const { id } = this.currencies[index];
      const data = {
        Name: this.currencies[index].Name,
        Value: this.currencies[index].Value,
      };
      const r = await services.editCurrencyExchange(id, data);
      if (r) {
        const notification = new UINotification(
          'Moneda editada con éxito',
          UINotification.notificationLevels.SUCCESS,
        );
        this.$store.commit('addNotification', notification);
      } else {
        const notification = new UINotification(
          `No se ha podido editar la moneda ${data.Name}`,
          UINotification.notificationLevels.ERROR,
        );
        this.$store.commit('addNotification', notification);
      }
      this.isLoading = false;
    },
    async deleteCurrency(index) {
      this.isLoading = true;
      const { id } = this.currencies[index];
      const r = await services.deleteCurrencyExchange(id);
      if (r) {
        this.currencies.splice(index, 1);
        const notification = new UINotification(
          'Moneda eliminda con éxito',
          UINotification.notificationLevels.SUCCESS,
        );
        this.$store.commit('addNotification', notification);
      } else {
        const notification = new UINotification(
          `No se ha podido eliminar la moneda ${this.currencies[index].Name}`,
          UINotification.notificationLevels.ERROR,
        );
        this.$store.commit('addNotification', notification);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>

</style>
