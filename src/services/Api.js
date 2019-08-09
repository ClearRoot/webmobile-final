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
  }
};
