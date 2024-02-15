<template>
  <div v-if="features">
    <div>
      <WHeadingsHFour heading="Equivalency Proposal" />
      <div class="text-sm">
        Projects registered in countries other than the United States may find
        some challenges based on local regulations and standards that differ
        from those outlined in WELL. IWBI invites projects to petition for the
        use of equivalent requirements that is more relevant to the
        country/region where a project is located, through an equivalency
        proposal (EP). An EP is a formal request submitted by a project to
        receive approval for the substitution of an equivalent standard, code or
        practice in place of WELL feature requirements, prior to final
        documentation review.
        <br />
        <br />
        Each project can submit EPs at no additional cost. EPs may be submitted
        before or after project registration.
      </div>
      <WHeadingsHFour heading="Equivalency Proposal submission guidance" />

      <ul class="mt-5 text-sm list-disc pl-5">
        <li>
          An EP is appropriate for projects in a region of the world where it is
          a challenge to comply with existing feature requirements.
        </li>
        <li>
          An EP is appropriate for projects that wish to propose an equivalent
          standard, code or practice to meet the feature intent. The EP proposal
          must include clear, substantiated evidence of how the equivalency
          meets the intent of the feature, including any relevant background
          information or supporting documentation.
        </li>
        <li>
          A formal ruling on the Equivalency Proposal will be provided within 20
          to 25 business days. To determine whether submission of an EP is
          recommended, a project team may inquire with the project’s WELL
          coaching contact (or
          <a class="text-primary-600" href="mailto:technical@wellcertified.com"
            >technical@wellcertified.com</a
          >
          if the project is not registered).
        </li>
      </ul>
    </div>

    <div>
      <div>
        <FormulateForm class="mt-5 space-y-2" @submit="submitForm">
          <FormulateInput
            v-model="formData.type_internal"
            :options="[
              {
                label: 'WELL v2',
                value: 'v2',
              },
              {
                label: 'WELL v2 Pilot',
                value: 'v2-pilot',
              },
              {
                label: 'WELL v1',
                value: 'v1',
              },
              {
                label: 'WELL Community',
                value: 'community',
              },
              {
                label: 'WELL Health Safety',
                value: 'v2-hsr',
              },
            ]"
            type="select"
            label="Alternative Version*"
            validation="required"
            @input="getFeaturesByType()"
          />

          <FormulateInput
            v-model="formData.feature_id"
            :options="featureOptions"
            type="select"
            label="Feature*"
            validation="required"
            @input="getFeatureOptions()"
          />

          <FormulateInput
            v-if="
              formData.feature_id &&
              formData.type_internal !== 'v1' &&
              formData.type_internal !== 'community'
            "
            v-model="formData.part_id"
            :options="partOptions"
            type="checkbox"
            label="Applicable part(s) *"
            validation="^required|min:1,length"
            error-behavior="live"
          />

          <ClientOnly>
            <FormulateInput
              v-model="formData.reason"
              type="richtext"
              label="Reason for Equivalency Request *"
              validation="required"
            >
              <template slot="help">
                <div class="text-sm text-gray-500">
                  Please state why the project cannot comply with the feature
                  requirements as written. This may be due to cultural concerns,
                  the availability of an alternate reference standard, or the
                  lack of compliant materials, etc.
                </div>
              </template>
            </FormulateInput>
          </ClientOnly>
          <ClientOnly>
            <FormulateInput
              v-model="formData.proposed"
              type="richtext"
              label="Proposed Alternative Means of Compliance *"
              validation="required"
            >
              <template slot="help">
                <div class="text-sm text-gray-500">
                  Please provide the name and a description of the proposed
                  equivalency and how it meets the intent of the feature. If
                  applicable, please state what international standards are
                  referenced within the proposed equivalent standard.
                </div>
              </template>
            </FormulateInput>
          </ClientOnly>

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
            placeholder="If applicable, please include a description of the verification method within the proposed equivalency, ie, performance-based, third-party verified, lab-tested, etc."
          />
          <FormulateInput
            v-model="formData.similar_feature_req"
            type="textarea"
            label="Similarities to WELL feature requirement *"
            validation="required"
            placeholder="Please provide a description of the similarities between the WELL feature requirements and the proposed equivalency, including testing or measurement protocols, emission/content limitations, etc."
          />
          <FormulateInput
            v-model="formData.diff_feature_req"
            type="textarea"
            label="Differences from WELL feature requirement *"
            validation="required"
            placeholder="Please provide a description of the differences between the WELL feature requirement and the proposed equivalency, including testing or measurement protocols, emission/content limitations, etc. If applicable, please provide an explanation of any potential benefits associated with these differences."
          />
          <FormulateInput
            v-model="formData.document"
            label="Documents"
            :value="formData.document"
            type="fileupload"
            upload-path="Ep/"
            mime-types=""
          />

          <FormulateInput type="submit" label="Submit" />
        </FormulateForm>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading Equivalency Form...</div>
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
        part_id: [],
        mid_review_comment_documents: [],
      },
      statusOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'altered', label: 'Approved with altered language' },
        { value: 'denied', label: 'Not Approved' },
        { value: 'inforequested', label: 'Additional Information Requested' },
        { value: 'not-applicable', label: 'Not Applicable' },
      ],
    }
  },

  computed: {
    ...mapState({
      features: (state) => state.features.features,
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
      if (
        this.features &&
        this.formData.feature_id &&
        this.formData.type_internal !== 'v1'
      ) {
        const selectedFeature = this.features.filter(
          (a) => a.id === parseInt(this.formData.feature_id)
        )
        if (selectedFeature.length) {
          for (let i = 0; i < selectedFeature[0].parts.length; i++) {
            const option = {}
            option.value = selectedFeature[0].parts[i].id
            option.label = selectedFeature[0].parts[i].name
            options.push(option)
          }
        }
      }
      return options
    },
  },

  async mounted() {
    await this.getFeaturesByType()
  },
  methods: {
    async submitForm() {
      this.formData.document = this.formData.document.map(function (file) {
        return { link_s3: file.url }
      })
      this.formData.mid_review_comment_documents = this.formData.mid_review_comment_documents.map(
        function (file) {
          return { link_s3: file.url }
        }
      )

      await this.$axios.post('api/aap/create', this.formData).then((res) => {
        this.$parent.getAlternatives()
        this.$parent.mode = 'list'
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Equivalency Proposal sucessfully created!',
        })
      })
    },
    getFeatureOptions() {
      this.formData.part_id = []
      if (this.formData.feature_id) {
        this.$store.dispatch(
          'features/getFeatureById',
          parseInt(this.formData.feature_id)
        )
      }
    },

    async getFeaturesByType() {
      await this.$store.dispatch(
        'features/getAllFeaturesByVersion',
        this.formData.type_internal
      )
    },
  },
}
</script>
