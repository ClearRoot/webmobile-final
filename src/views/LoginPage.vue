<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex xs5 text-xs-center>
      <v-layout
        align-center
        justify-center
        row
        fill-height
        elevation-5
        style="min-height:30vw;"
        white
        pa-4
      >
        <v-flex xs12>
          <!--Google Login form-->
          <v-btn
            class="ma-0 mu-3"
            round
            color="#df4a31"
            dark
            v-on:click="loginWithGoogle"
            style="width:100%;"
          >
            <v-icon class="mr-2">fab fa-google</v-icon>
            <div class="hidden-xs-only">
              Google 로그인
            </div>
            <div class="hidden-sm-and-up">
              Login
            </div>
          </v-btn>
          <br />
          <div v-if="authuser">
            <h2>Signed in as {{ authUser.email }}</h2>
          </div>
          <!--Facebook Login form-->
          <v-btn
            class="ma-0 mt-1"
            round
            color="indigo"
            dark
            v-on:click="loginWithFacebook"
            style="width:100%;"
          >
            <v-icon class="mr-2">fab fa-facebook</v-icon>
            <div class="hidden-xs-only">
              Facebook 로그인
            </div>
            <div class="hidden-sm-and-up">
              Login
            </div>
          </v-btn>
          <!--This site login-->
          <v-btn
            class="ma-0 mt-1"
            round
            color="indigo"
            dark
            @click="loginWithSite = true"
            style="width:100%;"
          >
            <div class="hidden-xs-only">
              Login
            </div>
            <div class="hidden-sm-and-up">
              Login
            </div>
          </v-btn>
          <v-dialog v-model="loginWithSite" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Login</span>
              </v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs8>
                    <v-text-field label="Email*" v-model="login_email" required>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs8>
                    <v-text-field
                      label="password*"
                      type="password"
                      v-model="login_password"
                      required
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn color="primary" flat @click="loginWithEmail">
                  login
                </v-btn>
                <v-btn color="primary" flat @click="loginWithSite = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--가입-->
          <v-layout row justify-center>
            <v-dialog v-model="JoinStie" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ma-0 mt-1"
                  round
                  color="indigo"
                  dark
                  v-on="on"
                  style="width:100%;"
                >
                  <div class="hidden-xs-only">
                    Join
                  </div>
                  <div class="hidden-sm-and-up">
                    Join
                  </div>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">member join</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field label="Email*" required></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          label="Password*"
                          type="password"
                          required
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          label="Confirm Password*"
                          type="password"
                          required
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <small>* 표시는 필수 입력값 입니다.</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-card-actions>
                    <v-btn color="blue darken-1" flat @click="JoinStie = false">
                      Close
                    </v-btn>
                  </v-card-actions>
                  <v-btn color="blue darken-1" flat @click="JoinStie = false">
                    Join
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-btn color="blue darken-1" flat @click="logOut">logout</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";

export default {
  name: "LoginPage",
  data() {
    return {
      loginWithSite: false,
      JoinStie: false,
      login_email: "",
      login_password: "",
      authuser: null
    };
  },
  components: {},
  methods: {
    async loginWithGoogle() {
      const result = await FirebaseService.loginWithGoogle();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
    },
    async loginWithFacebook() {
      const result = await FirebaseService.loginWithFacebook();
      this.$store.state.accessToken = result.credential.accessToken;
      this.$store.state.user = result.user;
    },
    async loginWithEmail() {
      FirebaseService.loginWithEmail(this.login_email, this.login_password);
    },
    async logOut() {
      FirebaseService.logOut();
    }
  },
  mounted() {
    console.log(this.$store.state)
  }
};
</script>
