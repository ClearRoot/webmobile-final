<template>
  <v-layout justify-center>
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="#00000099">
        <v-toolbar dark color="#00002288">
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-layout v-show="btnList">
              <v-btn
                tile
                outlined
                color="success"
                @click="btnEditBoard"
                v-show="checkAuth"
              >
                <v-icon>mdi-pencil</v-icon> Edit
              </v-btn>
              <v-btn
                class="ma-1"
                tile
                outlined
                color="red"
                @click="btnDeleteBoard"
                v-show="checkAuth"
              >
                <v-icon>mdi-pencil</v-icon> delete
              </v-btn>
            </v-layout>
            <v-btn class="ma-4" icon @click.close="close">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md5>
              <v-card v-if="!boardEditSwitch">
                <v-card-title primary class="title">
                  {{ itemTitle }}
                </v-card-title>
                <v-img
                  :src="this.$store.state.item.img"
                  v-if="this.$store.state.item_type === 'portfolios'"
                ></v-img>
                <vue-markdown
                  class="v-card__text"
                  :source="this.itemBody"
                ></vue-markdown>
              </v-card>
              <v-card v-if="boardEditSwitch">
                <BoardEdit v-if="boardEditSwitch === true" :boardItem="item">
                </BoardEdit>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12 sm6 md7 child-flex>
              <v-card>
                <Comment></Comment>
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
import VueMarkdown from "vue-markdown";

export default {
  name: "Board",
  data() {
    return {
      itemTitle: "",
      itemBody: "",
      item: {
        TitleEdit: "",
        BodyEdit: "",
        ImgEdit: ""
      },
      boardEditSwitch: false,
      btnList: true
    };
  },
  props: {
    value: Boolean
  },
  components: {
    Comment,
    BoardEdit,
    VueMarkdown
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
    checkAuth() {
      if (this.$store.state.user) {
        return this.$store.getters.checkAuth;
      } else {
        return null;
      }
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
      this.boardEditSwitch = false;
      this.show = false;
    },
    btnEditBoard() {
      this.boardEditSwitch = true;
      this.btnList = false;
      this.item.titleEdit = this.$store.getters.getItem.title;
      this.item.bodyEdit = this.$store.getters.getItem.body;
      this.item.imgEdit = this.$store.getters.getItem.img;
    },
    async btnDeleteBoard() {
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
            FirebaseService.removeItem(
              this.$store.getters.getItem.id,
              this.$store.getters.getItemType
            );
            this.swalWithBootstrapButtons.fire("삭제되었습니다");
            this.$EventBus.$emit("refreshBoard");
            this.show = false;
          }
        });
    }
  },
  created() {
    this.$EventBus.$on("clickedItem", () => {
      this.itemTitle = this.$store.getters.getItem.title;
      this.itemBody = this.$store.getters.getItem.body;
      this.btnList = true;
      this.show = true;
    });
    this.$EventBus.$on("close", () => {
      this.close();
    });
    this.$EventBus.$on("cancel", () => {
      this.boardEditSwitch = false;
      this.btnList = true;
    });
  }
};
</script>
