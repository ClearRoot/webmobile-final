<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn outline color="#ff0000" dark v-on="on">
          NEW {{ board_type }} </v-btn>
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
            <ImgList v-if="board_type === 'portfolio'" :name="name"></ImgList>
            <v-img v-if="imageFile" :src="imageFile"></v-img>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closeModal()">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="write()">
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
import Swal from "sweetalert2";

export default {
  name: "Writer",
  props: ["board_type"],
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
    async write() {
      if (this.title === "" || this.body === "") {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: "내용이 입력되지 않았습니다.",
          footer: "제목, 본문을 입력해주셔야합니다."
        });
      } else if (this.imageFile === "") {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: "이미지를 첨부해주셔야 합니다.",
          footer: "포트폴리오작성에는 이미지가 필요합니다."
        });
      } else {
        if (!this.saveBtn) {
          return 0;
        }
        this.saveBtn = false;
        if (this.board_type === "portfolio") {
          await FirebaseService.postPortfolio(
            this.title,
            this.body,
            this.imageFile
          );
        } else {
          await FirebaseService.postPost(this.title, this.body);
        }
        await this.$EventBus.$emit("refreshBoard");
        await this.closeModal();
      }
    }
  }
};
</script>
