<template>
  <v-layout>
    <h1>test page 입니다. 상세페이지가 완성되면 삭제 해주세요.</h1>
    <div style="wdith:350px">
      <Board></Board>
    </div>
  </v-layout>
</template>

<script>
import Board from "./Board";
export default {
  components: {
    Board
  }
};
</script>
