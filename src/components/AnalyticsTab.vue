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
        <div id="view-selector-1-container"></div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "AnalyticsTab",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      gapi.analytics.ready(function() {

        /**
         * Authorize the user immediately if the user has already granted access.
         * If no access has been created, render an authorize button inside the
         * element with the ID "embed-api-auth-container".
         */
        gapi.analytics.auth.authorize({
          container: 'embed-api-auth-container',
          clientid: '355527894492-mhj9muq00p79epl1mv9c3k7j05tbtvq0.apps.googleusercontent.com'
        });


        /**
         * Create a ViewSelector for the first view to be rendered inside of an
         * element with the id "view-selector-1-container".
         */
        var viewSelector1 = new gapi.analytics.ViewSelector({
          container: 'view-selector-1-container'
        });

        /**
         * Create a ViewSelector for the second view to be rendered inside of an
         * element with the id "view-selector-2-container".
         */

        // Render both view selectors to the page.
        viewSelector1.execute();


        /**
         * Create the first DataChart for top countries over the past 30 days.
         * It will be rendered inside an element with the id "chart-1-container".
         */
        var dataChart1 = new gapi.analytics.googleCharts.DataChart({
          query: {
            metrics: 'ga:sessions',
            dimensions: 'ga:country',
            'start-date': '30daysAgo',
            'end-date': 'yesterday',
            'max-results': 6,
            sort: '-ga:sessions'
          },
          chart: {
            container: 'chart-1-container',
            type: 'PIE',
            options: {
              width: '50%',
              pieHole: 4/9
            }
          }
        });

       // .subtract(3, 'day');

        /**
         * Create the second DataChart for top countries over the past 30 days.
         * It will be rendered inside an element with the id "chart-2-container".
         */
        var dataChart2 = new gapi.analytics.googleCharts.DataChart({
          query: {
            'dimensions': 'ga:browser',
            'metrics': 'ga:pageviews',
            'sort': '-ga:pageviews',
            'max-results': 5
          },
          chart: {
            container: 'chart-2-container',
            type: 'PIE',
            options: {
              width: '50%',
              pieHole: 4/9
            }
          }
        });


        var dataChart3 = new gapi.analytics.googleCharts.DataChart({
          query: {
            'dimensions': 'ga:date',
            'metrics': 'ga:sessions',
            'start-date': '30daysAgo',
            'end-date': 'yesterday'
          },
          chart: {
            container: 'chart-3-container',
            type: 'COLUMN',
            options: {
              width: '50%',
            }
          }
        });

        /**
         * Update the first dataChart when the first view selecter is changed.
         */
        viewSelector1.on('change', function(ids) {
          dataChart1.set({query: {ids: ids}}).execute();
          dataChart2.set({query: {ids: ids}}).execute();
          dataChart3.set({query: {ids: ids}}).execute();
          // alert(ids)
        });

        /**
         * Update the second dataChart when the second view selecter is changed.
         */

      });
    }
  }
};
</script>
