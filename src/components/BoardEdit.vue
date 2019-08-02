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
    close() {
      this.$EventBus.$emit("close");
    },
    async edit() {
      this.item.title = this.value.edit_title;
      this.item.body = this.value.edit_body;
      this.item.id = this.item_id;
      switch (this.board_type) {
        case "post":
          FirebaseService.updatePost(this.item);
          break;
        default:
          this.item.img = this.imageFile;
          FirebaseService.updatePortfolio(this.item);
      }
      await this.$EventBus.$emit("refreshBoard");
      close();
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
