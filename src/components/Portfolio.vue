<template>
  <v-card>
    <v-img :src="imgSrc" height="200px"> </v-img>
    <v-card-title primary-title>
      <div>
        <div class="headline titleText">{{ title }}</div>
        <span class="grey--text bodyText">{{ body }}</span>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Portfolio",
  props: {
    date: { type: String },
    title: { type: String },
    body: { type: String },
    imgSrc: { type: String },
    item_id: { type: String }
  },
  data() {
    return {
      ddlSource: "ko",
      ddlTarget: "en",
      thisTitle: "",
      thisBody: "",
      thisId: ""
    };
  },
  created() {
    this.$EventBus.$on("click-icon_portfolio", async () => {
      const axios = require("axios");
      var translateUrl =
        "https://www.googleapis.com/language/translate/v2?key=AIzaSyChUf-_S1c5gnxJdSZE8u5hBjTyRlBSgm8";
      translateUrl += "&source=" + this.ddlSource;
      translateUrl += "&target=" + this.ddlTarget;
      translateUrl += "&q=" + encodeURI(this.thisTitle);
      translateUrl += "&q=" + encodeURI(this.thisBody);
      axios({
        methods: "GET",
        url: translateUrl
      })
        .then(res => {
          this.thisTitle = res.data.data.translations[0].translatedText;
          this.thisBody = res.data.data.translations[1].translatedText;
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
    });
  }
};
</script>

<style>
.titleText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bodyText {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
