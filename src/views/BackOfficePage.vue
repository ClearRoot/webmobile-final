<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        BackOffice
      </div>
    </ImgBanner>
    <v-container v-if="true">
      <template>
        <v-card
          class="pa-3"
          flat
          height="15em"
          color="orange"
          img="https://www.gstatic.com/mobilesdk/190618_mobilesdk/dashboard_fore@2x.png"
        >
          <v-card-text class="white--text"
            >Google 애널리틱스를 사용하면 광고 ROI를 측정할 수 있을 뿐만 아니라
            플래시, 동영상 및 소셜 네트워크 사이트와 애플리케이션을 추적할 수
            있습니다.
          </v-card-text>
          <v-btn @click="goURL('https://analytics.google.com/')" class="mt-3">
            Google Analytics
          </v-btn>
        </v-card>
      </template>
    </v-container>
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
              <PostTab v-if="tabs[active] == 'post'"></PostTab>
              <PortfolioTab v-if="tabs[active] == 'portfolio'"></PortfolioTab>
              <UserTab v-if="tabs[active] == 'user'"></UserTab>
              <AnalyticsTab v-if="tabs[active] == 'analytics'"></AnalyticsTab>
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
      auth: null
    };
  },
  beforeMount() {
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
        return;
      }
      Swal.fire({
        type: "error",
        title: "403 error",
        text: "권한이 없거나 비정상적인 접근입니다."
      });
      this.$router.push("/");
    }
  },
  computed: {
    adminAuthStatus() {
      if (this.auth.userAuth == "admin") return true;
      return false;
    }
  }
};
</script>
