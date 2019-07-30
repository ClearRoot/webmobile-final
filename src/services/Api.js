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
  }
};
