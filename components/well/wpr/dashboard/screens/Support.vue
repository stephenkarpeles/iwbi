<template>
  <div data-page="support">
    <NavBreadcrumbs v-if="!$route.params.projectId">
      <WHeadingsHTwo
        heading="Support"
        sub-heading="Below, you'll find the articles, webcasts and tools to help you earn the WELL Performance Rating Seal. Listen to webcasts featuring industry leaders prioritizing health and safety, get tips and tricks to guide your progress and dig into your WELL Performance Rating toolkit.
"
      />
    </NavBreadcrumbs>
    <div
      v-for="resource in resources"
      :key="resource.title"
      class="space-y-5 md:mt-10"
    >
      <h3
        class="font-bold text-xl leading-7 text-primary-900 sm:text-2xl sm:leading-8"
      >
        {{ resource.title }}
      </h3>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
      >
        <WLinksBase
          v-for="(item, index) in resource.options"
          :key="index"
          :link="item.path ? item.path : null"
          target="_blank"
          description=""
          ><WCardsBase
            :heading="item.title"
            :thumbnail="item.image"
            description=""
          />
        </WLinksBase>
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
      supportList: [],
      singleDocumentLocation: false,
    }
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
      recertificationList: (state) => state.recertification.recertificationList,
      scorecardDocuments: (state) => state.shared.scorecardDocuments,
      scorecardAuditDocuments: (state) => state.shared.scorecardAuditDocuments,
    }),
    renewDate() {
      const today = this.$dayjs()
      if (!this.sharedWorkspace.hsr_achieved_date) return false
      else if (
        today.diff(this.sharedWorkspace.hsr_achieved_date, 'months', true) >= 3
      )
        return true
      else return false
    },

    resources() {
      let list = []

      if (!this.renewDate) {
        list = [
          {
            title: 'Getting Started',
            options: [
              // {
              //   title: 'WELL Performance Rating Tutorial Series',
              //   image:
              //     'https://a.storyblok.com/f/52232/856x524/f791572eb6/video-tutorial-series.png',
              //   target: '_blank',
              //   path: 'https://www.wellcertified.com/health-safety/tutorial-series',
              // },
              {
                title: 'Overview: the WELL Rating Process',
                image:
                  'https://a.storyblok.com/f/52232/856x524/0dbb6d2ca7/process-thumb.png',
                target: '_blank',
                path: 'https://well.support/getting-started-guide~e8b87299-6ea5-4b1e-ab07-da1234d3a971',
              },
              // {
              //   title:
              //     'Deep Dive: Exploring the WELL Performance Rating Features',
              //   image:
              //     'https://a.storyblok.com/f/52232/856x524/b6991c0062/features-thumb.png',
              //   target: '_blank',
              //   path: 'http://resources.wellcertified.com/articles/deep-dive-exploring-the-well-health-safety-rating-features',
              // },
              {
                title:
                  '(Coming soon) How to Create and Upload WELL Documentation',
                image:
                  'https://a.storyblok.com/f/52232/856x524/7e42333951/documentation-thumb.png',
                target: '_blank',
                // path: 'https://well.support/3e879027-bb8a-400e-99b4-845adb731c00',
              },
              {
                title: '(Coming soon) The WELL Rating Review Process',
                image:
                  'https://a.storyblok.com/f/52232/856x524/fc811389f8/reviews-thumb.png',
                target: '_blank',
                // path: 'http://resources.wellcertified.com/articles/well-health-safety-review-process',
              },
              {
                title: 'Celebrate your WELL Rating achievement',
                image:
                  'https://a.storyblok.com/f/52232/856x524/0e9c97467a/promotion-thumb.png',
                target: '_blank',
                path: 'https://well.support/celebrate-your-well-rating-achievement~32eaa750-f9b1-4948-80db-d012e1f510f9',
              },
            ],
          },
          {
            title: 'Technical tools',
            options: [
              {
                title: 'WELL Ratings Guidebook',
                image: 'wpr/wellratingguidelines_thumbnail.png',
                target: '_blank',
                path: 'https://resources.wellcertified.com/tools/well-ratings-guidebook/',
              },
              // {
              //   title:
              //     'Strategies from the WELL Building Standard to Support in the Fight Against COVID-19',
              //   image:
              //     'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/bd0ce79714/strategiesfromwellv2.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/tools/strategies-from-the-well-building-standard-to-support-in-the-fight-against-covid-19/',
              // },
              {
                title: '(Coming Soon) Letter of Assurance Template',
                image:
                  'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/4c1e784501/resource-template.png',
                target: '_blank',
                // path: 'https://a.storyblok.com/f/52232/x/74fa0a5f07/health-safety-rating-loas.pdf',
              },
              // {
              //   title: 'WELL Documentation Annotation Guide',
              //   image:
              //     'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/1cdb4677ea/resource-project-tool.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/resources/tools/well-health-safety-rating-annotation-guide',
              // },
              {
                title:
                  '(Coming soon) Interiors + Base Buildings: Applying WELL Certification in a WELL Certified Base Building',
                image:
                  'https://img2.storyblok.com/333x166/smart/f/52232/4167x2084/c25aeeae13/core-interiors-tools-covers-1.jpg',
                target: '_blank',
                // path: 'https://resources.wellcertified.com/resources/tools/interiors-and-base-buildings/',
              },
              // {
              //   title: 'WELL Performance Rating Documentation 101',
              //   image:
              //     'https://a.storyblok.com/f/52232/856x524/7e42333951/documentation-thumb.png',
              //   target: '_blank',
              //   path: 'https://cdn.wellcertified.com/education/well-health-safety-rating-documentation-101/story.html',
              // },
              {
                title: '(Coming soon) Sample Documentation',
                image: 'projects/v2/promotions/support-card.jpg',
                target: '_blank',
                // path: 'https://cdn.wellcertified.com/resources/hsr-sample-documentation.zip',
              },
              {
                title: '(Coming soon) Multiple Locations Document Sharing Form',
                image: 'projects/v2/promotions/support-card.jpg',
                // target: '_blank',
                // path: `${this.$config.assetsURL}shared-workspace/resources/whs_mpd-sharing-form.xlsx`,
              },
              {
                title: 'WELL Performance Rating Alignment Tool',
                image: 'wpr/wpr-rating-tool-thumbnail.png',
                target: '_blank',
                path: `https://resources.wellcertified.com/tools/well-performance-rating-alignment-tool/`,
              },
              {
                title: 'WELL Performance Rating Sensor Data Template',
                image: 'wpr/wpr-rating-tool-thumbnail.png',
                target: '_blank',
                path: `https://resources.wellcertified.com/tools/well-performance-rating-sensor-tool/`,
              },
            ],
          },
          {
            title: 'Helpful articles',
            options: [
              {
                title: 'Sleeping Giants: Awakening Building Water Systems',
                target: '_blank',
                image:
                  'https://img2.storyblok.com/1100x550/smart/f/52232/1733x1155/c583563162/stocksy_txpc07fc96ddwm100_medium_342966.jpg',
                path: 'https://resources.wellcertified.com/articles/sleeping-giants-awakening-building-water-systems/',
              },
              // {
              //   title:
              //     'Buildings Will Be Our First Line of Defense After COVID-19',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/1200x600/2280cd69c4/webcastjoeallen.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/buildings-will-be-our-first-line-of-defense-after-covid-19/',
              // },
              // {
              //   title:
              //     'Are Antimicrobial additives the Answer for Stopping the Spread of COVID-19',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/8256x5504/73e72e043c/man-looking-through-a-microscope-4033151.jpg',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/are-antimicrobial-additives-the-answer-to-stopping-the-spread-of-covid-19-/',
              // },
              // {
              //   title:
              //     'How Our Envirponment Can Help Minimize Stress and Bolster Immunity',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/600x300/180da451d8/cwqhqodw.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/how-our-environment-can-help-minimize-stress-and-bolster-immunity/',
              // },
              // {
              //   title:
              //     'Supporting Mental Health and Well-being During COVID-19',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/1733x1155/fcd8a93f7d/14-copy.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/supporting-mental-well-being-during-covid-19-iwbi-staff-voices/',
              // },
              // {
              //   title: 'Four Tips to Step Up Your Teleconferencing Game',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/76bbf881ff/ethan.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/four-tips-to-step-up-your-teleconferencing-game/',
              // },
            ],
          },
        ]
      } else {
        list = [
          // {
          //   title: 'Renewal Resources',
          //   options: [
          //     {
          //       title: 'Overview: the WELL Performance Rating renewal process',
          //       image:
          //         'https://a.storyblok.com/f/52232/856x524/0dbb6d2ca7/process-thumb.png',
          //       target: '_blank',
          //       path: 'https://well.support/f7d1faea-91fd-4d40-baa9-23d85fd2159d',
          //     },
          //     {
          //       title: 'How to upload ongoing documents',
          //       image:
          //         'https://a.storyblok.com/f/52232/856x524/7e42333951/documentation-thumb.png',
          //       target: '_blank',
          //       path: 'https://well.support/81f53e19-3a2d-44ef-a3ab-3627fe89745f',
          //     },
          //     {
          //       title:
          //         'Documentation requirements for multiple location projects',
          //       image:
          //         'https://a.storyblok.com/f/52232/856x524/7e42333951/documentation-thumb.png',
          //       target: '_blank',
          //       path: 'https://well.support/bb93fe28-87c4-438b-9667-311a09f7485a',
          //     },
          //     {
          //       title: 'How to upload documents and submit for renewal review',
          //       image:
          //         'https://a.storyblok.com/f/52232/856x524/fc811389f8/reviews-thumb.png',
          //       target: '_blank',
          //       path: 'https://well.support/6f3d4e99-c7b3-45fa-8a25-dae09878af9b',
          //     },
          //   ],
          // },
          {
            title: 'Technical tools',
            options: [
              {
                title: 'WELL Ratings Guidebook',
                image: 'wpr/wellratingguidelines_thumbnail.png',
                target: '_blank',
                path: 'https://resources.wellcertified.com/tools/well-ratings-guidebook/',
              },
              // {
              //   title:
              //     'Strategies from the WELL Building Standard to Support in the Fight Against COVID-19',
              //   image:
              //     'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/bd0ce79714/strategiesfromwellv2.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/tools/strategies-from-the-well-building-standard-to-support-in-the-fight-against-covid-19/',
              // },
              {
                title: '(Coming Soon) Letter of Assurance Template',
                image:
                  'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/4c1e784501/resource-template.png',
                target: '_blank',
                // path: 'https://a.storyblok.com/f/52232/x/74fa0a5f07/health-safety-rating-loas.pdf',
              },
              // {
              //   title: 'WELL Documentation Annotation Guide',
              //   image:
              //     'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/1cdb4677ea/resource-project-tool.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/resources/tools/well-health-safety-rating-annotation-guide',
              // },
              {
                title:
                  '(Coming soon) Interiors + Base Buildings: Applying WELL Certification in a WELL Certified Base Building',
                image:
                  'https://img2.storyblok.com/333x166/smart/f/52232/4167x2084/c25aeeae13/core-interiors-tools-covers-1.jpg',
                target: '_blank',
                // path: 'https://resources.wellcertified.com/resources/tools/interiors-and-base-buildings/',
              },
              // {
              //   title: 'WELL Performance Rating Documentation 101',
              //   image:
              //     'https://a.storyblok.com/f/52232/856x524/7e42333951/documentation-thumb.png',
              //   target: '_blank',
              //   path: 'https://cdn.wellcertified.com/education/well-health-safety-rating-documentation-101/story.html',
              // },
              {
                title: '(Coming soon) Sample Documentation',
                image: 'projects/v2/promotions/support-card.jpg',
                target: '_blank',
                // path: 'https://cdn.wellcertified.com/resources/hsr-sample-documentation.zip',
              },
              {
                title: '(Coming soon) Multiple Locations Document Sharing Form',
                image: 'projects/v2/promotions/support-card.jpg',
                // target: '_blank',
                // path: `${this.$config.assetsURL}shared-workspace/resources/whs_mpd-sharing-form.xlsx`,
              },
              {
                title: 'WELL Performance Rating Alignment Tool',
                image: 'wpr/wpr-rating-tool-thumbnail.png',
                target: '_blank',
                path: `https://resources.wellcertified.com/tools/well-performance-rating-alignment-tool/`,
              },
              {
                title: 'WELL Performance Rating Sensor Data Template',
                image: 'wpr/wpr-rating-tool-thumbnail.png',
                target: '_blank',
                path: `https://resources.wellcertified.com/tools/well-performance-rating-sensor-tool/`,
              },
            ],
          },
          {
            title: 'Helpful articles',
            options: [
              {
                title: 'Sleeping Giants: Awakening Building Water Systems',
                target: '_blank',
                image:
                  'https://img2.storyblok.com/1100x550/smart/f/52232/1733x1155/c583563162/stocksy_txpc07fc96ddwm100_medium_342966.jpg',
                path: 'https://resources.wellcertified.com/articles/sleeping-giants-awakening-building-water-systems/',
              },
              // {
              //   title:
              //     'Buildings Will Be Our First Line of Defense After COVID-19',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/1200x600/2280cd69c4/webcastjoeallen.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/buildings-will-be-our-first-line-of-defense-after-covid-19/',
              // },
              // {
              //   title:
              //     'Are Antimicrobial additives the Answer for Stopping the Spread of COVID-19',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/8256x5504/73e72e043c/man-looking-through-a-microscope-4033151.jpg',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/are-antimicrobial-additives-the-answer-to-stopping-the-spread-of-covid-19-/',
              // },
              // {
              //   title:
              //     'How Our Envirponment Can Help Minimize Stress and Bolster Immunity',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/600x300/180da451d8/cwqhqodw.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/how-our-environment-can-help-minimize-stress-and-bolster-immunity/',
              // },
              // {
              //   title:
              //     'Supporting Mental Health and Well-being During COVID-19',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/1733x1155/fcd8a93f7d/14-copy.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/supporting-mental-well-being-during-covid-19-iwbi-staff-voices/',
              // },
              // {
              //   title: 'Four Tips to Step Up Your Teleconferencing Game',
              //   image:
              //     'https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/76bbf881ff/ethan.png',
              //   target: '_blank',
              //   path: 'https://resources.wellcertified.com/articles/four-tips-to-step-up-your-teleconferencing-game/',
              // },
            ],
          },
        ]
      }

      return list
    },
  },
  mounted() {
    if (this.$route.params.id) {
      const self = this

      setTimeout(function () {
        self.$zendesk.show()
        self.$zendesk.prefill({
          name: {
            value: self.currentUser.name + ' ' + self.currentUser.last_name,
          },
          email: {
            value: self.currentUser.email,
          },
        })
      }, 1500)
    }
  },
  beforeDestroy() {
    this.$zendesk.hide()
  },
}
</script>
