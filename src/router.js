import Vue from "vue";
import Router from "vue-router";
import HomePage from "./views/HomePage.vue";
import PostPage from "./views/PostPage.vue";
import PortfolioPage from "./views/PortfolioPage.vue";
import RepositoryPage from "./views/RepositoryPage.vue";
import LoginPage from "./views/LoginPage.vue";
import SignIn from "./components/SignIn.vue";
import BackOfficePage from "./views/BackOfficePage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/post",
      name: "post",
      component: PostPage
    },
    {
      path: "/portfolio",
      name: "portfolio",
      component: PortfolioPage
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage
    },
    {
      path: "/repository",
      name: "repository",
      component: RepositoryPage
    },

    {
      path: "/signin",
      name: "signin",
      component: SignIn
    },

    {
      path: "/backoffice",
      name: "backoffice",
      component: BackOfficePage
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});
