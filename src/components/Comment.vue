<template>
  <div style="padding:10px; min-height: 500px;">
    <div id="disqus_thread"></div>
  </div>
</template>

<script>
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
        this.page.url = "http://samjo/" + self.board_type + "/" + self.item_id;
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
      item_id: "",
      item: { type: Object }
    };
  },
  props: {
    id: { type: String },
    board_type: { type: String }
  },
  watch: {
    item_id: function() {
      this.loadComments();
    }
  },
  created() {
    this.$EventBus.$on("item", res => {
      this.item = res;
      this.item_id = this.item.id;
    });
  }
};
</script>
