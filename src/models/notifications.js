export default class UINotification {
  static notificationLevels = {
    SUCCESS: 1,
    WARNING: 0,
    ERROR: -1,
  };

  constructor(notification, notificationLevel) {
    this.notification = notification;
    this.notificationLevel = notificationLevel;
  }
}
