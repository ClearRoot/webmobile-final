<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        PortfolioDetail
      </div>
    </ImgBanner>
        <v-container>

  <div>
      <v-img :src="imgSrc" height="200px">{{ thisImg}} </v-img>
          <div class="headline titleText">{{ thisTitle }}</div>

          <span class="grey--text bodyText">{{ thisBody }}</span>
        </div>



        </v-container>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import PortfolioList from "../components/PortfolioList";
export default {
  name: "PortfolioPage",
  components: {
    ImgBanner,
    PortfolioList
  },
  props: {
    date: { type: String },
    title: { type: String },
    body: { type: String },
    imgSrc: { type:  String }


  },


  data() {
    return {
      ddlSource: "ko",
      ddlTarget: "en",
      thisTitle: this.$route.params.id,
      thisBody : this.$route.params.id2,
      thisImg :this.$route.params.id3
    };
  },
created(){

      this.$EventBus.$on("click-icon_detail", async () => {
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
          console.log(this.ddlSource)
        }).catch(e => {
          console.error(e)
        });
    });
  },


  // created(){
  //   console.log(this.thisBody)
  // }





};
</script>
