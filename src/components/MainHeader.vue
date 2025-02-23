<template>
  <header>
    <v-container pa-0>
      <v-toolbar fixed flat dark :color="headerColor" height="65px">
        <v-toolbar-side-icon
          @click.stop="drawer = !drawer"
          class="hidden-md-and-up"
        >
          <v-icon>menu</v-icon>
        </v-toolbar-side-icon>
        <router-link to="/" tag="v-icon" class="hidden-xs-only">
          home
        </router-link>
        <v-toolbar-title>SamJo Blog</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat v-if="adminAuthStatus" to="/backoffice">BackOffice</v-btn>
          <v-btn flat to="/repository">Repository</v-btn>
          <v-btn flat to="/portfolio">Portfolio</v-btn>
          <v-btn flat to="/post">Post</v-btn>
          <v-btn flat v-if="!loginUserStatus" @click="dialog = true">
            Login
          </v-btn>
          <v-btn flat v-if="loginUserStatus" to="/memberModifyPage">
            MyPage
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
          fab
          dark
          fixed
          color="#ff3d4088"
          class="position"
          v-show="btnShow"
          @click="$vuetify.goTo(0)"
        >
          <v-icon>expand_less</v-icon>
        </v-btn>
      </v-fab-transition>
      <div
        id="frogue-container"
        class="position-right-bottom"
        data-chatbot="2d9abeee-081d-4c17-84fb-1a9f91c9d937"
        data-user="skrduq1260"
        data-init-key="value"
      ></div>
      <Board v-model="boardSwitch"></Board>
      <v-navigation-drawer v-model="drawer" width="160" fixed temporary>
        <v-list class="pa-1 grey" dark>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-gravatar v-if="!userPhotoURL" :email="userEmail" :size="80" />
              <v-img v-if="userPhotoURL" :src="userPhotoURL"></v-img>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title style="font-size: 0.8em;">
                {{ userName }}
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

          <v-list-tile v-if="loginUserStatus" to="/memberModifyPage">
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>MyPage</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

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
import Board from "./Board";

export default {
  name: "MainHeader",
  data() {
    return {
      boardSwitch: false,
      btnShow: false,
      drawer: false,
      dialog: false,
      headerColor: "#00002288",
      items: [
        { title: "Home", icon: "home", route: "/" },
        { title: "Repository", icon: "folder", route: "/repository" },
        { title: "Portfolio", icon: "art_track", route: "/portfolio" },
        { title: "Post", icon: "create", route: "/post" }
      ]
    };
  },
  computed: {
    loginUserStatus() {
      if (this.$store.state.user) {
        return this.$store.state.user;
      } else {
        return false;
      }
    },
    userEmail() {
      if (this.$store.state.user) {
        return this.$store.state.user.email;
      } else {
        return "Guest";
      }
    },
    userName() {
      if (this.$store.state.user) {
        if (this.$store.state.user.displayName) {
          return this.$store.state.user.displayName;
        } else {
          return this.$store.state.user.email;
        }
      } else {
        return "Guest";
      }
    },
    userPhotoURL() {
      if (this.$store.state.user) {
        return this.$store.state.user.photoURL;
      } else {
        return null;
      }
    },
    adminAuthStatus() {
      if (this.$store.state.auth) {
        return this.$store.state.auth.userAuth === "admin";
      }
      return false;
    }
  },
  components: {
    SignIn,
    Board
  },
  methods: {
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
      this.$store.commit("logout", {
        user: "",
        accessToken: "",
        auth: ""
      });
      this.$router.push("/");
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
    FirebaseService.authChk();
    this.$EventBus.$on("clickedItem", () => {
      this.boardSwitch = true;
    });
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
<style>
.position {
  bottom: 7em;
  right: 1.7em;
}
</style>
