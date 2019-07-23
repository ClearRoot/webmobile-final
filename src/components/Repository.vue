<template>
  <v-container class="py-3">
    <v-layout>
      <v-flex xs8>
        <div>
          <h2 class="font-weight-regular titleText">
            {{ repos.path_with_namespace }}
          </h2>
          <p
            class="subheading mb-1 grey--text text--darken-1 font-weight-light"
          >
            {{ repos.namespace.name }}
          </p>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>


export default {
  name: "Repository",

  props: {
    repos: {
      type: null
    },
    graphno: null
  },
  data() {
    return {
      stats: {},
      load: false
    };
  }
};

</script>

<style>
.titleText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
