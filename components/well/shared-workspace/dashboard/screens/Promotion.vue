<template>
  <div class="w-full mt-5 py-5 px-10">
    <WFeedbackAlert ref="alert" />
    <div class="w-full flex flex-wrap">
      <div class="w-full lg:w-1/3">
        <WHeadingsHTwo
          heading="Promotions"
          class="-mt-10 text-3xl"
          style="color: #4b4b4b"
        />
      </div>
      <div class="block w-full h-3.5 border-b text-center">
        <span
          class="text-2xl font-medium py-0 px-2.5 text-center relative inline-block m-0 bg-white"
          style="color: #656565"
          >Engagement Materials</span
        >
      </div>
      <div class="w-full mb-5">
        <div class="grid grid-cols-3 sm:grid-cols-3 gap-x-6 gap-y-16 pt-8">
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
            v-if="showCertificate"
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
            heading="WELL Health-Safety Rating Letter of Achievement"
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

          <WCardsBase
            v-for="(promotion, index) in promotionList"
            :key="'promotion-' + index"
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
      <div
        v-if="sharedworkspace.hsr_achieved_date"
        class="block w-full h-3.5 border-b text-center"
      >
        <span
          class="text-2xl font-medium py-0 px-2.5 text-center relative inline-block m-0 bg-white"
          style="color: #656565"
          >WELL Store</span
        >
      </div>
      <div v-if="sharedworkspace.hsr_achieved_date" class="w-full mt-5">
        <div
          v-if="hsrTime"
          class="grid grid-cols-3 sm:grid-cols-3 gap-x-6 gap-y-16 pt-8"
        >
          <WCardsBase
            v-for="card in wellStoreList2022"
            :key="'well-store-' + card.heading"
            :heading="card.heading"
            :thumbnail="card.thumbnail"
          >
            <div class="mt-4">
              <WLinksBase
                :link="card.link + sharedworkspace.no_of_assets"
                target="_blank"
                icon="arrow-right"
                icon-position="right"
              />
            </div>
          </WCardsBase>
        </div>
        <div
          v-else
          class="grid grid-cols-3 sm:grid-cols-3 gap-x-6 gap-y-16 pt-8"
        >
          <WCardsBase
            v-for="card in wellStoreList"
            :key="'well-store-' + card.heading"
            :heading="card.heading"
            :thumbnail="card.thumbnail"
          >
            <div class="mt-4">
              <WLinksBase
                :link="card.link + sharedworkspace.no_of_assets"
                target="_blank"
                icon="arrow-right"
                icon-position="right"
              />
            </div>
          </WCardsBase>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      certificateLink: '',
      loaLink: '',
      pListEnrolled: [
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
      ],
      wellStoreList: [
        {
          thumbnail:
            'shared-workspace/logos/2021/HSR-decals-2021-english-blue.png',
          heading: 'Blue Standard Decal(English)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39426157838403&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2021/HSR-decals-2021-schinese-blue.png',
          heading: 'Blue Standard Decal (English and Simplified Chinese) ',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=32288614744131&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2021/HSR-decals-2021-tchinese-blue.png',
          heading: 'Blue Standard Decal (English and Traditional Chinese)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=32288614776899&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2021/HSR-decals-2021-english-white.png',
          heading: 'White/Transparent Standard Decal(English)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39424953974851&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2021/HSR-decals-2021-schinese-white.png',
          heading:
            'White/Transparent Standard Decal (English and Simplified Chinese)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39424958857283&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2021/HSR-decals-2021-tchinese-white.png',
          heading:
            'White/Transparent Standard Decal (English and Traditional Chinese)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39424959250499&quantity=',
          min: 'enrolled',
        },
      ],
      wellStoreList2022: [
        {
          thumbnail:
            'shared-workspace/logos/2022/HSR-decals-2022-english-blue.png',
          heading: 'Blue Standard Decal(English)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39575628841027&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2022/HSR-decals-2022-schinese-blue.png',
          heading: 'Blue Standard Decal (English and Simplified Chinese) ',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39575628873795&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2022/HSR-decals-2022-tchinese-blue.png',
          heading: 'Blue Standard Decal (English and Traditional Chinese)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39575628906563&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2022/HSR-decals-2022-english-white.png',
          heading: 'White/Transparent Standard Decal(English)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39575628939331&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2022/HSR-decals-2022-schinese-white.png',
          heading:
            'White/Transparent Standard Decal (English and Simplified Chinese)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39575628972099&quantity=',
          min: 'enrolled',
        },
        {
          thumbnail:
            'shared-workspace/logos/2022/HSR-decals-2022-tchinese-white.png',
          heading:
            'White/Transparent Standard Decal (English and Traditional Chinese)',
          description: '',
          link: 'https://store.wellcertified.com/cart/add?id=39575629004867&quantity=',
          min: 'enrolled',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      sharedworkspace: (state) => state.shared.sharedWorkspace,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    hsrFileName() {
      const achievedDate =
        this.recertification && this.recertification.date_certified
          ? this.recertification.date_certified
          : this.sharedworkspace.hsr_achieved_date
      if (this.sharedworkspace.hsr_achieved_date) {
        const date1 = this.$dayjs(achievedDate)
        const date2 = this.$dayjs('2021-10-31')
        return date1 <= date2
          ? 'Health+Safety+Seals.zip'
          : 'Health+Safety+Seals+2022.zip'
      }
      return null
    },
    hsrTime() {
      const time1 = '2021-11-01'
      const date1Updated = new Date(time1.replace(/-/g, '/'))
      let time2 = this.sharedworkspace.hsr_achieved_date

      if (this.recertification !== '') {
        time2 = this.recertification.date_certified
        const date2Updated = new Date(time2.replace(/-/g, '/'))
        return new Date(date1Updated) < new Date(date2Updated) // true if time1 is later
      } else if (this.sharedworkspace.hsr_achieved_date) {
        time2 = this.sharedworkspace.hsr_achieved_date
        const date2Updated = new Date(time2.replace(/-/g, '/'))
        return new Date(date1Updated) < new Date(date2Updated) // true if time1 is later
      }
      return false
    },
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    promotionList() {
      // assign data for hsr
      const data = this.$store.state.shared.sharedWorkspace
      if (data.hsr_status === 'achieved') {
        return this.pListAchieved.filter((item) => this.isEnabled(item.min))
      } else {
        return this.pListEnrolled.filter((item) => this.isEnabled(item.min))
      }
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
    isTestNuxt() {
      if (
        window.location.href.search('test-nuxt') === -1 &&
        window.location.href.search('localhost') === -1
      ) {
        return false
      }
      return true
    },
    showCertificate() {
      if (this.$store.state.shared.sharedWorkspace.hsr_status === 'achieved') {
        return true
      }
      return false
    },
  },
  mounted() {
    this.downloadHsrCertificate()
    this.downloadHsrLoa()
  },
  methods: {
    downloadAllCertificate() {
      this.$store
        .dispatch('shared/downloadHsrAllCertificate', {
          portfolio_id: this.sharedworkspace.id,
        })
        .then((res) => {
          this.$refs.alert.showAlert('success', res.data.msg)
        })
    },
    downloadHsrCertificate() {
      this.$store
        .dispatch('shared/downloadHsrCertificate', {
          portfolio_id: this.sharedworkspace.id,
        })
        .then((res) => {
          this.certificateLink = res.data.url
        })
    },
    downloadHsrLoa() {
      this.$store
        .dispatch('shared/downloadHsrLoa', {
          portfolio_id: this.sharedworkspace.id,
        })
        .then((res) => {
          this.loaLink = res.data.url
        })
    },
    isEnabled(minStatus) {
      let enabled = true
      // update this logic to use in the projects
      // if (this.projectInfo) {
      //   return true
      // }
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
