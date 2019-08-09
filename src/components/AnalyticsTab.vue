<template>
  <div>
    <v-card>
      <v-card-title> {{ date }}<v-spacer></v-spacer> </v-card-title>
      <div>
        <v-layout rows align-center justify-center>
          <v-flex>
            <div id="embed-api-auth-container"></div>
            <v-card xs6>
              <v-card-title class="headline"><div>접속 국가</div></v-card-title>
              <v-card-text><div id="chart-1-container"></div></v-card-text>
            </v-card>
            <v-card xs6>
              <v-card-title class="headline"
                ><div>접속 브라우저</div></v-card-title
              >
              <v-card-text><div id="chart-2-container"></div></v-card-text>
            </v-card>
          </v-flex>
          <v-flex>
            <v-card xs6>
              <v-card-title class="headline"
                ><div>최근 30일 세션</div></v-card-title
              >
              <v-card-text><div id="chart-3-container"></div></v-card-text>
            </v-card>
            <v-card xs6>
              <v-card-title class="headline"><div>접속 URL</div></v-card-title>
              <v-card-text><div id="chart-4-container"></div></v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </v-card>
  </div>
</template>
<script>
import ApiService from "@/services/ApiService";

export default {
  name: "AnalyticsTab",
  data() {
    return {
      date: null
    };
  },
  mounted() {
    this.date = new Date();
    this.init();
  },
  methods: {
    async init() {
      let token = await ApiService.getRefreshToken();
      gapi.analytics.auth.authorize({
        serverAuth: { ids: "ga:199222657", access_token: token }
      });
      gapi.analytics.ready(function() {
        gapi.analytics.auth.authorize({
          container: "embed-api-auth-container",
          clientid:
            "355527894492-mhj9muq00p79epl1mv9c3k7j05tbtvq0.apps.googleusercontent.com"
        });

        var dataChart1 = new gapi.analytics.googleCharts.DataChart({
          query: {
            metrics: "ga:sessions",
            dimensions: "ga:country",
            "start-date": "30daysAgo",
            "end-date": "yesterday",
            "max-results": 10,
            sort: "-ga:sessions"
          },
          chart: {
            container: "chart-1-container",
            type: "PIE",
            options: {
              width: "50%"
            }
          }
        });
        var dataChart2 = new gapi.analytics.googleCharts.DataChart({
          query: {
            dimensions: "ga:browser",
            metrics: "ga:pageviews",
            sort: "-ga:pageviews",
            "max-results": 5
          },
          chart: {
            container: "chart-2-container",
            type: "PIE",
            options: {
              width: "50%"
            }
          }
        });


        var dataChart3 = new gapi.analytics.googleCharts.DataChart({
          query: {
            dimensions: "ga:date",
            metrics: "ga:sessions",
            "start-date": "30daysAgo",
            "end-date": "yesterday"
          },
          chart: {
            container: "chart-3-container",
            type: "COLUMN",
            options: {
              width: "50%"
            }
          }
        });
        var dataChart4 = new gapi.analytics.googleCharts.DataChart({
          query: {
            "start-date": "90daysAgo",
            "end-date": "today",
            metrics:
              "ga:pageviews,ga:uniquePageviews,ga:timeOnPage,ga:bounces,ga:entrances,ga:exits",
            sort: "-ga:pageviews",
            dimensions: "ga:pagePath",
            "max-results": 10
          },
          chart: {
            container: "chart-4-container",
            type: "PIE",
            options: {
              width: "100%"
            }
          }
        });
        let id = "ga:199222657";
        dataChart1.set({ query: { ids: id } }).execute();
        dataChart2.set({ query: { ids: id } }).execute();
        dataChart3.set({ query: { ids: id } }).execute();
        dataChart4.set({ query: { ids: id } }).execute();
      });
    }
  }
};
</script>
