<template>
  <div>
    <div
      class="
        relative
        bg-white
        rounded-lg
        shadow-md
        p-4
        md:p-8
        border border-primary-200
      "
    >
      <WHeadingsHThree
        class="max-w-3xl"
        heading="Presentation and Facilitation Skills"
        sub-heading="Please tell us more about your experience as a presenter and facilitator and why you believe yourself to be a strong candidate to join the WELL Faculty network."
      />

      <div class="mt-6">
        <div
          class="
            w-full
            bg-primary-100
            text-primary-800
            rounded-lg
            border-1 border-grey-200
            p-5
            my-2
          "
        >
          <span class="text-base"
            >Describe your qualifications and experience instructing on human
            health, wellness and the built environment. Provide examples of your
            engaging teaching style, ability to foster active learning and
            manage group dynamics, effective verbal and nonverbal communication
            tactics, and/or capacity to leverage technology and learning aids
            (400 words max).
          </span>
        </div>

        <FormulateInput
          v-model="formData.present_and_facilitation"
          type="textarea"
          class="mr-5 w-full"
        />
      </div>

      <div class="mt-6">
        <div
          class="
            text-white
            w-full
            bg-primary-100
            text-primary-800
            rounded-lg
            border-1 border-grey-200
            p-5
            my-2
          "
        >
          <span class="text-base"
            >Provide a list of your appearances as the lead presenter or
            co-presenter for educational offerings related to human health,
            wellness and the built environment. This may include presentations,
            workshops, courses, lectures, tours and more. Please specify which
            appearances were WELL specific and indicate the audience’s industry
            and level of technical expertise. Please be sure to indicate whether
            you have co-taught a WELL specific offering with a member of the
            IWBI or Delos team.
          </span>
        </div>

        <FormulateInput
          v-model="presenter"
          :value="presenterInput"
          type="fileupload"
          upload-path="faculty/"
          mime-types="application/msword, text/plain, application/pdf"
          validation="required"
          help="Files must be less than 20 MB. Allowed file types: doc, docx, pdf, txt."
        />
      </div>

      <div class="mt-6">
        <div
          class="
            text-white
            w-full
            bg-primary-100
            text-primary-800
            rounded-lg
            border-1 border-grey-200
            p-5
            my-2
          "
        >
          <span class="text-base"
            >Provide at least 2 documents which demonstrate your presentation
            and facilitation capabilities:
          </span>
          <ul class="list-disc list-inside">
            <li>Letter(s) of recommendation or client testimonial(s)</li>
          </ul>
        </div>

        <FormulateInput
          v-model="presentation"
          :value="presentationInput"
          type="fileupload"
          upload-path="faculty/"
          mime-types="application/msword, text/plain, application/pdf"
          help="Files must be less than 20 MB. Allowed file types: doc, docx, pdf, txt."
          validation="required|min:2"
        />
      </div>

      <div class="mt-6">
        <div
          class="
            text-white
            w-full
            bg-primary-100
            text-primary-800
            rounded-lg
            border-1 border-grey-200
            p-5
            my-2
          "
        >
          <span class="text-base"
            >Provide at least one (but preferably multiple) type(s) of
            documentation which demonstrate your presentation and facilitation
            capabilities, including but not limited to:
          </span>
          <ul class="list-disc list-inside">
            <li>Video of you speaking</li>
            <li>
              Survey results/evaluations from a course or presentation you led
              within the past 24 months
            </li>
          </ul>
        </div>

        <FormulateInput
          v-model="documentation"
          :value="documentationInput"
          type="fileupload"
          upload-path="faculty/"
          mime-types=""
          validation="required"
          help="Files must be less than 100 MB. Allowed file types: doc, docx, pdf, txt."
        />
      </div>

      <div class="mt-6">
        <div
          class="
            text-white
            w-full
            bg-primary-100
            text-primary-800
            rounded-lg
            border-1 border-grey-200
            p-5
            my-2
          "
        >
          <span class="text-base"
            >Please tell us about your experience implementing the WELL Building
            Standard and why you believe you are a strong candidate to educate
            the market Describe your qualifications, WELL project experience and
            specific subject matter expertise e.g. any specific Concepts or
            Features within the WBS. Provide project examples and describe your
            role and successes working with/on project teams. (400 words max)
          </span>
        </div>
        <FormulateInput
          v-model="formData.well_experience"
          type="textarea"
          class="mr-5 w-full"
        />
      </div>

      <div class="mt-6">
        <div
          class="
            text-white
            w-full
            bg-primary-100
            text-primary-800
            rounded-lg
            border-1 border-grey-200
            p-5
            my-2
          "
        >
          <span class="text-base"
            >Please indicate your willingness to travel for WELL events and any
            specific compensation requests.
          </span>
        </div>
        <FormulateInput
          v-model="formData.travel_events"
          type="textarea"
          class="mr-5 w-full"
        />
      </div>
    </div>
    <div
      class="
        relative
        bg-white
        rounded-lg
        shadow-md
        p-4
        md:p-8
        border border-primary-200
        mt-6
      "
    >
      <WHeadingsHThree
        class="max-w-3xl"
        heading="WELL FACULTY™ AGREEMENT - Terms &amp; Conditions"
      />
      <div class="bg-gray-50 rounded-md h-48">
        <LegalFacultyAgreement />
      </div>

      <FormulateInput
        type="checkbox"
        label="Yes, I have read and agree to abide by the terms and conditions."
        validation="required"
      />
      <div
        class="
          flex flex-col
          md:flex-row
          items-center
          space-y-2
          md:space-y-0
          justify-between
          mt-6
        "
      >
        <div class="w-60 md:w-48">
          <WButtonsBase
            type="primaryInverted"
            @click.native="$emit('handleStep', --currentStep)"
          >
            Previous Page
          </WButtonsBase>
        </div>
        <div>
          <div
            v-if="currentUser.role.includes('well-admin')"
            class="w-60 md:w-48"
          >
            <FormulateInput
              type="submit"
              label="Continue"
              @click="
                $emit('transferData', {
                  formData: formData,
                  documentation: documentation,
                  presentation: presentation,
                  presenter: presenter,
                })
              "
            />
          </div>
          <div v-else class="w-60">
            <FormulateInput
              type="submit"
              :label="
                faculty != null && Object.keys(faculty).length !== 0
                  ? 'Update'
                  : 'Save and Review Application'
              "
              @click="
                $emit('transferData', {
                  formData: formData,
                  documentation: documentation,
                  presentation: presentation,
                  presenter: presenter,
                })
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    dataInput: {
      type: Object,
      required: true,
    },
    documentationInput: {
      type: Array,
      required: true,
    },
    presentationInput: {
      type: Array,
      required: true,
    },
    presenterInput: {
      type: Array,
      required: true,
    },
    currentStepInput: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      formData: {},
      documentation: [],
      presentation: [],
      presenter: [],
      currentStep: 2,
    }
  },
  computed: {
    ...mapState({
      faculty: (state) => state.faculty.faculty,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.dataInput))
    this.currentStep = this.currentStepInput
  },
}
</script>
