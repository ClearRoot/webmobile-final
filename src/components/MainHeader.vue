<template>
  <header>
    <v-container pa-0>
      <v-toolbar fixed flat dark :color="headerColor" height="65px">
        <v-toolbar-side-icon
          @click.stop="drawer = !drawer"
          class="hidden-sm-and-up"
        >
          <v-icon>menu</v-icon>
        </v-toolbar-side-icon>
        <router-link to="/" tag="v-icon" class="hidden-xs-only">
          home
        </router-link>
        <v-toolbar-title>SamJo Blog</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn flat v-if="adminAuthStatus" to="/backoffice">BackOffice</v-btn>
          <v-btn flat to="/repository">Repository</v-btn>
          <v-btn flat to="/portfolio">Portfolio</v-btn>
          <v-btn flat to="/post">Post</v-btn>
          <v-btn flat v-if="!loginUserStatus" @click="dialog = true">
            Login
          </v-btn>
          <v-btn flat v-if="loginUserStatus" @click="logOut">Logout</v-btn>
          <v-btn flat @click="trans">Translation</v-btn>
          <v-icon medium @click="triggerBookmark">star_border</v-icon>
          <v-dialog
            class="ma-0 mt-1"
            v-model="dialog"
            max-width="300"
            persistent
            round
          >
            <SignIn></SignIn>
          </v-dialog>
        </v-toolbar-items>
      </v-toolbar>

      <v-fab-transition>
        <v-btn
          bottom
          right
          fixed
          fab
          dark
          color="#ff3d4088"
          v-show="btnShow"
          @click="$vuetify.goTo(0)"
        >
          <v-icon>expand_less</v-icon>
        </v-btn>
      </v-fab-transition>

      <v-navigation-drawer v-model="drawer" width="160" fixed temporary>
        <v-list class="pa-1 grey" dark>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-gravatar :email="userEmail" :size="80" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title style="font-size: 0.8em;">
                {{ userEmail }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list class="pt-0" dense>
          <v-divider></v-divider>
          <router-link
            v-for="item in items"
            :key="item.title"
            :to="item.route"
            tag="v-list-tile"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </router-link>


          <v-list-tile v-if="!loginUserStatus" @click="dialog = true">
            <v-list-tile-action>
              <v-icon>lock</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Login</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="loginUserStatus" @click="logOut">
            <v-list-tile-action>
              <v-icon>lock_open</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </header>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import SignIn from "../components/SignIn";
import Swal from "sweetalert2";

export default {
  name: "MainHeader",
  data() {
    return {
      authLoad: false,
      auth: false,
      showBackOffice: false,
      btnShow: false,
      drawer: false,
      dialog: false,
      headerColor: "#00002288",
      items: [
        { title: "Home", icon: "home", route: "/" },
        { title: "Repository", icon: "folder", route: "/repository" },
        { title: "Portfolio", icon: "art_track", route: "/portfolio" },
        { title: "Post", icon: "create", route: "/post" },
        { title: "Comment", icon: "lock_open", route: "/comment" }
      ]
    };
  },
  computed: {
    loginUserStatus() {
      return this.$store.state.user;
    },
    userEmail() {
      if (this.$store.state.user) {
        return this.$store.state.user.email;
      } else {
        return "Guest";
      }
    },
    adminAuthStatus() {
      if (!this.authLoad) this.checkAuth();
      if (this.authLoad && !this.auth.updated_at) this.checkAuth();
      if(!this.auth) return;
      if (this.auth.userAuth == "admin") return true;
      return false;
    }
  },
  components: {
    SignIn
  },
  methods: {
    async checkAuth() {
      if (this.$store.state.user) {
        const user = await FirebaseService.getUser();
        this.authLoad = true;
        this.auth = user;
      }
    },
    trans() {
      this.$EventBus.$emit("click-icon_aboutme");
      this.$EventBus.$emit("click-icon_portfolio");
      this.$EventBus.$emit("click-icon_post");
      this.$EventBus.$emit("click-icon_detail");
    },
    handleScroll() {
      this.btnShow = window.scrollY > 300;
      if (window.scrollY > 300) {
        this.headerColor = "#000022ff";
      } else if (window.scrollY < 250) {
        this.headerColor = "#00002288";
      }
    },
    triggerBookmark() {
      alert(
        (navigator.userAgent.toLowerCase().indexOf("mac") != -1
          ? "Cmd"
          : "Ctrl") + "+D 키를 눌러 즐겨찾기에 등록하실 수 있습니다."
      );
    },
    async logOut() {
      FirebaseService.logOut();
      this.swal_alert();
      this.$store.state.user = "";
      this.$store.state.accessToken = "";
      this.authLoad = false;
      this.auth = null;
    },
    swal_alert: function() {
      Swal.fire({
        title: "Logout 되었습니다.",
        background: "yellow",
        width: 300,
        showConfirmButton: false,
        timer: 1000,
        backdrop: `
          rgb(116,167,188)
          url("https://data.whicdn.com/images/300928902/original.gif")
          center
          no-repeat
        `
      });
    }
  },
  created() {
    FirebaseService.loginChk();
    this.$EventBus.$on("close", async () => {
      this.dialog = false;
    });
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
