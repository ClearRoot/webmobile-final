<template>
  <div>
    <v-card>
      <v-card-title>
        Portfolio Tab
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :search="search"
        v-model="selected"
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        select-all
        item-key="id"
      >
        <template v-slot:no-data>
          <v-alert :value="true" color="blue" icon="warning">
            로딩중 입니다.
          </v-alert>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            검색 결과가 없습니다.
          </v-alert>
        </template>
        <template v-slot:items="props">
          <tr :active="props.selected">
            <td @click="props.selected = !props.selected">
              <v-checkbox
                :input-value="props.selected"
                hide-details
              ></v-checkbox>
            </td>
            <td class="text-xs-left " @click="props.expanded = !props.expanded">
              {{ props.item.title }}
            </td>
            <td class="text-xs-left ">
              {{ props.item.ownerEmail }}
            </td>
            <td class="text-xs-right">{{ props.item.created_at }}</td>
            <td class="justify-center layout px-0">
              <v-icon class="mr-2" @click="open(props.item)" small>edit</v-icon>
              <v-icon small @click="removeItem(props.item)"> delete </v-icon>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat>
            <v-img :src="props.item.img" width="50%"></v-img>
          </v-card>
          <v-card flat>
            <v-card-text>{{ props.item.body }} </v-card-text>
          </v-card>
        </template>

        <template v-slot:footer>
          <td :colspan="headers.length">
            <strong>전체 게시글 갯수 : {{ items.length }}</strong>
          </td>
        </template>
      </v-data-table>
      <v-btn class="text-xs-right" @click="deleteSelItem()">선택삭제</v-btn>
      <div class="text-xs-center">
        <v-pagination
          v-model="pagination.page"
          :length="pages"
          :total-visible="7"
        ></v-pagination>
      </div>
    </v-card>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar flat dark color="primary">
          <v-btn icon dark>
            <v-icon @click="close(selItem)">close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="editItem(selItem)">
              수정하기
            </v-btn>
          </v-toolbar-items>
          <v-menu bottom right offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark icon v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>
          </v-menu>
        </v-toolbar>
        <v-card-text>
          <v-flex xs8>
            <v-text-field
              label="제목"
              outlined
              v-model="selItem.title"
              required
            ></v-text-field>
          </v-flex>
          <v-divider></v-divider>
          <v-textarea
            solo
            rows="20"
            row-height="20"
            label="내용"
            v-model="selItem.body"
            required
          ></v-textarea>
          <v-divider></v-divider>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import Swal from "sweetalert2";

export default {
  name: "ItemTab",
  props: {
    tab: null
  },
  data() {
    return {
      selItem: { title: null, body: null, origin: null },
      dialog: false,
      ddlSource: "ko",
      ddlTarget: "en",
      loading: true,
      selected: [],
      search: "",
      pagination: {},
      headers: [
        {
          text: "Title",
          align: "left",
          sortable: true,
          value: "title",
          width: "50%"
        },
        {
          text: "Author",
          align: "left",
          sortable: true,
          value: "author",
          width: "20%"
        },
        {
          text: "Created_at",
          value: "created_at",
          sortable: true,
          width: "15%"
        },
        { text: "function", value: "created_at", sortable: false, width: "10%" }
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
        this.selItem.url != this.selItem.url
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
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    async getItems() {
      this.loading = true;
      this.items = [];
      this.search = "";
      let temp;
      temp = await FirebaseService.getPortfolios();
      this.dialog = false;
      for (var i = 0; i < temp.length; i++) {
        var d = temp[i].created_at;
        temp[
          i
        ].created_at = `${d.getFullYear()}년 ${d.getMonth()}월 ${d.getDate()}일`;
      }
      this.pagination = {
        page: 1,
        rowsPerPage: 5, // -1 for All",
        totalItems: temp.length
      };
      this.items = temp;
      this.loading = false;
    },
    deleteSelItem() {
      this.swalWithBootstrapButtons
        .fire({
          title: "삭제 확인",
          text: "선택한 항목들을 정말로 삭제하시겠습니까?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "예",
          cancelButtonText: "아니오"
        })
        .then(result => {
          if (result.value) {
            for (let i = 0; i < this.selected.length; i++) {
              let index = this.items.indexOf(this.selected[i]);
              this.items.splice(index, 1);
              FirebaseService.removeItem(this.selected[i].id, "portfolios");
              this.pagination.totalItems--;
            }
            this.swalWithBootstrapButtons.fire("삭제되었습니다");
            this.pagination.page = 1;
            this.selected = [];
          }
        });
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
      })
        .then(res => {
          this.title = res.data.data.translations[0].translatedText;
          this.body = res.data.data.translations[1].translatedText;
          if (this.ddlSource == "en") {
            this.ddlSource = "ko";
            this.ddlTarget = "en";
          } else {
            this.ddlSource = "en";
            this.ddlTarget = "ko";
          }
        })
        .catch(e => {
          console.error(e)
        });
    },
    removeItem(item) {
      const index = this.items.indexOf(item);
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
            FirebaseService.removeItem(item.id, "portfolios");
            this.swalWithBootstrapButtons.fire("삭제되었습니다");
            this.pagination.totalItems--;
            this.pagination.page = 1;
          }
        });
    },
    editItem(item) {
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
              FirebaseService.updateItem(this.items[index], "portfolios");
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
