<template>
  <v-layout justify-center>
    <v-dialog
      style="z-index: 202;z-index: 99999993"
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="#00000099">
        <v-toolbar dark color="#00002288">
          <!-- <v-toolbar-title>{{ board_item.title }}</v-toolbar-title> -->

          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              tile
              outlined
              color="success"
              @click="eidt_board"
              v-show="checkAuth"
            >
              <v-icon>mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn
              class="ma-1"
              tile
              outlined
              color="red"
              @click="delete_board"
              v-show="checkAuth"
            >
              <v-icon>mdi-pencil</v-icon> delete
            </v-btn>
            <v-btn class="ma-4" icon @click.close="close">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md5>
              <v-card>
                <v-card-title primary class="title">
                  {{ item.edit_title }}
                </v-card-title>
                <v-img :src="board_item.img" v-if="!imgState && imgUrl"></v-img>
                <v-card-text>
                  {{ item.edit_body }}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12 sm6 md7 child-flex>
              <v-card>
                <Comment
                  :id="board_item.id"
                  v-show="edit_state === false"
                ></Comment>
                <BoardEdit
                  v-if="edit_state === true"
                  v-model="item"
                  :item_id="board_item.id"
                  :board_type="board_type"
                >
                </BoardEdit>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import FirebaseService from "../services/FirebaseService";
import BoardEdit from "./BoardEdit";
import Comment from "./Comment";
import Swal from "sweetalert2";

export default {
  name: "Board",
  data() {
    return {
      edit_state: false,
      item: {
        edit_title: "",
        edit_body: ""
      }
    };
  },
  props: {
    value: Boolean,
    board_item: { type: Object },
    board_type: { type: String }
  },
  components: {
    Comment,
    BoardEdit
  },
  watch: {
    board_item: function() {
      this.item.edit_title = this.board_item.title;
      this.item.edit_body = this.board_item.body;
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    imgState: function() {
      return this.edit_state;
    },
    imgUrl: function() {
      if (!this.board_item.img) {
        return false;
      } else {
        return true;
      }
    },
    checkAuth(){
      return (
        this.$store.state.user.uid == this.board_item.ownerId ||
        this.$store.state.auth.userAuth == "admin"
      );
    }
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
      this.show = false;
      this.edit_state = false;
    },
    eidt_board() {
      if (this.edit_state == true) {
        this.edit_state = false;
      } else {
        this.edit_state = true;
      }
      this.item.edit_title = this.board_item.title;
      this.item.edit_body = this.board_item.body;
    },
    async delete_board() {
      this.swalWithBootstrapButtons
        .fire({
          title: "삭제 확인",
          text: "게시글을 정말로 삭제하시겠습니까?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "예",
          cancelButtonText: "아니오"
        })
        .then(result => {
          if (result.value) {
            switch (this.board_type) {
              case "post":
                FirebaseService.removeItem(this.board_item.id, "posts");
                break;
              default:
                FirebaseService.removeItem(this.board_item.id, "portfolios");
            }
            this.swalWithBootstrapButtons.fire("삭제되었습니다");
            this.$EventBus.$emit("refreshBoard");
            this.show = false;
          }
        });
    }
  },
  created() {
    this.$EventBus.$on("closeRoot", () => (this.show = false));
    this.$EventBus.$on("close", () => (this.edit_state = false));
    this.$EventBus.$on("refreshDetail", item => (this.item = item));
  }
};
</script>
