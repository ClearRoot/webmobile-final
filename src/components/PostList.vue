<template>
  <v-layout row wrap>
    <v-flex
      class="xs12"
      v-for="i in posts.length > length ? length : posts.length"
      :key="i"
      :class="'sm' + 12 / column"
      px-3
    >
      <Post :data="posts[i - 1]"></Post>
    </v-flex>
    <v-flex xs12 text-xs-center round my-5 v-if="more">
      <v-btn outline color="black" dark v-on:click="loadMorePosts"
        ><v-icon size="25" class="mr-2">fa-plus</v-icon> 더 보기</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script>
import Post from "@/components/Post";
import FirebaseService from "@/services/FirebaseService";

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
      length: this.limits,
      more: this.loadMore
    };
  },
  components: {
    Post
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    async getPosts() {
      this.posts = await FirebaseService.getPosts();
    },
    loadMorePosts() {
      this.length += 6;
      if (this.length >= this.posts.length) this.more = false;
    }
  },
  created() {
    this.$EventBus.$on("refreshBoard", async () => {
      this.posts = await FirebaseService.getPosts();
    });
  }
};
</script>

<style>
.mw-700 {
  max-width: 700px;
  margin: auto;
}
</style>
