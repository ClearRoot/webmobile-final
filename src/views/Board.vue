<template>
  <div>
    <div style="height:300px"></div>
    <div id="disqus_thread"></div>
  </div>
</template>
<script>
export default {
  methods: {
    initDisqus() {
      this.getAddress();
      this.setBoard();
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
    getAddress() {
      const self = this;
      window.disqus_config = function() {
        this.page.identifier = self.id;
        this.page.url = "http://localhost/post/board/" + self.id;
      };
    },
    resetDisqus(disqus) {
      disqus.reset({
        reload: true,
        config: window.disqus_config
      });
    },
    loadComments() {
      this.getAddress();
      if (window.DISQUS) {
        this.resetDisqus(window.DISQUS);
        return;
      }
      this.initDisqus(this.id);
    }
  },
  data() {
    return {
      id: ""
    };
  },
  watch: {
    id: function(newId) {
      this.id = newId;
      this.loadComments();
    }
  },
  created() {
    this.id = this.$route.params.id;
  }
};
</script>
