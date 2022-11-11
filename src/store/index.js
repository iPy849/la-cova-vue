import { createStore } from 'vuex';

export default createStore({
  state: {
    notifications: [],
    notificationTimeMillisecs: 5000,
    currencyExchange: [
      {
        Name: 'Mn',
        Value: 1,
      }],
    currentCurrency: null,
  },
  getters: {
  },
  mutations: {
    addNotification(state, notification) {
      state.notifications.push(notification);
    },
    removeNotifications(state) {
      state.notifications.pop();
    },
    updateCurrencyExchange(state, data) {
      state.currencyExchange.push(...data);
    },
    setCurrentCurrency(state, data) {
      state.currentCurrency = data;
    },
  },
  actions: {
    selectCurrency(context, currency) {
      context.commit('setCurrentCurrency', currency);
    },
    initializeCurrency(context) {
      context.commit('setCurrentCurrency', context.state.currencyExchange[0]);
    },
  },
  modules: {
  },
});
