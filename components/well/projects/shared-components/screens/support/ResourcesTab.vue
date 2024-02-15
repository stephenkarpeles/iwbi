<template>
  <div class="w-full flex flex-wrap">
    <div class="w-full flex">
      <div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Getting Started" />
        <div
          class="
            grid grid-cols-1
            sm:grid-cols-3
            gap-x-5 gap-y-6
            md:gap-y-16
            mt-8
          "
        >
          <WCardsBase
            heading="Understand the WELL project administrator role"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/84c66824-9e9b-4f1e-babb-078553f4148d"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Build your WELL project team"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/6775141b-8e0e-4908-ab36-59d79d3a34d0"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Create a custom scorecard "
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/90cc304f-d215-4007-ace9-3a6fd8319c99"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Define your WELL project boundary "
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/0c8d5cd8-d4d2-4502-a2bb-940051d12c4a"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Understand the architecture of WELL v2"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/2b815f2b-88a7-4adb-a62e-661f10efaf04"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="WELL Core Guide"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/5d924cc2-2826-4654-b319-95578db3ce2d"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Estimate certification timelines"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/aa9ea972-4f5e-4c37-9d7f-e6f8669ece5c"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Prioritize WELL feature selection with public health data"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/cdacff64-58fc-4833-b9e3-d95cbaa13235"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Choose award milestones to achieve"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/aa2d59e7-6db8-420d-9c51-2b10515d5968"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Celebrate your WELL Certification enrollment"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/446140ee-09dd-40b1-a252-9255ecd79fd0"
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

    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Toolkits" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            v-if="project.type === 'v2'"
            heading="Access WELL v2 Certification toolkit"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/d353db7b-2c19-43a9-a8c8-2bfe38361659"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="project.type === 'v2-pilot'"
            heading="Access WELL v2 pilot Certification toolkit"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/b7233bb4-3e67-4032-a4a9-70e9a4de57b1"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="project.type === 'v1' || project.type === 'v1-upgraded'"
            heading="Access WELL v1 Certification toolkit"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/bbc4b885-75ef-4a08-9b9c-321ab78c1144"
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

    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Documentation Prep" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Start the WELL documentation process"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/f00a9cd5-10e1-4c15-bea4-131a73fa4f95"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Understanding document types"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/2e2fbbc2-4ce7-4b95-bf64-90f5e5a6f7e4"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Tips for preparing documentation"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/7cf3dc55-5925-4898-9485-e1529e25fea0"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Upload WELL documentation to your account"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/3acf48fd-1b66-46c0-9055-0e68c637482c"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Access evidence for WELL features"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/8c7e6342-bf0e-4c3a-9ad4-9821eb400ed7"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <!-- <WCardsBase
            heading="Use sample documentation"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/7474fd44-dc4c-4ac1-b3c9-2ce12c2af4ff"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase> -->
          <WCardsBase
            heading="WELL Project info form"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/well-project-information-form/ "
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Use an alternative approach"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/0c60363f-96e1-4880-92a5-ec0739d1cf14"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Pursue innovative features"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/3aa7fc5b-bf38-48e0-a58b-2468500af2ed"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Upgrade to newer requirements or versions"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/e42dcb7f-2c92-4289-9bab-e16ebcb95c91"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="project.type === 'v1'"
            heading="WELL Documentation preparation"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://iframe.videodelivery.net/ca0d544bb774af0d61d8fa7cbf9a43b1"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="project.type !== 'v1'"
            heading="WELL Documentation Annotation Guide"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/resources/tools/well-health-safety-rating-annotation-guide"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="
              project.reg_status === 1 &&
              project.reg_status !== 'unpaid' &&
              project.type === 'v2'
            "
            heading="Sample Documentation"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://cdn.wellcertified.com/resources/v2-sample-documentation.zip"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="
              project.reg_status === 1 &&
              project.reg_status !== 'unpaid' &&
              project.type === 'v1'
            "
            heading="Sample Documentation"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://cdn.wellcertified.com/resources/v1-sample-documentation.zip"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            v-if="
              project.reg_status === 1 &&
              project.reg_status !== 'unpaid' &&
              project.type === 'v2-pilot'
            "
            heading="Sample Documentation"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://cdn.wellcertified.com/resources/v2-pilot-sample-documentation.zip"
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

    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour
          class="text-primary-600"
          heading="Alternatives + Innovations"
        />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="WELL crosswalks"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1100x550/c1a5aaa5fd/crosswalks-socialpost-v2-1.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/78eecd45-1f48-47da-9b1b-61ebed1bf56a"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Explore alternative adherence paths"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1200x703/39f48dc089/articleheader5-aapheader.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/2e056cb4-f52d-4295-bd5a-07b73c068b0a"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Explore innovations"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/5f5b0c05b7/project-20photos-1.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/7f0be084-7aee-4f8e-b426-d1ae7533fd3c"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Explore equivalencies"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1719x691/584f15e89c/meeting-people.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/549214f4-9a41-4008-b4d1-ecf581bfd872"
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

    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour
          class="text-primary-600"
          heading="Performance Testing"
        />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Prepare the site for performance testing"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/e4a8f2ef-3500-4071-b746-9b712e037fe4"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Planning performance testing "
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/ab9ef08d-0955-45fb-a93c-305315268a42"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Hire a performance testing agent"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/593dc2f5-6543-44d0-bace-691f1b2ab18f"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Webcast: Preparing for PV"
            thumbnail="https://img2.storyblok.com/600x300/smart/f/52232/1000x500/82910ade17/events-webcast-generic.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://us02web.zoom.us/webinar/register/rec/WN_voAus4LAR-204XmoQ8J9hw?meetingId=TGWVtuUOA8DBdzcJUGhbCnTFI0ESRnMAUrQzDdzWo6Nt0nYtoVyMbwHg4QqZwxdE.hK_ZM8Wgru3BHr98&playId=7f36XNusjW3GhyeVIo-cXpvob7Gvdt8hnTlNwwGQl-Jw2kTMG4B8py5YYPEEXK3nIzJw5M1YzEPYhF0T.kkG4ijSRtjl7VVEd&action=play&_x_zm_rtaid=MKqbfZdZS8uoV9_cjML2GA.1619163695094.acdf2eedb05045922e2e399857a19a40&_x_zm_rhtaid=94"
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

    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Reviews" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Submit curative action plans"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/76b9890087/unnamed-1.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/a1b0c9c4-67de-4b71-9814-4ff51176e8bc"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>

          <WCardsBase
            heading="Submit documentation for review"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/974f7046-eb06-45e3-bd76-d5a4a043bc45"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Access your review report"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/d560201e-c3c4-4a10-97f1-864490f646df"
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

    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Award" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Celebrate your WELL Certification achievement"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/43da3f66-9f30-4821-b5c7-e08b2bd3b118"
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
    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour
          class="text-primary-600"
          heading="Provide annual reporting"
        />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Annual Reporting and recertification of WELL Certified spaces"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/9b79fdc8-6146-49b6-906f-5af3d0f8eb0d"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Complete recertification for your project"
            thumbnail="projects/v2/promotions/support-card.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/bb85a069-e332-4020-b8b7-d7bdb7953c82"
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
    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="COVID-19 Support" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Strategies from the WELL Building Standard to Support in the Fight Against COVID-19"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/bd0ce79714/strategiesfromwellv2.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/strategies-from-the-well-building-standard-to-support-in-the-fight-against-covid-19/"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="COVID-19 Training for Professionals"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/2400x1256/ee13cc4169/covidtraining-facebook_individuals_v3alt-2x.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/covid-19-training-for-professionals/"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="WELL Health-Safety Rating"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/2030x700/3181c2bc56/2.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://www.wellcertified.com/health-safety"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="WELL Health-Safety Feature Alignment Tool"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/c1e9c5643c/feature-alignment.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/well-health-safety-rating-feature-alignment-tool/"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Power of Place resources"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1733x1046/edf1acf5b7/stocksy_txpe6d6b6a9lfe200_medium_2586301-2.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://www.wellcertified.com/powerofplace/"
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
    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Guidebooks" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Certification Guidebook - WELL Building Standard"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/58868538f8/unnamed-1.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/e5afe220-850a-4bca-8e39-43c3efe7cee2"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Performance Verification Guidebook - WELL Building Standard"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/84dc2d5d6b/pv-tile.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/9a16fd61-95ca-438e-85cb-3f52524d99ad"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="WELL Health-Safety Rating Guidebook"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/2cf3d46d77/guidebook.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://well.support/f80cfae1-59a1-4e69-8e4c-36bfb7c537d8"
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
    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="Legal Forms" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Confirmation of Agent's Authority"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/e90e7bd5a2/resource-legal-form.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/confirmation-of-agent-s-authority/"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Change of Owner Agreement"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/e90e7bd5a2/resource-legal-form.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/gbci-change-of-owner-agreement/"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Confirmation of Primary Owner's Authority"
            thumbnail="https://img2.storyblok.com/1100x550/smart/f/52232/1000x500/e90e7bd5a2/resource-legal-form.png"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.wellcertified.com/tools/confirmation-of-primary-owners-authority/"
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
    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour
          class="text-primary-600"
          heading="Getting Started with WELL series"
        />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Introduction and Team Roles"
            :thumbnail="`${$config.legacyURL}static/images/resources/WelcometoWELLIntroduction.png`"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://watch.videodelivery.net/0c89bb8d715e1a968ced554920fae1ae"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Learning about the WELL Certification Process"
            :thumbnail="`${$config.legacyURL}static/images/resources/WelcometoWELLCertProcess.png`"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://watch.videodelivery.net/de19facf503e969cc730af02741ca6a3"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Understanding the WELL Digital Standard"
            :thumbnail="`${$config.legacyURL}static/images/resources/WelcometoWELL_WELLFeatures.png`"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://watch.videodelivery.net/709d22690e9cdd1701db72bdfac9104a"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Navigating the Project Dashboard"
            :thumbnail="`${$config.legacyURL}static/images/resources/WelcometoWELLProjectDashboard.png`"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://watch.videodelivery.net/bbff0e52e9cad39d56be4843875a713a"
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
    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="WELL Tutorials" />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-16 mt-8">
          <WCardsBase
            heading="Preparing WELL Documentation"
            :thumbnail="`${$config.legacyURL}static/images/resources/DocumentationPreparation.png`"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://watch.videodelivery.net/c156b40daf2be604d8bfd2d9f9456d13"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Explore
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Responding to Preliminary Review Comments"
            :thumbnail="`${$config.legacyURL}static/images/resources/RespondingtoReviewComments.png`"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://watch.videodelivery.net/c737694cc020cfc00e3e9e7dbe8c0061"
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
    <div class="w-full flex border-t mt-10 pt-10">
      <div div class="w-full">
        <WHeadingsHFour class="text-primary-600" heading="FAQs" />
        <div class="mt-8">
          <ul class="list-disc ml-7">
            <li>
              <WLinksBase
                link="http://resources.wellcertified.com/faqs"
                target="_blank"
              >
                http://resources.wellcertified.com/faqs
              </WLinksBase>
            </li>
          </ul>
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
      project: (state) => state.project.project,
    }),
  },
}
</script>
