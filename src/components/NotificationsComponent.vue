<template>
  <div
    class="notification m-2 p-2"
    :class="{
      'is-success': isSuccess,
      'is-warning': isWarning,
      'is-danger': isError
    }"
  >
    {{ this.data.notification }}
  </div>
</template>

<script>
import UINotification from '@/models/notifications';

export default {
  name: 'NotificationsComponent',
  props: {
    data: {
      type: UINotification,
      required: true,
    },
  },
  created() {
    setTimeout(
      () => this.$store.commit('removeNotifications'),
      this.$store.state.notificationTimeMillisecs,
    );
  },
  computed: {
    isSuccess() {
      return this.data.notificationLevel === UINotification.notificationLevels.SUCCESS;
    },
    isWarning() {
      return this.data.notificationLevel === UINotification.notificationLevels.WARNING;
    },
    isError() {
      return this.data.notificationLevel === UINotification.notificationLevels.ERROR;
    },
  },
};
</script>

<style scoped>

</style>
