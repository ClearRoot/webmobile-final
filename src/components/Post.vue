<template>
  <v-layout py-4 h-100>
      <v-flex row>
        <div class="caption">{{ formatedDate }}</div>
        <h2 class="color-333 headline font-weight-light titleText">
          {{ title }}
        </h2>
        <p class="mb-1 color-666 font-weight-light subheading bodyText">
          {{ body }}
        </p>
        <!-- <Board :item_id="id" :dialog_state="dialog"></Board>
        <v-btn @click="evt()"></v-btn> -->

        <Board :setBoard="this.setBoard" @close="boardClose"></Board>
           <v-btn icon @click="boardOpen()"><v-icon>add</v-icon></v-btn>

         <!-- <Board :item_id="id"></Board> -->
      </v-flex>
    </v-layout>
</template>

<script>
import Board from "../components/Board";
export default {
  name: "Post",
  props: {
    date: { type: Date },
    title: { type: String },
    body: { type: String },
    id: { type: String }
  },
  data() {
    return {
      setBoard:{
        dialog:false
      },
      ddlSource: "ko",
      ddlTarget: "en",
      thisTitle: "",
      thisBody: "",
      thisId: ""
    };
  },
  components: {
    Board
  },
  methods: {
    boardOpen() {
      console.log('다이알로그 열림')
      this.setBoard.dialog = true;
    },
    boardClose() {
      console.log('다이알로그 닫음')
      this.setBoard.dialog = false
    }
  },
  created() {
    this.$EventBus.$on("click-icon_post", async () => {
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
  computed: {
    formatedDate() {
      return `${this.date.getFullYear()}년 ${this.date.getMonth()}월 ${this.date.getDate()}일`;
    }
  },
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
