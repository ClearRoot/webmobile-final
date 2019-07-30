<template>
  <v-layout justify-center>
    <v-dialog
      :value="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click="$emit('close')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- <v-btn dark text @click="dialog = false">Save</v-btn> -->
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: "Board",
  data() {
    return {
      // id: this.item_id
    }
  },
  // watch : {
  //   dialog_state : function(){
  //     this.dialog = this.dialog_state;
  //   }
  // },
  props: {
    setDialog: {
      type: Object
    }
  },
  // mounted(){
  //   console.log(this.dialog + " : " + this.id)
  // },
  computed: {
    dialog() {
      return this.setDialog.dialog;
    }
  }
};
</script>
