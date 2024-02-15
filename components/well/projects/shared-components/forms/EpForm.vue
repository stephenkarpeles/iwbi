<template>
  <div>
    <div v-if="features && formReady">
      <div v-if="strategy">
        <WLinksBase
          data-id="ep-back-btn"
          link="#"
          icon="arrow-narrow-left"
          @click.native="$parent.currentScreen = 'landing'"
        >
          Back
        </WLinksBase>
        <div class="bg-secondary-600 text-white p-5 rounded-lg mt-2">
          {{ 'Editing ' + formData.type.toUpperCase() + '-0' + formData.id }}
        </div>
      </div>
      <div v-else>
        <div class="hidden md:block">
          <WHeadingsHFour heading="Equivalency Proposal" />
          <div class="text-sm">
            Projects registered in countries other than the United States may
            find some challenges based on local regulations and standards that
            differ from those outlined in WELL. IWBI invites projects to
            petition for the use of equivalent requirements that is more
            relevant to the country/region where a project is located, through
            an equivalency proposal (EP). An EP is a formal request submitted by
            a project to receive approval for the substitution of an equivalent
            standard, code or practice in place of WELL feature requirements,
            prior to final documentation review.
            <br />
            <br />
            Each project can submit EPs at no additional cost. EPs may be
            submitted before or after project registration.
          </div>
        </div>
        <LazyAccordiansBase label="Equivalency Proposal" class="sm:hidden my-4">
          <template #content>
            <div class="text-sm">
              Projects registered in countries other than the United States may
              find some challenges based on local regulations and standards that
              differ from those outlined in WELL. IWBI invites projects to
              petition for the use of equivalent requirements that is more
              relevant to the country/region where a project is located, through
              an equivalency proposal (EP). An EP is a formal request submitted
              by a project to receive approval for the substitution of an
              equivalent standard, code or practice in place of WELL feature
              requirements, prior to final documentation review.
              <br />
              <br />
              Each project can submit EPs at no additional cost. EPs may be
              submitted before or after project registration.
            </div>
          </template>
        </LazyAccordiansBase>
        <div class="hidden md:block">
          <WHeadingsHFour heading="Equivalency Proposal submission guidance" />

          <ul class="mt-5 text-sm list-disc pl-5">
            <li>
              An EP is appropriate for projects in a region of the world where
              it is a challenge to comply with existing feature requirements.
            </li>
            <li>
              An EP is appropriate for projects that wish to propose an
              equivalent standard, code or practice to meet the feature intent.
              The EP proposal must include clear, substantiated evidence of how
              the equivalency meets the intent of the feature, including any
              relevant background information or supporting documentation.
            </li>
            <li>
              A formal ruling on the Equivalency Proposal will be provided
              within 20 to 25 business days. To determine whether submission of
              an EP is recommended, a project team may inquire with the
              project’s WELL coaching contact (or
              <a
                class="text-primary-600"
                href="mailto:technical@wellcertified.com"
                >technical@wellcertified.com</a
              >
              if the project is not registered).
            </li>
          </ul>
        </div>
        <LazyAccordiansBase
          label="Equivalency Proposal submission guidance"
          class="sm:hidden my-4"
        >
          <template #content>
            <ul class="text-sm list-disc pl-5">
              <li>
                An EP is appropriate for projects in a region of the world where
                it is a challenge to comply with existing feature requirements.
              </li>
              <li>
                An EP is appropriate for projects that wish to propose an
                equivalent standard, code or practice to meet the feature
                intent. The EP proposal must include clear, substantiated
                evidence of how the equivalency meets the intent of the feature,
                including any relevant background information or supporting
                documentation.
              </li>
              <li>
                A formal ruling on the Equivalency Proposal will be provided
                within 20 to 25 business days. To determine whether submission
                of an EP is recommended, a project team may inquire with the
                project’s WELL coaching contact (or
                <a
                  class="text-primary-600"
                  href="mailto:technical@wellcertified.com"
                  >technical@wellcertified.com</a
                >
                if the project is not registered).
              </li>
            </ul>
          </template>
        </LazyAccordiansBase>
      </div>
      <div>
        <div>
          <FormulateForm class="mt-5 space-y-2" @submit="submitForm">
            <FormulateInput
              v-if="
                project &&
                (project.hsr_scorecard_version_id !== null ||
                  project.wpr_scorecard_version_id !== null)
              "
              v-model="formData.type_internal"
              :options="alternativeType"
              type="select"
              label="Alternative Version*"
              validation="required"
              :disabled="strategy ? true : false"
              @input="getFeaturesByType()"
            />
            <FormulateInput
              data-id="ep-feature-select"
              v-model="formData.feature_id"
              :options="featureOptions"
              type="select"
              label="Feature*"
              validation="required"
              :disabled="strategy ? true : false"
              @input="getFeatureOptions()"
            />
            <FormulateInput
              v-if="formData.feature_id"
              v-model="formData.part_id"
              :options="partOptions"
              type="checkbox"
              label="Applicable part(s) *"
              validation="min:1,length"
              :disabled="strategy ? true : false"
            />

            <ClientOnly>
              <FormulateInput
                data-id="ep-reason-input"
                :key="forceReMount + 2"
                v-model="formData.reason"
                type="richtext"
                label="Reason for Equivalency Request *"
                validation="required"
              >
                <template slot="help">
                  <div class="text-sm text-gray-500">
                    Please state why the project cannot comply with the feature
                    requirements as written. This may be due to cultural
                    concerns, the availability of an alternate reference
                    standard, or the lack of compliant materials, etc.
                  </div>
                </template>
              </FormulateInput>
            </ClientOnly>
            <ClientOnly>
              <FormulateInput
                data-id="ep-alternative-input"
                :key="forceReMount + 1"
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
              data-id="ep-region-input"
              v-model="formData.region"
              type="text"
              label="Regions/Countries where Equivalency may be Applicable *"
              validation="required"
            />
            <FormulateInput
              data-id="ep-verification-input"
              :key="forceReMount + 3"
              v-model="formData.verification_method"
              type="richtext"
              label="Verification method within proposed equivalent *"
              validation="required"
              placeholder="If applicable, please include a description of the verification method within the proposed equivalency, ie, performance-based, third-party verified, lab-tested, etc."
            />
            <FormulateInput
              data-id="ep-sim-equipment-input"
              :key="forceReMount + 4"
              v-model="formData.similar_feature_req"
              type="richtext"
              label="Similarities to WELL feature requirement *"
              validation="required"
              placeholder="Please provide a description of the similarities between the WELL feature requirements and the proposed equivalency, including testing or measurement protocols, emission/content limitations, etc."
            />
            <FormulateInput
              data-id="ep-diff-equipment-input"
              :key="forceReMount + 5"
              v-model="formData.diff_feature_req"
              type="richtext"
              label="Differences from WELL feature requirement *"
              validation="required"
              placeholder="Please provide a description of the differences between the WELL feature requirement and the proposed equivalency, including testing or measurement protocols, emission/content limitations, etc. If applicable, please provide an explanation of any potential benefits associated with these differences."
            />
            <FormulateInput
              data-id="ep-doc-upload"
              :key="forceReMount"
              v-model="formData.document"
              label="Documents"
              :value="formData.document"
              type="fileupload"
              upload-path="Ep/"
              mime-types=""
            />

            <div
              v-if="
                strategy &&
                (currentUser.role.includes('well-admin') ||
                  currentUser.role.includes('well-assessor'))
              "
            >
              <FormulateInput
                v-model="formData.status"
                :options="statusOptions"
                type="radio"
                label="AAP Status*"
                validation="min:1,length"
              />
              <ClientOnly>
                <FormulateInput
                  v-if="formData.status === 'inforequested'"
                  :key="forceReMount + 8"
                  v-model="formData.mid_review_comment"
                  type="richtext"
                  validation="required"
                  label="Mid Review Comments*"
                />
              </ClientOnly>
              <ClientOnly>
                <FormulateInput
                  v-if="formData.status === 'inforequested'"
                  :key="forceReMount + 7"
                  v-model="formData.mid_review_comment_documents"
                  label="Mid-Review Documents"
                  :value="formData.mid_review_comment_documents"
                  type="fileupload"
                  upload-path="Ep/"
                  mime-types=""
                />
              </ClientOnly>
              <ClientOnly>
                <FormulateInput
                  :key="forceReMount + 6"
                  v-model="formData.response"
                  type="richtext"
                  label="IWBI Response"
                />
              </ClientOnly>
              <FormulateInput
                v-model="formData.response_date"
                type="datetimepicker"
                label="IWBI Response Date"
                max="9999-01-01"
              />
              <FormulateInput
                v-model="formData.aap_decision_date"
                type="datetimepicker"
                label="AAP Decision Date"
                max="9999-01-01"
              />
              <FormulateInput
                v-model="formData.amount"
                type="text"
                label="Amount"
              />
              <FormulateInput
                v-model="formData.payment_status"
                :options="[
                  { label: 'Unpaid', value: 0 },
                  { label: 'Paid', value: 1 },
                ]"
                type="radio"
                label="Payment Status"
              />
              <ClientOnly>
                <FormulateInput
                  :key="forceReMount + 9"
                  v-model="formData.reviewer_notes"
                  type="richtext"
                  label="Admin Notes"
                />
              </ClientOnly>
              <ClientOnly>
                <FormulateInput
                  :key="forceReMount + 10"
                  v-model="formData.iwbi_notes"
                  type="richtext"
                  label="IWBI Notes"
                />
              </ClientOnly>
            </div>

            <FormulateInput
              data-id="ep-submit-btn"
              type="submit"
              label="Submit"
            />
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
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    strategy: {
      required: false,
      type: [Object, Array],
      default: null,
    },
  },
  data() {
    return {
      formReady: false,
      formData: {
        type: 'ep',
        type_internal: 'v2-pilot',
        sub_type: 0,
        document: [],
        part_id: [],
        mid_review_comment_documents: [],
      },
      forceReMount: 0,
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
      project: (state) => state.project.project,
      currentUser: (state) => state.user.currentUser,
    }),
    alternativeType() {
      const label = this.project.type === 'v2' ? 'WELL v2' : 'WELL v2 Pilot'
      const options = [{ label, value: this.project.type }]

      if (this.project.hsr_scorecard_version_id !== null) {
        options.push({ label: 'WELL Health-Safety Rating', value: 'v2-hsr' })
      }

      if (this.project.wpr_scorecard_version_id !== null) {
        options.push({ label: 'WELL Performance Rating', value: 'wpr' })
      }

      return options
    },
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
            option.value = selectedFeature[0].parts[i].id
            option.label = selectedFeature[0].parts[i].name
            options.push(option)
          }
        }
      }
      return options
    },
  },
  watch: {
    strategy(newValue) {
      if (newValue) {
        this.loadForm()
      } else {
        this.formData = {
          type: 'ep',
          type_internal: this.strategy
            ? this.strategy.type_internal
            : this.project.type,
          sub_type: 0,
          document: [],
          part_id: [],
          mid_review_comment_documents: [],
        }
      }
      // this will force the fileupload component to remount elegantly to take in the new data
      this.forceReMount++
    },
  },
  mounted() {
    if (this.project && !this.strategy) {
      this.$store.dispatch(
        'features/getAllFeaturesByVersionId',
        this.project.applicable_version_id
      )
      this.formReady = true
    } else if (this.strategy) {
      this.$store.dispatch(
        'features/getAllFeaturesByVersionId',
        this.strategy.version_id
      )
      this.loadForm()
      this.formReady = true
    }
    this.forceReMount++
  },
  methods: {
    getFeaturesByType() {
      if (this.formData.type_internal === 'v2-hsr') {
        this.$store.dispatch(
          'features/getAllFeaturesByVersionId',
          this.project.hsr_scorecard_version_id
        )
      } else if (this.formData.type_internal === 'wpr') {
        this.$store.dispatch(
          'features/getAllFeaturesByVersionId',
          this.project.wpr_scorecard_version_id
        )
      } else {
        this.$store.dispatch(
          'features/getAllFeaturesByVersionId',
          this.project.applicable_version_id
        )
      }
      this.$set(this, 'formData.feature_id', null)
      this.$set(this, 'formData.part_id', [])
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
    clearForm() {
      this.formData = {
        type: 'ep',
        type_internal: this.strategy
          ? this.strategy.type_internal
          : this.project.type,
        sub_type: 0,
        document: [],
      }
    },
    loadForm() {
      this.formData = { ...this.strategy }

      this.$store
        .dispatch('features/getFeatureById', this.formData.feature_id)
        .then(() => {
          this.formData.part_id = this.formData.parts.map(function (part) {
            return part.part_id
          })
        })

      this.formData.document = this.formData.documents
      this.formData.mid_review_comment_documents = []
    },
    submitForm() {
      // attach project id to submission data
      if (this.project) {
        this.formData.project_id = this.project.id
      }

      // format documents object for laravel controller
      this.formData.document = this.formData.document.map(function (file) {
        return { link_s3: file.url }
      })
      this.formData.mid_review_comment_documents =
        this.formData.mid_review_comment_documents.map(function (file) {
          return { link_s3: file.url }
        })

      if (!this.strategy) {
        this.$store
          .dispatch('project/createAAP', this.formData)
          .then(this.clearForm(), (this.$parent.currentScreen = 'landing'))
      } else {
        this.$store.dispatch('project/updateAAP', this.formData).then(() => {
          this.clearForm()
          setTimeout(() => {
            this.$store.dispatch(
              'alternative/getStrategy',
              this.$route.params.altId
            )
            this.$parent.currentScreen = 'landing'
          }, 1500)
        })
      }
    },
  },
}
</script>
