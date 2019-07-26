<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        Portfolio
      </div>
    </ImgBanner>
    <v-container>
      <!-- Portfolio -->
      <PortfolioWriter></PortfolioWriter>
      <v-layout>
        <v-flex xs12>
          <PortfolioList :limits="2" :load-more="true"></PortfolioList>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import PortfolioList from "../components/PortfolioList";
import PortfolioWriter from "../components/PortfolioWriter";

export default {
  name: "PortfolioPage",
  components: {
    ImgBanner,
    PortfolioList,
    PortfolioWriter
  },

  methods: {

  }
};
</script>
