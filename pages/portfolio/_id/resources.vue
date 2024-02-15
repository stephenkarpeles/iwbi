<template>
  <div>
    <PortfolioResourcesScreen />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar', // sidebar layout
  data() {
    return {
      mList: [
        {
          thumbnail:
            'https://img2.storyblok.com/333x166/smart/f/52232/1600x900/0f7944b976/wellportfolio-copy.png',
          heading: 'WELL Portfolio Guidebook',
          description:
            'The WELL Portfolio Guidebook is a step-by-step guide to WELL Portfolio, a program which enables organizations to enhance building performance and improve human well-being at scale.',
          link: 'https://resources.wellcertified.com/tools/well-portfolio-guidebook',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/2ab2d7531b/performanceverification-resource-thumbnail.png',
          heading: 'Performance Verification Guidebook',
          description:
            'The WELL Performance Verification Guidebook, a step-by-step guide to the performance verification process.',
          link: 'https://resources.wellcertified.com/tools/performance-verification-guidebook/',
          min: 'enrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/ced30d7d3f/wellcorecertification-resource-thumbnail2.png',
          heading: 'Core Applicability Matrix',
          description:
            'Identifies the applicability of features for WELL Core projects and for multifamily residential projects pursuing WELL Certification.',
          link: 'https://v2.wellcertified.com/v/en/appendix/core-mfr',
          min: 'enrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/db95e35f29/crosswalks-socialpost-v2-1.png',
          heading: 'Green Rating Crosswalks',
          description:
            'The blueprint for applying WELL alongside other global standards.',
          link: 'https://resources.wellcertified.com/articles/announcing-well-v2-crosswalks-the-blueprint-for-applying-well-alongside-other-global-standards/',
          min: 'enrolled',
        },
      ],
      pList: [
        {
          thumbnail:
            'https://img2.storyblok.com/333x166/smart/f/52232/1600x900/f9269a7334/wellportfolio-copy.png',
          heading: 'WELL Portfolio Overview',
          description:
            'Demonstrate your leadership by applying the world’s leading health-focused building standard – WELL – across multiple spaces in a streamlined and cost-effective approach.',
          link: 'https://resources.wellcertified.com/tools/well-portfolio-overview/',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/666x332/smart/f/52232/1000x500/72d8c80322/resource-presentation.png',
          heading: 'WELL Portfolio Presentation',
          description: 'Learn more about WELL Portfolio™',
          link: 'http://resources.wellcertified.com/tools/well-portfolio-presentation',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://a.storyblok.com/f/52232/1600x900/92fae9d0ee/divider.png',
          heading: 'Advancing human health through the WELL Portfolio program',
          description:
            'Leading global companies demonstrate commitment to health through a portfolio-wide approach.',
          link: 'https://resources.wellcertified.com/articles/advancing-human-health-through-the-well-portfolio-program/',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/333x166/smart/f/52232/1276x638/542a63dbbd/screen-shot-2019-04-24-at-10-19-12-am.png',
          heading: 'What is WELL? Telling the WELL Story',
          description:
            'Learn about what makes WELL the premier standard for buildings and communities around the globe.',
          link: 'https://resources.wellcertified.com/tools/telling-the-well-story-or-what-is-well-/',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/ced30d7d3f/wellcorecertification-resource-thumbnail2.png',
          heading: 'WELL for Core Developers',
          description:
            'Provides information on the implementation and benefits of WELL Certification for Core projects.',
          link: 'https://resources.wellcertified.com/tools/well-core-certification-well-v2/',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/1400x700/smart/f/52232/2420x1870/5d71558915/gggch1.png',
          heading: 'Advancing the UN SDGs through WELL',
          description:
            'IWBI joins hands with global, cross-sector partners committed to similar goals.',
          link: 'https://www.wellcertified.com/sdgs',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/666x332/smart/f/52232/1000x500/72d8c80322/resource-presentation.png',
          heading: 'WELL Portfolio Presentation',
          description: 'Learn more about WELL Portfolio™',
          link: 'http://resources.wellcertified.com/tools/well-portfolio-presentation',
          min: 'preenrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/972663afa4/resource-presentation.png',
          heading: 'WELL Presentation',
          description: 'Learn more about WELL.',
          link: 'https://resources.wellcertified.com/tools/well-presentation/',
          min: 'preenrolled',
        },
      ],
    }
  },
  head() {
    return {
      title: `Portfolio Resources`,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
    subscriptionStatus() {
      return this.$store.getters['portfolio/subscriptionStatus'] || null
    },
    marketingList() {
      return this.mList.filter((item) => this.isEnabled(item.min))
    },
    projectList() {
      return this.pList.filter((item) => this.isEnabled(item.min))
    },
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Resources')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
  },
  methods: {
    isEnabled(minStatus) {
      let enabled = true
      if (minStatus) {
        if (
          this.subscriptionStatus === 'preenrolled' &&
          minStatus !== this.subscriptionStatus
        ) {
          enabled = false
        } else if (
          this.subscriptionStatus === 'enrolled' &&
          minStatus === 'subscribed'
        ) {
          enabled = false
        }
      }
      return enabled
    },
  },
}
</script>
