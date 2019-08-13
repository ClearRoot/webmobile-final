<template>
  <v-layout>
    <v-flex xs12>
      <v-dialog v-model="imageListDialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn outline color="black" dark v-on="on">Select Image</v-btn>
        </template>
        <v-card>
          <v-layout row>
            <v-flex xs6 ml-3 mt-3>
              <ImgUploader></ImgUploader>
            </v-flex>
            <v-spacer></v-spacer>
            <v-layout row mt-3>
              <v-flex xs6>
                <v-btn color="blue darken-1" flat @click="getRandomImgSrc()">
                  Random
                </v-btn>
              </v-flex>
              <v-flex xs5>
                <v-btn color="blue darken-1" flat @click="closeModal()">
                  Close
                </v-btn>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-container grid-list-sm fluid>
            <v-layout row wrap>
              <v-flex v-for="image in images" :key="image.url" xs4>
                <v-card flat tile @click="selectImg(image.url)">
                  <v-img :src="image.url" height="150px"></v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import ImgUploader from "@/components/ImgUploader";
import ApiService from "@/services/ApiService";

export default {
  name: "ImgList",
  data() {
    return {
      imageListDialog: false,
      images: [],
      imageFile: ""
    };
  },
  props: {
    name: { type: String }
  },
  components: {
    ImgUploader
  },
  mounted() {
    this.getImageUrls();
  },
  created() {
    this.$EventBus.$on("refreshImgList", async () => {
      this.images = await FirebaseService.getImageUrls();
    });
  },
  methods: {
    async getImageUrls() {
      this.images = await FirebaseService.getImageUrls();
    },
    closeModal() {
      (this.imageListDialog = false), (this.imageFile = "");
    },
    async selectImg(url) {
      if (this.name === "Writer") {
        await this.$EventBus.$emit("selectImgWriter", url);
      } else {
        await this.$EventBus.$emit("selectImgBanner", url);
      }
      await this.closeModal();
    },
    getRandomImgSrc() {
      ApiService.getImgBanner()
        .then(res => {
          this.selectImg(res.request.responseURL);
        })
        .catch(() => {
          this.selectImg(require("../assets/offline.jpg"));
        });
    }
  }
};
</script>
