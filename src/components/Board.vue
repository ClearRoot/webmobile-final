<template>
  <v-layout justify-center>
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card color="grey">
        <v-toolbar dark>
          <v-toolbar-title>{{ board_item.title }}</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              tile
              outlined
              color="success"
              @click="eidt_board"
              v-show="board_item.auth"
            >
              <v-icon>mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn
              class="ma-1"
              tile
              outlined
              color="red"
              @click="delete_board"
              v-show="board_item.auth"
            >
              <v-icon>mdi-pencil</v-icon> delete
            </v-btn>
            <v-btn class="ma-4" icon @click.close="show = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md5>
              <v-card>
                <v-card-title
                  primary
                  class="title"
                  v-show="edit_state === false">
                  {{ board_item.title }}
                </v-card-title>
                <v-card-title
                  primary
                  class="title"
                  v-show="edit_state === true">
                  {{ item.edit_title }}
                </v-card-title>
                <v-card-text v-show="edit_state === false">
                  {{ board_item.body }}
                </v-card-text>
                <v-card-text v-show="edit_state === true">
                  {{ item.edit_body }}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12 sm6 m7 child-flex>
              <v-card>
                <Comment
                  :id="board_item.id"
                  :board_type="'post'"
                  v-show="edit_state === false"
                ></Comment>
                <BoardEdit v-show="edit_state === true" v-model="item" :item_id="board_item.id"></BoardEdit>
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
    board_item: { type: Object }
    // data: { type: Object }
  },
  components: {
    Comment,
    BoardEdit
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    eidt_board() {
      if (this.edit_state == true) {
        this.edit_state = false;
      } else {
        this.edit_state = true;
      }
      this.item.edit_title = this.board_item.title;
      this.item.edit_body = this.board_item.body;
    },
    delete_board() {
      FirebaseService.removeItem(this.board_item.id, "posts");
      this.show = false;
    }
  },
  created() {
    this.$EventBus.$on("close", () => (this.edit_state = false));
  }
};
</script>
