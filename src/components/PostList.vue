<template>
  <v-layout row wrap>
    <v-flex
      class="xs12"
      v-for="i in posts.length > limits ? limits : posts.length"
      :key="i"
      :class="'sm' + 12 / column"
      px-3
    >
      <Post
        :date="posts[i - 1].created_at"
        :title="posts[i - 1].title"
        :body="posts[i - 1].body"
        :id="posts[i - 1].id"
      ></Post>
      <Board :setDialog="setDialog"></Board>
      <v-btn icon @click="boardOpen()"><v-icon>add</v-icon></v-btn>
      <v-divider></v-divider>


    </v-flex>
    <v-flex xs12 text-xs-center round my-5 v-if="loadMore">
      <v-btn outline color="black" dark v-on:click="loadMorePosts"
        ><v-icon size="25" class="mr-2">fa-plus</v-icon> 더 보기</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script>
import Post from "@/components/Post";
import FirebaseService from "@/services/FirebaseService";
import Board from "./Board";

export default {
  name: "PostList",
  props: {
    column: { type: Number, default: 1 },
    limits: { type: Number, default: 6 },
    loadMore: { type: Boolean, default: false }
  },
  data() {
    return {
      posts: [],
      setDialog: {
       dialog: false
      }
    };
  },
  created() {
    this.$EventBus.$on("refreshBoard", async () => {
      this.posts = await FirebaseService.getPosts();
    });
  },
  components: {
    Post,
    Board
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    async getPosts() {
      this.posts = await FirebaseService.getPosts();
    },
    loadMorePosts() {
      this.limits += 6;
    },
    boardOpen() {
      console.log('다이알로그 열림')
      this.setDialog.dialog = true;
    },
    boardClose() {
      console.log('다이알로그 닫음')
      this.setDialog.dialog = false;
    }
  }
};
</script>

<style>
.mw-700 {
  max-width: 700px;
  margin: auto;
}
</style>
