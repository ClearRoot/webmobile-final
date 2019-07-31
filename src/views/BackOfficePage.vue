<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        BackOffice
      </div>
    </ImgBanner>
    <v-container>
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

export default {
  name: "BackOfficePage",
  components: {
    ImgBanner,
    PostTab,
    PortfolioTab,
    UserTab
  },
  data() {
    return {
      ddlSource: "ko",
      ddlTarget: "en",
      active: 0,
      posts: [],
      tabs: ["post", "portfolio", "user"]
    };
  },
  methods: {
    translate() {
      const axios = require("axios");
      var translateUrl =
        "https://www.googleapis.com/language/translate/v2?key=AIzaSyChUf-_S1c5gnxJdSZE8u5hBjTyRlBSgm8";
      translateUrl += "&source=" + this.ddlSource;
      translateUrl += "&target=" + this.ddlTarget;
      translateUrl += "&q=" + encodeURI(this.title);
      translateUrl += "&q=" + encodeURI(this.body);
      axios({
        methods: "GET",
        url: translateUrl
      })
        .then(res => {
          this.title = res.data.data.translations[0].translatedText;
          this.body = res.data.data.translations[1].translatedText;
          if (this.ddlSource == "en") {
            this.ddlSource = "ko";
            this.ddlTarget = "en";
          } else {
            this.ddlSource = "en";
            this.ddlTarget = "ko";
          }
        })
        .catch(e => {
          console.error(e)
        });
    },
    goURL(url) {
      window.open(url);
    }
  }
};
</script>
