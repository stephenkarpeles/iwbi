<template>
  <div>
    <div>
      <section class="pt-8 sm:pt-16">
        <div class="mb-6 md:mb-12 text-3xl font-bold text-center sm:text-left">
          WELL Health-Safety Roadmap Tool
        </div>
        <WHeadingsHFour heading="Basic Project Information" />
        <div class="flex justify-between">
          <p
            class="
              text-base
              opacity-70
              self-start
              text-primary-900 text-center
              sm:text-left sm:w-1/2
            "
          >
            Provide us with some details about your project so that we can
            customize your assessment.
          </p>
        </div>
      </section>
      <section class="pt-2">
        <div class="border-primary-200 border shadow-md rounded-lg">
          <div class="flex flex-col-reverse sm:flex-row">
            <div class="sm:w-1/2 p-8">
              <FormulateForm
                name="step-one"
                class="space-y-3"
                @submit="sendBasicInformation"
              >
                <div class="flex flex-col">
                  <div v-if="!currentUser">
                    <div class="">
                      <FormulateInput
                        v-model="form.email"
                        type="text"
                        label="Email"
                        validation="email"
                        :input-class="
                          (context, classes) => [
                            'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                          ]
                        "
                      />
                    </div>
                    <p class="text-sm text-primary-900 leading-4 opacity-50">
                      If your email is associated with a WELL Account, or if you
                      use it to create one in the future, your results will be
                      saved to that account.
                    </p>
                  </div>
                  <div v-if="projectTypesOptions" class="mb-4">
                    <FormulateInput
                      v-model="form.project_type"
                      type="select"
                      label="Type of Project"
                      :options="projectTypesOptions"
                      validation="required"
                      :input-class="
                        (context, classes) => [
                          'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                        ]
                      "
                      @change="onChangedProjectType"
                    />
                    <p class="text-sm text-primary-900 leading-4 opacity-50">
                      The type of assessment will impact how we rank the
                      feasibility of specific features of the rating system.
                    </p>
                  </div>
                  <div class="mb-4">
                    <FormulateInput
                      v-model="form.name"
                      type="text"
                      label="Project name"
                      validation="required"
                      :disabled="$route.query.portfolio_id ? true : false"
                      :input-class="
                        (context, classes) => [
                          'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                        ]
                      "
                    />
                  </div>
                  <div v-if="countriesOptions" class="mb-4">
                    <FormulateInput
                      id="continue"
                      v-model="form.country"
                      type="select"
                      label="Country / Region"
                      :options="countriesOptions"
                      validation="required"
                      :input-class="
                        (context, classes) => [
                          'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                        ]
                      "
                    />
                    <p class="text-sm text-primary-900 leading-4 opacity-50">
                      If assessing a portfolio, enter the location of company
                      headquarters.
                    </p>
                  </div>
                  <div v-if="spaceTypesOptions" class="mb-4">
                    <FormulateInput
                      v-model="form.space_type_id"
                      type="select"
                      label="Primary space type"
                      :options="spaceTypesOptions"
                      validation="required"
                      :input-class="
                        (context, classes) => [
                          'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                        ]
                      "
                    />
                  </div>
                  <div class="mb-4">
                    <FormulateInput
                      v-model="form.well_core_project"
                      type="radio"
                      :disabled="form.project_type === 'Tenant Space'"
                      :options="confirmOptions"
                      validation="required"
                      :element-class="
                        (context, classes) =>
                          ['text-sm flex space-x-8 mb-2'].concat(classes)
                      "
                    >
                      <template slot="label">
                        <label
                          class="
                            text-sm
                            font-bold
                            leading-5
                            text-gray-700
                            sm:mt-px sm:pt-2
                          "
                          >Is this a WELL Core™ project?
                          <Flyout
                            ref="conceptFlyout"
                            y="bottom"
                            x="right"
                            class="h-full"
                          >
                            <WButtonsBase
                              type="tooltip"
                              icon="question-mark-circle"
                            />
                            <template #content>
                              <div
                                class="
                                  text-sm
                                  font-light
                                  p-2
                                  text-center
                                  w-72
                                  text-primary-900
                                  leading-4
                                  opacity-50
                                "
                              >
                                <p class="font-bold">WELL Core</p>
                                <p>
                                  In WELL Core projects, the majority of regular
                                  occupants are not affiliated with the project
                                  owner. Any building type can register for WELL
                                  Core, provided that at least 75% of the
                                  project area is occupied by one or more
                                  tenants and/or serves as common space in the
                                  building accessible to all tenants. Note that
                                  offices affiliated with the project owner but
                                  unrelated to the management of the project
                                  property may be considered a tenant, as long
                                  as additional tenants unaffiliated with the
                                  project owner occupy at least 60% of the net
                                  leased area.
                                </p>
                              </div>
                            </template>
                          </Flyout>
                        </label>
                      </template>
                    </FormulateInput>
                    <p
                      v-if="form.project_type === 'Tenant Space'"
                      class="text-sm text-primary-900 leading-4 opacity-50"
                    >
                      A Tenant Space cannot be a WELL Core project.
                    </p>
                  </div>
                  <div class="mb-4">
                    <FormulateInput
                      v-model="form.approximate_area"
                      maxlength="9"
                      type="text"
                      label="Approximate square footage"
                      validation="required|number"
                      :input-class="
                        (context, classes) => [
                          'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                        ]
                      "
                    />
                  </div>
                  <div class="mb-4">
                    <FormulateInput
                      v-model="form.staff_count"
                      maxlength="9"
                      type="text"
                      label="Approximate occupant count"
                      validation="required|number"
                      :input-class="
                        (context, classes) => [
                          'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                        ]
                      "
                    />
                  </div>
                  <div class="mb-4">
                    <FormulateInput
                      v-model="form.food_establishment"
                      type="radio"
                      label="Does the project contain any food service establishments?"
                      :options="confirmOptions"
                      validation="required"
                      :element-class="
                        (context, classes) =>
                          ['text-sm flex space-x-8'].concat(classes)
                      "
                    />
                  </div>

                  <div>
                    <FormulateInput
                      v-if="!currentUser"
                      type="checkbox"
                      validation="required"
                      class="mb-4"
                      name="Agreement"
                    >
                      <template #label>
                        <div class="ml-2">
                          By providing your information above, we will add you
                          to our mailing list and send you information about
                          membership and other programs that may be of interest
                          to you in accordance with our
                          <a
                            href="https://www.wellcertified.com/privacy"
                            target="_blank"
                            class="
                              active:text-primary-700
                              duration-150
                              ease-in-out
                              font-medium
                              h-full
                              hover:text-primary-800
                              text-primary-600
                              transition
                            "
                          >
                            Privacy Policy
                          </a>
                          .
                        </div>
                      </template>
                    </FormulateInput>
                  </div>

                  <div
                    v-if="errors.length > 0"
                    class="text-red-700 text-sm font-museo-sans mb-4"
                  >
                    <div class="rounded-md bg-red-50 p-4">
                      <div class="flex">
                        <div class="flex-shrink-0">
                          <!-- Heroicon name: x-circle -->
                          <svg
                            class="h-5 w-5 text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <h3 class="text-sm font-medium text-red-800">
                            There was an error submitting the basic information
                          </h3>
                          <div class="mt-2 text-sm text-red-700">
                            <ul class="list-disc pl-5 space-y-1">
                              <li v-for="error in errors" :key="error.id">
                                {{ error.text }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <FormulateInput type="submit" label="Next" />
                  </div>
                </div>
              </FormulateForm>
            </div>
            <div
              class="
                sm:w-1/2
                bg-primary-800
                flex
                items-center
                justify-center
                sm:rounded-r-lg sm:rounded-tl-none
                rounded-t-lg
                py-4
                sm:py-0
                px-5
              "
            >
              <div>
                <img
                  class="w-4/5 lg:w-full mx-auto"
                  src="/assessment/main-26.png"
                  alt="image stock"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  auth: false,
  data() {
    return {
      errors: [],
      form: {
        email: null,
        name: null,
        country: null,
        space_type_id: null,
        project_type: null,
        well_core_project: false,
        staff_count: null,
        approximate_area: null,
        unit: 'sq. ft.',
        food_establishment: false,
      },
      confirmOptions: {
        1: 'Yes',
        0: 'No',
      },
    }
  },
  head() {
    return {
      title: 'WELL Health-Safety Roadmap Tool',
    }
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
      basicInformationData: (state) => state.assessment.basicInformationData,
      assessmentKey: (state) => state.assessment.assessmentKey,
    }),
    spaceTypesOptions() {
      const remappedToObject = {}

      if (this.basicInformationData && this.basicInformationData.space_types) {
        this.basicInformationData.space_types.forEach((e) =>
          Object.assign(remappedToObject, { [e.id]: e.name })
        )
      }

      return remappedToObject
    },
    projectTypesOptions() {
      const remappedToObject = {}

      if (
        this.basicInformationData &&
        this.basicInformationData.project_types
      ) {
        this.basicInformationData.project_types.forEach((e) =>
          Object.assign(remappedToObject, { [e]: e })
        )
      }

      return remappedToObject
    },
    countriesOptions() {
      const remappedToObject = {}

      if (this.basicInformationData && this.basicInformationData.countries) {
        this.basicInformationData.countries.forEach((e) =>
          Object.assign(remappedToObject, { [e.value]: e.label })
        )
      }

      return remappedToObject
    },
  },
  async mounted() {
    if (this.currentUser) {
      this.form.email = this.currentUser.email
    }

    await this.$store.dispatch('assessment/loadBasicInformationData')

    if (this.$route.query.portfolio_id) {
      await this.$store.dispatch('shared/getSharedWorkspace', {
        id: this.$route.query.portfolio_id,
      })

      this.form.name = this.sharedWorkspace.name
      this.form.approximate_area = this.sharedWorkspace.area
      this.form.space_type_id = this.sharedWorkspace.space_types.length
        ? this.sharedWorkspace.space_types[0].id
        : ''
      if (
        this.sharedWorkspace.addresses.length &&
        this.sharedWorkspace.addresses[0].country_name
      ) {
        const country = this.basicInformationData.countries.find(
          (a) => a.label === this.sharedWorkspace.addresses[0].country_name
        )

        this.form.country = country ? country.value : ''
      }
    }
  },
  methods: {
    async sendBasicInformation() {
      try {
        this.errors = []

        await this.$store.dispatch('assessment/saveBasicInformation', {
          email: this.form.email,
          name: this.form.name,
          country: this.form.country,
          space_type_id: this.form.space_type_id,
          project_type: this.form.project_type,
          well_core_project: this.form.well_core_project === '1',
          staff_count: parseInt(this.form.staff_count),
          approximate_area: parseInt(this.form.approximate_area),
          unit: this.form.unit,
          food_establishment: this.form.food_establishment === '1',
          portfolio_number: this.$route.query.portfolio_id
            ? this.$route.query.portfolio_id
            : null,
        })

        this.$router.push(`/shared-workspaces/roadmap/${this.assessmentKey}`)
      } catch (e) {
        const errors = Object.entries(e.response.data.errors)
        errors.forEach(([key, value]) => {
          this.errors.push({ id: key, text: value[0] })
        })
      }
    },
    onChangedProjectType(e) {
      if (e.target.value === 'Tenant Space') {
        this.form.well_core_project = '0'
      }
    },
  },
}
</script>
