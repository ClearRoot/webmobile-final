<template>
  <v-container pa-5 fill-height fluid grid-list-xl>
    <v-layout justify-center wrap pa-3>
      <v-flex xs12 md8 mt-3>
        <v-card class="v-card-profile">
          <v-flex pt-5>
            <v-avatar class="mx-auto d-block" size="130">
              <v-img v-if="imageFile" :src="imageFile"></v-img>
              <v-gravatar v-if="!imageFile" :email="getUser.email" :size="80" />
            </v-avatar>
          </v-flex>
          <v-card-text class="text-xs-center">
            <ImgList v-if="edit" :name="name"></ImgList>
            <v-form>
              <v-container py-3>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    <v-list-tile-content>
                      <v-list-tile-title class="title">
                        E-Mail
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-list-tile-content>
                      <v-list-tile-title class="body-1">
                        {{ getUser.email }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-list-tile-content>
                      <v-list-tile-title class="title">
                        NickName
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-list-tile-content>
                      <v-list-tile-title v-if="!edit" class="body-1">
                        {{ getUser.displayName }}
                      </v-list-tile-title>
                      <v-text-field v-if="edit" v-model="editNickName" />
                    </v-list-tile-content>
                  </v-flex>
                  <v-flex xs12 text-xs-right>
                    <v-btn
                      v-if="edit"
                      class="mx-0 font-weight-light"
                      color="success"
                      @click="updateUser"
                    >
                      Update Profile
                    </v-btn>
                    <v-btn
                      v-if="!edit"
                      @click="editUser"
                      class="ma-2"
                      tile
                      color="success"
                    >
                      <v-icon left>edit</v-icon>Edit
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import ImgList from "@/components/ImgList";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      socials: [
        {
          icon: "fab fa-facebook",
          color: "indigo"
        },
        {
          icon: "fab fa-linkedin",
          color: "cyan darken-1"
        },
        {
          icon: "fab fa-instagram",
          color: "red lighten-3"
        }
      ],
      email: "",
      nickName: "",
      aboutMe: "hello",
      imageFile: "",
      name: "Writer",
      edit: false,
      editNickName: ""
    };
  },
  components: {
    ImgList
  },
  methods: {
    async updateUser() {
      await FirebaseService.updateUser(this.editNickName, this.imageFile);
      this.$store.commit("changeUser", [this.editNickName, this.imageFile]);
      Swal.fire({
        position: "mid",
        type: "success",
        title: "수정되었습니다.",
        showConfirmButton: false,
        timer: 1500
      });
      this.$router.push("/");
    },
    editUser() {
      this.editNickName = this.$store.state.user.displayName;
      this.edit = true;
    }
  },
  computed: {
    getUser() {
      if (this.$store.state.user) {
        return this.$store.state.user;
      } else {
        return "Guest";
      }
    }
  },
  mounted() {
    this.imageFile = this.$store.state.user.photoURL;
  },
  created() {
    this.$EventBus.$on("selectImgWriter", res => {
      this.imageFile = res;
    });
  }
};
</script>
