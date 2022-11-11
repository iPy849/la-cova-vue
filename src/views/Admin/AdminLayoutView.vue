<template>
  <nav class="navbar p-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="material-icons centered-text">
        settings
      </div>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
         data-target="navbarBasicExample" ref="burger"
         @click="this.openResponsiveBurguer">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div ref="navbarMenu" class="navbar-menu is-shadowless">
      <div class="navbar-start">
        <router-link :to="{ name: 'AdminMenuEdit' }" class="navbar-item">
          Edición de Menú
        </router-link>

        <router-link :to="{ name: 'AdminMenuAdd' }" class="navbar-item">
          Agregar producto
        </router-link>

        <router-link :to="{ name: 'AdminMenuCurrencyExchange' }" class="navbar-item">
          Tasas de cambio
        </router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button
              class="button is-danger is-fullwidth is-rounded"
              @click="this.$router.push({name: 'home'})"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <main class="container is-widescreen p-5">
    <router-view/>
  </main>
</template>

<script>
export default {
  name: 'AdminLayoutView',
  methods: {
    openResponsiveBurguer() {
      this.$refs.burger.classList.toggle('is-active');
      this.$refs.navbarMenu.classList.toggle('is-active');
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/sass/_colors" as vars;

nav {
  border-bottom: 3px solid vars.$dark;

  .centered-text {
    font-size: 3rem;
  }
}
</style>
