<template>
  <div>
    <v-img
      src="http://file3.instiz.net/data/file3/2018/08/14/4/7/1/471dca7dd711a5d73995eb544f2a0fee.gif"
      aspect-ratio="1.9"
    >
      <v-layout align-center justify-center row fill-height>
        <v-flex text-xs-center>
          <span class="text-shadow display-2 font-weight-black">
            <slot name="text" /> ERROR!!!
          </span>
        </v-flex>
      </v-layout>
    </v-img>
    <v-layout row justify-end></v-layout>
  </div>
</template>
