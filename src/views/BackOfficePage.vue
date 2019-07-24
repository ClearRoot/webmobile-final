<template>
  <div>
    <ImgBanner>
      <div style="line-height:1.2em;font-size:1.2em;" slot="text">
        BackOffice
      </div>
    </ImgBanner>
    <v-container>
      <!-- Portfolio -->
      <!-- here -->
      <v-btn @click="goURL('https://analytics.google.com/')"
        >Google Analytics</v-btn
      >



      <!-- Portfolio -->
      <v-layout>
        <v-flex xs12>
          <!-- PortfolioList -->
          <template>
            <div>
            <v-data-table
              v-model="selected"
              loading = true
              :headers="headers"
              :items="posts"
              :loading="loading"
              hide-actions
              :pagination.sync="pagination"
              select-all
              search
              item-key="id"
              class="elevation-1"
              expand
            >
              <template v-slot:headers="props">
                <tr>
                  <th>
                    <v-checkbox
                      :input-value="props.all"
                      :indeterminate="props.indeterminate"
                      primary
                      hide-details
                      @click.stop="toggleAll"
                    ></v-checkbox>
                  </th>
                  <th
                    v-for="header in props.headers"
                    :key="header.text"
                    :class="[
                      'column sortable',
                      pagination.descending ? 'desc' : 'asc',
                      header.value === pagination.sortBy ? 'active' : ''
                    ]"
                    @click="changeSort(header.value)"
                  >
                    <v-icon small>arrow_upward</v-icon>
                    {{ header.text }}
                  </th>
                </tr>
              </template>
              <template v-slot:items="props">
                <tr :active="props.selected" >
                  <td @click="props.selected = !props.selected">
                    <v-checkbox
                      :input-value="props.selected"
                      primary
                      hide-details

                    ></v-checkbox>
                  </td>
                  <td class="text-xs-left " @click="props.expanded = !props.expanded">{{ props.item.title }}</td>
                  <td class="text-xs-right">{{ props.item.created_at }}</td>
                  <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="removePost(props.item)"
          >
            delete
          </v-icon>
        </td>
                </tr>
              </template>
              <template v-slot:expand="props">
        <v-card flat>
          <v-card-text>{{props.item.body}}</v-card-text>
        </v-card>
      </template>
            </v-data-table>
            <div class="text-xs-center pt-2">
                <v-pagination
                  v-model="pagination.page"
                  :length="pages"
                ></v-pagination>
            </div>
           </div>
          </template>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImgBanner from "../components/ImgBanner";
import FirebaseService from "@/services/FirebaseService";

export default {
  name: "BackOfficePage",
  components: {
    ImgBanner
  },
  data() {
    return {
      loading: true,
      ddlSource: "ko",
      ddlTarget: "en",
      singleSelect: false,
        selected: [],
        search: '',
          pagination: {},
      headers: [
         {
           text: 'Title',
           align: 'left',
           sortable: false,
           value: 'title',
         },
         { text: 'Created_at', value: 'created_at' }
       ],
       posts: [],
    };
  },
  computed: {
  pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },
  mounted(){
    this.getPosts();
  },
  methods: {

    toggleAll () {
            if (this.selected.length) this.selected = []
            else this.selected = this.posts.slice()
          },
          changeSort (column) {
            if (this.pagination.sortBy === column) {
              this.pagination.descending = !this.pagination.descending
            } else {
              this.pagination.sortBy = column
              this.pagination.descending = false
            }
          },

    async getPosts(){
      this.posts = await FirebaseService.getPosts();
      for(var i = 0 ; i < this.posts.length ; i++){
        var temp = this.posts[i].created_at;
        this.posts[i].created_at = `${temp.getFullYear()}년 ${temp.getMonth()}월 ${temp.getDate()}일`;
      }
      this.pagination = {
//       descending:true,
      // page: 1,
      rowsPerPage: 5, // -1 for All",
      totalItems: this.posts.length

      }
      this.loading = false;
    },
    translate() {
      const axios = require("axios");
      var translateUrl =
        "https://www.googleapis.com/language/translate/v2?key=AIzaSyChUf-_S1c5gnxJdSZE8u5hBjTyRlBSgm8";
      translateUrl += "&source=" + this.ddlSource;
      translateUrl += "&target=" + this.ddlTarget;
      translateUrl += "&q=" + encodeURI(this.title);
      translateUrl += "&q=" + encodeURI(this.body);
      axios({
        methods: "GET",
        url: translateUrl
      }).then(res => {
          this.title = res.data.data.translations[0].translatedText;
          this.body = res.data.data.translations[1].translatedText;
          if (this.ddlSource == "en") {
            this.ddlSource = "ko";
            this.ddlTarget = "en";
          } else {
            this.ddlSource = "en";
            this.ddlTarget = "ko";
          }
        }).catch(e => {
          console.error(e)
        });
    },
    goURL(url){
      // window.open(url);
      console.log(this.posts);
    },
    removePost(item){

      const index = this.posts.indexOf(item)
      let flag = confirm('Are you sure you want to delete this item?');
       this.posts.splice(index, 1)
      alert("삭제되었다.")
      // FirebaseService.removePost(item.id);
    }
  }
};
</script>
<style>
.titleText {
  overflow:hidden;
  text-overflow : ellipsis;
  display:-webkit-box;
  /* -webkit-line-clamp:1; */
  /* -webkit-box-orient:vertical; */
  word-wrap:break-word;
}
</style>
