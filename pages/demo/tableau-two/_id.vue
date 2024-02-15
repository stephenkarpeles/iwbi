<template>
  <div class="flex flex-wrap">
    <div class="w-full hidden">
      <WButtonsBase @click.native="filterViz()"> Filter </WButtonsBase>
    </div>
    <div class="w-1/2">
      <WHeadingsHThree heading="Properties" />
      <div>
        Explore an analysis of your portfolio’s composition, including how
        properties are grouped, where they are located, how properties are used,
        current ownership structures or other relevant differentiators.
      </div>
      <div class="h-32 overflow-hidden">
        <div ref="tableauCount"></div>
      </div>
    </div>
    <div ref="tableauMap" class="w-1/2"></div>
    <div class="w-full">
      <div ref="tableauSpace"></div>
    </div>
    <div class="w-full">
      <iframe
        class="w-full"
        src="https://tableau.wellcertified.com/views/POCFinal/Spacetype/smitha/c42adf47-3718-4817-9810-3d653d43f092?:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n&:embed=y&Portfolio%20Id=WELLP00003"
      ></iframe>
    </div>
    <!-- <div class="w-full">
      <div ref="tableauTotals"></div>
    </div> -->
    <!-- <div class="w-full">
      <div ref="tableauMap"></div>
    </div> -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      urlMap: `https://tableau.wellcertified.com/views/POCFinal/Map?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n&:embed=y&Portfolio Id=${this.$route.params.id}`,
      urlCount: `https://tableau.wellcertified.com/views/POCFinal/headercount?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n&:embed=y&Portfolio Id=${this.$route.params.id}`,
      urlSpace: `https://tableau.wellcertified.com/views/POCFinal/Spacetype/smitha/c42adf47-3718-4817-9810-3d653d43f092?:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n&:embed=y&Portfolio Id=${this.$route.params.id}`,
      urlTotals: `https://tableau.wellcertified.com/views/POCFinal/Country?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n&:embed=y&Portfolio Id=${this.$route.params.id}`,
      // urlOne:
      //   'https://tableau.wellcertified.com/views/IndividualProjectsDashboard/Sheet3?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n',
      // urlTwo:
      //   'https://tableau.wellcertified.com/views/IndividualProjectsDashboard/Sheet4?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n',
      // urlThree:
      //   'https://tableau.wellcertified.com/views/IndividualProjectsDashboard/Sheet2?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n',
      // url: 'https://tableau.wellcertified.com/views/IndividualProjectsDashboard/Dashboard1?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n',
      // urlFour:
      //   'https://tableau.wellcertified.com/views/IndividualProjectsDashboard/Sheet1?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n',

      options: {
        hideTabs: true,
      },

      vizFour: null,
    }
  }, // sidebar layout
  // get portfolio by id
  head() {
    return {
      title: `Portfolio Dashboard`,
      script: [
        {
          src: 'https://public.tableau.com/javascripts/api/tableau-2.min.js',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      surveyStarted: (state) => state.portfolio.portfolio.survey_started,
      surveyCompleted: (state) => state.portfolio.portfolio.survey_completed,
    }),
  },
  async mounted() {
    this.initViz()

    this.$store.commit('settings/setSidebarTab', 'Locations')

    await this.$store
      .dispatch('portfolio/getPortfolio', {
        id: this.$route.params.id,
      })
      .then((res) => {
        if (
          (res &&
            res.response &&
            res.response.status &&
            res.response.status === 404) ||
          (res &&
            res.response &&
            res.response.status &&
            res.response.status === 403)
        ) {
          this.$nuxt.error({
            statusCode: res.response.status,
            message: res.response.data.msg,
          })
        }
      })
  },
  methods: {
    filterViz() {
      let worksheet

      this.vizFour
        .getWorkbook()
        .activateSheetAsync('Sheet 1')
        .then(function (sheet) {
          worksheet = sheet
        })
      worksheet.applyFilterAsync(
        'Industry',
        'Healthcare',
        window.tableau.FilterUpdateType.REPLACE
      )
    },
    initViz() {
      /* eslint-disable no-unused-vars */
      /* eslint-disable no-undef */
      // const viz = new tableau.Viz(
      //   this.$refs.tableauOne,
      //   this.urlOne,
      //   this.options
      // )
      // const vizTwo = new tableau.Viz(
      //   this.$refs.tableauTwo,
      //   this.urlTwo,
      //   this.options
      // )
      // const vizTotals = new tableau.Viz(
      //   this.$refs.tableauTotals,
      //   this.urlTotals,
      //   this.options
      // )

      this.vizCount = new tableau.Viz(
        this.$refs.tableauCount,
        this.urlCount,
        this.options
      )
      this.vizMap = new tableau.Viz(
        this.$refs.tableauMap,
        this.urlMap,
        this.options
      )
      this.vizSpace = new tableau.Viz(
        this.$refs.tableauSpace,
        this.urlSpace,
        this.options
      )
    },
  },
}
</script>
