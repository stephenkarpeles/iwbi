<template>
  <div class="relative bg-white rounded-lg shadow-md">
    <div class="lg:absolute lg:inset-0">
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          class="
            hidden
            lg:block
            h-56
            w-full
            object-cover
            lg:absolute lg:h-full
            rounded-r-lg
          "
          src="/shared-workspace/locations.jpg"
          alt=""
        />
      </div>
    </div>
    <div
      class="
        relative
        md:pt-8
        pb-8
        md:pb-16
        px-4
        sm:pt-16 sm:px-6
        lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2
        border
        rounded-md
      "
    >
      <div class="lg:pr-8">
        <div v-if="formData" class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
          <WHeadingsHTwo heading="Tell us about your locations">
            <div class="mt-3 text-base leading-6 text-gray-500">
              Please ensure the information submitted is accurate and can be
              used for billing purposes. Please use English characters only.
            </div>
          </WHeadingsHTwo>
          <FormulateForm @submit="submitSharedWorkspace">
            <FormulateInput
              v-model="formData.locations"
              type="number"
              label="How many locations are you seeking to enroll?*"
              class="mr-5 mt-5 w-full"
              min="1"
              validation="required"
            />
            <div
              class="
                bg-secondary-100
                text-secondary-700
                border
                p-2
                mb-2
                text-sm
                rounded
                border-secondary-700
              "
            >
              *Locations must share the same space type to be eligible for the
              same enrollment. Please begin another enrollment for locations
              with separate or distinct uses.
            </div>
            <FormulateInput
              v-if="formData.space_types"
              v-model="formData.space_types"
              type="multi"
              :multiple="true"
              :options="spaceTypes"
              label="Which of the following best describes your locations?*"
              placeholder="Please select primary space type"
              class="mr-5 w-full"
              validation="required"
            />

            <div class="md:space-x-2">
              <label
                class="
                  text-sm
                  font-bold
                  leading-5
                  text-gray-700
                  sm:mt-px sm:pt-2
                "
                >What is the combined size of all enrolling locations, estimated
                in square feet or square meters?*</label
              >
              <div class="md:flex justify-between w-full">
                <div class="flex relative w-full mr-2">
                  <FormulateInput
                    v-model="formData.area"
                    class="w-full"
                    type="number"
                    validation="required"
                    min="10"
                    step="0.01"
                    @keyup="calcSqM()"
                  />
                  <div
                    style="height: 40px"
                    class="
                      absolute
                      right-0
                      top-0
                      flex
                      bg-primary-100
                      text-primary-400
                      border border-primary-300
                      rounded-r
                    "
                  >
                    <div class="my-auto px-3">ft <sup>2</sup></div>
                  </div>
                </div>
                <div class="flex relative w-full">
                  <FormulateInput
                    v-model="formData.area_in_meter"
                    class="w-full"
                    type="number"
                    validation="required"
                    step="0.01"
                    @keyup="calcSqFt()"
                  />
                  <div
                    style="height: 40px"
                    class="
                      absolute
                      right-0
                      top-0
                      flex
                      bg-primary-100
                      text-primary-400
                      border border-primary-300
                      rounded-r
                    "
                  >
                    <div class="my-auto px-3">m <sup>2</sup></div>
                  </div>
                </div>
              </div>
            </div>
            <WFeedbackBanner
              :visible="true"
              message="
                  <strong>Looking to enroll a previously registered WELL Project or Portfolio?</strong><br/>
                  Visit your associated account to opt-in for the WELL Health-Safety Rating."
            />

            <div class="mt-5 md:flex space-y-3 md:space-y-0 justify-between">
              <div class="md:w-40">
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="
                    $store.dispatch('shared/setActiveTab', 'ENROLLMENT TYPE')
                  "
                >
                  Back
                </WButtonsBase>
              </div>
              <div class="md:w-40">
                <WButtonsBase
                  v-if="submittingRequest"
                  :type="'primaryInverted'"
                >
                  <span>
                    <WLoadingSpinner type="button" class="mx-auto" />
                  </span>
                </WButtonsBase>
                <FormulateInput v-else type="submit" label="Continue" />
              </div>
            </div>
          </FormulateForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      submittingRequest: false,
      formData: {
        locations: 1,
        area: 0,
        area_in_meter: 0,
      },
    }
  },
  computed: {
    spaceTypes() {
      if (this.$store.state.shared.spaceTypes) {
        return this.$store.state.shared.spaceTypes
      }
      return null
    },
  },
  async created() {
    await this.$store.dispatch('shared/fetchSpaceTypes')
  },
  beforeCreate() {
    this.formData = {
      locations: this.$store.state.shared.sharedWorkspace.no_of_assets
        ? this.$store.state.shared.sharedWorkspace.no_of_assets
        : 1,
      area: this.$store.state.shared.sharedWorkspace.area
        ? this.$store.state.shared.sharedWorkspace.area
        : 1,
      space_types: [],
    }
    if (
      this.$store.state.shared.sharedWorkspace.space_types &&
      this.$store.state.shared.sharedWorkspace.space_types.length
    ) {
      this.formData.space_types =
        this.$store.state.shared.sharedWorkspace.space_types.map((e) => {
          return {
            label: e.name,
            value: e.id,
          }
        })
    }
  },
  mounted() {
    this.formData = {
      locations: this.$store.state.shared.sharedWorkspace.no_of_assets
        ? this.$store.state.shared.sharedWorkspace.no_of_assets
        : 1,
      area: this.$store.state.shared.sharedWorkspace.area
        ? this.$store.state.shared.sharedWorkspace.area
        : 0,
      area_in_meter: this.$store.state.shared.sharedWorkspace.area_in_meter
        ? this.$store.state.shared.sharedWorkspace.area_in_meter
        : 0,
      space_types: [],
    }
    this.calcSqM()
    if (
      this.$store.state.shared.sharedWorkspace.space_types &&
      this.$store.state.shared.sharedWorkspace.space_types.length
    ) {
      this.formData.space_types =
        this.$store.state.shared.sharedWorkspace.space_types.map((e) => {
          return {
            label: e.name,
            value: e.id,
          }
        })
    }
  },
  methods: {
    async submitSharedWorkspace() {
      this.submittingRequest = true
      const sharedWorkspace = { ...this.$store.state.shared.sharedWorkspace }
      sharedWorkspace.no_of_assets = this.formData.locations
      sharedWorkspace.space_types = this.formData.space_types.length
        ? this.formData.space_types.map((e) => {
            return e.value
          })
        : []
      sharedWorkspace.area = this.formData.area
      await this.$store.dispatch(
        'shared/updateSharedWorkspace',
        sharedWorkspace
      )
      this.$store.dispatch('shared/setActiveTab', 'FEES + DISCOUNTS')
      this.submittingRequest = false
    },
    calcSqM() {
      if (this.formData.area) {
        this.formData.area_in_meter = Number.parseFloat(
          this.formData.area * 0.092903
        ).toFixed(2)
      } else {
        this.formData.area_in_meter = 0
      }
    },
    calcSqFt() {
      if (this.formData.area_in_meter) {
        this.formData.area = Number.parseFloat(
          this.formData.area_in_meter * 10.7639
        ).toFixed(2)
      } else {
        this.formData.area = 0
      }
    },
  },
}
</script>
