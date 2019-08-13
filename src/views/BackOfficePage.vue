<template>
  <div v-if="!loading">
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        BackOffice
      </div>
    </ImgBanner>
    <v-container>
      <v-layout>
        <v-flex xs12>
          <template>
            <v-tabs fixed-tabs v-model="active">
              <v-tab v-for="(tab, i) in tabs" :key="i">
                {{ tab }}
              </v-tab>
            </v-tabs>
          </template>
          <v-tabs-items>
            <v-tab-item>
              <PostTab v-show="tabs[active] == 'post'"></PostTab>
              <PortfolioTab v-show="tabs[active] == 'portfolio'"></PortfolioTab>
              <UserTab v-show="tabs[active] == 'user'"></UserTab>
              <AnalyticsTab v-show="tabs[active] == 'analytics'"></AnalyticsTab>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import PostTab from "../components/PostTab";
import PortfolioTab from "../components/PortfolioTab";
import UserTab from "../components/UserTab";
import AnalyticsTab from "../components/AnalyticsTab";
import FirebaseService from "../services/FirebaseService";
import Swal from "sweetalert2";
export default {
  name: "BackOfficePage",
  components: {
    ImgBanner,
    PostTab,
    PortfolioTab,
    UserTab,
    AnalyticsTab
  },
  data() {
    return {
      active: 0,
      posts: [],
      tabs: ["post", "portfolio", "user", "analytics"],
      auth: null,
      loading: true
    };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    goURL(url) {
      window.open(url);
    },
    async checkAuth() {
      await FirebaseService.loginChk();
      await FirebaseService.authChk();
      if (this.$store.state.auth.userAuth === "admin") {
        try {
          if(gapi) {
            this.loading = false;
            return;
          }
        } catch (e) {
          //
        }
      }
      Swal.fire({
        type: "error",
        title: "403 error",
        text: "권한이 없거나 비정상적인 접근입니다."
      });
      this.$router.push("/");
    }
  }
};
</script>
