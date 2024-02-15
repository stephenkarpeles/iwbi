<template>
  <div v-if="projectList.length > 0" class="w-full mt-5">
    <WFeedbackAlert ref="alert" class="z-50" />
    <div class="block w-full h-3.5 border-b text-center mt-2">
      <span
        class="text-2xl font-medium py-0 px-2.5 text-center relative inline-block m-0 bg-white"
        style="color: #656565"
        >Engagement Materials</span
      >
    </div>

    <div
      class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-6 pt-8"
    >
      <WLinksBase
        v-for="(cardData, index) in certificate"
        :key="'resource-' + index"
        :link="cardData.link"
        target="_blank"
      >
        <WCardsBase
          :heading="cardData.heading"
          :description="cardData.description"
          :thumbnail="cardData.thumbnail"
        >
        </WCardsBase>
      </WLinksBase>
      <WLinksBase @click.native="downloadAllCertificate">
        <WCardsBase
          :heading="certificateAll.heading"
          :description="certificateAll.description"
          :thumbnail="certificateAll.thumbnail"
        >
        </WCardsBase>
      </WLinksBase>
      <WLinksBase @click.native="downloadLOA">
        <WCardsBase
          :heading="letterOfAchievement.heading"
          :description="letterOfAchievement.description"
          :thumbnail="letterOfAchievement.thumbnail"
        >
        </WCardsBase>
      </WLinksBase>
    </div>
    <div
      v-if="projectList.length > 0"
      class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-6 pt-8"
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
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      certificate: [
        {
          thumbnail:
            'https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png',
          heading: 'WELL Health-Safety Rating Certificate',
          description: '',
          link: '',
          min: 'enrolled',
        },
        {
          thumbnail:
            'https://a.storyblok.com/f/52232/1000x500/627116b3e5/get-to-know-hsr-2-2.png',
          heading: 'WELL Health Safety Seal',
          description: '',
          link: `https://cdn.wellcertified.com/resources/health-safety/${this.hsrFileName}`,
          min: 'enrolled',
        },
      ],
      certificateAll: {
        thumbnail:
          'https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png',
        heading: 'Download All WELL Health-Safety Rating Certificates',
        description: '',
        link: '',
        min: 'enrolled',
      },
      letterOfAchievement: {
        thumbnail:
          'https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png',
        heading: 'WELL Health-Safety Rating Letter of Achievement',
        description: '',
        link: '',
        min: 'enrolled',
      },

      pListEnrolled: [
        {
          thumbnail:
            'https://a.storyblok.com/f/52232/1000x500/a09daf9256/wellbrandguidelines-resource-thumbnail-copy.png',
          heading: 'IWBI branding guidelines',
          description:
            'Consult IWBI&#39s brand guidelines to learn how you can use the official WELL Portfolio member mark.',
          link: 'https://resources.wellcertified.com/tools/well-branding-guidelines/',
          min: 'enrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/fb39482c7e/resource-guidelines.png',
          heading:
            'Marketing and PR guidelines for the WELL Health-Safety Rating',
          description:
            'Are you looking to tell your WELL Health-Safety Rating story? Here are some ideas to help get you started',
          link: 'https://www.wellcertified.com/health-safety/marketing-guidelines-enrolled',
          min: 'enrolled',
        },
      ],
      pListAchieved: [
        {
          thumbnail:
            'https://a.storyblok.com/f/52232/1000x500/a09daf9256/wellbrandguidelines-resource-thumbnail-copy.png',
          heading: 'IWBI branding guidelines',
          description:
            'Consult IWBI&#39s brand guidelines to learn how you can use the official WELL Portfolio member mark.',
          link: 'https://resources.wellcertified.com/tools/well-branding-guidelines/',
          min: 'enrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/fb39482c7e/resource-guidelines.png',
          heading:
            'Marketing and PR guidelines for the WELL Health-Safety Rating',
          description:
            'Are you looking to tell your WELL Health-Safety Rating story? Here are some ideas to help get you started',
          link: 'https://www.wellcertified.com/health-safety/marketing-guidelines-achieved',
          min: 'enrolled',
        },
        {
          thumbnail:
            'https://img2.storyblok.com/600x300/smart/f/52232/1734x1154/8e1ee4a8c8/stocksy_txp04a07bf369t200_medium_186268.png',
          heading: 'WELL Health-Safety Rated Collateral Toolkit',
          description:
            'Showcase your achievement with table tents, posters, palm cards and more.',
          link: 'https://resources.wellcertified.com/resources/tools/well-health-safety-rated-collateral',
          min: 'enrolled',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
    hsrFileName() {
      if (this.project.hsr_achieved_date) {
        const date1 = this.$dayjs(this.project.hsr_achieved_date)
        const date2 = this.$dayjs('2021-10-31')
        return date1 <= date2
          ? 'Health+Safety+Seals.zip'
          : 'Health+Safety+Seals+2022.zip'
      }
      return null
    },
    subscriptionStatus() {
      return this.$store.getters['portfolio/subscriptionStatus'] || null
    },
    projectList() {
      const data = this.portfolio ? this.portfolio : this.portfolio
      if (data.hsr_status === 'achieved') {
        return this.pListAchieved.filter((item) => this.isEnabled(item.min))
      } else {
        return this.pListEnrolled.filter((item) => this.isEnabled(item.min))
      }
    },
  },
  watch: {
    portfolio() {
      this.getCertificateUrl()
    },
  },
  mounted() {
    if (this.portfolio && this.portfolio.hsr_status === 'achieved') {
      this.getCertificateUrl()
    }
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
    getCertificateUrl() {
      this.$axios
        .get(`api/portfolio/${this.portfolio.id}/hsr-certificate/pdfExport`)
        .then((response) => {
          this.certificate[0].link = response.data.url
        })
    },
    getProjectCertificateUrl() {
      this.$axios
        .get(`api/project/${this.project.id}/hsr-certificate/pdfExport`)
        .then((response) => {
          this.certificate[0].link = response.data.url
        })
    },
    downloadLOA() {
      this.$axios
        .get(`api/portfolio/${this.portfolio.id}/hsr-loa-certificate/pdfExport`)
        .then((response) => {
          window.open(response.data.url, '_blank')
        })
    },
    downloadAllCertificate() {
      this.$axios
        .get(`api/portfolio/${this.portfolio.id}/hsr-certificate/downloadAll`)
        .then((response) => {
          this.$refs.alert.showAlert('success', response.data.msg)
        })
    },
  },
}
</script>
