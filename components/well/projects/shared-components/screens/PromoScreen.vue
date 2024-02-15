<template>
  <div class="w-full py-5 px-10">
    <div class="w-full flex flex-wrap">
      <div class="w-full lg:w-1/3">
        <WHeadingsHTwo
          heading="Promotions"
          class="-mt-6 text-3xl"
          style="color: #4b4b4b"
        />
      </div>
      <div class="block w-full h-3.5 border-b text-center">
        <span
          class="text-2xl font-medium py-0 px-2.5 text-center relative inline-block m-0 bg-white"
          style="color: #656565"
        >
          Engagement Materials
        </span>
      </div>
      <div class="w-full">
        <div class="w-full lg:w-1/3 lg: pr-16"></div>
        <div
          v-if="
            ![
              'Performance Verification Appeal Application',
              'Documentation Appeal Application',
              'Curative Action Plan Application',
            ].includes(project.project_phase)
          "
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-16 mt-12"
        >
          <WCardsBase
            heading="Marketing and PR guidelines for WELL projects"
            description="Are you looking to tell your building’s WELL story? Here are some ideas to help get you started."
            thumbnail="projects/v2/promotions/resource-guidelines.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/articles/marketing-and-pr-guidelines-for-well-projects/"
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="project.cert_status"
            heading="WELL Certification Letter of Achievement"
            sub-heading="Letter"
            description=""
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/480x221/632aaaea15/core-and-shell-article-image_0.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="certLoaLink"
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="showCertificate"
            heading="WELL Health-Safety Rating Certificate"
            sub-heading="Certificate"
            description=""
            thumbnail="https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="certificateLink"
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="showCertificate"
            heading="WELL Health Safety Seal"
            sub-heading="Seal"
            description=""
            thumbnail="https://a.storyblok.com/f/52232/1000x500/627116b3e5/get-to-know-hsr-2-2.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="`https://cdn.wellcertified.com/resources/health-safety/${hsrFileName}`"
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="showCertificate && sharedWorkspace && sharedWorkspace.id"
            heading="Download All WELL Health-Safety Rating Certificates"
            sub-heading="Certificates"
            description=""
            thumbnail="https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png"
          >
            <div class="mt-4">
              <WLinksBase
                link=""
                target=""
                icon="download"
                icon-position="right"
                @click.native="downloadAllCertificate"
              />
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="showCertificate"
            heading="WELL Health-Safety Letter of Achievement"
            sub-heading="Letter"
            description=""
            thumbnail="https://asw9rfeyn.cloudimg.io/crop/600x300/x/https://cdn.wellcertified.com/resources/health-safety/Health-Safety_Seal.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="loaLink"
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>

          <WCardsBase
            v-if="project.pre_cert_status === 'Compliance'"
            heading="Digital Precertification Seals"
            description=""
            thumbnail="projects/digitalseal.png"
          >
            <div class="mt-4">
              <WLinksBase
                :link="
                  $config.assetsURL +
                  'projects/promotions/precertification_marks.zip'
                "
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>

          <WCardsBase
            v-if="project.date_certified"
            heading="IWBI Brand and Style Guidelines"
            description="Download IWBI’s branding, design and style guidelines to learn how to use WELL’s assets."
            thumbnail="projects/promotions/branding.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="
                  https://resources.wellcertified.com/tools/well-branding-guidelines/
                "
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>

          <WCardsBase
            v-if="project.date_certified"
            :heading="certification.heading"
            description=""
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                :link="certification.link"
                target="_blank"
                icon="download"
                icon-position="right"
              />
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="project.type !== 'v1' && project.reg_status"
            heading="Welcome to WELL Toolkit"
            thumbnail="projects/v2/promotions/toolkit.png"
            description="The comprehensive “Welcome to WELL” toolkit is designed to help you extract the greatest benefit from your space as well as publicize your achievement."
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/download-the-welcome-to-well-toolkit~5b51705f-94ec-451a-970d-3b1f8617cce3"
                target="_blank"
                icon="download"
                icon-position="right"
              >
              </WLinksBase>
            </div>
          </WCardsBase>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-16 mt-12"
        >
          <div
            v-for="(promotion, index) in pListEnrolled"
            :key="'promotion-' + index"
            :class="[!project.hsr_opt && 'hidden', 'h-full']"
          >
            <WCardsBase
              class="h-full"
              :heading="promotion.heading"
              :description="promotion.description"
              :thumbnail="promotion.thumbnail"
            >
              <div class="mt-4">
                <WLinksBase
                  :link="promotion.link"
                  target="_blank"
                  icon="download"
                  icon-position="right"
                />
              </div>
            </WCardsBase>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      certificateLink: '',
      loaLink: '',
      certLoaLink: '',
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    hsrFileName() {
      const achievedDate =
        this.recertification &&
        this.recertification.date_certified &&
        this.recertification.type === 'v2-hsr'
          ? this.recertification.date_certified
          : this.project.hsr_achieved_date
      if (this.project.hsr_achieved_date) {
        const date1 = this.$dayjs(achievedDate)
        const date2 = this.$dayjs('2021-10-31')
        return date1 <= date2
          ? 'Health+Safety+Seals.zip'
          : 'Health+Safety+Seals+2022.zip'
      }
      return null
    },
    certification() {
      let payload = {
        heading: '',
        link: '',
      }
      const projectCertification = this.project.cert_status + '.zip'
      let heading = 'WELL '
      let link = 'https://cdn.wellcertified.com/resources/project/'
      if (this.project.v1_project_standard === 'community') {
        heading += 'Community Seals'
        link += 'well-community/'
      } else if (this.project.project_type === 'cs') {
        heading += 'Core Seals'
        link += 'well-core/'
      } else {
        heading += 'Certification Seals'
        link += 'well-certification/'
      }
      link += projectCertification
      payload = {
        heading,
        link,
      }
      return payload
    },
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    pListEnrolled() {
      return [
        {
          thumbnail:
            'https://a.storyblok.com/f/52232/1000x500/a09daf9256/wellbrandguidelines-resource-thumbnail-copy.png',
          heading: 'IWBI branding guidelines ',
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
        {
          thumbnail:
            'https://img2.storyblok.com/600x300/smart/f/52232/1734x1154/8e1ee4a8c8/stocksy_txp04a07bf369t200_medium_186268.png',
          heading:
            this.recertification &&
            this.recertification.type === 'v2-hsr' &&
            this.recertification.date_certified
              ? 'Promote your renewal'
              : 'WELL Health-Safety Rated Collateral Toolkit',
          description:
            this.recertification &&
            this.recertification.type === 'v2-hsr' &&
            this.recertification.date_certified
              ? "With your renewed commitment to health and safety, you've demonstrated to the world that your organization puts people first. Now it's time to share what this achievement is all about."
              : 'Showcase your achievement with table tents, posters, palm cards and more.',
          link:
            this.recertification &&
            this.recertification.type === 'v2-hsr' &&
            this.recertification.date_certified
              ? 'https://www.wellcertified.com/health-safety/promotional-toolkit-hsr-renewal'
              : 'https://resources.wellcertified.com/resources/tools/well-health-safety-rated-collateral',
          min: 'enrolled',
        },
      ]
    },
    pListAchieved() {
      return [
        {
          thumbnail:
            'https://a.storyblok.com/f/52232/1000x500/a09daf9256/wellbrandguidelines-resource-thumbnail-copy.png',
          heading: 'IWBI branding guidelines ',
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
          heading:
            this.recertification &&
            this.recertification.type === 'v2-hsr' &&
            this.recertification.date_certified
              ? 'Promote your renewal'
              : 'WELL Health-Safety Rated Collateral Toolkit',
          description:
            this.recertification &&
            this.recertification.type === 'v2-hsr' &&
            this.recertification.date_certified
              ? "With your renewed commitment to health and safety, you've demonstrated to the world that your organization puts people first. Now it's time to share what this achievement is all about."
              : 'Showcase your achievement with table tents, posters, palm cards and more.',
          link:
            this.recertification &&
            this.recertification.type === 'v2-hsr' &&
            this.recertification.date_certified
              ? 'https://www.wellcertified.com/health-safety/promotional-toolkit-hsr-renewal'
              : 'https://resources.wellcertified.com/resources/tools/well-health-safety-rated-collateral',
          min: 'enrolled',
        },
      ]
    },
    showCertificate() {
      if (
        this.$store.state.shared.sharedWorkspace.hsr_status === 'achieved' ||
        this.project.hsr_status === 'achieved'
      ) {
        return true
      }
      return false
    },
  },
  watch: {
    showCertificate(value) {
      if (value && this.certificateLink) {
        this.downloadHsrLoa()
        this.downloadHsrCertificate()
      }
    },
  },
  mounted() {
    if (
      this.$store.state.shared.sharedWorkspace.hsr_status === 'achieved' ||
      this.project.hsr_status === 'achieved'
    ) {
      this.downloadHsrLoa()
      this.downloadHsrCertificate()
    }
    if (this.project.cert_status) {
      this.$store
        .dispatch('project/downloadLoa', { project_id: this.project.id })
        .then((res) => {
          this.certLoaLink = res.data.url
        })
    }
  },
  methods: {
    downloadAllCertificate() {
      this.$store
        .dispatch('shared/downloadHsrAllCertificate', {
          portfolio_id: this.sharedWorkspace.id,
        })
        .then((res) => {
          this.$refs.alert.showAlert('success', res.data.msg)
        })
    },
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
      let payload = {}
      if (this.project) {
        payload = {
          project_id: this.project.id,
        }
        this.$store.dispatch('project/downloadHsrLoa', payload).then((res) => {
          this.loaLink = res.data.url
        })
      } else if (this.sharedWorkspace && this.sharedWorkspace.id) {
        payload = {
          portfolio_id: this.project.id,
        }
        this.$store.dispatch('shared/downloadHsrLoa', payload).then((res) => {
          this.loaLink = res.data.url
        })
      }
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
