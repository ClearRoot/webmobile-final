<template>
  <div>
    <ImgBanner>
      <div class="imgbanner-title" slot="text">Just Do it.</div>
    </ImgBanner>
    <v-container>
      <!-- About Me -->
      <v-carousel
        light
        hide-controls
        v-resize="onResize"
        :height="height"
        style="box-shadow:0px 0px 0px 0px"
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
          transition="fade"
          reverse-transition="fade"
        >
          <v-layout my-5>
            <v-flex xs12 sm8 class="text-sm-left text-xs-center" align-baseline>
              <h2 class="headline mb-3">{{ item.name }}</h2>
              <p class="mr-4">{{ item.aboutMe }}</p>
              <v-flex xs12 sm8 py-5 class="hidden-sm-and-down">
                <v-btn
                  v-for="btn in item.buttons"
                  :href="btn.link"
                  :key="btn.title"
                  class="mx-3"
                  icon
                >
                  <v-icon medium>{{ btn.icon }}</v-icon>
                </v-btn>
              </v-flex>
            </v-flex>
            <v-flex sm4 class="hidden-xs-only">
              <v-img
                class="img-circle"
                :src="getImgUrl(item.img)"
                aspect-ratio="1.5"
              />
            </v-flex>
          </v-layout>
        </v-carousel-item>
      </v-carousel>
      <!-- Portfolio -->
      <v-layout my-5>
        <v-flex xs12>
          <div class="headline my-5 text-xs-center">
            <router-link to="/portfolio" style="text-decoration: none;">
              <span class="black--text">Portfolio</span>
            </router-link>
          </div>
          <PortfolioList></PortfolioList>
        </v-flex>
      </v-layout>
      <!-- Post -->
      <v-layout my-5>
        <v-flex xs12>
          <h2 class="headline my-5 text-xs-center">Post</h2>
          <PostList :column="2"></PostList>
        </v-flex>
      </v-layout>
      <!-- Github -->
      <v-layout my-5>
        <v-flex xs12>
          <div class="headline my-5 text-xs-center">
            <router-link to="/repository" style="text-decoration: none;">
              <span class="black--text">Project</span>
            </router-link>
          </div>
          <RepositoryList></RepositoryList>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import PortfolioList from "../components/PortfolioList";
import PostList from "../components/PostList";
import RepositoryList from "../components/RepositoryList";
import ApiService from "@/services/ApiService";

export default {
  name: "HomePage",
  components: {
    ImgBanner,
    PortfolioList,
    PostList,
    RepositoryList
  },
  data() {
    return {
      height: 0,
      items: [
        {
          aboutMe:
            "안녕하세요. 축산학을 전공했지만 IT 개발을 좋아하고, 공부하는 예비 개발자입니다.주로 Python을 사용하며, Web으로는 Django, Bootstrap, Vue, Vuetify를 사용할 수 있습니다.",
          img: "cat_profile.jpg",
          name: "조호근",
          buttons: [
            {
              title: "facebook",
              icon: "fab fa-facebook",
              link: "https://www.facebook.com/"
            },
            {
              title: "instagram",
              icon: "fab fa-instagram",
              link: "https://www.instagram.com/"
            },
            {
              title: "gitlab",
              icon: "fab fa-gitlab",
              link: "https://lab.ssafy.com/ClearRoot"
            },
            {
              title: "github",
              icon: "fab fa-github",
              link: "https://github.com/ClearRoot/"
            }
          ]
        },
        {
          aboutMe: "지금 잠을 자면 꿈을 꾸지만, 지금 공부하면 꿈을 이룬다",
          img: "profile.jpg",
          name: "김선일",
          buttons: [
            {
              title: "facebook",
              icon: "fab fa-facebook",
              link: "https://www.facebook.com/"
            },
            {
              title: "instagram",
              icon: "fab fa-instagram",
              link: "https://www.instagram.com/"
            },
            {
              title: "gitlab",
              icon: "fab fa-gitlab",
              link: "https://lab.ssafy.com/kimseonili"
            }
          ]
        },
        {
          aboutMe:
            "안녕하세요.컴퓨터공학을 전공했습니다. 알고리즘과 웹 개발을 공부하고있습니다. 반갑습니다.",
          img: "kch_profile.png",
          name: "김초희",
          buttons: [
            {
              title: "facebook",
              icon: "fab fa-facebook",
              link: "https://www.facebook.com/"
            },
            {
              title: "instagram",
              icon: "fab fa-instagram",
              link: "https://www.instagram.com/"
            },
            {
              title: "gitlab",
              icon: "fab fa-gitlab",
              link: "https://lab.ssafy.com/lee1260"
            }
          ]
        },
        {
          aboutMe:
            "안녕하세요, 저는 Front-End 개발자를 목표로 하고있습니다. 아직 서투르지만 노력하고있습니다.",
          img: "jdj_profile.png",
          name: "정동준",
          buttons: [
            {
              title: "facebook",
              icon: "fab fa-facebook",
              link: "https://www.facebook.com/"
            },
            {
              title: "instagram",
              icon: "fab fa-instagram",
              link: "https://www.instagram.com/"
            },
            {
              title: "gitlab",
              icon: "fab fa-gitlab",
              link: "https://lab.ssafy.com/june3360"
            }
          ]
        }
      ],
      ddlSource: "ko",
      ddlTarget: "en"
    };
  },

  created() {
    this.$EventBus.$on("click-icon_aboutme", async () => {
      ApiService.getTranslates(
        this.ddlSource,
        this.ddlTarget,
        this.items[0].aboutMe,
        this.items[1].aboutMe,
        this.items[2].aboutMe,
        this.items[3].aboutMe
      )
        .then(res => {
          for (let i = 0; i < 4; i++) {
            this.items[i].aboutMe =
              res.data.data.translations[i].translatedText;
          }
          if (this.ddlSource == "en") {
            this.ddlSource = "ko";
            this.ddlTarget = "en";
          } else {
            this.ddlSource = "en";
            this.ddlTarget = "ko";
          }
        })
        .catch(e => {
          console.error(e);
        });
    });
  },

  mounted() {
    this.onResize();
  },

  methods: {
    getImgUrl(img) {
      return require("../assets/" + img);
    },
    onResize() {
      this.height = window.innerWidth / 3;
      if (this.height > 350) {
        this.height = 350;
      } else if (this.height < 250) {
        this.height = 250;
      }
    }
  }
};
</script>

<style>
.imgbanner-title {
  line-height: 1.2em;
  font-size: 7vw;
}
.img-circle {
  border-radius: 5%;
}
.v-carousel__controls {
  background-color: hsla(0, 0%, 100%, .0);
}
</style>
<style lang="stylus">
.fade
  &-enter-active, &-leave-active, &-leave-to
    transition: .3s ease-out
    position: relative
    top: 0
    left: 0

  &-enter, &-leave, &-leave-to
    opacity: 0
</style>
