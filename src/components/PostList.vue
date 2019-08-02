<template>
  <v-layout row wrap>
    <v-flex
      class="xs12"
      v-for="i in posts.length > limits ? limits : posts.length"
      :key="i"
      :class="'sm' + 12 / column"
      px-3
    >
      <Post :data="posts[i - 1]"></Post>
    </v-flex>

    <Board v-model="showBoard" :board_item="item" :board_type="'post'"> </Board>
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
import Board from "@/components/Board";

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
      showBoard: false,
      item: { type: Object }
    };
  },
  created() {
    this.$EventBus.$on("refreshBoard", async () => {
      this.posts = await FirebaseService.getPosts();
    });
    this.$EventBus.$on("item", res =>{
      this.item = res;
      console.log(this.$store.state.user)
      if (
        this.item.ownerId == this.$store.state.user.uid ||
        this.$store.state.user.auth == "admin"
      ) {
        this.item.auth = true;
      }else {
        this.item.auth = false;
      }
      this.showBoard = true;
    })
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
