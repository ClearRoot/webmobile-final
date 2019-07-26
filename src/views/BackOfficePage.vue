<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        BackOffice
      </div>
    </ImgBanner>
    <v-container>
      <!-- Portfolio -->
      <!-- here -->
      <v-btn @click="goURL('https://analytics.google.com/')"
        >Google Analytics</v-btn
      >

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
              <Tab :tab="tabs[active]" v-if="tabs[active] != 'user'"></Tab>
              <UserTab :tab="tabs[active]" v-if="tabs[active] == 'user'"></UserTab>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-container>
    <div style="height:1000px">
    </div>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import Tab from "../components/Tab";
import UserTab from "../components/UserTab";

export default {
  name: "BackOfficePage",
  components: {
    ImgBanner,
    Tab,
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
      }).then(res => {
          this.title = res.data.data.translations[0].translatedText;
          this.body = res.data.data.translations[1].translatedText;
          if (this.ddlSource == "en") {
            this.ddlSource = "ko";
            this.ddlTarget = "en";
          } else {
            this.ddlSource = "en";
            this.ddlTarget = "ko";
          }
        }).catch(e => {
          console.error(e)
        });
    },
    goURL(url){
      // window.open(url);
      console.log(this.posts);
    }
  }
};
</script>
<style>
.titleText {
  overflow:hidden;
  text-overflow : ellipsis;
  display:-webkit-box;
  /* -webkit-line-clamp:1; */
  /* -webkit-box-orient:vertical; */
  word-wrap:break-word;
}
</style>
