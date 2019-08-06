<template>
  <v-layout mt-5 wrap>
    <v-flex
      v-for="i in portfolios.length > limits ? limits : portfolios.length"
      :key="i"
      xs12
      sm6
    >
      <Portfolio class="ma-3" :data="portfolios[i - 1]"></Portfolio>
    </v-flex>

    <Board
      v-if="render"
      v-model="showBoard"
      :board_item="item"
      :board_type="'portfolio'"
    ></Board>
    <v-flex xs12 text-xs-center round my-5 v-if="loadMore">
      <v-btn outline color="black" dark v-on:click="loadMorePortfolios"
        ><v-icon size="25" class="mr-2">fa-plus</v-icon> 더 보기</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script>
import Portfolio from "@/components/Portfolio";
import FirebaseService from "@/services/FirebaseService";
import Board from "@/components/Board";

export default {
  name: "PortfoliosList",
  props: {
    limits: { type: Number, default: 6 },
    loadMore: { type: Boolean, default: false }
  },
  data() {
    return {
      render: true,
      portfolios: [],
      showBoard: false,
      item: { type: Object }
    };
  },
  created() {
    if (this.$route.name == "home") {
      this.render = false;
    }
    this.$EventBus.$on("refreshBoard", async () => {
      this.portfolios = await FirebaseService.getPortfolios();
    });
    this.$EventBus.$on("item", res => {
      this.item = res;
      this.showBoard = true;
    });
  },
  components: {
    Portfolio,
    Board
  },
  mounted() {
    this.getPortfolios();
  },
  methods: {
    async getPortfolios() {
      this.portfolios = await FirebaseService.getPortfolios(); //console.log(this.tii)//타이틀, 바디값만 출력함~~~~
    },

    loadMorePortfolios() {
      this.limits += 6;
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
