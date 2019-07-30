<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn outline color="#ff0000" dark v-on="on">NEW Portfolio</v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="title"
                  v-model="title"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <markdown-editor
                  :configs="options"
                  v-model="body"
                ></markdown-editor>
              </v-flex>
            </v-layout>
            <ImgList :name="name"></ImgList>
            <v-img v-if="imageFile" :src="imageFile"></v-img>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeModal()">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="writePortfolio()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import ImgList from "@/components/ImgList";

export default {
  name: "Writer",
  data() {
    return {
      name: "Writer",
      dialog: false,
      saveBtn: true,
      title: "",
      body: "",
      imageFile: "",
      options: {
        spellChecker: false
      }
    };
  },
  components: {
    ImgList
  },
  created() {
    this.$EventBus.$on("selectImgWriter", res => {
      this.imageFile = res;
    });
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.saveBtn = true;
      this.title = "";
      this.body = "";
      this.imageFile = "";
    },
    async writePortfolio() {
      if (!this.saveBtn) {
        return 0;
      }
      this.saveBtn = false;
      await FirebaseService.postPortfolio(
        this.title,
        this.body,
        this.imageFile
      );
      await this.$EventBus.$emit("refreshPortfolioList");
      await this.closeModal();
    }
  }
};
</script>
