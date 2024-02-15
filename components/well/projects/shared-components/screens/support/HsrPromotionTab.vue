<template>
  <div class="w-full flex flex-wrap">
    <div class="w-full flex">
      <div class="w-full">
        <WHeadingsHFour
          class="text-primary-600"
          heading="Engagement Materials"
        />
        <div
          class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-6 md:gap-y-16 mt-8"
        >
          <WCardsBase
            heading="WELL Health-Safety Rating Certificate"
            thumbnail="https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="certificateLink"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="WELL Health-Safety Seal"
            thumbnail="https://a.storyblok.com/f/52232/1000x500/627116b3e5/get-to-know-hsr-2-2.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="`https://cdn.wellcertified.com/resources/health-safety/${hsrFileName}`"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="WELL Health-Safety Rating Letter of Achievement"
            description=""
            thumbnail="https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="loaLink"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="IWBI Branding Guidelines"
            sub-heading="Consult IWBI's brand guidelines to learn how you can use the official WELL Portfolio member mark."
            thumbnail="https://a.storyblok.com/f/52232/1000x500/a09daf9256/wellbrandguidelines-resource-thumbnail-copy.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/well-branding-guidelines/"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Marketing and PR guidelines for the WELL Health-Safety Rating"
            sub-heading="Are you looking to tell your WELL Health-Safety Rating story? Here are some ideas to help get you started"
            thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1000x500/fb39482c7e/resource-guidelines.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://www.wellcertified.com/health-safety/marketing-guidelines-achieved"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            :heading="recertCard.title"
            :sub-heading="recertCard.subTitle"
            thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1734x1154/8e1ee4a8c8/stocksy_txp04a07bf369t200_medium_186268.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="recertCard.link"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      certificateLink: '',
      loaLink: '',
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      recertificationList: (state) => state.recertification.recertificationList,
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
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    recertCard() {
      if (
        this.recertification &&
        this.recertification.type === 'v2-hsr' &&
        this.recertification.date_certified
      ) {
        return {
          title: 'Promote your renewal',
          subTitle:
            "With your renewed commitment to health and safety, you've demonstrated to the world that your organization puts people first. Now it's time to share what this achievement is all about.",
          link: 'https://www.wellcertified.com/health-safety/promotional-toolkit-hsr-renewal',
        }
      } else {
        return {
          title: 'WELL Health-Safety Rated Collateral Toolkit',
          subTitle:
            'Showcase your achievement with table tents, posters, palm cards and more',
          link: 'https://resources.wellcertified.com/resources/tools/well-health-safety-rated-collateral',
        }
      }
    },
  },
  mounted() {
    this.downloadHsrCertificate()
    this.downloadHsrLoa()
  },
  methods: {
    ...mapActions('project', []),
    downloadHsrCertificate() {
      this.$store
        .dispatch('project/downloadHsrCertificate', {
          project_id: this.project.id,
        })
        .then((res) => {
          this.certificateLink = res.data.url
        })
    },
    downloadHsrLoa() {
      this.$store
        .dispatch('project/downloadHsrLoa', {
          project_id: this.project.id,
        })
        .then((res) => {
          this.loaLink = res.data.url
        })
    },
  },
}
</script>
