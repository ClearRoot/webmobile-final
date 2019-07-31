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
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td class="text-xs-left " @click="props.expanded = !props.expanded">
              {{ props.item.userEmail }}
            </td>
            <td class="justify-center layout px-0">
              <v-select
                v-model="props.item.userAuth"
                :disabled="
                  props.item.userEmail == 'test@test.com' ? true : false
                "
                @change="changeEvt(props.item.id, props.item.userAuth)"
                :items="auth"
                solo
              ></v-select>
            </td>
            <td>
              <v-icon small @click="removeItem(props.item)">delete</v-icon>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat>
            <v-card-text>작성한 Post 수 : {{ props.item.posts }} </v-card-text>
            <v-card-text
              >작성한 Portfolio 수 : {{ props.item.portfolios }}
            </v-card-text>
          </v-card>
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
      auth: ["admin", "member", "visitant"],
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
        { text: "권한", value: "auth", sortable: false, width: "10%" },
        { text: "function", value: "created_at", sortable: false, width: "5%" }
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
    changeEvt(uid, auth) {
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
      this.items = await FirebaseService.getUsers();
      this.dialog = false;
      for (var i = 0; i < this.items.length; i++) {
        var temp = this.items[i].created_at;
        this.items[
          i
        ].created_at = `${temp.getFullYear()}년 ${temp.getMonth()}월 ${temp.getDate()}일`;
      }
      this.pagination = {
        page: 1,
        rowsPerPage: 5, // -1 for All",
        totalItems: this.items.length
      };
      this.loading = false;
    },
    translate() {
      changeSortequire("axios");
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
          title: "회원 탈퇴 처리",
          text: "이 회원을 탈퇴처리 하시겠습니까?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "예",
          cancelButtonText: "아니오"
        })
        .then(result => {
          if (result.value) {
            this.items.splice(index, 1);
            FirebaseService.removeItem(item.id, "users");
            this.swalWithBootstrapButtons.fire("처리되었습니다");
            this.pagination.totalItems--;
            this.pagination.page = 1;
          }
        });
    }
  }
};
</script>
