<template>
  <div>
    <v-card>
    <v-card-title>
   User Tab
   <v-spacer></v-spacer>
   <v-text-field
     v-model="search"
     append-icon="search"
     label="Search"
     single-line
     hide-details
   ></v-text-field>
 </v-card-title>
    <v-data-table
    :search="search"
      v-model="selected"
      :headers="headers"
      :items="items"
      :loading="loading"
      hide-actions
      :pagination.sync="pagination"
      select-all
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
        <td class="text-xs-left " @click="props.expanded = !props.expanded"><div class="titleText">
          {{ props.item.userEmail }}
        </div></td>
        <!-- <td class="text-xs-right">{{ props.item.updated_at }}</td> -->
        <td class="justify-center layout px-0">
          <v-flex xs12 sm6 d-flex>
                  <v-select
                      v-model="props.item.userAuth"
                      :disabled="props.item.userEmail == 'test@test.com' ? true : false"
                      @change="changeEvt(props.item.id, props.item.userAuth)"
                    :items="auth"
                    solo
                  ></v-select>
                </v-flex>






</td>
<td>
  <v-icon
small
@click="removeItem(props.item)"
>
delete
</v-icon>
</td>
      </tr>
    </template>
    <template>
</template>
  </v-data-table>
  <div class="text-xs-center">
      <v-pagination
        v-model="pagination.page"
        :length="pages"
         :total-visible="7"
      ></v-pagination>
  </div>
</v-card>




 </div>




</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import Swal from "sweetalert2";

export default {
  name: "UserTab",
  props: {
    tab: null
  },
  data() {
    return {
      auth:["admin", "member", "visitant"],
      selItem: { title: null, body: null, origin: null },
      dialog: false,
      ddlSource: "ko",
      ddlTarget: "en",
      // singleSelect: false,
      loading: true,
      selected: [],
      search: "",
      pagination: {},
      headers: [
        {
          text: "ID",
          align: "left",
          sortable: true,
          value: "title",
          width: "65%"
        },
        { text: "권한", value: "created_at", sortable: false, width: "10%" },
        { text: "function", value: "created_at", sortable: false,width: "10%" }
      ],
      items: [],
      swalWithBootstrapButtons: null
    };
  },
  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },
  mounted() {
    this.getItems();
    this.init();
  },
  watch: {
    tab: function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.getItems();
      }
    }
  },
  methods: {
    changeEvt(uid, auth){
      FirebaseService.updateUserAuth(uid, auth);
    },
    init() {
      this.swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: true
      });
    },
    open(item) {
      this.selItem.title = item.title;
      this.selItem.body = item.body;
      this.selItem.origin = item;
      this.dialog = true;
    },
    close(item) {
      if (
        this.selItem.title != item.origin.title ||
        this.selItem.body != item.origin.body ||
        (this.tab == "portfolio" && this.selItem.url != this.selItem.url)
      ) {
        this.swalWithBootstrapButtons
          .fire({
            title: "수정 취소",
            text: "수정사항을 취소하고 종료하시겠습니까?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
          })
          .then(result => {
            if (result.value) {
              this.dialog = false;
            }
          });
      } else {
        this.dialog = false;
      }
    },

    toggleAll () {
      if (this.selected.length) this.selected = [];
      else this.selected = this.items.slice();
    },
          changeSort (column) {
            if (this.pagination.sortBy === column) {
              this.pagination.descending = !this.pagination.descending
            } else {
              this.pagination.sortBy = column
              this.pagination.descending = false
            }
          },

    async getItems(){
      this.loading = true;
      this.search = "";
      if (this.tab === "post") {
        this.items = await FirebaseService.getPosts();
      } else if (this.tab === "portfolio") {
        this.items = await FirebaseService.getPortfolios();
      } else if (this.tab === "user"){
        this.items = await FirebaseService.getUsers();
      }
      this.dialog = false;
      console.log(this.items)
      for (var i = 0; i < this.items.length; i++) {
        var temp = this.items[i].created_at;
        this.items[i].created_at = `${temp.getFullYear()}년 ${temp.getMonth()}월 ${temp.getDate()}일`;
      }
      this.pagination = {
//       descending:true,
      page: 1,
      rowsPerPage: 5, // -1 for All",
      totalItems: this.items.length

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
    removeItem(item){

      const index = this.items.indexOf(item)


      this.swalWithBootstrapButtons
        .fire({
          title: "삭제 확인",
          text: "정말로 삭제하시겠습니까?",
          type: "warning",
      showCancelButton: true,
          confirmButtonText: "예",
          cancelButtonText: "아니오"
        })
        .then(result => {
          if (result.value) {
            this.items.splice(index, 1);
            FirebaseService.removeItem(item.id, this.tab + "s");
            this.swalWithBootstrapButtons.fire("삭제되었습니다");
            this.pagination.totalItems--;
            this.pagination.page = 1;
      }
    })

  },

  editItem(item){
      const index = this.items.indexOf(item.origin);
      if (
        this.selItem.title != item.origin.title ||
        this.selItem.body != item.origin.body
      ) {
        this.swalWithBootstrapButtons
          .fire({
            title: "수정 확인",
            text: "수정하시겠습니까?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
          })
          .then(result => {
            if (result.value) {
              this.items[index].title = this.selItem.title;
              this.items[index].body = this.selItem.body;
              FirebaseService.updateItem(this.items[index], this.tab + "s");
              this.swalWithBootstrapButtons.fire("수정되었습니다");
              this.dialog = false;
            }
          });
      } else {
        this.dialog = false;
      }
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
