<template>
  <div class="w-full flex flex-wrap">
    <div class="w-full md:flex">
      <div class="w-full lg:w-1/3 lg:pr-16">
        <WHeadingsHThree
          heading="WELL Faculty Orientation"
          sub-heading="New to the WELL Faculty network? Get acquainted with key program benefits and resources in your onboarding module and download foundational WELL Faculty assets to get started."
        />
        <WButtonsBase @click.native="downloadCert()">
          Download certificate
        </WButtonsBase>
      </div>
      <div class="w-full lg:w-2/3">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:gap-y-16 my-10 md:my-0"
        >
          <WCardsBase
            heading="WELL Faculty Onboarding Module"
            description="Access your onboarding module to find out more about the WELL Faculty program and learn alternatives to create engaging education sessions."
            thumbnail="well-faculty/dashboard/cards/orientation/onboarding.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="/education-courses/well-faculty-onboarding"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Get Started
              </WLinksBase>
            </div>
          </WCardsBase>

          <WCardsBase
            heading="WELL Brand Guide"
            description="Download the brand guide and learn how to use IWBI and WELL trademarks and branding elements appropriately, legally and artfully."
            thumbnail="well-faculty/dashboard/cards/orientation/brand-guide.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.WELLcertified.com/tools/WELL-branding-guidelines/"
                target="_blank"
                icon="download"
              />
            </div>
          </WCardsBase>

          <WCardsBase
            heading="IWBI Style Guide"
            description="Access the style guide to communicate the values behind WELL and craft personal stories that resonate with your audiences."
            thumbnail="well-faculty/dashboard/cards/orientation/style-guide.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://docs.google.com/document/d/16RZxaAHMf2seJpxaAHD0GFQtPFQyqcUz8IzM_NE6UAM/view"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Access
              </WLinksBase>
            </div>
          </WCardsBase>

          <WCardsBase
            heading="Custom Presentation"
            description="Download this PowerPoint presentation template to create custom slides in WELL presentations."
            thumbnail="well-faculty/dashboard/cards/orientation/presentation-template.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://cdn.wellcertified.com/resources/faculty/WELL%20Faculty_Custom%20Presentation%20Template_Lato%20Font_Dec%202020.pptx"
                target="_blank"
                icon="download"
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
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  methods: {
    async downloadCert() {
      await this.$axios
        .get('api/user/download-faculty-certificate/' + this.currentUser.id, {
          headers: this.headers,
          responseType: 'blob', // had to add this one here
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'WELL-Faculty-Certificate.pdf') // or any other extension
          document.body.appendChild(link)
          link.click()
        })
    },
  },
}
</script>
