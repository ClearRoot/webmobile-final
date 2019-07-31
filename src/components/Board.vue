<template>
  <v-layout justify-center>
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >

      <v-card>
        <v-toolbar dark color="#22778844">
          <v-btn icon @click.close="show = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{data.id}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text>Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md6>
              <v-card color="purple" dark>
                <v-card-title primary class="title">
                  {{ data.title }}
                </v-card-title>
                <v-card-text>{{ data.body }}</v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12 sm6 m6 child-flex>
              <v-card color="green lighten-2" dark>
              <!-- <Comment :item_id="data.id" :board_type="'post'"></Comment> -->
              <h1> 댓글 !@!$#!%!#%!%!@%!@%</h1>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
// import Comment from "./Comment";

export default {
  name: "Board",
  data() {
    return {};
  },
  props: {
    value: Boolean,
    data: { type: Object }
  },
  components: {
    // Comment
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
  }
};
</script>
