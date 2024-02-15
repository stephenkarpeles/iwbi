<template>
  <div class="w-full mt-5 py-5 px-10">
    <div class="w-full lg:w-1/3">
      <WHeadingsHTwo heading="Resources" class="-mt-10 text-3xl" />
    </div>
    <div class="block w-full h-3.5 border-b text-center mt-6">
      <span
        class="text-2xl font-medium py-0 px-2.5 text-center relative inline-block m-0 bg-white"
        style="color: #656565"
        >Technical Tools</span
      >
    </div>

    <div
      class="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-6 pt-8"
    >
      <WLinksBase
        v-for="(mlist, index) in marketingList"
        :key="'resource-' + index"
        :link="mlist.link"
        target="_blank"
      >
        <WCardsBase
          :heading="mlist.heading"
          :description="mlist.description"
          :thumbnail="mlist.thumbnail"
        >
        </WCardsBase>
      </WLinksBase>
      <WLinksBase
        :link="
          portfolio && portfolio.type === 'v2'
            ? 'https://cdn.wellcertified.com/resources/v2-sample-documentation.zip'
            : 'https://cdn.wellcertified.com/resources/v2-pilot-sample-documentation.zip'
        "
        target="_blank"
      >
        <WCardsBase
          heading="Sample Documentation"
          thumbnail="projects/v2/promotions/support-card.png"
          description="Click to download a zip file of sample documentation to inform your project submittals."
        >
        </WCardsBase>
      </WLinksBase>

      <WCardsBase
        v-if="
          portfolio &&
          portfolio.type === 'v2' &&
          currentUser.role.includes('well-admin')
        "
        description="Visualize and track progress, collaborate on improvements and share your impact with others"
        heading="Sustainable Development Goals Impact Report"
        thumbnail="projects/v2/promotions/goals.png"
        @click.native="!loading ? downloadReport() : null"
      >
        <template v-if="loading" name="footer">
          <div class="mx-auto text-center">
            <WLoadingSpinner type="button" class="mx-auto mt-5" />
            <div class="mt-3 text-primary-600">Downloading...</div>
          </div>
        </template>
      </WCardsBase>
      <!-- Renamed GRI tool instead or ESG resources per Ramitha -->
      <WLinksBase
        v-if="portfolio && portfolio.type === 'v2'"
        :link="$config.assetsURL + 'portfolio/resources/WELL-GRI.xlsx'"
        target="_blank"
      >
        <WCardsBase
          heading="GRI tool"
          thumbnail="projects/v2/promotions/support-card.png"
          description="Contains the WELL-GRI Alignment tool"
        >
        </WCardsBase>
      </WLinksBase>
    </div>
    <div class="block w-full h-3.5 border-b text-center mt-10">
      <span
        class="text-2xl font-medium py-0 px-2.5 text-center relative inline-block m-0 bg-white"
        style="color: #656565"
        >Engagement Materials</span
      >
    </div>
    <div
      class="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-x-6 gap-y-6 pt-8"
    >
      <WLinksBase
        v-for="(plist, index) in projectList"
        :key="'resource-' + index"
        :link="plist.link"
        target="_blank"
      >
        <WCardsBase
          :heading="plist.heading"
          :description="plist.description"
          :thumbnail="plist.thumbnail"
        >
        </WCardsBase>
      </WLinksBase>
      <WLinksBase
        link="https://well.support/download-the-welcome-to-well-toolkit~5b51705f-94ec-451a-970d-3b1f8617cce3"
        target="_blank"
      >
        <WCardsBase
          heading="Welcome to WELL Toolkit"
          thumbnail="projects/v2/promotions/toolkit.png"
          description="The comprehensive “Welcome to WELL” toolkit is designed to help you extract the greatest benefit from your space as well as publicize your achievement."
        >
        </WCardsBase>
      </WLinksBase>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      loading: false,
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
        {
          thumbnail: 'projects/v2/promotions/support-card.png',
          heading: 'Documentation Guide',
          description: '',
          link: 'https://well.support/documentation-guide~3ba5ace6-aeec-4fe7-af6d-1e7b144b3cb8',
          min: 'preenrolled',
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
        {
          thumbnail: 'projects/v2/promotions/support-card.png',
          heading: 'Marketing your commitment to WELL',
          description: '',
          link: 'https://well.support/marketing-your-commitment-to-well~672a7332-cb35-4511-acff-f09de48f1dd7#h-ROqatDI-d43c7',
          min: 'preenrolled',
        },
        {
          thumbnail: 'projects/v2/promotions/support-card.png',
          heading: 'Marketing your WELL achievement',
          description: '',
          link: 'https://well.support/marketing-your-well-achievement~cdb8c5e1-9880-46a6-8504-2810fafd4a2b',
          min: 'preenrolled',
        },
        {
          thumbnail: 'projects/v2/promotions/support-card.png',
          heading: 'Celebrate your WELL Portfolio achievement',
          description: '',
          link: 'https://well.support/celebrate-your-well-portfolio-achievement~dff73cf9-dedd-4102-a966-64606b1cf0d7',
          min: 'preenrolled',
        },
        {
          thumbnail: 'projects/v2/promotions/support-card.png',
          heading: 'WELL and ESG',
          description: '',
          link: 'https://well.support/well-and-esg~d3149f7a-f2a1-4cfc-ba0e-9d6d2f296ed1',
          min: 'preenrolled',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
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
  methods: {
    downloadReport() {
      this.loading = true
      this.$axios
        .get(`/api/portfolio/${this.portfolio.id}/sdg/download-report`)
        .then((resp) => {
          this.loading = false
          window.open(resp.data.url, '_blank')
        })
        .catch(() => {
          this.loading = false
        })
      // api/portfolio/{portfolio_id}/sdg/download-report
    },
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
