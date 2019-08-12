import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: "",
    user: "",
    auth: "",
    item: {},
    item_type: "",
    board: ""
  },
  getters: {
    getItem(state) {
      return state.item;
    },
    getItemType(state) {
      return state.item_type;
    },
    checkAuth: state => {
      return (
        state.user.uid === state.item.ownerId || state.auth.userAuth === "admin"
      );
    }
  },
  mutations: {
    clickedItem: (state, payload) => {
      state.item = payload[0];
      state.item_type = payload[1];
    },
    closeItem: state => {
      state.item = {};
    },
    insertName: (state, payload) => {
      state.name = payload.nameVal;
    },
    logout: (state, payload) => {
      state.user = payload.userVal;
      state.accessToken = payload.accessTokenVal;
      state.auth = payload.authVal;
      state.loginChk = payload.loginChkVal;
    }
  },
  actions: {},
  plugins: [createPersistedState()]
});
