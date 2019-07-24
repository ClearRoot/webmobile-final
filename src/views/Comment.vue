<template>
  <div>
    <div style="height:300px"></div>
    <div id="disqus_thread"></div>
  </div>
</template>
<script>
/*
var disqus_config = function () {
this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
// (function() {
//   // DON'T EDIT BELOW THIS LINE
//   var d = document,
//     s = d.createElement("script");
//   s.src = "https://samjo.disqus.com/embed.js";
//   s.setAttribute("data-timestamp", +new Date());
//   (d.head || d.body).appendChild(s);
// })();

export default {
  methods: {
    initDisqus() {
      const self = this;
      window.disqus_config = function() {
        this.page.identifier = "http://localhost:8080/post/#!" + self.id;
        this.page.url = "http://localhost/post:8080/#!" + self.id;
      };
      setTimeout(() => {
        const d = document,
          s = d.createElement("script");
        s.src = "https://" + "samjo" + ".disqus.com/embed.js";
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
      if (window.DISQUS) {
        this.resetDisqus(window.DISQUS);
        return;
      }
      this.initDisqus();
    }
  },
  mounted() {
    this.loadData(this.id);
  }
};
</script>
