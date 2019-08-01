<template>
  <v-layout py-4 h-100>
    <v-flex row>
      <v-hover>
        <v-card
          @click.close="openBoard"
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 2}`"
          class="mx-auto"
          color="#26c6da"
          dark
        >
          <v-toolbar card light dense>
            <v-toolbar-title
              class="headline font-weight-bold text-no-wrap text-truncate"
            >
              {{ data.title }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="body-2 font-weight bodyText">
            {{ data.body }}
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

              <v-layout align-center justify-end>
                >
                <v-icon class="mr-1">mdi-heart</v-icon>
                <span class="subheading mr-2">{{ formatedDate }}</span>
              </v-layout>
            </v-list-tile>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script>
import ApiService from "@/services/ApiService";

export default {
  name: "Post",
  props: {
    data: { type: Object }
  },
  data() {
    return {
      ddlSource: "ko",
      ddlTarget: "en",
      thisTitle: "",
      thisBody: "",
      thisId: "",
      showBoard: false
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
  methods: {
    openBoard() {
      this.$EventBus.$emit("item", this.data);
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
.color-666 {
  color: #666;
}
.color-333 {
  color: #333;
}
.h-100 {
  height: 100%;
}
.bodyText {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
