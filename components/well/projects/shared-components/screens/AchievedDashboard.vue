<template>
  <div>
    <div v-if="project" class="flex">
      <div class="w-8/12">
        <div>
          <div class="flex">
            <h3 class="mt-4 text-2xl font-semibold text-primary-900">
              WELL Health-Safety Rating
            </h3>
          </div>
          <h6 class="text-lg font-semibold mt-8 ml-1 text-primary-900">
            {{
              recertificationList.length
                ? 'Renew your WELL Health-Safety Rating achievement!'
                : 'Congratulations on earning the WELL Health-Safety seal!'
            }}
          </h6>
          <p
            class="text-base font-normal ml-1 mt-4 mb-6 leading-6 text-primary-900 text-opacity-60"
          >
            {{
              recertificationList.length
                ? `We look forward to supporting you on your journey towards maintaining your WELL Health-Safety Rating goals. Check out below for a preview of what's ahead!`
                : `You&#8217;ve now joined a community of organizations pushing the
            boundaries of what health and safety look like in a post-COVID
            environment. Not only did you put in the work - you third-party
            verified your investment. it&#8217;s time to celebrate and
            communicate your accomplishments with your broader community and
            social network.`
            }}
          </p>
        </div>
        <div v-if="!recertificationList.length" class="ml-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16 pt-8">
            <div class="shadow border border-primary-300 rounded">
              <WCardsBase
                thumbnail="shared-workspace/promotional.png"
                class="shadow-none"
              >
                <div class="-mx-4 px-2 -mt-4">
                  <div>
                    <span
                      class="text-sm font-semibold text-secondary-600 uppercase"
                      >Activity</span
                    >
                    <p class="text-base font-semibold text-primary-900">
                      Communicate your accomplishment
                    </p>
                    <p
                      class="text-sm font-normal text-primary-900 text-opacity-50"
                    >
                      Leverage our expertly curated promotional materials, your
                      digital certificate and the official rating mark to share
                      the news with your community and celebrate this momentous
                      achievement.
                    </p>
                  </div>
                  <div class="mt-4">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        $router.push(
                          `/projects/${project.type}/${project.project_number}/promotions`
                        )
                      "
                    >
                      Explore promotional materials</WButtonsBase
                    >
                  </div>
                </div>
              </WCardsBase>
            </div>
            <div class="shadow rounded border border-primary-300">
              <WCardsBase
                thumbnail="shared-workspace/profile.png"
                class="shadow-none"
              >
                <div class="-mx-4 px-2 -mt-4">
                  <div>
                    <span
                      class="text-sm font-semibold text-secondary-600 uppercase"
                      >Activity</span
                    >
                    <p class="text-base font-semibold text-primary-900">
                      Update your organizational profile
                    </p>
                    <p
                      class="text-sm font-normal text-primary-900 text-opacity-50"
                    >
                      Take a quick look back at the profile you created upon
                      enrollment to ensure it&#8217;s up-to-date. Upload photos
                      to help showcase your efforts to those who may not be able
                      to visit your space in-person
                    </p>
                  </div>
                  <div class="mt-4">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        $router.push(
                          `/projects/${project.type}/${project.project_number}/profile`
                        )
                      "
                      >Update your profile</WButtonsBase
                    >
                  </div>
                </div>
              </WCardsBase>
            </div>
          </div>
        </div>
        <div class="ml-1">
          <h4 class="text-lg font-semibold mt-4 mb-1 text-primary-900">
            RESOURCES
          </h4>
          <hr />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16 pt-8">
            <WCardsBase
              thumbnail="shared-workspace/Driving-better-investment-decisions.png"
              class="shadow-none"
            >
              <div class="-mx-4">
                <div>
                  <span
                    class="text-sm font-semibold text-primary-900 text-opacity-50"
                    >{{ $dayjs('Mar 16,2020').format('MMM DD, YYYY') }}</span
                  >
                  <p class="text-base font-semibold text-primary-900">
                    Driving better investment decisions
                  </p>
                  <p
                    class="text-sm font-normal text-primary-900 text-opacity-50"
                  >
                    Learn how WELL is strengthening investment strategy by
                    driving organizational excellence and supporting ESG
                    performance.
                  </p>
                  <a
                    href="https://resources.wellcertified.com/tools/driving-better-investment-decisions/"
                    target="_blank"
                    class="text-sm font-normal text-primary-600"
                    >See More</a
                  >
                </div>
              </div>
            </WCardsBase>

            <WCardsBase
              thumbnail="shared-workspace/guidebook.png"
              class="shadow-none"
            >
              <div class="-mx-4">
                <div>
                  <span
                    class="text-sm font-semibold text-primary-900 text-opacity-50"
                    >{{ $dayjs('Oct 14,2020').format('MMM DD, YYYY') }}</span
                  >
                  <p class="text-base font-semibold text-primary-900">
                    WELL Health-Safety Rating Guidebook
                  </p>
                  <p
                    class="text-sm font-normal text-primary-900 text-opacity-50"
                  >
                    A step-by-step guide to implementing and achieving the WELL
                    Health-Safety Rating. Versions: Q2 2020 - Q4 2020
                  </p>
                  <a
                    href="https://a.storyblok.com/f/52232/x/0da851f648/well-health-safety-rating-guidebook-0630.pdf"
                    target="_blank"
                    class="text-sm font-normal text-primary-600"
                    >See More</a
                  >
                </div>
              </div>
            </WCardsBase>
          </div>
        </div>
      </div>
      <div class="w-4/12 mt-5 ml-4">
        <div class="text-center w-56 mx-auto mb-5">
          <img
            src="/shared-workspace/Health-Safety_QR-8in-ALL-01.png"
            alt="hsr-seal"
          />
        </div>
        <div>
          <div class="px-4 mb-4">
            <div class="border-2 border-primary-300 text-center rounded py-2">
              <span class="text-sm font-semibold text-primary-900 text-center"
                >Your
                {{
                  recertificationList.filter(
                    (a) => a.type == 'v2-hsr' && a.date_certified
                  ).length
                    ? 'renewed'
                    : ''
                }}
                WELL Health-Safety rating seal is valid<br />from
                {{ expiresFrom }}
                to
                {{ expiresTo }}</span
              ><br
                v-if="
                  recertificationList.filter(
                    (a) => a.type == 'v2-hsr' && a.date_certified
                  ).length
                "
              />
              <span
                v-if="
                  recertificationList.filter(
                    (a) => a.type == 'v2-hsr' && a.date_certified
                  ).length
                "
                class="text-sm font-semibold text-primary-900 text-center"
                >Past achievements:<br
                  v-if="
                    recertificationList.filter(
                      (a) => a.type == 'v2-hsr' && a.date_certified
                    ).length
                  "
                />
                {{ $dayjs(project.hsr_achieved_date).format('MMM DD,YYYY') }}
                to
                {{
                  $dayjs(project.hsr_achieved_date)
                    .add(1, 'year')
                    .format('MMM DD,YYYY')
                }}
              </span>
            </div>
            <div class="mt-4 mb-2">
              <WButtonsBase
                type="primaryInverted"
                @click.native="
                  $router.push(
                    `/projects/${project.type}/${project.project_number}/hsr-checklist`
                  )
                "
                >{{
                  recertification
                    ? 'Access your renewal checklist'
                    : 'Access your WELL Health-Safety checklist'
                }}</WButtonsBase
              >
            </div>
            <div class="mt-4 mb-2">
              <WButtonsBase
                v-if="renewDate"
                type="primaryInverted"
                @click.native="
                  $router.push(
                    `/projects/${project.type}/${project.project_number}/hsr-recertification`
                  )
                "
                >Renew now</WButtonsBase
              >
            </div>
            <div class="mt-8 px-4 py-4 mb-4 border-2 rounded-md">
              <span class="text-sm font-semibold text-primary-600"
                >GETTING STARTED</span
              >
              <h6 class="text-lg font-semibold text-primary-900">
                Complete your checklist
              </h6>
              <p class="text-sm font-normal text-primary-900 text-opacity-50">
                Here are a few recommended tasks to begin your WELL
                Health-Safety Rating:
              </p>

              <hr class="mx-4" />
              <div class="mt-4 px-3 space-y-4">
                <WLinksBase
                  :link="`https://a.storyblok.com/f/52232/x/0da851f648/well-health-safety-rating-guidebook-0630.pdf`"
                  target="_blank"
                  type="blank"
                  class="flex text-base font-semibold text-primary-600"
                >
                  <div class="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      if="svgComponent"
                      class="mx-1 w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <div class="text-primary-900 ml-2">
                      Review program guidebook
                    </div>
                  </div>
                  <p
                    class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
                  >
                    Learn about how strategies must be applied in order to earn
                    your WELL Health-Safety Rating
                  </p>
                </WLinksBase>

                <WLinksBase
                  :link="`/projects/${project.type}/${project.project_number}/promotions`"
                  type="blank"
                  class="flex text-base font-semibold text-primary-600"
                >
                  <div class="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      if="svgComponent"
                      class="mx-1 w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <div class="text-primary-900 ml-2">
                      Plan press or messaging
                    </div>
                  </div>
                  <p
                    class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
                  >
                    Utilize our PR Guidelines, IWBI Brand Guide and sample
                    promotional materials, included in your enrollment
                  </p>
                </WLinksBase>

                <WLinksBase
                  target="_blank"
                  :link="'https://cdn.wellcertified.com/resources/health-safety/WELL-health-safety-rating-locations-sqft.xlsm'"
                  type="blank"
                  class="flex text-base font-semibold text-primary-600"
                >
                  <div class="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      if="svgComponent"
                      class="mx-1 w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <div class="text-primary-900 ml-2">
                      Compile location details
                    </div>
                  </div>
                  <p
                    class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
                  >
                    Prior to submitting for review, we’ll need to know a bit
                    more about each location in order to determine compliance
                  </p>
                </WLinksBase>

                <WLinksBase
                  type="blank"
                  class="flex text-base font-semibold text-primary-600"
                  @click.native="
                    $store.commit('settings/setSidebarTab', 'Team')
                  "
                >
                  <div class="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      if="svgComponent"
                      class="mx-1 w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <div class="text-primary-900 ml-2">
                      Build your team roster
                    </div>
                  </div>
                  <p
                    class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
                  >
                    Inviting collaborators to your team now can ensure they’re
                    ready to work on the checklist together after launch.
                  </p>
                </WLinksBase>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Dashboard...</div>
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
      recertificationList: (state) => state.recertification.recertificationList,
      currentUser: (state) => state.user.currentUser,
    }),
    achieveDate() {
      if (this.recertificationList && this.recertificationList.length) {
        const recert = this.recertificationList.filter((a) => a.date_certified)
        if (recert.length) {
          return recert[recert.length - 1].date_certified
        } else {
          return this.project.hsr_achieved_date
        }
      } else {
        return this.project.hsr_achieved_date
      }
    },
    expiresFrom() {
      return this.$dayjs(this.achieveDate).format('MMM DD, YYYY')
    },
    expiresTo() {
      return this.$dayjs(this.achieveDate).add(1, 'year').format('MMM DD, YYYY')
    },
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    checklist() {
      return this.project.hsr_scorecard_id
    },
    accessLevel() {
      if (this.currentUser.role.includes('well-admin')) {
        return 'well-admin'
      }
      if (this.project && this.project.members) {
        return this.project.members.filter(
          (member) => member.id === this.currentUser.id
        ).length
          ? this.project.members.find(
              (member) => member.id === this.currentUser.id
            ).pivot.role
          : false
      }
      return false
    },
    renewDate() {
      if (
        this.accessLevel !== 'project-admin' &&
        this.accessLevel !== 'project-manager' &&
        this.accessLevel !== 'well-admin'
      ) {
        return false
      }
      if (!this.project.hsr_achieved_date) return false

      const lastRecertification = this.recertificationList.length
        ? this.recertificationList[this.recertificationList.length - 1]
        : ''
      let recertExpirationDate = ''

      if (lastRecertification) {
        if (!lastRecertification.date_certified) return false

        if (lastRecertification.date_certified)
          recertExpirationDate = this.$dayjs(lastRecertification.date_certified)
        else recertExpirationDate = this.$dayjs(this.project.hsr_achieved_date)
      } else {
        recertExpirationDate = this.$dayjs(this.project.hsr_achieved_date)
      }

      const today = this.$dayjs()
      return today.diff(recertExpirationDate, 'months', true) >= 3
    },
    recertificationPaymentStatus() {
      const recertifiction = []
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction.push(this.recertificationList[lastRecertifiction])
      } else {
        recertifiction.push('')
      }
      return recertifiction
    },
  },
}
</script>
