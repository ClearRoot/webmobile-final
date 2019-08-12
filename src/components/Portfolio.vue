<template>
  <v-hover>
    <v-card
      @click.close="clickedItem"
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 12 : 2}`"
    >
      <v-img :src="data.img" height="200px"></v-img>
      <v-card-title primary-title>
        <div v-if="!translateState" class="headline text-no-wrap text-truncate">
          {{ data.title }}
        </div>
        <div v-if="translateState" class="headline text-no-wrap text-truncate">
          {{ titleEN }}
        </div>
      </v-card-title>
      <v-card-text v-if="!translateState" class="grey--text portfolioBodyText">
        {{ data.body }}
      </v-card-text>
      <v-card-text v-if="translateState" class="grey--text portfolioBodyText">
        {{ bodyEN }}
      </v-card-text>
      <v-card-actions>
        <v-list-tile class="grow">
          <v-list-tile-avatar color="grey darken-3">
            <v-gravatar class="elevation-6" :email="data.ownerEmail" />
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-if="data.ownerDisplayName">{{
              data.ownerDisplayName
            }}</v-list-tile-title>
            <v-list-tile-title v-if="!data.ownerDisplayName">{{
              data.ownerEmail
            }}</v-list-tile-title>
          </v-list-tile-content>

          <v-layout align-center justify-end class="hidden-xs-only">
            <v-icon class="mr-1">mdi-heart</v-icon>
            <span class="subheading mr-2">{{ formatedDate }}</span>
          </v-layout>
        </v-list-tile>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import ApiService from "@/services/ApiService";

export default {
  name: "Portfolio",
  props: {
    data: { type: Object }
  },
  data() {
    return {
      ddlSource: "ko",
      ddlTarget: "en",
      titleEN: "",
      bodyEN: "",
      translateState: false
    };
  },
  created() {
    this.$EventBus.$on("click-icon_portfolio", async () => {
      if (!this.titleEN || !this.bodyEN) {
        ApiService.getTranslates(
          this.ddlSource,
          this.ddlTarget,
          this.data.title,
          this.data.body
        )
          .then(res => {
            this.titleEN = res.data.data.translations[0].translatedText;
            this.bodyEN = res.data.data.translations[1].translatedText;
            this.translateState = !this.translateState;
          })
          .catch(e => {
            console.error(e)
          });
      } else {
        this.translateState = !this.translateState;
      }
    });
  },
  methods: {
    clickedItem() {
      this.$store.commit("clickedItem", [this.data, "portfolios"]);
      this.$EventBus.$emit("clickedItem", true);
    }
  },
  computed: {
    formatedDate() {
      const date = this.data.created_at;
      return `${date.getFullYear()}년 ${date.getMonth() +1}월 ${date.getDate()}일`;
    }
  }
};
</script>

<style>
.portfolioBodyText {
  overflow: hidden;
  height: 5.7em;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
