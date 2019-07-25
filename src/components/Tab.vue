<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
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
  @click="removeItem(props.item)"
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
  <div class="text-xs-center">
      <v-pagination
        v-model="pagination.page"
        :length="pages"
         :total-visible="7"
         style="vertical-align:none !important"
      ></v-pagination>
  </div>
 </div>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import Swal from "sweetalert2";

export default {
  name: "ItemTab",
  props:{
    tab:""
  },
  data() {
    return {

      ddlSource: "ko",
      ddlTarget: "en",
      singleSelect: false,
      loading: true,
        selected: [],
        search: '',
          pagination: {},
      headers: [
         {
           text: 'Title',
           align: 'left',
           sortable: true,
           value: 'title',
         },
         { text: 'Created_at', value: 'created_at', sortable: true},
        { text: 'function', value: 'created_at' , sortable: false}
       ],
       items: [],
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
    this.getItems();
  },
  watch: {
    tab : function(newVal, oldVal){
      console.log("new : " + newVal + ", old : " + oldVal)
      if(newVal != oldVal){
        this.getItems();
      }
    }
  },
  methods: {

    toggleAll () {
            if (this.selected.length) this.selected = []
            else this.selected = this.items.slice()
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
      this.loading = true
      if(this.tab==="post"){
        this.items = await FirebaseService.getPosts();
      } else if (this.tab === "portfolio") {
        this.items = await FirebaseService.getPortfolios();
      } else if (this.tab === "user"){
        //not yet
        return;
      }
      for(var i = 0 ; i < this.items.length ; i++){
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
      // let flag =
      const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
    })

    swalWithBootstrapButtons.fire({
      title: '삭제 확인',
      text: "정말로 삭제하시겠습니까?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오',
    }).then((result) => {
      if (result.value) {
        this.items.splice(index, 1)
       // FirebaseService.removeItem(item.id);
        swalWithBootstrapButtons.fire(
          '삭제되었습니다'
        )
      }
    })

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
