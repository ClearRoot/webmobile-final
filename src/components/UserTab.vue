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
        item-key="id"
        class="elevation-1"
        expand
      >
        <template v-slot:no-data>
          <v-alert :value="true" color="blue">
            <v-progress-circular
              :size="40"
              color="primary"
              indeterminate
            ></v-progress-circular>
            데이터를 받아오는 중입니다.
          </v-alert>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            검색 결과가 없습니다.
          </v-alert>
        </template>
        <template v-slot:items="props">
          <tr :active="props.selected">
            <td class="text-xs-left " @click="props.expanded = !props.expanded">
              {{ props.item.userEmail }}
            </td>
            <td class="justify-center layout px-0">
              <v-select
                v-model="props.item.userAuth"
                :disabled="
                  props.item.userAuth == 'admin' ? true : false
                "
                @change="changeEvt(props.item.id, props.item.userAuth,props.item)"
                :items="props.item.userAuth == 'admin' ? admin : auth"
                solo
              ></v-select>
            </td>
            <td><!-- spacing --></td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat>
            <v-card-text>작성한 Post 수 : {{ props.item.posts }} </v-card-text>
            <v-card-text
              >작성한 Portfolio 수 : {{ props.item.portfolios }}
            </v-card-text>
            <v-divider></v-divider>
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
      auth: ["member", "visitant"],
      admin: ["admin"],
      ddlSource: "ko",
      ddlTarget: "en",
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
        { text: "", sortable: false }
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
    changeEvt(uid, auth, origin) {
      this.swalWithBootstrapButtons
        .fire({
          title: "회원 권한 변경",
          text: "해당 회원의 권한을 변경하시겠습니까?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "예",
          cancelButtonText: "아니오"
        })
        .then(result => {
          if (result.value) {
            FirebaseService.updateUserAuth(uid, auth, origin.userEmail);
            this.swalWithBootstrapButtons.fire("권한이 변경되었습니다");
          }else {
            const index = this.items.indexOf(origin);
            if (auth == "member") this.items[index].userAuth = "visitant";
            else this.items[index].userAuth = "member";
          }
        });

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
      console.log(this.items)
    }
  }
};
</script>
