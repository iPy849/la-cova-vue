<template>
  <teleport to="#modalPlaceholder">
    <ModalComponent
      :active="isLoadingData"
      :is-blocked="true"
      :is-dialog="true"
    >
      <template #title>Procesando información</template>
      <template #content>
        <SpinnerComponent/>
      </template>
      <template #positive>Ok</template>
    </ModalComponent>
  </teleport>

  <form @submit.prevent="formHandler">
    <h1 class="title">
      Agregar producto:
    </h1>
    <!-- Control de sección -->
    <div class="field">
      <label class="label">Selecciona la sección que quieres trabajar:</label>
      <div class="control has-icons-left" id="sectionSelection">
        <div class="select" :class="{'is-loading': isLoadingData}">
          <IconComponent class="is-left" :icon-name="'menu_book'"/>
          <select :disabled="isLoadingData" v-model="selectedSection">
            <option disabled>-- Selecciona la sección --</option>
            <option>Nueva sección</option>
            <option
              v-for="(section, index) in sections"
              :key="index"
            >
              {{ section.section }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- Crear nueva sección -->
    <div class="field" v-if="isNewSection">
      <label class="label">Nombre de nueva sección:</label>
      <div class="control has-icons-left">
         <input
           v-model="newSection"
           class="input"
           type="text"
           placeholder="Nombre de la nueva sección"
           required
         >
        <span class="icon is-small is-left">
          <IconComponent icon-name="clear_all" />
        </span>
      </div>
    </div>
    <hr/>
    <h2 class="subtitle has-text-weight-bold">
      Información del producto:
    </h2>
    <!-- Nombre del producto -->
    <div class="field">
      <label class="label">Nombre del producto:</label>
      <div class="control has-icons-left">
        <input
          v-model="productName"
          class="input"
          type="text"
          placeholder="Nombre del producto"
          required
        >
        <span class="icon is-small is-left">
          <IconComponent icon-name="inventory_2" />
        </span>
      </div>
    </div>
    <!-- Precio del producto -->
    <div class="field">
      <label class="label">Precio del producto (Mn):</label>
      <div class="control has-icons-left">
        <input
          v-model="productPrice"
          class="input"
          type="number"
          min="0"
          placeholder="Precio del producto en Mn"
          required
        >
        <span class="icon is-small is-left">
          <IconComponent icon-name="attach_money" />
        </span>
      </div>
    </div>
    <div class="field has-text-centered">
      <input class="button is-success control" type="submit" value="Crear producto">
    </div>
  </form>
</template>

<script>
import IconComponent from '@/components/IconComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';

import services from '@/services';
import UINotification from '@/models/notifications';

export default {
  name: 'AdminMenuAddView',
  components: {
    IconComponent,
    ModalComponent,
    SpinnerComponent,
  },
  data() {
    return {
      sections: [],
      isLoadingData: true,
      selectedSection: null,
      newSection: null,
      productName: null,
      productPrice: null,
    };
  },
  async created() {
    this.sections = await services.getSections();

    this.isLoadingData = false;
  },
  methods: {
    async formHandler() {
      this.isLoadingData = true;

      // Hay nueva sección
      if (this.newSection) {
        const newSectionData = await services.addSection(this.newSection);

        // Se registró correctamente la sección
        if (newSectionData) {
          this.sections.push(newSectionData);
          this.selectedSection = newSectionData.section;
          const notification = new UINotification(
            'Sección agregada con éxito',
            UINotification.notificationLevels.SUCCESS,
          );
          this.$store.commit('addNotification', notification);
        } else {
          const notification = new UINotification(
            'Error al agregar la nueva sección, recargue la página e intente otra vez',
            UINotification.notificationLevels.ERROR,
          );
          this.$store.commit('addNotification', notification);
          this.isLoadingData = false;
          return;
        }
      }

      // Encuentra el id de la sección
      this.selectedSection = this.sections.find(
        (section) => section.section === this.selectedSection,
      ).id;

      // Registrar nuevo producto
      const newProductData = await services.addFoodInSection(
        this.selectedSection,
        this.productName,
        this.productPrice,
      );

      if (newProductData) {
        const notification = new UINotification(
          'Producto agregado con éxito',
          UINotification.notificationLevels.SUCCESS,
        );
        this.$store.commit('addNotification', notification);
      } else {
        const notification = new UINotification(
          'Error al agregar el nuevo producto, recargue la página e intente otra vez',
          UINotification.notificationLevels.ERROR,
        );
        this.$store.commit('addNotification', notification);
      }

      setTimeout(() => {
        this.isLoadingData = false;
        this.$router.go();
      }, 3000);
    },
  },
  computed: {
    isNewSection() {
      return this.selectedSection === 'Nueva sección';
    },
  },
};
</script>

<style scoped>

</style>
