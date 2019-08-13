<template>
  <div>
    <v-img :src="imgSrc" aspect-ratio="1.7">
      <v-layout align-center justify-center row fill-height>
        <v-flex text-xs-center>
          <span class="text-shadow display-2 font-weight-black">
            <slot name="text" />
          </span>
        </v-flex>
      </v-layout>
    </v-img>
    <v-layout row justify-end>
      <div>
        <ImgList :name="name"></ImgList>
      </div>
    </v-layout>
  </div>
</template>

<script>
import ImgList from "@/components/ImgList";
import ApiService from "@/services/ApiService";

export default {
  name: "ImgBanner",
  data() {
    return {
      name: "ImgBanner",
      imgSrc: ""
    };
  },
  components: {
    ImgList
  },
  created() {
    this.$EventBus.$on("selectImgBanner", res => {
      this.imgSrc = res;
    });
  },
  props: {
    text: { type: String }
  },
  mounted() {
    this.getImgSrc();
  },
  methods: {
    getImgSrc() {
      ApiService.getImgBanner()
        .then(res => {
          this.imgSrc = res.request.responseURL;
        })
        .catch(() => {
          this.imgSrc = require("../assets/offline.jpg");
        });
    }
  }
};
</script>

<style>
.text-shadow {
  text-shadow: 0 0 15px rgb(255, 255, 255);
}
</style>
