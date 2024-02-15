<template>
  <div>
    <div>
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="Membership" />
      </NavBreadcrumbs>
      <div class="relative bg-white rounded-lg shadow-md">
        <div class="lg:absolute lg:inset-0">
          <!-- eslint-disable-next-line prettier/prettier -->
          <div
            class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
            style="
              background: linear-gradient(
                359.89deg,
                #f4f9fb 0.11%,
                #ffffff 173.12%
              );
            "
          ></div>
        </div>
        <div
          class="
            relative
            pt-12
            pb-16
            px-4
            sm:pt-16 sm:px-6
            lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2
            border
            rounded-md
          "
        >
          <div class="lg:pr-8">
            <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
              <ClientOnly>
                <WHeadingsHTwo heading="About">
                  <div class="mt-3 text-base leading-6 text-gray-500">
                    The member program at the International WELL Building
                    Institute™ (IWBI™) is a means of convening, celebrating and
                    collaborating with companies and organizations who are
                    actively supporting and driving forward the mission to
                    advance human health in buildings and communities around the
                    world. We are excited to roll out this collaborative
                    platform to drive forward meaningful change: the strength of
                    this movement grows when we stand shoulder to shoulder,
                    align our passions and work together toward global
                    transformation.
                  </div>
                </WHeadingsHTwo>
                <WStepsVertical
                  :steps="[
                    {
                      name: 'SUBSCRIBE',
                      status: registeredStatus,
                      link: '/membership/register',
                    },
                    {
                      name: 'CONFIRMATION',
                      description: 'Review your subscription details.',
                      status: registeredStatus ? 'complete' : '',
                      link: registeredStatus ? '/membership/confirmation' : '#',
                    },
                    {
                      name: 'PAYMENT',
                      status: registeredStatus ? 'current' : '',
                      link: '#',
                    },
                    {
                      name: 'INFORMATION',
                      status: '',
                      link: '#',
                    },
                  ]"
                />
                <WButtonsBase @click.native="gotoNextStep()">
                  Continue
                </WButtonsBase>
              </ClientOnly>
            </div>
          </div>
          <div class="ml-8 shadow-md p-8 rounded-lg border border-primary-200">
            <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
              <div class="text-center border-b-2 pb-3 border-primary-200">
                <img
                  v-if="membership.type === 'Cornerstone'"
                  class="mx-auto"
                  :src="$config.assetsURL + 'membership/cornerstone-logo.png'"
                />
                <img
                  v-else
                  class="mx-auto"
                  :src="$config.assetsURL + 'membership/member-logo.png'"
                />
                <WHeadingsHThree :heading="membership.type" />
              </div>
              <div class="px-14 my-6">
                <WHeadingsHFour heading="Benefits" />
                <ul
                  v-if="membership.type === 'Cornerstone'"
                  class="list-disc ml-5 space-y-5"
                >
                  <li>
                    15% Discount on the WELL Health-Safety Rating [limited time
                    only]
                  </li>
                  <li>
                    2.5% Discount on WELL registration, precertification,
                    documentation review & recertification fees
                  </li>
                  <li>
                    15% Discount on WELL Performance Testing Agent training fees
                  </li>
                  <li>
                    15% Discount on all WELL AP products and fees (excluding
                    renewal fee)
                  </li>
                  <li>
                    One WELL Faculty annual fee waiver, plus save 15% on
                    additional faculty fees
                  </li>
                  <li>
                    One free pass to The WELL Conference and save 25% on
                    additional passes
                  </li>

                  <li>
                    Showcase your commitment to health and wellness with the
                    IWBI membership mark
                  </li>
                  <li>
                    Highlight your company’s achievements in the IWBI member
                    directory
                  </li>
                  <li>
                    Submit content to share on IWBI’s social media network
                  </li>
                  <li>
                    Hear from the experts about how to create an impactful and
                    engaging WELL presentation
                  </li>
                  <li>
                    Connect with other IWBI members on our premier community
                    engagement platform *coming soon
                  </li>
                  <li>Attend the annual IWBI membership meeting</li>
                  <li>
                    Receive an invite to a pre-scheduled "Intro to WELL"
                    presentation
                  </li>
                </ul>
                <ul v-else class="list-disc ml-5 space-y-5">
                  <li>
                    25% Discount on the WELL Health-Safety Rating [limited time
                    only]
                  </li>
                  <li>
                    7.5% Discount on all WELL registration, WELL
                    Precertification, and recertification review fees
                  </li>
                  <li>
                    30% Discount on WELL Performance Testing Agent training fees
                  </li>
                  <li>
                    30% Discount on all WELL AP products and fees (excluding
                    renewal fee)
                  </li>
                  <li>
                    Three WELL Faculty annual fee waivers, plus save 30% on any
                    additional faculty fees
                  </li>
                  <li>
                    Three free passes to The WELL Conference and save 30% on
                    additional passes
                  </li>
                  <li>
                    Access to priority customer service for technical questions
                    as well as guidance on WELL and other initiatives
                  </li>
                  <li>
                    Showcase your commitment to health and wellness with the
                    IWBI membership mark
                  </li>
                  <li>
                    Highlight your company’s achievements in the IWBI member
                    directory
                  </li>
                  <li>
                    Submit content to share on IWBI’s social media network
                  </li>
                  <li>
                    Hear from the experts about how to create an impactful and
                    engaging WELL presentation
                  </li>
                  <li>Sponsor an annual IWBI newsletter or webcast</li>
                  <li>Publish a spotlight article on IWBI’s website</li>
                  <li>
                    Connect with other IWBI members on our premier community
                    engagement platform *coming soon
                  </li>
                  <li>
                    Additionally, receive an exclusive invitation to our CEO
                    reception.
                  </li>
                  <li>
                    Opportunity to schedule an "Intro to WELL" or "Why WELL"
                    presentation by an IWBI team member with an audience of your
                    choosing
                  </li>
                  <li>
                    Feature your organization’s name and logo at events that the
                    IWBI team hosts, sponsors or attends
                  </li>
                </ul>
              </div>
              <div class="text-center border-t-2 pt-3 border-primary-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  async asyncData({ store, redirect }) {
    await Promise.all([store.dispatch('membership/getMembership')])

    if (Object.keys(store.state.membership.membership).length === 0) {
      redirect('/membership/pricing')
    }

    if (
      store.state.user.currentUser.membership_id !== false ||
      store.state.membership.membership.created_at
    ) {
      redirect('/membership/dashboard')
    }

    return {
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `Membership`,
    }
  },
  computed: {
    ...mapState({
      membership: (state) => state.membership.membership,
    }),
    registeredStatus() {
      if (Object.keys(this.membership).length !== 0) {
        return 'complete'
      }
      return 'current'
    },
  },
  methods: {
    gotoNextStep() {
      if (this.registeredStatus !== 'complete') {
        this.$router.push('/membership/register')
      } else {
        this.$router.push('/membership/confirmation')
      }
    },
  },
}
</script>
