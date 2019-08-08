import Api from "@/services/Api";

export default {
  async getAnalyticsDatas(query) {
    let token = await Api.refresh();
    return Api.analytics(query, token).get(token).then(response => {return response}); 
  }
};
