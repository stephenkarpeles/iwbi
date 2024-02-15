<template>
  <div class="container mx-auto" style="max-width: 1024px">
    <NavBreadcrumbs>
      <WHeadingsHTwo
        class="text-primary-900 mt-10"
        heading="WELL Health-Safety Pricing Estimator"
      />
    </NavBreadcrumbs>
    <div class="flex flex-wrap items-stretch mt-8">
      <div
        class="text-sm w-full md:w-7/12 bg-cover flex border-blue-100 border rounded px-8 pb-12 shadow-md"
      >
        <FormulateForm @validation="validate" @submit="submitHandler">
          <div class="mt-5 text-gray-700">
            <Flyout
              :show-triangle="false"
              y="bottom"
              x="right"
              :additional-classes="'mt-3'"
            >
              <span class="text-primary-500 font-bold text-sm"
                >Number of locations
              </span>
              <template #content>
                <ModalsHoverPopup>
                  <template #title>Number of locations</template>
                  <template #description>
                    The total number of locations that will be submitted for
                    review as part of a single application. Must share an owner
                    to be considered part of the same application.</template
                  >
                  <template #focusText
                    >Price reductions apply to multi-location
                    applications.</template
                  >
                  <template #additionalOption></template>
                </ModalsHoverPopup>
              </template>
            </Flyout>
            being submitted under same ownership:
            <div class="mt-4 w-28">
              <FormulateInput
                id="locations"
                v-model="form.locations"
                :input-class="
                  (context, classes) => [
                    'text-center h-10 text-primary-700 appearance-none w-full px-3 py-2 border border-primary-300 rounded-md placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5',
                  ]
                "
                type="text"
                validation="required"
                min="1"
              />
            </div>
            <div class="mt-10 relative">
              <label
                for="small"
                class="text-sm block font-medium text-gray-700 mt-px"
              >
                Is your organization a
                <Flyout
                  :show-triangle="false"
                  y="top"
                  x="right"
                  :additional-classes="'-mt-3'"
                >
                  <span class="font-bold text-sm text-primary-500">
                    small business
                  </span>
                  ?
                  <template #content>
                    <ModalsHoverPopup>
                      <template #title>Small Business</template>
                      <template #description>
                        Companies with less than 50 employees and less than $10
                        million in annual revenue.</template
                      >
                      <template #focusText>
                        Eligible for 35% price reduction.*
                      </template>
                      <template #additionalOption>
                        <p class="mt-5">
                          <sup>*</sup>
                          Can not be combined with sector and market reductions
                        </p>
                      </template>
                    </ModalsHoverPopup>
                  </template>
                </Flyout>
              </label>
              <div class="mt-4">
                <FormulateInput
                  id="small"
                  v-model="form.small"
                  :element-class="
                    (context, classes) =>
                      ['text-sm flex space-x-8'].concat(classes)
                  "
                  :options="confirmOptions"
                  type="radio"
                />
              </div>
            </div>

            <div
              v-if="sectorsOptions"
              class="mt-10 text-sm block font-medium relative text-gray-700"
            >
              Are your locations serving any of the
              <Flyout
                :show-triangle="false"
                y="top"
                x="right"
                :additional-classes="'-mt-3'"
              >
                <span class="font-bold text-sm text-primary-500">
                  sectors
                </span>
                <template #content>
                  <ModalsHoverPopup>
                    <template #title>Sector Pricing</template>
                    <template #description>
                      IWBI offers a discount for projects in sectors that serve
                      the social good. Projects in these sectors are eligible
                      for a
                      <span class="text-sm text-primary-400">
                        35% price reduction.<sup>*</sup>
                      </span>
                    </template>
                    <template #additionalOption>
                      <p class="mt-5">
                        <sup>*</sup>
                        Can not be combined with small business and market
                        reductions
                      </p>
                    </template>
                  </ModalsHoverPopup>
                </template>
              </Flyout>
              below?
              <div class="mt-4">
                <div class="relative mt-0.5">
                  <div class="mt-3 inline-flex rounded-md sm:mt-0">
                    <div
                      class="w-full relative flex text-left hover:cursor-pointer"
                    >
                      <input
                        v-model="form.sectors"
                        value=""
                        type="radio"
                        name="sectors"
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-primary-300"
                      />
                      <span class="ml-4 font-medium text-sm text-primary-700">
                        None
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  v-for="(item, key) in sectorsOptions"
                  :key="item"
                  class="relative mt-0.5"
                >
                  <Flyout
                    :show-triangle="false"
                    y="top"
                    x="right"
                    :additional-classes="'-mt-3 ml-16'"
                  >
                    <input
                      v-model="form.sectors"
                      :value="key"
                      type="radio"
                      name="sectors"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-primary-300"
                    />
                    <span
                      class="ml-4 font-medium text-sm text-primary-700"
                      for=""
                      >{{ item }}</span
                    >
                    <template #content>
                      <ModalsHoverPopup>
                        <template
                          v-if="radioPopups[key] && radioPopups[key].title"
                          #title
                          >{{ radioPopups[key].title }}</template
                        >
                        <template
                          v-if="
                            radioPopups[key] && radioPopups[key].description
                          "
                          #description
                        >
                          {{ radioPopups[key].description }}</template
                        >
                        <template
                          v-if="radioPopups[key] && radioPopups[key].focusText"
                          #focusText
                          >{{ radioPopups[key].focusText }}</template
                        >
                        <template
                          v-if="
                            radioPopups[key] &&
                            radioPopups[key].additionalOption
                          "
                          #additionalOption
                          >{{ radioPopups[key].additionalOption }}</template
                        >
                      </ModalsHoverPopup>
                    </template>
                  </Flyout>
                </div>
              </div>
            </div>
            <div class="mt-10">
              <label for="emerging" class="text-sm font-medium text-gray-700">
                Are your locations predominantly located in one of these
              </label>
              <Flyout
                :show-triangle="false"
                y="top"
                x="right"
                :additional-classes="'-mt-3'"
              >
                <span class="font-bold text-sm text-primary-500"
                  >emerging markets</span
                >
                <span class="block text-sm font-medium text-gray-700">?</span>
                <template #content>
                  <ModalsHoverPopup>
                    <template #title>Emerging Markets</template>
                    <template #description>
                      IWBI offers a discount for projects from organizations
                      headquartered in countries in the World Bank “low” and
                      “lower-middle” income groups per a 2016 analysis. These
                      projects are eligible for a
                      <span class="text-sm text-primary-400">
                        35% price reduction.<sup>*</sup>
                      </span>
                    </template>
                    <template #additionalOption>
                      <p class="mt-5">
                        <sup>*</sup>
                        Can not be combined with small business and sector
                        reductions
                      </p>
                    </template>
                  </ModalsHoverPopup>
                </template>
              </Flyout>

              <div class="mt-3">
                <FormulateInput
                  id="emerging"
                  v-model="form.emerging"
                  :options="formData.countries"
                  type="select"
                  :element-class="
                    (context, classes) => ['w-80'].concat(classes)
                  "
                  :input-class="
                    (context, classes) => [
                      'rounded border-primary-300 text-primary-700 form-select relative block w-full mb-4 bg-transparent focus:z-10 transition ease-in-out duration-150 text-sm sm:leading-5',
                    ]
                  "
                />
              </div>
            </div>

            <div class="mt-10">
              <label
                for="iwbi"
                class="relative block text-sm font-medium text-gray-700"
              >
                Is your organization or consultant an
                <Flyout
                  :show-triangle="false"
                  y="top"
                  x="right"
                  :additional-classes="'-mt-3'"
                >
                  <span class="font-bold text-sm text-primary-500">
                    IWBI Member
                  </span>
                  <template #content>
                    <ModalsHoverPopup>
                      <template #title>IWBI Membership</template>
                      <template #description>
                        <p>
                          IWBI Members are eligible for additional discounts on
                          the WELL Ratings, up to 25%.
                        </p>
                        <p>
                          For WELL Portfolio Members, projects that are a part
                          of your existing Portfolio can enroll into the WELL
                          Ratings free of charge. For other projects, a 25%
                          discount applies.
                        </p>
                      </template>
                    </ModalsHoverPopup>
                  </template>
                </Flyout>
                ?
              </label>
              <div class="mt-2">
                <FormulateInput
                  id="iwbi"
                  v-model="form.membership"
                  :options="membershipTypeOptions"
                  type="radio"
                  :input-class="
                    (context, classes) => ['mb-1.5 text-sm'].concat(classes)
                  "
                />
              </div>
            </div>
          </div>
          <div v-if="form.locations == 1" class="mt-10">
            <label
              for="previously"
              class="text-sm block w-full font-medium text-gray-700 mt-px"
            >
              Has your location previously earned WELL Certification?
            </label>
            <div class="mt-4 w-full">
              <FormulateInput
                id="previously"
                v-model="previously"
                :element-class="
                  (context, classes) =>
                    ['text-sm flex space-x-8'].concat(classes)
                "
                :options="confirmOptions"
                type="radio"
              />
            </div>
          </div>

          <div class="mt-10">
            <label
              for="enroll"
              class="text-sm block w-full font-medium text-gray-700 mt-px"
            >
              Are your locations enrolled as part of a WELL Portfolio or
              pursuing WELL Certification?
            </label>
            <div class="mt-4 w-full">
              <FormulateInput
                id="enroll"
                v-model="locationsEnrolled"
                :element-class="
                  (context, classes) =>
                    ['text-sm flex space-x-8'].concat(classes)
                "
                :options="confirmOptions"
                type="radio"
              />
            </div>
          </div>
          <button ref="submitBtn" class="hidden">Submit</button>
        </FormulateForm>
      </div>
      <div class="w-full flex-1 bg-blue-lightest text-center mt-10 md:mt-0">
        <div
          class="rounded-md bg-primary-100 border-primary-800 border border-primary-300 min-h-full pb-8 md:ml-4"
        >
          <p class="mt-20">
            <span class="text-sm font-light opacity-50">
              Price per location:
            </span>
          </p>
          <div class="min-h-[11rem]">
            <transition-group
              enter-active-class="transition-all  duration-500"
              leave-active-class="transition-all  duration-200"
              enter-class="opacity-0"
              enter-to-class="opacity-100"
              leave-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <p :key="1" class="min-h-[3.25rem]">
                <span v-if="pricePerLocation" class="text-5xl text-primary-900">
                  {{
                    $options.filters
                      .currencyUSA(pricePerLocation)
                      .includes('.00')
                      ? $options.filters
                          .currencyUSA(pricePerLocation)
                          .split('.00')[0]
                      : $options.filters.currencyUSA(pricePerLocation)
                  }}
                </span>
                <span v-else class="text-5xl font-extrabold text-black">
                  $0
                </span>
                <span
                  v-if="
                    totalPrice &&
                    Number(form.locations.replace(',', '')) > 400 &&
                    Number(form.locations.replace(',', '')) < 10001
                  "
                  class="text-sm text-center opacity-50 font-light"
                >
                  <br />compared to base price of $4,200 per location
                </span>
              </p>
              <p :key="2" class="mt-6 min-h-[3.25rem]">
                <span class="">
                  <span class="text-black opacity-50 text-sm">
                    Total Price for
                  </span>
                  <span class="text-primary-700 font-bold text-sm">
                    {{ calculator.countLocations | formatNumber }}
                  </span>
                  <span class="opacity-50 text-sm">
                    location{{ hasMoreThanOneLocation ? 's' : '' }}</span
                  >

                  <div
                    v-if="
                      Number(form.locations.replace(',', '')) > 400 &&
                      Number(form.locations.replace(',', '')) < 10001
                    "
                    class="w-8 inline"
                  >
                    <Flyout
                      :show-triangle="false"
                      y="top"
                      x="right"
                      :additional-classes="'-mt-3'"
                    >
                      <WIconsBase
                        type="secondary"
                        icon="information-circle-small"
                        class="text-white"
                      />

                      <template #content>
                        <ModalsHoverPopup>
                          <template #title>Additional Ways to Save</template>
                          <template #description>
                            Enrolling 401+ locations makes you eligible for our
                            pricing cap, so there’s no cost for additional
                            locations.
                          </template>
                          <template #additionalOption>
                            <p class="mt-5">
                              For other ways of maximizing your total savings
                              and your impact with WELL, please contact our team
                              to discuss your specific goals.
                            </p>
                          </template>
                        </ModalsHoverPopup>
                      </template>
                    </Flyout>
                  </div>
                  <br />
                  <span
                    v-if="totalPrice"
                    class="text-center text-primary-900 font-bold text-2xl"
                  >
                    {{
                      $options.filters.currencyUSA(totalPrice).includes('.00')
                        ? $options.filters
                            .currencyUSA(totalPrice)
                            .split('.00')[0]
                        : $options.filters.currencyUSA(totalPrice)
                    }}
                  </span>
                  <span
                    v-else
                    class="text-center text-primary-000 font-bold text-2xl"
                    >$0
                  </span>
                </span>
              </p>

              <p :key="4" class="mt-4 min-h-[1.25rem]">
                <template v-if="locationsEnrolled && locationsEnrolled == 0">
                  <span class="block text-sm text-gray-500 px-8">
                    Fees may be waived if submitted alongside other
                    documentation reviews. See if
                    <a
                      class="font-bold text-primary-400"
                      href="https://www.wellcertified.com/portfolio/"
                    >
                      WELL Portfolio
                    </a>
                    may be right for you.
                  </span>
                </template>
                <span
                  v-if="
                    locationsEnrolled !== 0 &&
                    totalSaving !== null &&
                    computedLocations < 401
                  "
                  class="inline-flex items-center p-2 rounded-md font-medium bg-success-200 text-success-700"
                >
                  Total Savings:
                  {{
                    $options.filters.currencyUSA(totalSaving).includes('.00')
                      ? $options.filters
                          .currencyUSA(totalSaving)
                          .split('.00')[0]
                      : $options.filters.currencyUSA(totalSaving)
                  }}% <br />
                  compared to base price of $4,200 per location
                </span>
              </p>
            </transition-group>
          </div>
          <p class="mt-14">
            <span class="text-sm font-bold text-gray-400">
              Ready to get started?
            </span>
          </p>
          <div class="mt-4">
            <div class="w-28 mx-auto">
              <WButtonsBase
                class="text-base"
                @click.native="
                  $router.push('/shared-workspaces/create/landing')
                "
              >
                Enroll now
              </WButtonsBase>
            </div>
          </div>
          <div class="mt-4 w-10/12 mx-auto text-center">
            <span class="text-sm text-gray-400">
              Get a head start on health and safety. Use our new
              <a
                href="/shared-workspaces/roadmap"
                target="blank"
                class="text-sm font-normal text-primary-400"
              >
                roadmap tool
              </a>
              to learn how to get started.
            </span>
            <img class="mt-20 mx-auto" src="/pricing-calculator/well.png" />
          </div>
        </div>
      </div>

      <div
        class="text-lg text-center w-full font-light text-gray-400 mt-5 mb-10"
      >
        <p>
          This calculator is for your internal informational purposes only. IWBI
          shall not be liable or responsible for any actions or inaction taken
          in reliance on this tool.
          <a class="text-primary-500" href="/shared-workspaces/create/landing"
            >Enroll your project here
          </a>
          &nbsp;for an official quote.

          <a
            class="text-primary-500"
            href="mailto:healthsafety@wellcertified.com"
            >contact IWBI</a
          >
          if you have any questions.
        </p>
      </div>
    </div>

    <WFeedbackModal ref="happyToHelp" :can-manually-close="true">
      <div
        class="inline-block float-right"
        @click="$refs.happyToHelp.isHidden = true"
      >
        <img src="/pricing-calculator/x.png" alt="" />
      </div>
      <div class="max-w-md text-primary-900 py-8 px-8">
        <WHeadingsHThree
          class="mx-auto text-center font-extrabold"
          heading="We’re happy to help!"
        />
        <div class="flex flex-col">
          <p class="text-sm text-gray-400 text-center font-light">
            Submissions of 10,000+ locations are a big deal, and require some
            special handling. Please enter your email address below and someone
            from IWBI will reach out to you with information about a custom
            quote.
          </p>
          <label
            for="continue"
            class="mt-4 block font-medium text-sm text-black"
          >
            Email address
          </label>
          <FormulateInput
            id="continue"
            v-model="modalForm.email"
            type="text"
            validation="email"
          />
          <WButtonsBase
            class="mt-2 w-48 mx-auto"
            type="primary"
            @click.native="
              () => {
                $refs.billingModal.isHidden = false
                sendEmailForm
              }
            "
          >
            Continue
          </WButtonsBase>
          <p class="mt-4 text-sm text-gray-400 text-center font-light">
            By providing your information above, we will add you to our mailing
            list and send you information about membership and other programs
            that may be of interest to you in accordance with our
            <a
              href="https://www.wellcertified.com/privacy"
              class="text-primary-400"
              >Privacy Policy.</a
            >
          </p>
        </div>
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  auth: false,
  data() {
    return {
      formIsValid: true,
      form: {
        locations: '1',
        small: 1,
        membership: null,
        emerging: '',
        sectors: '',
      },
      modalForm: {
        email: null,
      },
      confirmOptions: {
        0: 'Yes',
        1: 'No',
      },
      isShowModals: {
        numberOfLocations: false,
        sector: false,
        emergingMarkets: false,
        IWBIMember: false,
        smallBusiness: false,
        market_based: false,
        'government/municipal-buildings': false,
        'non-profit-charitable-organizations': false,
        'low-income/affordable-housing': false,
        'small-business': false,
        'assisted-living': false,
        schools: false,
      },
      radioPopups: {
        'government/municipal-buildings': {
          title: 'Government and Municipal Buildings',
          description:
            'Buildings that serve "government agencies", which are entities 100% owned by government and serve government function.',
        },
        'non-profit-charitable-organizations': {
          title: 'Non-Profit and Charitable Organizations',
          description:
            'Projects may be considered non-profits if the primary business conducted in a given space falls within the non-profit sector.',
        },
        'low-income/affordable-housing': {
          title: 'Low-Income and Affordable Housing',
          description:
            'Projects may be considered "low-income housing" for the purposes of WELL if at least 40% of units are reserved for households makings 60% or less than the area median income and if housing costs are deemed "affordable" for those households. Housing is defined as "affordable" when total cost of rent is no more than 33% of income; thus, total annual cost must not exceed 20% of area median income.',
        },
        'assisted-living': {
          title: 'Senior and Assisted Living',
          description:
            'Spaces that provide any level of supervised care and support services to residents, such as aging adults, disabled youth or long-term care patients.',
        },
        schools: {
          title: 'Schools and Education Facilities',
          description:
            'All educational facilities, such as public and private schools, primary and secondary and higher education.',
        },
        'healthcare-facilities': {
          title: 'Healthcare Facilities',
          description:
            'Facilities, such as hospitals or clinics, that provide medical treatment to patients that are typically reimbursed (partly or fully) by an insurance policy or government agency.',
        },
      },
    }
  },
  computed: {
    ...mapState({
      formData: (state) => state.hsr.data,
      quote: (state) => state.hsr.quote,
    }),
    ...mapGetters('hsr', [
      'pricePerLocation',
      'totalSaving',
      'totalPrice',
      'isEnroll',
      'isPrevious',
    ]),
    calculator: {
      get() {
        return this.$store.state.hsr.calculator
      },
      set(locationsEnrolled) {},
    },
    locationsEnrolled: {
      get() {
        return this.$store.state.hsr.calculator.locationsEnrolled
      },
      set(locationsEnrolled) {
        this.$store.commit('hsr/updateCalculator', { locationsEnrolled })
      },
    },
    previously: {
      get() {
        return this.$store.state.hsr.calculator.previously
      },
      set(previously) {
        this.$store.commit('hsr/updateCalculator', { previously })
      },
    },
    head() {
      return {
        title: 'Create a Pricing Estimate',
      }
    },
    hasMoreThanOneLocation() {
      return this.calculator?.countLocations > 1
    },
    computedLocations() {
      if (this.form.locations) {
        return Number(this.form.locations.replace(',', ''))
      }
      return 0
    },
    membershipTypeOptions() {
      const options = {}
      for (let i = 0; i < this.formData.membership_types.length; i++) {
        const optionData = this.formData.membership_types[i]

        let text = optionData.name
        if (optionData.discount > 0) {
          text += ` (${optionData.discount}% Discount)`
        }
        options[optionData.id] = text
      }

      return options
    },
    sectorsOptions() {
      const remappedToObject = {}

      this.formData.sectors.forEach((e) =>
        Object.assign(remappedToObject, { [e.id]: e.name })
      )

      return remappedToObject
    },
    locationName() {
      let text = 'Location'
      if (this.form.locations !== null && this.form.locations > 1) {
        text += 's'
      }

      return text
    },
  },
  watch: {
    form: {
      handler(v) {
        this.setQuote({})
        if (v.locations) {
          if (Number(v.locations.replace(',', '')) > 10000) {
            this.$refs.happyToHelp.isHidden = false

            this.form.properties = 1
            this.submitHandler()
          }
          if (this.formIsValid) {
            this.callSubmit()
          }
          const num = v.locations
            .replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          this.$nextTick(() => (this.form.locations = num))
        }
      },
      deep: true,
    },
    previously() {
      this.callSubmit()
    },
  },
  mounted() {
    this.submitHandler()
    this.$store.dispatch('hsr/getData')
  },
  methods: {
    ...mapMutations('hsr', ['setQuote', 'updateCalculator']),
    callSubmit() {
      this.$refs.submitBtn.click()
    },
    validate(data) {
      this.formIsValid = !data.hasErrors
      if (this.formIsValid) {
        this.callSubmit()
      }
    },
    submitHandler() {
      if (this.form.locations > 10000) {
        this.form.locations = 1
      }

      this.$store
        .dispatch('hsr/calculateQuote', {
          properties: this.computedLocations,
          estimate_sector: this.form.sectors,
          country: this.form.emerging ? this.form.emerging : '--',
          multi_use: 0,
          small_business: 1 - this.form.small,
          membership_type: this.form.membership,
          previous_well_certification: 1 - this.previously,
        })
        .then((e) => {
          this.updateCalculator({ countLocations: this.computedLocations })
        })
    },
  },
}
</script>
