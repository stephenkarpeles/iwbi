<template>
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
    <!-- temporary v-model -->
    <FormulateInput
      v-model="formData.application_status"
      label="Application Status"
      type="radio"
      :options="[
        { label: 'Pending Approval', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Denied ', value: 'denied' },
      ]"
    />
    <!-- date picker -->

    <FormulateInput
      v-model="formData.approved_date"
      class="mt-4"
      type="datetimepicker"
      label="Application Approved Date"
      max="9999-01-01"
    />

    <FormulateInput
      v-model="formData.approved_by"
      type="text"
      label="Approved By"
    />

    <FormulateInput
      v-model="formData.expiration_date"
      type="datetimepicker"
      label="Faculty Expiration date"
      max="9999-01-01"
    />
    <ClientOnly>
      <FormulateInput
        v-model="formData.reason_denial"
        type="richtext"
        label="Reason Denial"
      />
    </ClientOnly>

    <FormulateInput
      v-model="formData.region"
      class="mt-4"
      type="text"
      label="Region"
    />

    <FormulateInput
      v-model="formData.source"
      type="text"
      label="Source (recommended that they are considered)"
    />

    <FormulateInput
      v-model="formData.teaching_experience"
      label="Teaching Experience"
      type="radio"
      :options="{
        0: 'N/A',
        1: 'Yes, quality',
        2: 'Yes, quality unknown',
        3: 'No',
        4: 'Don’t know',
      }"
    />
    <ClientOnly>
      <FormulateInput
        v-model="formData.teaching_experience_notes"
        class="mt-4"
        type="richtext"
        label="Teaching Experience Notes"
      />
    </ClientOnly>
    <ClientOnly>
      <FormulateInput
        v-model="formData.well_events_taught"
        class="mt-4"
        type="richtext"
        label="WELL Events Taught (ongoing)"
      />
    </ClientOnly>
    <FormulateInput
      v-model="formData.willingness_to_train"
      class="mt-4"
      type="text"
      label="Willingness to Train"
    />

    <FormulateInput
      v-model="formData.technical"
      label="Technical"
      type="radio"
      :options="[
        { label: 'Yes, quality', value: 1 },
        { label: 'No', value: 0 },
      ]"
    />

    <FormulateInput
      v-model="formData.bd"
      class="mt-4"
      label="Business Development"
      type="radio"
      :options="[
        { label: 'Yes, quality', value: 1 },
        { label: 'No', value: 0 },
      ]"
    />

    <FormulateInput
      v-model="formData.red_flag"
      label="Red Flag"
      class="mt-4"
      type="radio"
      :options="[
        { label: 'Yes, quality', value: 1 },
        { label: 'No', value: 0 },
      ]"
    />

    <FormulateInput
      v-model="formData.workshops"
      class="mt-4"
      :options="[
        {
          label: 'Understanding the WELL Building Standard - 8 hour',
          value: '8 hour',
        },
        {
          label: 'Understanding the WELL Building Standard - 4 hour',
          value: '4 hour',
        },
        {
          label: 'Understanding the WELL Building Standard - 2 hour',
          value: '2 hour',
        },
        {
          label: 'Introduction to the WELL Building Standard - 1 hour',
          value: '1 hour',
        },
        { label: 'Other', value: 'other' },
      ]"
      type="checkbox"
      label="Which of the following workshops is this Faculty member qualified to teach?"
    />
    <ClientOnly>
      <FormulateInput
        v-model="formData.next_step"
        type="richtext"
        label="Next Step"
        class="mt-4"
      />
    </ClientOnly>
    <FormulateInput
      v-model="formData.next_step_date"
      class="mt-4"
      type="datetimepicker"
      label="Next Step Date"
      max="9999-01-01"
    />
    <ClientOnly>
      <FormulateInput
        v-model="formData.admin_note1"
        type="richtext"
        label="Admin Notes"
      />
    </ClientOnly>
    <ClientOnly>
      <FormulateInput
        v-model="formData.admin_note2"
        type="richtext"
        class="mt-4"
        label="Admin Notes 2"
      />
    </ClientOnly>
    <ClientOnly>
      <FormulateInput
        v-model="formData.admin_note3"
        type="richtext"
        class="mt-4"
        label="Admin Notes 3"
      />
    </ClientOnly>
    <!-- look into file upload -->
    <FormulateInput
      v-model="scoreCards"
      :value="scoreCardsInput"
      class="mt-4"
      label="Scorecard Documents"
      type="fileupload"
      :multiple="false"
      upload-path="faculty/scorecards/"
      help="Files must be less than 20 MB. Allowed file types: doc, docx, pdf, txt."
      mime-types="application/msword, text/plain, application/pdf"
    />

    <div
      class="
        flex
        justify-between
        mt-6
        flex-col
        md:flex-row
        space-y-2
        md:space-y-0
        items-center
      "
    >
      <div class="w-60 md:w-48">
        <WButtonsBase
          type="primaryInverted"
          @click.native="$emit('handleStep', currentStep--)"
        >
          Previous Page
        </WButtonsBase>
      </div>
      <div class="w-60">
        <FormulateInput
          type="submit"
          :label="
            faculty != null && Object.keys(faculty).length !== 0
              ? 'Update And Review Application'
              : 'Continue'
          "
          @click="
            $emit('transferData', {
              formData: formData,
              scoreCards: scoreCards,
            })
          "
        />
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
    scoreCardsInput: {
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
      scoreCards: [],
      currentStep: 3,
    }
  },
  computed: {
    ...mapState({
      faculty: (state) => state.faculty.faculty,
    }),
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.dataInput))
    this.currentStep = this.currentStepInput
  },
}
</script>
