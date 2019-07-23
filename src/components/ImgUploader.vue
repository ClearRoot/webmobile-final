<template>
  <v-layout row>
    <v-dialog v-model="imageUploderDialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Image Upload</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Image Upload</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 class="text-xs-center">
                <v-text-field
                  label="Select Image"
                  ick="pickFile"
                  v-model="imageName"
                  prepend-icon="attach_file"
                  @click="pickFile"
                ></v-text-field>
                <input
                  type="file"
                  style="display: none"
                  ref="image"
                  accept="image/*"
                  @change="onFilePicked"
                />
                <img :src="imageUrl" height="150" v-if="imageUrl" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeModal()">Close</v-btn>
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="blue darken-1"
            class="white--text"
            @click="ImageUpload()"
          >
            Upload
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";

export default {
  name: "ImgUploader",
  data() {
    return {
      imageUploderDialog: false,
      img_title: "Image Upload",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      loading: false
    };
  },
  methods: {
    closeModal() {
      this.imageUploderDialog = false;
      this.img_title = "Image Upload";
      this.imageName = "";
      this.imageUrl = "";
      this.imageFile = "";
      this.loading = false;
    },
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0];
        });
      } else {
        (this.imageName = ""), (this.imageFile = ""), (this.imageUrl = "");
      }
    },
    async ImageUpload() {
      this.loading = true;
      const axios = require("axios");
      let formData = new FormData();
      formData.append("image", this.imageFile);
      formData.append("title", this.imageName);
      await axios({
        method: "POST",
        url: "https://api.imgur.com/3/image",
        data: formData,
        headers: {
          Authorization: "Client-ID 4da685cf5ed5665"
        },
        mimeType: "multipart/form-data"
      })
        .then(async res => {
          await FirebaseService.postImageUrls(
            this.imageName,
            res.data.data.link
          );
          await this.$EventBus.$emit("refreshImgList");
          await this.closeModal();
        })
        .catch(() => {
          alert("이미지 저장에 실패하였습니다. \n\n다시 시도해주세요.");
          this.loading = false;
        });
    }
  }
};
</script>
