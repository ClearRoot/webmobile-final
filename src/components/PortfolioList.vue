<template>
  <v-layout mt-5 wrap>
    <v-flex
      v-for="i in portfolios.length > length ? length : portfolios.length"
      :key="i"
      xs12
      sm6
    >
      <Portfolio class="ma-3" :data="portfolios[i - 1]"></Portfolio>
    </v-flex>
    <v-flex xs12 text-xs-center round my-5 v-if="more">
      <v-btn outline color="black" dark v-on:click="loadMorePortfolios"
        ><v-icon size="25" class="mr-2">fa-plus</v-icon> 더 보기</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script>
import Portfolio from "@/components/Portfolio";
import FirebaseService from "@/services/FirebaseService";

export default {
  name: "PortfoliosList",
  props: {
    limits: { type: Number, default: 6 },
    loadMore: { type: Boolean, default: false }
  },
  data() {
    return {
      portfolios: [],
      length: this.limits,
      more: this.loadMore
    };
  },
  created() {
    this.$EventBus.$on("refreshBoard", async () => {
      this.portfolios = await FirebaseService.getPortfolios();
    });
  },
  components: {
    Portfolio
  },
  mounted() {
    this.getPortfolios();
  },
  methods: {
    async getPortfolios() {
      this.portfolios = await FirebaseService.getPortfolios();
    },
    loadMorePortfolios() {
      this.length += 6;
      if (this.length >= this.portfolios.length) this.more = false;
    }
  }
};
</script>

<style>
.mw-700 {
  max-width: 700px;
  margin: auto;
}
</style>
