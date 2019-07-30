import Api from "@/services/Api";

const BASE_URL = "https://lab.ssafy.com/api/v4";

export default {
  getRepos(userName) {
    return Api.gitLab(BASE_URL).get(`/users/${userName}/projects`);
  },
  getCommits(fullName, page) {
    return Api.gitLab(BASE_URL).get(
      `/projects/${fullName}/repository/commits?per_page=10&page=${page}`
    );
  },
  getMembers() {
    return Api.gitLab(BASE_URL).get(`/projects/6082/members`);
  }
};
