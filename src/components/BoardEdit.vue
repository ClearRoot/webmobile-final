<template>
  <v-layout row justify-center>
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="title"
                v-model = "boardItem.titleEdit"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <ImgList v-if="this.$store.getters.getItemType === 'portfolios'" :name="name"></ImgList>
            <v-img v-if="imageFile" :src="imageFile"></v-img>
              <markdown-editor
                :configs="options"
                v-model = "boardItem.bodyEdit"
              ></markdown-editor>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close()">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="edit()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import ImgList from "@/components/ImgList";
import Swal from "sweetalert2";
export default {
  name: "Writer",
  props: {
    boardItem : { type: Object}
  },
  data() {
    return {
      name: "Writer",
      dialog: false,
      saveBtn: true,
      title: "",
      body: "",
      imageFile: this.boardItem.imgEdit,
      options: {
        spellChecker: false
      },
      item: {
        id: "",
        title: "",
        body: "",
        Img: ""
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
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: true
      });
    },
    close() {
      if (
        this.boardItem.titleEdit != this.$store.getters.getItem.title ||
        this.boardItem.bodyEdit != this.$store.getters.getItem.body
      ) {
        this.swalWithBootstrapButtons
          .fire({
            title: "수정 취소",
            text: "수정사항을 취소하고 종료하시겠습니까?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
          })
          .then(result => {
            if (result.value) {
              this.boardItem.titleEdit = this.$store.getters.getItem.title;
              this.boardItem.bodyEdit = this.$store.getters.getItem.body;
              this.$EventBus.$emit("cancel");
            }
          });
      } else {
        this.$EventBus.$emit("cancel");
      }
    },
    async edit() {
      this.swalWithBootstrapButtons
        .fire({
          title: "수정 확인",
          text: "수정하시겠습니까?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "예",
          cancelButtonText: "아니오"
        })
        .then(result => {
          if (result.value) {
            this.item.id = this.$store.getters.getItem.id;
            this.item.title = this.boardItem.titleEdit;
            this.item.body = this.boardItem.bodyEdit;
            switch (this.$store.getters.getItemType) {
              case "posts":
                FirebaseService.updatePost(this.item);
                break;
              default:
                this.item.img = this.imageFile;
                FirebaseService.updatePortfolio(this.item);
            }
            // this.$EventBus.$emit("closeRoot");
            this.$EventBus.$emit("close");
            this.$EventBus.$emit("refreshBoard");
            // this.$EventBus.$emit("refreshDetail",this.value);
            this.swalWithBootstrapButtons.fire("수정되었습니다");
          }
        });
    },
  }
};
</script>
