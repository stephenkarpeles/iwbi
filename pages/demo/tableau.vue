<template>
  <div class="justify-center flex flex-wrap space-y-3">
    <div ref="tableau"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      url: 'https://tableau.wellcertified.com/views/IndividualProjectsDashboard/Dashboard1?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=n',
      options: {
        hideTabs: true,
      },
    }
  },
  head: {
    script: [
      {
        src: 'https://public.tableau.com/javascripts/api/tableau-2.min.js',
      },
    ],
  },
  mounted() {
    this.initViz()
  },
  methods: {
    initViz() {
      /* eslint-disable no-unused-vars */
      /* eslint-disable-next-line no-undef */
      const viz = new tableau.Viz(this.$refs.tableau, this.url, this.options)
    },
  },
}
</script>
