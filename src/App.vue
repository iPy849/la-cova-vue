<template>
  <div id="modalPlaceholder"></div>
  <div id="notifications" class="is-overlay">
    <NotificationsComponent
      v-for="(notificationData, index) in getNotifications"
      :key="index"
      :data="notificationData"/>
  </div>
  <router-view/>
</template>

<script>
import NotificationsComponent from '@/components/NotificationsComponent.vue';

export default {
  components: { NotificationsComponent },
  computed: {
    getNotifications() {
      return this.$store.state.notifications;
    },
  },
};
</script>

<style lang="scss">
</style>
