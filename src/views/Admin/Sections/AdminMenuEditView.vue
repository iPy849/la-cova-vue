<template>
  <teleport to="#modalPlaceholder">
    <ModalComponent
      :active="modal"
      :is-dialog="isWaitingEdit"
      :is-blocked="!this.editFormData || isWaitingEdit"
      @onModalClose="closeModalHandler"
      @onModalPositiveClick="positiveModalHandler"
      @onModalNegativeClick="closeModalHandler"
    >
      <template #title>Edición de {{ selectedData.Name }}</template>
      <template #content>
        <SpinnerComponent v-if="isWaitingEdit"/>
        <AdminEditItemForm
          v-else
          :nameData="selectedData.Name"
          :priceData="selectedData.PriceMn"
          @formChanges="formHandler"
        />
      </template>
      <template #positive>Guardar</template>
      <template #negative>Cancelar</template>
    </ModalComponent>

    <ModalComponent
      :active="isWaitingDeletion"
      :is-blocked="true"
      :is-dialog="true"
    >
      <template #title>Borrando elemento</template>
      <template #content>
        <SpinnerComponent/>
      </template>
      <template #positive>Borrando...</template>
    </ModalComponent>
  </teleport>

  <h1 class="title">Edición de Menú:</h1>
  <SpinnerComponent v-if="isDataLoading"/>
  <section
    v-else
    class="pb-1"
    v-for="(section, i) in sections"
    :key="i"
  >

    <h2 class="subtitle has-text-weight-bold">
      {{ section }}
      <span>
        <DangerIconComponent
          icon-name="delete"
          @click="deleteSection(menuData[section].id)"
        />
      </span>
    </h2>

    <div v-if="menuData[section].items.length">
      <AdminMenuItemComponent
        v-for="(item, j) in sectionItems(section)"
        :key="j"
        :item-data="{...item, section, index: j}"
        @onEditClick="onEditClickHandler"
        @onDeleteClick="onDeleteClickHandler"
      />
    </div>
    <p v-else>No hay elementos disponibles en esta sección...</p>
    <hr/>
  </section>
</template>

<script>
// TODO: Probar todas las funciones de la vista
import DangerIconComponent from '@/components/DangerIconComponent.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import AdminMenuItemComponent from '@/components/AdminMenuItemComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import AdminEditItemForm from '@/components/AdminEditItemForm.vue';
import services from '@/services/index';
import UINotification from '@/models/notifications';

export default {
  name: 'AdminMenuPreviewView',
  components: {
    SpinnerComponent,
    AdminMenuItemComponent,
    ModalComponent,
    AdminEditItemForm,
    DangerIconComponent,
  },
  data() {
    return {
      menuData: {},
      modal: false,
      isWaitingEdit: false,
      isWaitingDeletion: false,
      selectedData: null,
      editFormData: null,
    };
  },
  async created() {
    const menuSections = await services.getSections();
    for (let i = 0; i < menuSections.length; i++) {
      const sectionData = menuSections[i];
      const items = await services.getFoodBySection(sectionData.id);
      this.menuData[sectionData.section] = {
        id: sectionData.id,
        items,
      };
    }
  },
  methods: {
    sectionItems(sectionName) {
      return this.menuData[sectionName].items;
    },
    // Sections
    async deleteSection(sectionId) {
      // TODO: Hacer esta función más elegante para quitar de la lista que se muestra
      this.isWaitingDeletion = true;
      if (await services.deleteSections(sectionId)) {
        this.sections.forEach((s) => {
          if (this.menuData[s].id === sectionId) {
            delete this.menuData[s];
          }
        });
        const message = 'Eliminación de sección exitosa';
        const notification = new UINotification(
          message,
          UINotification.notificationLevels.SUCCESS,
        );
        this.$store.commit('addNotification', notification);
      } else {
        const message = 'Error al realizar la eliminación de la sección';
        const notification = new UINotification(
          message,
          UINotification.notificationLevels.ERROR,
        );
        this.$store.commit('addNotification', notification);
      }
      this.isWaitingDeletion = false;
    },
    // Items
    onEditClickHandler(data) {
      this.modal = true;
      this.selectedData = data;
    },
    async onDeleteClickHandler(data) {
      this.isWaitingDeletion = true;
      const result = await services.deleteFood(data.sectionId, data.id);
      if (result) {
        this.menuData[data.section].items.splice(data.index, 1);
        const message = 'Eliminación exitosa';
        const notification = new UINotification(
          message,
          UINotification.notificationLevels.SUCCESS,
        );
        this.$store.commit('addNotification', notification);
      } else {
        const message = 'Error al realizar la eliminación del elemento';
        const notification = new UINotification(
          message,
          UINotification.notificationLevels.ERROR,
        );
        this.$store.commit('addNotification', notification);
      }
      this.isWaitingDeletion = false;
    },
    // Modal
    closeModalHandler() {
      this.editFormData = null;
      this.modal = false;
      this.isWaitingDeletion = false;
    },
    async positiveModalHandler() {
      this.isWaitingEdit = true;
      const result = await services.editFood(
        this.selectedData.sectionId,
        this.selectedData.id,
        this.editFormData,
      );
      if (result) {
        const {
          section,
          index,
        } = this.selectedData;
        this.menuData[section].items[index].Name = this.editFormData.Name;
        this.menuData[section].items[index].PriceMn = this.editFormData.PriceMn;
        const message = 'Edición exitosa';
        const notification = new UINotification(
          message,
          UINotification.notificationLevels.SUCCESS,
        );
        this.$store.commit('addNotification', notification);
      } else {
        const message = 'Error al realizar la edición del elemento';
        const notification = new UINotification(
          message,
          UINotification.notificationLevels.ERROR,
        );
        this.$store.commit('addNotification', notification);
      }
      this.isWaitingEdit = false;
      this.closeModalHandler();
    },
    // Formulario
    formHandler(data) {
      const didEdited = (
        data.Name !== this.selectedData.Name || data.PriceMn !== this.selectedData.PriceMn
      );
      this.editFormData = didEdited ? data : null;
    },
  },
  computed: {
    sections() {
      return Object.keys(this.menuData);
    },
    isDataLoading() {
      return Object.keys(this.menuData).length === 0;
    },
  },
};
</script>
