<template>
  <v-card>
    <!--This site login-->
    <v-toolbar card color="blue-grey" dark>
      <v-toolbar-title span="headline" class="mx-auto">Login</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-container grid-list-md>
        <!-- firebase email login -->
        <v-layout wrap color="teal lighten-4">
          <v-flex xs12 sm12>
            <v-text-field
              color="teal"
              label="E-MAIL"
              hint="test@test.com"
              v-model="login_email"
              persistent-hint
              outline
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12>
            <v-text-field
              color="teal"
              label="PASSWORD"
              v-model="login_password"
              type="password"
              persistent-hint
              outline
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <!--social network login-->
        <v-layout row justify-center>
          <v-btn flat v-on:click="loginWithFacebook">
            <i
              class="fab fa-facebook mr-1"
              size="25px"
              style="font-size:20px;color:blue"
            ></i>
            facebook
          </v-btn>
          <v-btn flat v-on:click="loginWithGoogle">
            <i
              class="fab fa-google"
              size="25px"
              style="font-size:20px;color:red"
            ></i>
            &nbsp;Google
          </v-btn>
        </v-layout>
        <!--login // close button-->
        <v-layout row justify-center>
          <v-btn color="teal" flat @click="loginWithEmail">login</v-btn>
          <v-btn color="teal" flat @click="close">close</v-btn>
        </v-layout>
        <!--가입-->
        <v-layout row justify-center>
          <v-dialog v-model="JoinStie" persistent max-width="600px">
            <template v-slot:activator="{ on }">
              <p>Don't have a account?</p>
              <p
                style="color:teal; text-decoration: button; cursor:pointer;"
                v-on="on"
              >
                &nbsp;REGISTER HERE
              </p>
            </template>
            <v-card>
              <v-toolbar card color="blue-grey" class="text-md-center" dark>
                <v-toolbar-title span="headline">Member Join</v-toolbar-title>
              </v-toolbar>
              <v-divider></v-divider>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field
                        outline
                        label="E-MAIL*"
                        v-model="join_email"
                        required
                        :rules="[rules.email]"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        outline
                        label="PASSOWRD*"
                        v-model="join_password"
                        type="password"
                        required
                        :rules="[rules.password, rules.length(6)]"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        outline
                        label="CONFIRM PASSWORD*"
                        v-model="join_confirm_password"
                        type="password"
                        required
                        :rules="[rules.password, rules.length(6)]"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <small>* 표시는 필수 입력값 입니다.</small>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="teal darken-1" flat @click="JoinStie = false">
                  Close
                </v-btn>
                <v-btn color="teal darken-1" flat @click="joinWithEmial">
                  Join
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </v-card>
  </v-card>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import Swal from "sweetalert2";

export default {
  name: "signin",
  data() {
    return {
      JoinStie: false,
      login_email: "",
      login_password: "",
      join_email: "",
      join_password: "",
      join_confirm_password: "",
      rules: {
        email: v => (v || "").match(/@/) || "E-mail 형식을 입력해주세요.",
        length: len => v => (v || "").length >= len || "최소 ${len} 이상으로 설정하여야 합니다.",
        password: v => (v || "").match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
        "비밀번호에는 대문자, 숫자 및 특수 문자가 포함되어야합니다.",
        required: v => !!v || "This field is required"
      }
    };
  },

  methods: {
    async loginWithGoogle() {
      const result = await FirebaseService.loginWithGoogle();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
      const auth = await FirebaseService.getUser();
      this.$store.state.user.auth = auth.userAuth;
      if (result.user) {
        FirebaseService.createUserRule();
        FirebaseService.requestPermission();
        this.swal_alert("social_login", null);
      }
      this.close();
    },
    async loginWithFacebook() {
      const result = await FirebaseService.loginWithFacebook();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
      const auth = await FirebaseService.getUser();
      this.$store.state.user.auth = auth.userAuth;
      if (result.user) {
        FirebaseService.createUserRule();
        FirebaseService.requestPermission();
        this.swal_alert("social_login", null);
      }
      this.close();
    },
    async loginWithEmail() {
      const result = await FirebaseService.loginWithEmail(
        this.login_email,
        this.login_password
      );
      this.$store.state.user = result.user;
      const auth = await FirebaseService.getUser();
      this.$store.state.user.auth = auth.userAuth;
      if (result.user) {
        FirebaseService.createUserRule();
        FirebaseService.requestPermission();
        this.swal_alert("login", result.user.email);
        this.close();
      } else {
        this.swal_alert("error", result.code);
      }
    },
    async joinWithEmial() {
      const result = await FirebaseService.joinWithEmail(
        this.join_email,
        this.join_password,
        this.join_confirm_password
      );
      if (result && this.join_password === this.join_confirm_password) {
        this.swal_alert("join", null);
        this.close();
      } else {
        this.swal_alert("error", null);
      }
    },
    close: function() {
      this.$EventBus.$emit("close", false);
      this.reset();
    },
    reset: function() {
      this.login_email = "";
      this.login_password = "";
      this.join_email = "";
      this.join_password = "";
      this.join_confirm_password = "";
    },
    swal_alert: function(code, message) {
      if (code === "login") {
        Swal.fire({
          title: message,
          text: "환영합니다.",
          type: "success",
          showConfirmButton: false,
          timer: 1000
        });
      } else if (code === "error") {
        var alertcode = "";
        if (message === "auth/invalid-email") {
          alertcode = "이메일 형식을 잘못되었습니다.";
        } else if (message === "auth/wrong-password") {
          alertcode = "아이디가 잘못되었거나, 비밀번호가 틀립니다.";
        } else if (message === "auth/user-not-found") {
          alertcode = "존재하지 않는 아이디입니다.";
        } else {
          alertcode = "잘 못 입력하셨습니다";
        }
        Swal.fire({
          title: "Error!",
          text: alertcode,
          type: "error",
          showConfirmButton: false,
          timer: 2000
        });
      } else if (code === "join") {
        Swal.fire({
          title: "환영합니다.",
          text: "가입되었습니다.",
          type: "question",
          customClass: {
            icon: "swal2-arabic-question-mark"
          },
          confirmButtonText: "예",
          cancelButtonText: "아니오",
          showCancelButton: true,
          showCloseButton: true
        });
      } else if (code === "social_login") {
        Swal.fire({
          title: "반갑습니다.",
          type: "success",
          showConfirmButton: false,
          timer: 2000
        });
      }
    }
  },
  mounted() {
    let self = this;
    window.addEventListener("keyup", function(event) {
      if (self.login_email && event.keyCode === 13) {
        self.loginWithEmail();
      } else if (event.keyCode === 27) {
        self.close();
      }
    });
  }
};
</script>
