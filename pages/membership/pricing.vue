<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <WHeadingsHTwo heading="Membership" />
        </NavBreadcrumbs>
        <!-- eslint-disable-next-line prettier/prettier -->
        <div class="relative p-14 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg" style="background: linear-gradient(265.18deg, #17353F 34.43%, #32748A 179.13%);">
          <img
            class="absolute bottom-0 opacity-50 right-0"
            :src="$config.assetsURL + 'membership/pricing/logo.png'"
          />
          <div class="font-light text-gray-300 mb-5">MEMBERSHIP AT IWBI</div>
          <WHeadingsHOne
            class="text-white max-w-xl space-y-8"
            heading="Join Us"
            sub-heading="The member program at the International WELL Building Institute™ (IWBI™) is a means of convening, celebrating and collaborating with companies and organizations who are actively supporting and driving forward the mission to advance human health in buildings and communities around the world. We are excited to roll out this collaborative platform to drive forward meaningful change: the strength of this movement grows when we stand shoulder to shoulder, align our passions and work together toward global transformation."
          />
          <div class="space-x-5 flex">
            <div class="w-32">
              <a href="#plans">
                <WButtonsBase type="primary"> Start Enrollment </WButtonsBase>
              </a>
            </div>
            <div class="w-32">
              <WLinksBase
                target="_blank"
                link="https://www.wellcertified.com/membership"
              >
                <WButtonsBase type="primaryInverted">
                  + Learn More
                </WButtonsBase>
              </WLinksBase>
            </div>
          </div>
        </div>

        <div class="text-center my-5 text-gray-500 font-medium">
          We are pleased to offer the following benefits associated with two
          tiers of memberships:
        </div>

        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="shadow overflow-hidden border-b border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        class="px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
                      >
                        Benefits
                      </th>
                      <th
                        v-for="membershipType in membershipTypes"
                        :key="membershipType.id"
                        class="px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
                      >
                        <div
                          class="tx-20 tx-normal"
                          style="text-transform: capitalize"
                        >
                          {{ membershipType.name }}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(benefit, index) in membershipBenefits"
                      :key="index"
                    >
                      <td
                        :class="{ 'bg-primary-100': index % 2 }"
                        class="px-6 py-4 text-sm leading-5 font-medium text-gray-900"
                        style="width: 40rem"
                        v-html="benefit.desc"
                      ></td>
                      <td
                        :class="{ 'bg-primary-100': index % 2 }"
                        class="px-6 py-4 text-sm leading-5 text-gray-500"
                        v-html="
                          getTextforBenefit(benefit, membershipTypes[0].id)
                        "
                      ></td>
                      <td
                        :class="{ 'bg-primary-100': index % 2 }"
                        class="px-6 py-4 text-sm leading-5 text-gray-500"
                        v-html="
                          getTextforBenefit(benefit, membershipTypes[1].id)
                        "
                      ></td>
                      <td
                        :class="{ 'bg-primary-100': index % 2 }"
                        class="px-6 py-4 text-sm leading-5 text-gray-500"
                        v-html="
                          getTextforBenefit(benefit, membershipTypes[2].id)
                        "
                      ></td>
                    </tr>
                    <tr id="plans">
                      <td class="px-6 py-4 text-sm leading-5 text-gray-500">
                        If you have any questions, please contact us at
                        membership@wellcertified.com.
                      </td>
                      <td
                        v-for="membershipType in membershipTypes"
                        :key="membershipType.id"
                        class="px-6 py-4 text-sm leading-5 w-48 text-gray-500"
                      >
                        <div v-if="membershipType.name !== 'Portfolio'">
                          <span class="text-2xl text-primary-900 font-black">
                            ${{ membershipType.fee }}
                          </span>
                          <span>/year</span>
                        </div>
                        <div v-else class="text-center">
                          <span class="">
                            Included in WELL Portfolio program
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="!currentUser.member_type">
                      <td></td>
                      <td
                        v-for="membershipType in membershipTypes"
                        :key="membershipType.id"
                        class="px-6 py-4"
                      >
                        <WButtonsBase
                          v-if="membershipType.name !== 'Portfolio'"
                          @click.native="
                            $router.push(
                              '/membership/register/' + membershipType.id
                            )
                          "
                        >
                          Subscribe
                        </WButtonsBase>
                        <WLinksBase
                          v-else
                          target="_blank"
                          link="https://www.wellcertified.com/portfolio"
                        >
                          <WButtonsBase type="primaryInverted">
                            Learn More
                          </WButtonsBase>
                        </WLinksBase>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white">
          <div
            class="max-w-screen-xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8"
          >
            <h2 class="text-3xl leading-9 font-extrabold text-gray-900">
              Frequently asked questions
            </h2>

            <div class="mt-6 border-t border-gray-200 pt-10">
              <dl
                class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:grid-rows-2 md:col-gap-8 md:row-gap-12 gap-7"
              >
                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    What is the IWBI member program?
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    The member program at the International WELL Building
                    Institute (IWBI) is how we are convening, celebrating and
                    collaborating with companies and organizations who are
                    leading the movement to advance human health in buildings
                    and communities around the world.
                  </dd>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    With the membership discount, do members get additional
                    discounts on WELL AP study materials after they register for
                    the WELL AP exam?
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    The discount exclusively applies to the WELL AP exam only
                    and self-guided bundles.
                  </dd>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    How long is membership active? Is it on a calendar year
                    cycle?
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    Membership is active for one year following the date
                    membership payment is made. Therefore, the payment for the
                    next year of membership would be due on that same date each
                    year. For example, if membership payment was made on
                    4/28/2019, membership would be active until 4/28/2020.
                  </dd>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    Will my member mark indicate what tier of membership my
                    organization has?
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    No, the member mark is general and does not distinguish
                    between Cornerstone and Keystone membership. Members can
                    indicate their level through text in their marketing
                    materials in accordance with the PR and brand guidelines.
                  </dd>
                </div>

                <div class="space-y-2">
                  <dt class="text-lg leading-6 font-black text-gray-900">
                    As a Keystone member, how many times per year am I permitted
                    to develop and submit original content to be published on
                    the IWBI website?
                  </dt>
                  <dd class="text-base leading-6 text-gray-500">
                    Keystone members can develop and submit original content for
                    IWBI's review and potential publication on IWBI’s website
                    once per year of membership.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, redirect, $axios }) {
    let membershipTypes
    let membershipBenefits

    await Promise.all([
      $axios.get('api/membership/list').then((response) => {
        membershipTypes = response.data.memberships
        membershipBenefits = response.data.benefits
      }),
    ])

    return {
      currentUser: store.state.user.currentUser,
      membershipTypes,
      membershipBenefits,
    }
  },
  computed: {
    registeredStatus() {
      return 'current'
    },
  },
  methods: {
    getTextforBenefit(benefit, membershipId) {
      const applicableBenefits = benefit.membership_benefits.filter(function (
        e
      ) {
        return e.membership_id === membershipId
      })[0]
      if (
        applicableBenefits.discount_percentage !== null ||
        applicableBenefits.discount_percentage > 0
      ) {
        return applicableBenefits.discount_percentage + '%'
      } else if (applicableBenefits.is_available) {
        let responseStr = '✔'
        if (applicableBenefits.available_text !== null) {
          responseStr += ' ' + applicableBenefits.available_text
        }
        return responseStr
      }
      return ''
    },
  },
  head() {
    return {
      title: `Membership Pricing`,
    }
  },
}
</script>
