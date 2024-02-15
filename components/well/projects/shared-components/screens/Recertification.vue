<template>
  <div>
    <div v-if="currentUser" class="">
      <WFeedbackModal ref="modal" :can-manually-close="false">
        <div class="max-w-lg mx-10 my-5">
          <div
            class="
              mx-auto
              flex
              items-center
              justify-center
              h-12
              w-12
              rounded-full
              bg-green-100
            "
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
          <WHeadingsHFour
            :heading="
              !staySameVersion
                ? 'Thank you for choosing upgrade the project to v2. One of our team member will reach out to you about the upgrade.'
                : 'Creating your recertification now...'
            "
          />
        </div>
      </WFeedbackModal>
      <NavBreadcrumbs v-if="project.type !== 'v2'">
        <WHeadingsHTwo class="mb-2" heading="Enroll for Recertification" />
        <WStepsHorizontal
          :steps="[
            {
              name: 'PROJECT SIZE',
              status: currentStep === 0 ? 'current' : 'complete',
            },
            {
              name: 'CONFIRM YOUR PROGRAM',
              status: currentStep !== 0 ? 'current' : '',
            },
          ]"
        />
      </NavBreadcrumbs>

      <WLinksBase
        link="#"
        icon="arrow-narrow-left"
        @click.native="
          $router.push(
            `/projects/${project.type}/${project.project_number}/dashboard`
          )
        "
      >
        Back to Project
      </WLinksBase>

      <div class="relative bg-white rounded-lg shadow-md mt-3">
        <div class="hidden lg:block lg:absolute lg:inset-0">
          <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              class="
                h-56
                w-full
                object-cover
                lg:absolute lg:h-full
                rounded-r-lg
              "
              :src="'/projects/v2/create/' + currentStep + '.jpg'"
              alt=""
            />
          </div>
        </div>
        <div
          class="
            border
            rounded-lg
            relative
            py-6
            px-4
            xl:pt-16
            sm:px-6
            lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2
          "
        >
          <div class="lg:pr-8" style="min-height: 460px">
            <div
              :class="{ hidden: currentStep !== 0 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Is there a change to the project area since initial
                          certification?"
              >
              </WHeadingsHTwo>
              <div class="flex justify-between space-x-4 mt-10">
                <WButtonsBase
                  :type="areaChanged ? 'primary' : 'primaryInverted'"
                  @click.native="areaChanged = areaChanged = true"
                  >Yes</WButtonsBase
                >
                <WButtonsBase
                  :type="!areaChanged ? 'primary' : 'primaryInverted'"
                  @click.native="areaChanged = areaChanged = false"
                  >No</WButtonsBase
                >
              </div>
              <FormulateForm
                v-if="areaChanged"
                @submit="project.type !== 'v2' ? currentStep++ : createRecert()"
              >
                <div class="text-sm font-bold text-gray-700 sm:pt-2 mt-5">
                  Updated project area *
                </div>
                <div class="w-full relative">
                  <FormulateInput
                    v-model="formData.area"
                    type="number"
                    min="0"
                    step=".01"
                    name="area"
                    placeholder="Gross Area"
                    validation="required|number"
                    @keyup="changeAreaInMeter()"
                  />
                  <div
                    class="
                      absolute
                      right-0
                      top-0
                      flex
                      h-10
                      bg-primary-100
                      text-primary-400
                      border border-primary-300
                      rounded-r
                    "
                  >
                    <div class="my-auto px-3">sq ft</div>
                  </div>
                </div>
                <div class="w-full relative">
                  <FormulateInput
                    v-model="formData.area_in_meter"
                    type="number"
                    min="0"
                    step=".01"
                    name="area_in_meter"
                    placeholder="Gross Area"
                    validation="required|number"
                    @keyup="changeAreaInFeet()"
                  />
                  <div
                    class="
                      absolute
                      right-0
                      top-0
                      flex
                      h-10
                      bg-primary-100
                      text-primary-400
                      border border-primary-300
                      rounded-r
                    "
                  >
                    <div class="my-auto px-3">sq m</div>
                  </div>
                </div>
                <FormulateInput
                  v-model="formData.desc"
                  validation="required"
                  type="richtext"
                  label="Describe the change to your project area in a few sentences. This information can help us better facilitate you in your recertification process."
                />

                <FormulateInput
                  v-if="areaChanged"
                  class="mt-24"
                  type="submit"
                  :label="project.type !== 'v2' ? 'Continue' : 'Submit'"
                />
              </FormulateForm>
              <WButtonsBase
                v-if="!areaChanged"
                class="mt-10"
                @click.native="
                  project.type !== 'v2' ? currentStep++ : createRecert()
                "
                >{{
                  project.type !== 'v2' ? 'Continue' : 'Submit'
                }}</WButtonsBase
              >
            </div>
            <div
              :class="{ hidden: currentStep !== 1 }"
              class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
            >
              <WHeadingsHTwo
                heading="Are you pursuing recertification under the same version or do you wish to upgrade to WELL v2?"
              >
              </WHeadingsHTwo>
              <div class="flex justify-between space-x-4 mt-10">
                <WButtonsBase
                  :type="staySameVersion ? 'primary' : 'primaryInverted'"
                  @click.native="staySameVersion = areaChanged = true"
                  >Stay in the same version</WButtonsBase
                >
                <WButtonsBase
                  :type="!staySameVersion ? 'primary' : 'primaryInverted'"
                  @click.native="staySameVersion = staySameVersion = false"
                  >Upgrade to v2</WButtonsBase
                >
              </div>
              <div class="mt-24 space-x-4 flex justify-between">
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="currentStep--"
                  >Back</WButtonsBase
                >
                <WButtonsBase @click.native="createRecert">Submit</WButtonsBase>
              </div>
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
        area: null,
        areaInMeters: null,
      },
      areaChanged: false,
      staySameVersion: true,
    }
  },
  head() {
    return {
      title: `Create a recertification`,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.project.project,
    }),
  },
  methods: {
    changeAreaInMeter(event) {
      if (this.formData.area) {
        this.formData.area_in_meter = Number.parseFloat(
          this.formData.area / 10.764
        ).toFixed(2)
      } else {
        this.formData.area_in_meter = 0
      }
    },
    changeAreaInFeet(event) {
      if (this.formData.area_in_meter) {
        this.formData.area = Number.parseFloat(
          this.formData.area_in_meter * 10.764
        ).toFixed(2)
      } else {
        this.formData.area = 0
      }
    },
    async createRecert() {
      const data = {
        area: this.areaChanged ? this.formData.area : this.project.area,
        area_change_desc: this.formData.desc,
        version_upgrade: !this.staySameVersion,
        type: this.project.type,
        location_changed: false,
        hsr_review: false,
        project_id: this.project.id,
      }
      await this.$store.dispatch('project/createProjectRecertification', data)
      setTimeout(() => {
        this.$refs.modal.isHidden = false
        this.$router.push(
          `/projects/${this.project.type}/${this.project.project_number}/dashboard`
        )
      }, 3000)
    },
  },
}
</script>
