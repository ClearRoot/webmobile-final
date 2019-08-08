<template>
  <div>
    <v-card>
      <v-card-title>
        Analytics Tab
        <v-spacer></v-spacer>
      </v-card-title>
      <div>
        <div id="embed-api-auth-container"></div>
        <div id="chart-1-container"></div>
        <div id="chart-2-container"></div>
        <div id="chart-3-container"></div>
        <div id="chart-4-container"></div>
        <div id="view-selector-1-container"></div>
      </div>
    </v-card>
  </div>
</template>

<script>
import Api from "@/services/Api";
export default {
  name: "AnalyticsTab",
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let token = await Api.refresh();
      gapi.analytics.auth.authorize({
        serverAuth: {
          access_token: token
        }
      });
      gapi.analytics.ready(function() {
        gapi.analytics.auth.authorize({
          container: "embed-api-auth-container",
          clientid:
            "355527894492-mhj9muq00p79epl1mv9c3k7j05tbtvq0.apps.googleusercontent.com"
        });

        var viewSelector1 = new gapi.analytics.ViewSelector({
          container: "view-selector-1-container"
        });

        viewSelector1.execute();

        var dataChart1 = new gapi.analytics.googleCharts.DataChart({
          query: {
            metrics: "ga:sessions",
            dimensions: "ga:country",
            "start-date": "30daysAgo",
            "end-date": "yesterday",
            "max-results": 6,
            sort: "-ga:sessions"
          },
          chart: {
            container: "chart-1-container",
            type: "PIE",
            options: {
              width: "50%",
              pieHole: 4/9
            }
          }
        });
"ga:sessions"
       // .subtract(3, "day");

        /**
         * Create the second DataChart for top countries over the past 30 days.
         * It will be rendered inside an element with the id "chart-2-container".
         */
        var dataChart2 = new gapi.analytics.googleCharts.DataChart({
          query: {
            "dimensions": "ga:browser",
            "metrics": "ga:pageviews",
            "sort": "-ga:pageviews",
            "max-results": 5
          },
          chart: {
            container: "chart-2-container",
            type: "PIE",
            options: {
              width: "50%",
              pieHole: 4/9
            }
          }
        });


        var dataChart3 = new gapi.analytics.googleCharts.DataChart({
          query: {
            "dimensions": "ga:date",
            "metrics": "ga:sessions",
            "start-date": "30daysAgo",
            "end-date": "yesterday"
          },
          chart: {
            container: "chart-3-container",
            type: "COLUMN",
            options: {
              width: "50%",
            }
          }
        });
        var dataChart4 = new gapi.analytics.googleCharts.DataChart({
    query : {"start-date": "90daysAgo",
      "end-date": "today",
      "metrics": "ga:pageviews,ga:uniquePageviews,ga:timeOnPage,ga:bounces,ga:entrances,ga:exits",
      "sort": "-ga:pageviews",
      "dimensions": "ga:pagePath",
      "max-results": 10},
    chart: {
      "container": "chart-4-container",
      "type": "PIE",
      "options": {
        "width": "100%",
        "pieHole": 0,
      }
    }
  });
        /**
         * Update the first dataChart when the first view selecter is changed.
         */
        viewSelector1.on("change",function(ids) {
          dataChart1.set({query: {ids: ids}}).execute();
          dataChart2.set({query: {ids: ids}}).execute();
          dataChart3.set({query: {ids: ids}}).execute();
          dataChart4.set({query: {ids: ids}}).execute();

        });

        /**
         * Update the second dataChart when the second view selecter is changed.
         */

      });
    }
  }
};
</script>
