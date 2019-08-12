<template>
  <div class="disqus_field">
    <div id="disqus_thread"></div>
  </div>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";

export default {
  methods: {
    initDisqus() {
      this.setAddress();
      this.setBoard();
    },
    setAddress() {
      const self = this;
      window.disqus_config = function() {
        this.page.identifier = self.item_id;
        this.page.url = "http://samjo/" + self.item_id;
        this.callbacks.onNewComment = [
          function(comment) {
            comment.title = self.item.title;
            FirebaseService.creatCommentMessage(comment);
          }
        ];
      };
    },
    setBoard() {
      setTimeout(() => {
        const d = document,
          s = d.createElement("script");
        s.src = "https://samjo.disqus.com/embed.js";
        s.setAttribute("data-timestamp", new Date());
        (d.head || d.body).appendChild(s);
      }, 100);
    },
    resetDisqus(disqus) {
      disqus.reset({
        reload: true,
        config: window.disqus_config
      });
    },
    loadComments() {
      this.setAddress();
      if (window.DISQUS) {
        this.resetDisqus(window.DISQUS);
        return;
      }
      this.initDisqus(this.item_id);
    }
  },
  data() {
    return {
      item_id: ""
    };
  },
  created() {
    this.$EventBus.$on("clickedItem", () => {
      this.item_id = this.$store.getters.getItem.id;
      this.loadComments();
    });
  }
};
</script>
<style>
.disqus_field {
  padding: 10px;
  min-height: 500px;
}
</style>
