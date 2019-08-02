<template>
  <v-layout row justify-center>
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="title"
                v-model="value.edit_title"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <markdown-editor
                :configs="options"
                v-model="value.edit_body"
              ></markdown-editor>
            </v-flex>
            <input
              style="visibility:hidden"
              type="text"
              ref="item_title"
              :value="value.edit_title"
              @input="updateDate()"
            />
            <input
              style="visibility:hidden"
              type="text"
              ref="item_body"
              :value="value.edit_body"
              @input="updateDate()"
            />
          </v-layout>
          <ImgList v-if="board_type === 'portfolio'" :name="name"></ImgList>
          <v-img v-if="imageFile" :src="imageFile"></v-img>
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
    board_type: { type: String },
    item_id: { type: String },
    value: { type: Object }
  },
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
      },
      item: {
        title: "",
        body: "",
        id: ""
      },
      origin_title: "",
      origin_body: ""
    };
  },
  components: {
    ImgList
  },
  created() {
    this.$EventBus.$on("selectImgWriter", res => {
      this.imageFile = res;
    });
    this.origin_title = this.value.edit_title;
    this.origin_body = this.value.edit_body;
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
        this.value.edit_title != this.origin_title ||
        this.value.edit_body != this.origin_body
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
              this.value.edit_title = this.origin_title;
              this.value.edit_body = this.origin_body;
              this.$EventBus.$emit("close");
            }
          });
      } else {
        this.$EventBus.$emit("close");
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
            this.item.title = this.value.edit_title;
            this.item.body = this.value.edit_body;
            this.origin_title = this.value.edit_title
            this.origin_body = this.value.edit_body;
            this.item.id = this.item_id;
            switch (this.board_type) {
              case "post":
                FirebaseService.updatePost(this.item);
                break;
              default:
                this.item.img = this.imageFile;
                FirebaseService.updatePortfolio(this.item);
            }
            this.$EventBus.$emit("closeRoot");
            this.$EventBus.$emit("close");
            this.$EventBus.$emit("refreshBoard");
            this.$EventBus.$emit("refreshDetail",this.value);
            this.swalWithBootstrapButtons.fire("수정되었습니다");
          }
        });

    },
    updateDate() {
      this.$emit("input", {
        edit_title: this.$refs.item_title.value,
        edit_body: this.$refs.item_body.value
      });
    }
  }
};
</script>
