<template>
  <div class="border border-primary-200 rounded-lg">
    <div class="flex flex-col-reverse sm:flex-row">
      <div class="p-8 sm:w-1/2 max-w-full shadow-md min-h-[800px]">
        <h1
          class="
            mb-1.5
            font-bold
            text-primary-900 text-3xl text-center
            sm:text-left
          "
        >
          Program-Specific Questions
        </h1>
        <p
          class="
            text-base text-primary-900
            opacity-50
            leading-6
            tracking-tighter
            text-center
            sm:text-left
          "
        >
          These questions will help us assess appropriate Innovation features
          for you to pursue.
        </p>
        <div class="mt-16">
          <FormulateForm
            name="step-one"
            class="space-y-3"
            @submit="submitProgramSpecific"
          >
            <div class="flex flex-col">
              <div class="mb-4">
                <FormulateInput
                  v-model="programSpecific.well_professional"
                  type="select"
                  label="Will your WELL Health-Safety Rating Project Team include a WELL
                Accredited Professional?"
                  :options="wellAPOptions"
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
                  v-model="programSpecific.certification_status"
                  type="select"
                  label="Is your project currently WELL Certified or
                Precertified?"
                  :options="certificationStatusOptions"
                  validation="required"
                  :input-class="
                    (context, classes) => [
                      'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                    ]
                  "
                  @change="onChangedCertificationStatus"
                />
              </div>

              <div
                v-if="programSpecific.certification_status === 'no'"
                class="mb-4"
              >
                <FormulateInput
                  v-model="programSpecific.already_submitted"
                  type="select"
                  label="Do you anticipate the project to earn WELL Certification or
                Precertification before you apply for the Health-Safety
                Rating?"
                  :options="alreadySubmittedOptions"
                  validation="required"
                  :input-class="
                    (context, classes) => [
                      'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                    ]
                  "
                />
              </div>

              <div
                v-if="
                  programSpecific.certification_status === 'well_pre_certified'
                "
                class="mb-4"
              >
                <FormulateInput
                  v-model="programSpecific.certification_before_hsr"
                  type="select"
                  label="Do you anticipate the project to earn WELL Certification before
                you apply for the the Health-Safety Rating?"
                  :options="certBeforeHsrOptions"
                  validation="required"
                  :input-class="
                    (context, classes) => [
                      'rounded text-primary-700 mb-2 w-full border-primary-300 text-sm',
                    ]
                  "
                />
              </div>
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
                      There was an error submitting the assessment
                    </h3>
                    <div class="mt-2 text-sm text-red-700">
                      <ul class="list-disc pl-5 space-y-1">
                        <li v-for="error in errors" :key="error">
                          {{ error }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <FormulateInput type="submit" label="Submit" />
            </div>
          </FormulateForm>
        </div>
      </div>

      <div
        class="
          sm:w-1/2
          max-w-full
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
        <div class="xl:w-1/2">
          <img
            class="max-w-full"
            src="/assessment/main-30.png"
            alt="Assessment program specific questions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      programSpecific: {
        well_professional: null,
        certification_status: null,
        already_submitted: null,
        certification_before_hsr: null,
      },
      wellAPOptions: {
        1: 'Yes',
        0: 'No',
      },
      certificationStatusOptions: {
        no: 'No',
        well_certified: 'Yes - We are WELL Certified',
        well_pre_certified: 'Yes - We are WELL Precertified',
      },
      alreadySubmittedOptions: {
        yes_certification:
          'Yes, WELL Certification is expected to be approved before applying for Health-Safety Rating',
        yes_pre_certification:
          'Yes, WELL Precertification is expected to be approved before applying for Health-Safety Rating',
        unsure:
          'No/Unsure – We do not anticipate receiving WELL Certification/Precertification approval before applying for Health-Safety Rating',
        not_pursuing: 'We are not pursuing WELL Certification/Precertification',
      },
      certBeforeHsrOptions: {
        yes: 'Yes, WELL Certification is expected to be approved before applying for Health-Safety Rating',
        unsure:
          'No/Unsure – We do not anticipate receiving WELL Certification/Precertification approval before applying for Health-Safety Rating',
        not_pursuing: 'We are not pursuing WELL Certification',
      },
    }
  },
  methods: {
    submitProgramSpecific() {
      this.$emit('submitted', this.programSpecific)
    },
    onChangedCertificationStatus(v) {
      if (v === 'no') {
        this.programSpecific.certification_before_hsr = null
      } else if (v === 'well_pre_certified') {
        this.programSpecific.already_submitted = null
      } else {
        this.programSpecific.certification_before_hsr = null
        this.programSpecific.already_submitted = null
      }
    },
  },
}
</script>
