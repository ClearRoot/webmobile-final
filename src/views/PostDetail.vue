<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        PostDetail
      </div>
    </ImgBanner>
    <div class="headline titleText">{{ thisTitle }}</div>
    <span class="grey--text bodyText">{{ thisBody }}</span>
    <Comment></Comment>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import Comment from "../components/Comment";

export default {
  name: "PostDetail",
  components: {
    ImgBanner,
    Comment
  },
  props: {
    date: { type: String },
    title: { type: String },
    body: { type: String }
  },
  data() {
    return {
      ddlSource: "ko",
      ddlTarget: "en",
      thisTitle: this.$route.params.id,
      thisBody: this.$route.params.id2
    };
  },
  created() {
    this.$EventBus.$on("click-icon_detail", async () => {
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
  },
  mounted() {
    this.$route.params.id = this.title;
    this.$route.params.id2 = this.body;
  }
};
</script>
