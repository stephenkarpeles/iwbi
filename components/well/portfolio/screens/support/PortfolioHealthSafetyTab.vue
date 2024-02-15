<template>
  <div>
    <div v-for="resource in resources" :key="resource.title">
      <WHeadingsHFour class="text-primary-600" :heading="resource.title" />
      <div
        class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-6 md:gap-y-16 mt-8"
      >
        <div v-for="(item, index) in resource.options" :key="index">
          <WCardsBase
            :heading="item.title"
            :thumbnail="item.image"
            class="h-full"
          >
            <div class="mt-4">
              <WLinksBase
                :link="item.path"
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
    <div class="w-full flex border-t md:mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Support Documents" />
        <div class="mt-8">
          <ul class="list-disc ml-7">
            <li v-for="doc in sampleDocuments" :key="doc.title">
              <WLinksBase :link="doc.link" target="_blank">
                {{ doc.title }}
              </WLinksBase>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      resources: [
        {
          title: 'Getting Started',
          options: [
            {
              title: 'WELL Health-Safety Rating Tutorial Series',
              image:
                'https://a.storyblok.com/f/52232/856x524/f791572eb6/video-tutorial-series.png',
              target: '_blank',
              path: 'https://www.wellcertified.com/health-safety/tutorial-series',
            },
            {
              title: 'Overview: the WELL Health-Safety Rating Process',
              image:
                'https://a.storyblok.com/f/52232/856x524/0dbb6d2ca7/process-thumb.png',
              target: '_blank',
              path: 'http://resources.wellcertified.com/articles/overview-the-well-health-safety-rating-process',
            },
            {
              title:
                'Deep Dive: Exploring the WELL Health-Safety Rating Features',
              image:
                'https://a.storyblok.com/f/52232/856x524/b6991c0062/features-thumb.png',
              target: '_blank',
              path: 'http://resources.wellcertified.com/articles/deep-dive-exploring-the-well-health-safety-rating-features',
            },
            {
              title: 'How to Create and Upload WELL Documentation',
              image:
                'https://a.storyblok.com/f/52232/856x524/7e42333951/documentation-thumb.png',
              target: '_blank',
              path: 'http://resources.wellcertified.com/articles/how-to-create-and-upload-well-documentation',
            },
            {
              title: 'The WELL Health-Safety Rating Review Process',
              image:
                'https://a.storyblok.com/f/52232/856x524/fc811389f8/reviews-thumb.png',
              target: '_blank',
              path: 'http://resources.wellcertified.com/articles/well-health-safety-review-process',
            },
            {
              title: 'How to Promote your WELL Health-Safety Rating',
              image:
                'https://a.storyblok.com/f/52232/856x524/0e9c97467a/promotion-thumb.png',
              target: '_blank',
              path: 'http://resources.wellcertified.com/articles/how-to-promote-your-well-health-safety-rating',
            },
          ],
        },
        {
          title: 'Technical tools',
          options: [
            {
              title: 'WELL Health-Safety Rating Guidebook',
              image:
                'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/68a7038d5f/thumbnailsguidebook.png',
              target: '_blank',
              path: 'https://a.storyblok.com/f/52232/x/0da851f648/well-health-safety-rating-guidebook-0630.pdf',
            },
            {
              title:
                'Strategies from the WELL Building Standard to Support in the Fight Against COVID-19',
              image:
                'https://img2.storyblok.com/333x166/smart/f/52232/1000x500/bd0ce79714/strategiesfromwellv2.png',
              target: '_blank',
              path: 'https://resources.wellcertified.com/tools/strategies-from-the-well-building-standard-to-support-in-the-fight-against-covid-19/',
            },
            {
              title: 'Letter of Assurance Template',
              image:
                'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/4c1e784501/resource-template.png',
              target: '_blank',
              path: 'https://a.storyblok.com/f/52232/x/74fa0a5f07/health-safety-rating-loas.pdf',
            },
            {
              title:
                'WELL Health-Safety Rating Multiple Projects Documentation Sharing form',
              image:
                'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/1cdb4677ea/resource-project-tool.png',
              target: '_blank',
              path: 'https://resources.wellcertified.com/tools/well-health-safety-multiple-projects-documentation-sharing-form/',
            },
            {
              title: 'WELL Documentation Annotation Guide',
              image:
                'https://img2.storyblok.com/600x300/smart/f/52232/1000x500/1cdb4677ea/resource-project-tool.png',
              target: '_blank',
              path: 'https://resources.wellcertified.com/resources/tools/well-health-safety-rating-annotation-guide/',
            },
            {
              title:
                'Interiors + Base Buildings: Applying WELL Certification in a WELL Certified Base Building',
              image:
                'https://img2.storyblok.com/333x166/smart/f/52232/4167x2084/c25aeeae13/core-interiors-tools-covers-1.jpg',
              target: '_blank',
              path: 'https://resources.wellcertified.com/resources/tools/interiors-and-base-buildings/',
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
            {
              title:
                'Buildings Will Be Our First Line of Defense After COVID-19',
              image:
                'https://img2.storyblok.com/1100x550/smart/f/52232/1200x600/2280cd69c4/webcastjoeallen.png',
              target: '_blank',
              path: 'https://resources.wellcertified.com/articles/buildings-will-be-our-first-line-of-defense-after-covid-19/',
            },
            {
              title:
                'Are Antimicrobial additives the Answer for Stopping the Spread of COVID-19',
              image:
                'https://img2.storyblok.com/1100x550/smart/f/52232/8256x5504/73e72e043c/man-looking-through-a-microscope-4033151.jpg',
              target: '_blank',
              path: 'https://resources.wellcertified.com/articles/are-antimicrobial-additives-the-answer-to-stopping-the-spread-of-covid-19-/',
            },
            {
              title:
                'How Our Envirponment Can Help Minimize Stress and Bolster Immunity',
              image:
                'https://img2.storyblok.com/1100x550/smart/f/52232/600x300/180da451d8/cwqhqodw.png',
              target: '_blank',
              path: 'https://resources.wellcertified.com/articles/how-our-environment-can-help-minimize-stress-and-bolster-immunity/',
            },
            {
              title: 'Supporting Mental Health and Well-being During COVID-19',
              image:
                'https://img2.storyblok.com/1100x550/smart/f/52232/1733x1155/fcd8a93f7d/14-copy.png',
              target: '_blank',
              path: 'https://resources.wellcertified.com/articles/supporting-mental-well-being-during-covid-19-iwbi-staff-voices/',
            },
            {
              title: 'Four Tips to Step Up Your Teleconferencing Game',
              image:
                'https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/76bbf881ff/ethan.png',
              target: '_blank',
              path: 'https://resources.wellcertified.com/articles/four-tips-to-step-up-your-teleconferencing-game/',
            },
          ],
        },
      ],
      sampleDocuments: [
        {
          link: 'https://resources.wellcertified.com/resources/tools/support-handwashing-hsr',
          title: 'Support Handwashing',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/reduce-surface-contact-hsr',
          title: 'Reduce Surface Contact',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/improve-cleaning-practices-hsr',
          title: 'Improve Cleaning Practices',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/select-preferred-cleaning-products-hsr',
          title: 'Select Preferred Cleaning Products',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/develop-emergency-preparedness-plan-hsr',
          title: 'Develop Emergency Preparedness Plan',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/create-business-continuity-plan-hsr',
          title: 'Create Business Continuity Plan',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/plan-for-healthy-re-entry-hsr',
          title: 'Plan for Healthy Re-Entry',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/provide-emergency-resources-hsr',
          title: 'Provide Emergency Resources',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/bolster-emergency-resilience-hsr',
          title: 'Bolster Emergency Resilience',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/provide-sick-leave-hsr',
          title: 'Provide Sick Leave',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/provide-health-benefits-hsr',
          title: 'Provide Health Benefits',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/support-mental-health-recovery-hsr',
          title: 'Support Mental Health Recovery',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/promote-flu-vaccines-hsr',
          title: 'Promote Flu Vaccines',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/promote-smoke-free-environment-hsr',
          title: 'Promote a Smoke-Free Environment',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/assess-ventilation-hsr',
          title: 'Assess Ventilation',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/assess-and-maintain-air-treatment-systems-hsr',
          title: 'Assess and Maintain Air Treatment Systems',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/develop-legionella-management-plan-hsr',
          title: 'Develop Legionella Management Plan',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/develop-legionella-management-plan-best-practices-hsr',
          title: 'Develop Legionella Management Plan Best Practices',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/monitor-air-and-water-quality-hsr',
          title: 'Monitor Air and Water Quality',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/manage-mold-and-moisture-hsr',
          title: 'Manage Mold and Moisture',
        },
        {
          link: 'http://resources.wellcertified.com/resources/tools/promote-health-and-wellness-hsr',
          title: 'Promote Health and Wellness',
        },
        {
          link: 'https://resources.wellcertified.com/resources/tools/share-food-inspection-information-hsr',
          title: 'Share Food Inspection Information',
        },
      ],
    }
  },
}
</script>
