import Api from "@/services/Api";
import axios from "axios";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
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
  },
  getRefreshToken() {
    return axios
      .post("https://accounts.google.com/o/oauth2/token", {
        grant_type: "refresh_token",
        refresh_token:
          "1/amvjBSmM2NhlrBcjGj_hlFxn0msNXYWPfpa1GLBXHEIFbk9Nfba8HWgOENNEgNaF",
        client_id:
          "355527894492-mhj9muq00p79epl1mv9c3k7j05tbtvq0.apps.googleusercontent.com",
        client_secret: "IRkbHrMqGsT9w39FP0miAJVa"
      })
      .then(response => {
        return response.data.access_token;
      })
      .catch(error => {
      console.log("refresh error" + error);
      });
  }
};
