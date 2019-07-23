<template>
  <div>
    <v-layout justify-center>
      <div xs6>
        <div>{{ time }}</div>
        <div>{{ cityName }}</div>
        <div>{{ weather }}</div>
      </div>
      <img xs6 :src="weatherImgUrl" />
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "Weather",
  data() {
    return {
      weather: "",
      currentTemp: "",
      cityName: "",
      weatherImgUrl: "",
      time: "",
      weatherApiUrl:
        "http://api.openweathermap.org/data/2.5/weather?q=gwangju&units=metric&lang=kr&appid=d27787a4bf39395d1cd18e77f737675d"
    };
  },
  mounted() {
    this.weatherAxios();
    this.clock();
  },
  methods: {
    weatherAxios() {
      const axios = require("axios");
      axios({
        method: "GET",
        url: this.weatherApiUrl
      })
        .then(res => {
          this.weather = res.data.weather[0].main;
          this.currentTemp = res.data.main.temp;
          this.cityName = res.data.name;
          this.weatherImgUrl =
            "http://openweathermap.org/img/w/" +
            res.data.weather[0].icon +
            ".png";
        })
        .catch(e => {
          console.log(e);
        });
    },
    clock() {
      const today = new Date();
      const dd = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      let y = today.getFullYear();
      let utcM = today.getUTCMonth() + 1;
      let utcD = today.getUTCDate();
      let d = today.getDay();
      this.time = y + "-" + utcM + "-" + utcD + " " + dd[d];
    }
  }
};
</script>
