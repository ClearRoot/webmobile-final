<template>
  <v-layout py-3 h-100>
    <v-flex>
      <v-hover>
        <v-card
          @click="clickedItem"
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 2}`"
          class="mx-auto"
          color="#26c6da"
          dark
        >
          <v-toolbar card light dense>
            <v-toolbar-title
              v-if="!translateState"
              class="headline font-weight-bold text-no-wrap text-truncate"
            >
              {{ data.title }}
            </v-toolbar-title>
            <v-toolbar-title
              v-if="translateState"
              class="headline font-weight-bold text-no-wrap text-truncate"
            >
              {{ titleEN }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text
            v-if="!translateState"
            class="body-2 font-weight postBodyText"
          >
            {{ data.body }}
          </v-card-text>
          <v-card-text
            v-if="translateState"
            class="body-2 font-weight postBodyText"
          >
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
      titleEN: "",
      bodyEN: "",
      translateState: false
    };
  },
  created() {
    this.$EventBus.$on("click-icon_post", async () => {
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
      this.$store.commit("clickedItem", [this.data, "posts"])
      this.$EventBus.$emit("clickedItem", true);
    }
  },
  computed: {
    formatedDate() {
      const date = this.data.created_at;
      return `${date.getFullYear()}년 ${date.getMonth() +1}월 ${date.getDate()}일`;
    }
  },
  mounted() {
    this.title = this.data.title;
    this.body = this.data.body;
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
.postBodyText {
  overflow: hidden;
  height: 5.7em;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
