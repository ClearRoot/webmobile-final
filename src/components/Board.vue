<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
    </template>
    <v-card tile>
      <v-toolbar flat dark color="primary">
        <v-btn icon dark>
          <v-icon @click="dialog = false">close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="update()">
            수정하기
          </v-btn>
        </v-toolbar-items>
        <v-menu bottom right offset-y>
          <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>
        </v-menu>
      </v-toolbar>
      <v-card-text>
        <v-flex xs8>
          <v-text-field
            label="제목"
            outlined
            v-model="item_title"
            required
          ></v-text-field>
        </v-flex>
        <v-divider></v-divider>
        <v-textarea
          solo
          rows="20"
          row-height="20"
          label="내용"
          v-model="item_content"
          required
        ></v-textarea>
        <v-divider></v-divider>
      </v-card-text>
      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";

export default {
  data() {
    return {
      dialog: false,
      items: [],
      setItem: {
        title: this.item_title,
        body: this.item_content,
        id: this.item_id
      }
    };
  },
  props: ["item_title", "item_content"],
  methods: {
    update() {
      console.log(this.title + " " + this.body + " " + this.id)
    }
  }
};
</script>
