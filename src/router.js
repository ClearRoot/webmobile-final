import Vue from "vue";
import Router from "vue-router";
import HomePage from "./views/HomePage.vue";
import PostPage from "./views/PostPage.vue";
import PortfolioPage from "./views/PortfolioPage.vue";
import PortfolioDetail from "./views/PortfolioDetail.vue";
import PostDetail from "./views/PostDetail.vue";
import RepositoryPage from "./views/RepositoryPage.vue";
import LoginPage from "./views/LoginPage.vue";

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
      path: "/portfoliodetail",
      name: "portfoliodetail",
      component: PortfolioDetail,
      props:true
    },
    {
      path: "/postdetail",
      name: "postdetail",
      component: PostDetail,
      props:true
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});
