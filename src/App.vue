<template>
  <v-app>
    <MainHeader />
    <v-content>
      <router-view />
    </v-content>
    <MainFooter />
  </v-app>
</template>

<script>
import store from "./store";
import MainHeader from "./components/MainHeader.vue";
import MainFooter from "./components/MainFooter.vue";

export default {
  name: "App",
  store,
  components: {
    MainHeader,
    MainFooter
  },
  data() {
    return {};
  }
};
</script>
