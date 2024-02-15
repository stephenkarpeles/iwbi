<template>
  <div class="w-full flex flex-wrap">
    <div class="w-full md:flex">
      <div class="w-full lg:w-1/3 lg:pr-16">
        <WHeadingsHThree
          heading="Keep Learning"
          sub-heading="Access exclusive education to enhance your skills, knowledge and help you create WELL education that is personal and customizable for any audience."
        />
      </div>
      <div class="w-full lg:w-2/3">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 md:gap-y-16 my-10 md:my-0"
        >
          <WCardsBase
            heading="Telling the WELL Story"
            description="This four-module course will help you prepare a compelling and custom narrative to communicate about WELL with simplicity, clarity and meaning."
            thumbnail="well-faculty/dashboard/cards/keep-learning/story.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="/education-courses/telling-WELL-story"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Get Started
              </WLinksBase>
            </div>
          </WCardsBase>
          <WCardsBase
            heading="Webcasts"
            description="Access your onboarding module to find out more about the WELL Faculty program and learn alternatives to create engaging education sessions."
            thumbnail="well-faculty/dashboard/cards/keep-learning/webcasts.jpg"
          >
            <div class="mt-4">
              <WLinksBase
                link="https://resources.WELLcertified.com/webcasts/"
                target="_blank"
                icon="arrow-narrow-right"
                icon-position="right"
              >
                Access
              </WLinksBase>
            </div>
          </WCardsBase>
        </div>
      </div>
    </div>
  </div>
</template>
