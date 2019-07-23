<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        Repository
      </div>
    </ImgBanner>
    <v-container>
      <!-- Portfolio -->
      <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center">Project</h2>
          <RepositoryList></RepositoryList>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import RepositoryList from "../components/RepositoryList";

export default {
  name: "PortfolioPage",
  components: {
    ImgBanner,
    RepositoryList
  }
};
</script>
