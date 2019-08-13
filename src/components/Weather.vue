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
import ApiService from "@/services/ApiService";

export default {
  name: "Weather",
  data() {
    return {
      weather: "",
      currentTemp: "",
      cityName: "",
      weatherImgUrl: "",
      time: ""
    };
  },
  mounted() {
    this.weatherAxios();
    this.clock();
  },
  methods: {
    weatherAxios() {
      ApiService.getWeather()
        .then(res => {
          this.weather = res.data.weather[0].main;
          this.currentTemp = res.data.main.temp;
          this.cityName = res.data.name;
          this.weatherImgUrl =
            "https://openweathermap.org/img/w/" +
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
