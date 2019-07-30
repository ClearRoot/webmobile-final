<template>
  <router-link
    :to="{
      name: 'postdetail',
      params: {
        id: thisTitle,
        id2: thisBody,
        item_id: thisId,
        board_type: 'post'
      }
    }"
    style="text-decoration: none;"
  >
    <v-layout py-4 h-100>
      <v-flex row>
        <div class="caption">{{ formatedDate }}</div>
        <h2 class="color-333 headline font-weight-light titleText">
          {{ thisTitle }}
        </h2>
        <p class="mb-1 color-666 font-weight-light subheading bodyText">
          {{ thisBody }}
        </p>
      </v-flex>
    </v-layout>
  </router-link>
</template>

<script>
import ApiService from "@/services/ApiService";

export default {
  name: "Post",
  props: {
    date: { type: Date },
    title: { type: String },
    body: { type: String },
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
    this.$EventBus.$on("click-icon_post", async () => {
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
  },

  computed: {
    formatedDate() {
      return `${this.date.getFullYear()}년 ${this.date.getMonth()}월 ${this.date.getDate()}일`;
    }
  }
};
</script>

<style>
.color-666 {
  color: #666;
}
.color-333 {
  color: #333;
}
.h-100 {
  height: 100%;
}
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
