<template>
  <div>
    <div v-if="concepts">
      <WHeadingsHFour heading="Rating System" />
      <div class="text-sm">
        Projects pursuing WELL Certification may seek to gain points for
        individual building or community certifications using a health and
        wellness or green rating system that does not currently qualify for
        points under WELL. IWBI invites projects to submit information about the
        rating system they would like to use by selecting “Rating System
        Submission” in the dropdown menu below and completing the required
        information. Projects can submit rating systems at no additional cost,
        either before or after project registration. You can find
        <a href="/resources/preapproved-programs" target="_blank"
          >the list of pre-approved rating systems here</a
        >.
      </div>
      <WHeadingsHFour heading="Rating System submission guidance" />

      <ul class="mt-5 text-sm list-disc pl-5">
        <li>
          <p class="lh-5 tx-14">
            A formal ruling on the rating system submission will be provided
            within 20 to 25 business days. Project teams may submit any
            questions to
            <a href="mailto:technical@wellcertified.com"
              >technical@wellcertified.com</a
            >.
          </p>
        </li>
      </ul>
      <div>
        <FormulateForm class="mt-5 space-y-2" @submit="submitForm">
          <FormulateInput
            v-model="formData.feature_id"
            :options="featureOptions"
            type="select"
            label="Feature*"
            validation="required"
            @input="
              formData.part_id = []
              $store.dispatch('features/getFeatureById', formData.feature_id)
            "
          />
          <FormulateInput
            v-model="formData.part_id"
            :options="partOptions"
            type="checkbox"
            label="Applicable part(s) *"
            validation="min:1,length"
          />
          <FormulateInput
            v-model="formData.reason"
            type="textarea"
            label="Reason for Equivalency Request *"
            validation="required"
          />
          <FormulateInput
            v-model="formData.proposed"
            type="textarea"
            label="Proposed Alternative Means of Compliance *"
            validation="required"
          />
          <FormulateInput
            v-model="formData.region"
            type="text"
            label="Regions/Countries where Equivalency may be Applicable *"
            validation="required"
          />
          <FormulateInput
            v-model="formData.verification_method"
            type="textarea"
            label="Verification method within proposed equivalent *"
            validation="required"
          />
          <FormulateInput
            v-model="formData.similar_feature_req"
            type="textarea"
            label="Similarities to WELL feature requirement *"
            validation="required"
          />
          <FormulateInput
            v-model="formData.diff_feature_req"
            type="textarea"
            label="Differences from WELL feature requirement *"
            validation="required"
          />
          <FormulateInput
            v-model="formData.document"
            label="Documents"
            :value="formData.document"
            type="fileupload"
            upload-path="membership/"
            mime-types=""
          />
          <FormulateInput type="submit" label="Submit" />
        </FormulateForm>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Rating System Form...</div>
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
        type: 'ep',
        type_internal: 'v2-pilot',
        sub_type: 0,
        document: [],
      },
    }
  },
  computed: {
    ...mapState({
      concepts: (state) => state.concepts.concepts,
      feature: (state) => state.features.feature,
      project_id: (state) => state.project.project.id,
    }),
    featureOptions() {
      const options = []

      if (this.concepts) {
        for (let concept = 0; concept < this.concepts.length; concept++) {
          for (
            let feature = 0;
            feature < this.concepts[concept].features.length;
            feature++
          ) {
            const option = {
              label: null,
              value: null,
            }
            option.label = this.concepts[concept].features[
              feature
            ].feature_full_name
            option.value = String(this.concepts[concept].features[feature].id)
            options.push(option)
          }
        }
      }
      return options
    },
    partOptions() {
      const options = []
      if (this.feature) {
        for (let i = 0; i < this.feature.parts.length; i++) {
          const option = {}
          option.value = this.feature.parts[i].id
          option.label = this.feature.parts[i].name
          options.push(option)
        }
      }
      return options
    },
  },
  mounted() {
    this.$store.dispatch('concepts/getConceptsAndFeatures')
  },
  methods: {
    submitForm() {
      // attach project id to submission data
      this.formData.project_id = this.project_id

      // format documents object for laravel controller
      this.formData.document = this.formData.document.map(function (file) {
        const fileInfo = { link_s3: file.url }
        return fileInfo
      })

      this.$store
        .dispatch('project/createAAP', this.formData)
        .then(alert('submitted aap'))
    },
  },
}
</script>
