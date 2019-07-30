<template>
  <router-link
    :to="{
      name: 'portfoliodetail',
      params: {
        id: thisTitle,
        id2: thisBody,
        id3: imgSrc,
        item_id: thisId,
        board_type: 'portfolio'
      }
    }"
    style="text-decoration: none;"
  >
    <v-card>
      <v-img :src="imgSrc" height="200px"> </v-img>
      <v-card-title primary-title>
        <div>
          <div class="headline titleText">{{ thisTitle }}</div>
          <span class="grey--text bodyText">{{ thisBody }}</span>
        </div>
      </v-card-title>
    </v-card>
  </router-link>
</template>

<script>
import ApiService from "@/services/ApiService";

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
      ApiService.getTranslates(
        this.ddlSource,
        this.ddlTarget,
        this.thisTitle,
        this.thisBody
      )
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
    this.thisTitle = this.title;
    this.thisBody = this.body;
    this.thisId = this.item_id;
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
