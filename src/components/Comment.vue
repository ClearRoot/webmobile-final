<template>
  <div>
    <div style="height:300px; width:350px;"></div>
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
        console.log(this.page.url)
      };
    },
    setBoard() {
      setTimeout(() => {
        const d = document,
          s = d.createElement("script");
        s.src = "https://samjo.disqus.com/embed.js";
        s.setAttribute("data-timestamp", new Date());
        (d.head || d.body).appendChild(s);
      }, 1500);
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
  watch: {
    item_id: function() {
      if (this.item_id) {
        localStorage.setItem("item_id", this.item_id);
        localStorage.setItem("board_type", this.board_type);
      } else {
        this.item_id = localStorage.getItem("item_id");
        this.board_type = localStorage.getItem("board_type");
      }
      this.loadComments();
    }
  },
  created() {
    this.item_id = this.$route.params.item_id;
    this.board_type = this.$route.params.board_type;
  }
};
</script>
