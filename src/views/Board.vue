<template>
  <div>
    <div style="height:300px"></div>
    <div id="disqus_thread"></div>
  </div>
</template>
<script>
export default {

  // methods: {
//     loadData() {
//       console.log("1st : " + this.id)
//       this.loadComments();
//
//     },
//     initDisqus() {
//       cnosole.log("여기다 " +this.id);
//       const self = this;
//       window.disqus_config = function() {
//         this.page.identifier = 'http://localhost/post/board/' + self.id;
//         this.page.url = 'http://localhost/post/board/' + self.id;
//         console.log(this.page.identifier + " " + this.page.url)
//       };
//       setTimeout(() => {
//         const d = document, s = d.createElement('script');
//         s.src = 'https://samjo.disqus.com/embed.js';
//         s.setAttribute('data-timestamp', new Date());
//         (d.head || d.body).appendChild(s);
//       }, 1500);
//     },
//
//     resetDisqus(disqus) {
//       disqus.reset({
//         reload: true,
//         config: window.disqus_config
//       });
//     },
//     loadComments() {
//       if (window.DISQUS) {
//         this.resetDisqus(window.DISQUS);
//         return;
//       }
//       this.initDisqus(this.id);
//     }
//   },
//   mounted() {
//     this.loadData();
//   },
//   data(){
//     let address = this.$route.params.id;
//     return{
//       id: address
//     }
//   },
//   watch: {
//     id: function(newId) {
//       console.log("new : " + newId);
//       this.id = newId;
//       this.loadData(this.id);
//       // console.log('Data changed=>' + message);
//     }
// },
  created() {
    this.id = this.$route.params.id;
    console.log(this.id)
    // this.id = "!@#"
  }
}
// };
</script>
