<template>
  <div>
    <div v-if="features">
      <WHeadingsHFour heading="Request guidance" />
      <div>
        <FormulateForm class="mt-5 space-y-2" @submit="submitGuidance">
          <FormulateInput
            data-id="guidance-feature-select"
            v-model="formData.feature_id"
            :options="featureOptions"
            type="select"
            label="Feature*"
            validation="required"
          />
          <FormulateInput
            v-if="formData.feature_id"
            :key="forceReMount + 3"
            v-model="formData.parts"
            :options="partOptions"
            type="checkbox"
            label="Applicable part(s) *"
          />
          <FormulateInput
            v-model="formData.guidance"
            :options="guidanceList"
            type="radio"
            label="Which of the following would you like guidance on for this feature? *"
            validation="required"
          />
          <div v-if="formData.guidance === 'requirement'" class="mb-5">
            <FormulateInput
              v-model="formData.requirement"
              :options="requirementList"
              type="checkbox"
              label="Are you requesting threshold requirement for:"
            />
          </div>
          <div v-if="formData.guidance === 'applicable'" class="mb-5">
            <FormulateInput
              v-model="formData.requirement"
              :options="requirementList"
              type="checkbox"
              label="Are you requesting applicability requirement for:"
            />
          </div>
          <div v-if="formData.requirement.includes('space-type')" class="mb-5">
            <FormulateInput
              v-model="formData.space_type_desc"
              placeholder="Please describe which space type(s) require guidance (include project plans clearly indicating the unique space type(s) within the project boundary, describe typical occupants that use the space, and how the space(s) is used)."
              type="textarea"
            />
          </div>
          <div
            v-if="formData.requirement.includes('occupant-type')"
            class="mb-5"
          >
            <FormulateInput
              v-model="formData.occupant_type_desc"
              placeholder="Please describe which occupant type(s) require guidance (include description of typical occupant hours, occupant activities within the space, and any unique occupant characteristics that may require special consideration)."
              type="textarea"
            />
          </div>
          <FormulateInput
            :key="forceReMount"
            v-model="formData.document"
            label="Attach Document"
            :value="formData.document"
            :is-zendesk-upload="true"
            type="fileupload"
          />
          <FormulateInput data-id="guidance-btn" type="submit" label="Submit" />
        </FormulateForm>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">
          Loading Guidance Request Form...
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      formData: {
        document: [],
        parts: [],
        feature_id: null,
        guidance: '',
        requirement: [],
        space_type_desc: '',
        occupant_type_desc: '',
      },
      forceReMount: 0,
      guidanceList: [
        {
          label:
            'Threshold requirement for my unique space type(s) / occupant type(s)',
          value: 'requirement',
        },
        {
          label:
            'Applicability requirement for my unique space type(s) / occupant type(s)',
          value: 'applicable',
        },
      ],
      requirementList: [
        { label: 'Unique space type(s)', value: 'space-type' },
        { label: 'Unique occupant type(s)', value: 'occupant-type' },
      ],
    }
  },
  computed: {
    ...mapState({
      features: (state) => state.features.features,
      project: (state) => state.project.project,
      currentUser: (state) => state.user.currentUser,
    }),
    featureOptions() {
      const options = []

      if (this.features) {
        for (let b = 0; b < this.features.length; b++) {
          const option = {
            label: this.features[b].feature_full_name,
            value: String(this.features[b].id),
          }
          options.push(option)
        }
      }
      return options
    },
    partOptions() {
      const options = []
      if (this.features && this.formData.feature_id) {
        const selectedFeature = this.features.filter(
          (a) => a.id === parseInt(this.formData.feature_id)
        )
        if (selectedFeature.length) {
          for (let i = 0; i < selectedFeature[0].parts.length; i++) {
            const option = {}
            option.value = selectedFeature[0].parts[i].name
            option.label = selectedFeature[0].parts[i].name
            options.push(option)
          }
        }
      }
      return options
    },
  },
  methods: {
    getFeatureDetails() {
      return this.features.filter(
        (a) => a.id === parseInt(this.formData.feature_id)
      )[0]
    },
    async submitGuidance() {
      if (this.formData.guidance === 'requirement') {
        this.formData.subject = this.guidanceList[0].label
      } else {
        this.formData.subject = this.guidanceList[1].label
      }
      const guidanceTitle =
        '<b>Which of the following would you like guidance on for this feature?</b><br>' +
        this.formData.subject +
        '<br><br>'
      let option2 = ''
      if (this.formData.guidance === 'requirement') {
        option2 =
          '<b>Does this requirement threshold address all space types, and all occupants, within your project boundary?</b><br>'
        if (this.formData.requirement.includes('space-type')) {
          option2 +=
            'No, the requirement threshold doesn’t address all my project’s <b>space types.</b><br>' +
            this.formData.space_type_desc +
            '<br>'
        }
        if (this.formData.requirement.includes('occupant-type')) {
          option2 +=
            'No, the requirement threshold doesn’t address all my project’s <b>occupant types.</b><br>' +
            this.formData.occupant_type_desc +
            '<br>'
        }
      } else {
        option2 =
          '<b>Is the scope of the requirement applicable to all space types, and all occupants, within your project boundary?</b><br>'
        if (this.formData.requirement.includes('space-type')) {
          option2 +=
            'No, the requirement doesn’t apply to all my project’s <b>space types.</b><br>' +
            this.formData.space_type_desc +
            '<br>'
        }
        if (this.formData.requirement.includes('occupant-type')) {
          option2 +=
            'No, the requirement doesn’t apply to all my project’s <b>occupant types.</b><br>' +
            this.formData.occupant_type_desc +
            '<br>'
        }
      }
      const description = guidanceTitle + '' + option2
      this.formData.description = description
      const feature = this.getFeatureDetails(this.formData.feature_id)
      const data = {
        user_email: this.currentUser.email,
        subject: this.formData.subject,
        description: this.formData.description,
        tags: [
          'projectid:' + this.project.id,
          'server:' + 'v2-test',
          this.partOptions,
        ],
        issue_catagory: feature ? feature.feature_full_name : '',
        issue_sub_catagory: feature ? feature.feature_full_name : '',
        issue_feature_parts: this.formData.parts,
        project_number: this.project.project_number,
        project_name: this.project.name,
        is_guidance: true,
        custom_guidance: this.formData.guidance,
        uploads: this.formData.document.map((a) => a.token),
      }
      const newTicket = await this.$store.dispatch(
        'support/createGuidance',
        data
      )
      this.$parent.currentScreen = 'landing'
      this.$parent.currentTicket = newTicket
    },
  },
}
</script>
