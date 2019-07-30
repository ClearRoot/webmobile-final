import Api from "@/services/Api";

const WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather";
const TRANSLATE_URL = "https://www.googleapis.com/language/translate/v2";

export default {
  getWeather() {
    let city = "gwangju";
    const units = "metric";
    const lang = "kr";
    const appid = "d27787a4bf39395d1cd18e77f737675d";
    return Api.normalApi(WEATHER_URL).get(
      `?q=${city}&units=${units}&lang=${lang}&appid=${appid}`
    );
  },
  getTranslates(s, t) {
    const key = "AIzaSyChUf-_S1c5gnxJdSZE8u5hBjTyRlBSgm8";
    const source = s;
    const target = t;
    let texts = "";
    const textsCount = arguments.length;
    for (var i = 2; i < textsCount; i++) {
      texts += `&q=${arguments[i]}`;
    }
    return Api.normalApi(TRANSLATE_URL).get(
      `?key=${key}&source=${source}&target=${target}` + texts
    );
  }
};
