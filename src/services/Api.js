import axios from "axios";

export default {
  gitLab(baseURL) {
    return axios.create({
      baseURL: baseURL,
      withCredentials: false,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": "3RdxpbkH4CUDwt4siZMy"
      }
    });
  },
  normalApi(baseURL) {
    return axios.create({
      baseURL: baseURL,
      withCredentials: false,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  },
  analytics(baseURL, token) {
    return axios.create({
      baseURL: baseURL,
      token: token,
      headers: {
        Accept: "application/json",
        "Content-Type": "Content-type:application/x-www-form-urlencoded"
      }
    });
  },
  refresh() {
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
