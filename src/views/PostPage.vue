<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">Post</div>
    </ImgBanner>
    <v-container>
    <BoardWriter :board_type="'post'" v-show="checkAuth"></BoardWriter>
      <!-- Post -->
      <v-layout>
        <v-flex xs12>
          <PostList :limits="6" :load-more="true"></PostList>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import PostList from "../components/PostList";
import BoardWriter from "../components/BoardWriter";

export default {
  name: "PostPage",
  components: {
    ImgBanner,
    PostList,
    BoardWriter
  },
  computed: {
    checkAuth() {
      if (this.$store.state.auth) {
        return this.$store.state.auth.userAuth != "visitant";
      }
      return false;
    }
  }
};
</script>
