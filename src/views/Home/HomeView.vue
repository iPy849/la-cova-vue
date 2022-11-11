<template>
  <!-- Modales -->
  <teleport to="#modalPlaceholder">
    <ModalComponent
      :active="currencyModal"
      :is-dialog="true"
      @onModalPositiveClick="closeCurrencyModal"
    >
      <template #title>Selecciona la tasa de cambio:</template>
      <template #content>
        <small class="subtitle is-6">Selecciona una opción:</small>
        <div class="menu">
          <ul class="menu-list">
            <li
              v-for="(currency, i) in getCurrencyExchange" :key="i"
              @click="setCurrentCurrency(currency)"
            >
              <a
                class="is-flex is-align-items-center"
                :class="{
                  'has-background-dark': getCurrentCurrency.Name === currency.Name,
                  'has-text-light': getCurrentCurrency.Name === currency.Name,
                }"
              >
                <IconComponent icon-name="chevron_right" />
                {{ currency.Name }} - {{ currency.Value }} Mn
              </a>
            </li>
          </ul>
        </div>
      </template>
      <template #positive>Ok</template>
    </ModalComponent>

  </teleport>

  <!-- Navbar -->
  <header v-if="!this.isLoading">
    <nav
      class="navbar p-5 is-justify-content-space-between has-background-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <div class="title m-0 has-text-white">
          La Cova
        </div>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample" ref="burger"
           @click="this.openResponsiveBurguer">
          <span class="has-background-light" aria-hidden="true"></span>
          <span class="has-background-light" aria-hidden="true"></span>
          <span class="has-background-light" aria-hidden="true"></span>
        </a>
      </div>
      <div
        ref="navbarMenu"
        class="navbar-menu is-shadowless has-background-dark"
      >
        <div class="navbar-start m-0">
          <a
            v-for="(section, i) in getSectionsName"
            :key="i"
            :href="'#'+generateSectionId(section)"
            class="navbar-item has-text-white"
            @click="openResponsiveBurguer"
          >
            {{ section }}
          </a>
        </div>
      </div>
    </nav>
  </header>

  <!-- FAB -->
  <div
    class="fab is-inline-block"
    v-if="!this.isLoading"
  >
    <button
      class="button is-normal is-rounded is-primary is-outlined has-background-white m-1"
      @click="toggleCurrencyModal"
      type="button"
    >
      Moneda
    </button>

    <div
      class="button is-normal has-text-white has-background-dark m-1 circle-button"
      @click="toTop"
    >
      <IconComponent icon-name="arrow_upward"/>
    </div>
  </div>

  <!-- Content -->
  <main class="p-4 m-auto">
    <div v-if="this.isLoading" class="p-6">
      <SpinnerComponent />
      <small class="m-auto navbar-item w-fit-content">Cargando información...</small>
    </div>
    <!-- Sections -->
    <section
      v-for="(section, index_i) in this.getSectionsName"
      :key="index_i"
      v-else
    >
      <!-- Items -->
      <h2 class="title" :id="generateSectionId(section)">{{ section }}</h2>
      <div v-for="(item, index_j) in this.menu[section]" :key="index_j">
        <div class="columns is-mobile is-vcentered">
          <div class="column is-one-third-mobile is-one-fifth-tablet">{{ item.Name }}</div>
          <div class="column dotted-separator"></div>
          <div
            class="column has-text-right has-text-weight-bold is-one-third-mobile
                  is-one-fifth-tablet"
          >
            {{ calculatePrice(item.PriceMn) }} {{ getCurrentCurrency.Name }}
          </div>
        </div>
      </div>
      <hr>
    </section>
  </main>
</template>

<script>
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import IconComponent from '@/components/IconComponent.vue';

import ModalComponent from '@/components/ModalComponent.vue';
import services from '@/services';

export default {
  name: 'HomeView',
  components: { SpinnerComponent, ModalComponent, IconComponent },
  data() {
    return {
      menu: {},
      isLoading: true,
      currencyModal: false,
    };
  },
  async created() {
    // Llamar la información del menú
    const sections = await services.getSections();
    for (let i = 0; i < sections.length; i++) {
      this.menu[sections[i].section] = await services.getFoodBySection(sections[i].id);
    }
    // Llamar la información del cambio de moneda y meterla en el estado global
    if (this.$store.state.currencyExchange.length === 1) {
      this.$store.commit(
        'updateCurrencyExchange',
        await services.getAllCurrencyExchange(),
      );
    }
    this.$store.dispatch('initializeCurrency');
    this.isLoading = false;
  },
  methods: {
    // Navegación del menu
    generateSectionId(section) {
      return `_${section}`;
    },
    openResponsiveBurguer() {
      this.$refs.burger.classList.toggle('is-active');
      this.$refs.navbarMenu.classList.toggle('is-active');
    },
    // Eventos del modal de moneda
    toggleCurrencyModal() {
      this.currencyModal = !this.currencyModal;
    },
    closeCurrencyModal() {
      this.currencyModal = false;
    },
    setCurrentCurrency(data) {
      if (data.Name === this.getCurrentCurrency.Name) {
        return;
      }

      this.closeCurrencyModal();
      this.$store.dispatch('selectCurrency', data);
      this.isLoading = true;
      setTimeout(
        () => { this.isLoading = false; },
        500,
      );
    },
    // Ayuda
    calculatePrice(priceMn) {
      const v = priceMn / this.getCurrentCurrency.Value;
      return v.toFixed(2);
    },
    toTop() {
      window.scrollTo(0, 0);
    },
  },
  computed: {
    getSectionsName() {
      return Object.keys(this.menu);
    },
    getCurrencyExchange() {
      return this.$store.state.currencyExchange;
    },
    getCurrentCurrency() {
      return this.$store.state.currentCurrency;
    },
  },
};
</script>
<style lang="scss" scoped>
@use "@/assets/sass/_colors" as vars;
nav {
  border-bottom: 3px solid vars.$dark;

  .navbar-item {
    transition: .2s transform;
  }
}

.fab {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 10;
}

// Arreglando bulma
@media screen and (min-width: 1024px) {
  .navbar {
    align-items: initial;
    display: block;

    .navbar-burger {
      display: initial;
    }

    .navbar-menu {
      .is-active {
        display: block;
      }

      &:not(.is-active){
        display: none;
      }

      .navbar-start {
        display: block;

        .navbar-item:hover {
          background: transparent;
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>
