<template>
  <v-footer dark height="auto">
    <v-card class="flex" flat tile>
      <v-card-title class="grey">
        <v-layout row wrap justify-space-around align-center>
          <v-flex xs12 md3 my-2>
            <Weather></Weather>
          </v-flex>
          <v-flex xs12 md6 my-2 text-xs-center>
            <strong class="subheading">
              Get connected with us on social networks!
            </strong>
          </v-flex>
          <v-flex xs12 md3 my-2>
            <v-layout justify-center> </v-layout>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-actions class="grey darken-3 justify-center">
        2019.07.19 — &nbsp; <strong>SSAFY</strong>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
import Weather from "@/components/Weather";

export default {
  name: "MainFooter",
  data() {
    return {
      items: [
        {
          title: "facebook",
          icon: "fab fa-facebook",
          link: "https://www.facebook.com/"
        },
        {
          title: "instagram",
          icon: "fab fa-instagram",
          link: "https://www.instagram.com/"
        },
        {
          title: "gitlab",
          icon: "fab fa-gitlab",
          link: "https://lab.ssafy.com/ClearRoot/webmobile-sub2"
        },
        {
          title: "github",
          icon: "fab fa-github",
          link: "https://github.com/ClearRoot/"
        }
      ]
    };
  },
  components: {
    Weather
  },
  methods: {}
};
</script>
