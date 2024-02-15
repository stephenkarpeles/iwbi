<template>
  <div>
    <div v-if="currentUser" class="">
      <WFeedbackModal ref="modal" :can-manually-close="false">
        <div class="max-w-lg mx-10 my-5">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
          >
            <svg
              class="h-6 w-6 text-green-600"
              x-description="Heroicon name: check"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <WHeadingsHFour heading="Creating your new project account now..." />
        </div>
      </WFeedbackModal>
      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="WELL v2 Project Creation" />
        <WStepsHorizontal
          :steps="[
            {
              name: 'NAME YOUR PROJECT',
              status: currentStep === 0 ? 'current' : 'complete',
            },
            {
              name: 'PROJECT LOCATION',
              status: currentStep > 1 ? 'complete' : '',
            },
            {
              name: 'PROJECT DETAILS',
              status: currentStep > 4 ? 'complete' : '',
            },
            {
              name: 'CHOOSE A PROGRAM',
              status: currentStep > 5 ? 'current' : '',
            },
          ]"
        />
      </NavBreadcrumbs>

      <WLinksBase
        link="#"
        icon="arrow-narrow-left"
        @click.native="$router.push('/projects/v2/')"
      >
        Back to list
      </WLinksBase>

      <div class="relative bg-white rounded-lg shadow-md mt-3">
        <div :class="{ hidden: currentStep !== 5 }">
          <div class="bg-primary-200">
            <div class="pt-12 sm:pt-16">
              <div
                class="max-w-screen-xl mx-auto text-center px-4 sm:px-6 lg:px-8"
              >
                <div class="max-w-3xl mx-auto space-y-1 lg:max-w-none">
                  <WHeadingsHThree
                    heading="Which program is best for your project?"
                  />
                </div>
              </div>
            </div>
            <div
              class="mt-8 pb-12 bg-gray-50 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24"
            >
              <div class="relative">
                <div class="absolute inset-0 h-3/4 bg-primary-200"></div>
                <div
                  class="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
                >
                  <div
                    :class="[
                      formData.primary_space_type_id === '3'
                        ? ''
                        : 'lg:grid-cols-2 lg:grid lg:gap-5 lg:max-w-5xl',
                      'max-w-md mx-auto space-y-4  lg:space-y-0',
                    ]"
                  >
                    <div
                      class="flex flex-col rounded-lg shadow-lg overflow-hidden"
                    >
                      <div class="h-full px-6 py-8 bg-white sm:p-10 sm:pb-6">
                        <img
                          class="mx-auto mb-6"
                          src="/projects/v2/create/package-logos/regular.png"
                        />
                        <WHeadingsHThree heading="WELL Certification" />
                        <p class="mt-5 text-lg leading-7 text-gray-500">
                          WELL Certification is for projects looking to address
                          the full scope of project design, construction and
                          operations.
                        </p>
                      </div>
                      <div
                        class="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-white space-y-6 sm:p-10 sm:pt-6"
                      >
                        <WButtonsBase
                          data-id="program-type-select"
                          @click.native="currentStep++"
                        >
                          Select
                        </WButtonsBase>
                      </div>
                    </div>

                    <div
                      v-if="formData.primary_space_type_id !== '3'"
                      class="flex flex-col rounded-lg shadow-lg overflow-hidden"
                    >
                      <div
                        class="h-full px-6 py-8 sm:p-10 sm:pb-6"
                        style="background-color: #be886e"
                      >
                        <img
                          class="mx-auto mb-6"
                          src="/projects/v2/create/package-logos/core.png"
                        />
                        <WHeadingsHThree
                          class="text-white"
                          heading="WELL Core Certification"
                        />
                        <p class="mt-5 text-lg leading-7 text-white">
                          WELL Core Certification is for projects seeking to
                          address fundamental features in the base building.
                        </p>
                      </div>
                      <div
                        class="flex-1 flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6"
                        style="background-color: #be886e"
                      >
                        <WButtonsBase
                          type="primaryInverted"
                          @click.native="
                            formData.project_type = 'cs'
                            createProject()
                          "
                        >
                          Select
                        </WButtonsBase>
                      </div>
                    </div>
                  </div>
                  <div class="h-10 w-1/2 mt-5">
                    <WLinksBase
                      v-if="Object.keys(primarySpaceOptions).length === 1"
                      icon="arrow-narrow-left"
                      @click.native="
                        ;(currentStep = 3),
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back to previous step
                    </WLinksBase>
                    <WLinksBase
                      v-else
                      icon="arrow-narrow-left"
                      @click.native="
                        currentStep--,
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back to previous step
                    </WLinksBase>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden lg:block lg:absolute lg:inset-0">
          <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              v-if="currentStep !== 5"
              class="h-56 w-full object-cover lg:absolute lg:h-full rounded-r-lg"
              :src="'/projects/v2/create/' + currentStep + '.jpg'"
              alt=""
            />
          </div>
        </div>
        <div
          :class="{ 'hidden lg:hidden': currentStep === 5 }"
          class="border rounded-lg relative py-6 px-4 xl:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2"
        >
          <div class="lg:pr-8" style="min-height: 460px">
            <div
              :class="{ hidden: currentStep !== 0 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="What should we call your project?"
                sub-heading="Enter a project nickname for this location."
              >
              </WHeadingsHTwo>

              <FormulateForm @submit="validateStep">
                <FormulateInput
                  data-id="nick-name-project"
                  v-model="formData.name"
                  type="text"
                  label="Project nickname"
                  validation="required"
                  placeholder="Ex. Acme Headquarters, Empire State Building, etc."
                />
                <FormulateInput
                  data-id="name-continue-btn"
                  class="mt-24"
                  type="submit"
                  label="Continue"
                />
              </FormulateForm>
            </div>
            <div
              :class="{ hidden: currentStep !== 1 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Where is your project located?"
                sub-heading="Let us know where you are for localized support and resources."
              >
              </WHeadingsHTwo>

              <FormulateForm @submit="validateStep">
                <FormInputsAddressFormulate
                  :required="true"
                  :address="formData.address"
                  :target="formData.address"
                />

                <div class="flex mt-5">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        currentStep--,
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput
                      data-id="location-continue-btn"
                      type="submit"
                      label="Continue"
                    />
                  </span>
                </div>
              </FormulateForm>
            </div>
            <div
              :class="{ hidden: currentStep !== 2 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="What is the size of your project?"
                sub-heading="An estimated size of your project is okay for now!"
              >
              </WHeadingsHTwo>

              <FormulateForm @submit="validateStep">
                <div
                  class="mt-5 text-sm font-medium leading-5 text-primary-800"
                >
                  Area Size
                </div>
                <div class="w-full relative">
                  <FormulateInput
                    v-model="formData.area"
                    type="number"
                    min="0"
                    step=".01"
                    placeholder="Area (in sq ft)"
                    validation="required|number"
                    @keyup="calcSqM()"
                  />
                  <div
                    class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
                  >
                    <div class="my-auto px-3">ft <sup>2</sup></div>
                  </div>
                </div>

                <div class="w-full relative mt-3">
                  <FormulateInput
                    v-model="formData.areaInMeters"
                    type="number"
                    min="0"
                    step=".01"
                    placeholder="Area (in sq m)"
                    validation="required|number"
                    @keyup="calcSqFt()"
                  />
                  <div
                    class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
                  >
                    <div class="my-auto px-3">m <sup>2</sup></div>
                  </div>
                </div>

                <div class="flex mt-24">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        currentStep--,
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput
                      data-id="details-continue-btn"
                      type="submit"
                      label="Continue"
                    />
                  </span>
                </div>
              </FormulateForm>
            </div>
            <div
              :class="{ hidden: currentStep !== 3 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Which of these space types describe your project?"
                sub-heading="Any space type can successfully use WELL to promote health and well-being! This helps us to tailor recommendations and support. "
              >
              </WHeadingsHTwo>

              <FormulateForm @submit="validateStep">
                <WHeadingsHFour heading="Space Types" />
                <div class="w-full relative grid grid-cols-2 gap-x-2">
                  <FormulateInput
                    data-id="space-type-input"
                    v-model="formData.space_types"
                    :options="spaceTypeOptions"
                    type="checkbox"
                    validation="min:1,length"
                  />
                </div>
                <div class="flex mt-5">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        currentStep--,
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput
                      data-id="space-type-continue-btn"
                      type="submit"
                      label="Continue"
                    />
                  </span>
                </div>
              </FormulateForm>
            </div>
            <div
              :class="{ hidden: currentStep !== 4 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Which is the primary use of the project location?"
                sub-heading="Knowing which space type the project is primarily dedicated to enables us to customize our guidance even further. "
              >
              </WHeadingsHTwo>

              <FormulateForm @submit="validateStep">
                <FormulateInput
                  v-model="formData.primary_space_type_id"
                  :options="primarySpaceOptions"
                  type="radio"
                  name="Primary use"
                  validation="required"
                />
                <div class="flex mt-5">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        currentStep--,
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput type="submit" label="Continue" />
                  </span>
                </div>
              </FormulateForm>
            </div>
            <!-- Step 5 is above in the markup due to layout -->
            <div
              :class="{ hidden: currentStep !== 6 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="What ownership do you have of the project location?"
                sub-heading="WELL Certification is for projects looking to address the full scope of project design, construction and operations."
              >
              </WHeadingsHTwo>

              <FormulateForm @submit="validateStep">
                <FormulateInput
                  v-model="formData.project_type"
                  class="mt-4"
                  :options="[
                    { value: 'cics', label: 'The project is a space I lease' },
                    {
                      value: 'new-existing',
                      label: 'The project is a space I own and occupy',
                    },
                  ]"
                  type="radio"
                  name="Ownership type"
                  validation="required"
                />
                <div class="flex mt-24">
                  <span class="h-10 w-1/2 mr-1">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="
                        currentStep--,
                          ($parent.$parent.$refs.content.scrollTop = 0)
                      "
                    >
                      Back
                    </WButtonsBase>
                  </span>
                  <span class="h-10 w-1/2 ml-1">
                    <FormulateInput type="submit" label="Continue" />
                  </span>
                </div>
              </FormulateForm>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Project Creation...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentStep: 0,
      formData: {
        name: null,
        area: null,
        areaInMeters: null,
        space_types: [],
        primary_space_type_id: null,
        type: 'v2',
        construction_status: '',
        project_type: null,
        address: {
          country_code: '',
          state: '',
          street: '',
          city: '',
          postal_code: '',
        },
      },
      spaceTypeOptions: [
        { label: 'Office', value: 12 },
        { label: 'Residential', value: 3 },
        { label: 'Retail', value: 6 },
        { label: 'Education', value: 11 },
        { label: 'Hospitality', value: 16 },
        { label: 'Assisted Living', value: 17 },
        { label: 'Cultural Institutions', value: 18 },
        { label: 'Public Assembly', value: 19 },
        { label: 'Commercial Kitchen', value: 2 },
        { label: 'Commercial Dining', value: 4 },
        { label: 'Industrial', value: 20 },
        { label: 'Laboratory', value: 21 },
        { label: 'Fitness', value: 22 },
        { label: 'Healthcare', value: 24 },
        { label: 'Warehouses', value: 9 },
        { label: 'Childcare', value: 25 },
        { label: 'Auditorium', value: 26 },
        { label: 'Transportation', value: 27 },
        { label: 'Library', value: 28 },
        { label: 'Grocery', value: 29 },
        { label: 'Sporting Venue', value: 23 },
        { label: 'Shopping Center', value: 30 },
        { label: 'Manufacturing', value: 31 },
        { label: 'Medical Office', value: 32 },
        { label: 'Data Centers', value: 33 },
        { label: 'Convention Centers', value: 34 },
        { label: 'Others', value: 15 },
      ],
    }
  },
  head() {
    return {
      title: `Create a v2 Certification`,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      countries: (state) => state.address.countries,
    }),
    primarySpaceOptions() {
      const options = {}

      if (this.formData.space_types.length > 0) {
        for (let i = 0; i < this.formData.space_types.length; i++) {
          const spaceOption = this.spaceTypeOptions.find(
            (space) => space.value === this.formData.space_types[i]
          )
          options[spaceOption.value] = spaceOption.label
        }
      }
      return options
    },
    countryOptions() {
      const options = []
      this.countries.forEach(function (country) {
        options.push({ value: country.id, label: country.name })
      })
      return options
    },
    filteredStates() {
      const options = []
      if (this.formData.country_id) {
        const country = this.countries.filter(
          (country) => country.id === this.formData.country_id
        )[0].code

        this.getStates(country).forEach(function (state) {
          options.push({ value: state, label: state })
        })
      }
      return options
    },
  },
  methods: {
    calcSqM() {
      if (this.formData.area) {
        this.formData.areaInMeters = Number.parseFloat(
          this.formData.area * 0.092903
        ).toFixed(2)
      } else {
        this.formData.areaInMeters = 0
      }
    },
    calcSqFt() {
      if (this.formData.areaInMeters) {
        this.formData.area = Number.parseFloat(
          this.formData.areaInMeters * 10.7639
        ).toFixed(2)
      } else {
        this.formData.area = 0
      }
    },
    createProject() {
      this.$refs.modal.isHidden = false

      this.formData.country_id = this.countries.find(
        (country) => country.code === this.formData.address.country_code
      ).id
      this.formData.city = this.formData.address.city
      this.formData.state = this.formData.address.state
      this.formData.street = this.formData.address.street
      this.formData.postal_code = this.formData.address.postal_code

      this.$store.dispatch('project/create', this.formData)

      const thisObj = this
      setTimeout(function () {
        thisObj.$store.dispatch('project/getV2Projects', {
          project_number: '',
          country_id: 0,
          name: '',
          reg_status: '',
          user_type: 'user',
        })
      }, 2500)
    },
    getStates(country) {
      if (country && this.states[country]) {
        return Object.values(this.states[country])
      }
      return []
    },
    validateStep() {
      this.$parent.$parent.$refs.content.scrollTop = 0
      if (this.currentStep !== 6) {
        // if there is only one space type choosen push the user to the next screen and assign the primary
        if (
          this.currentStep === 3 &&
          Object.keys(this.primarySpaceOptions).length === 1
        ) {
          this.formData.primary_space_type_id = Object.keys(
            this.primarySpaceOptions
          )[0]
          this.currentStep = 5
        } else {
          this.currentStep++
        }
      } else {
        this.createProject()
      }
    },
  },
}
</script>
