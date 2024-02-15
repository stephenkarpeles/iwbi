<template>
  <div>
    <div v-if="features && formReady">
      <div v-if="strategy">
        <WLinksBase
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
          <WHeadingsHFour heading="Alternative Adherence Path" />
          <div class="text-sm">
            WELL welcomes projects to meet feature requirements through
            innovative, alternatives, which can be proposed through an
            alternative adherence path (AAP) submission. An AAP is a formal
            request submitted by a project to receive technical guidance and
            approval for an alternatives to comply with a WELL feature, prior to
            full documentation review.
          </div>
          <ul class="mt-5 text-sm list-disc pl-5">
            <li>
              An AAP is appropriate for projects with a unique, nuanced or
              complex element that restricts their ability to comply with
              existing feature requirements.
            </li>
            <li>
              An AAP is appropriate for projects that wish to propose
              alternative methods to meet the feature intent.
            </li>
            <li>
              The AAP proposal must include clear, substantiated evidence of how
              the proposed alternative meets the intent of the feature,
              including any relevant background information or supporting
              documentation.
            </li>
            <li>
              To determine whether submission of an AAP is recommended, a
              project may inquire with the project's coaching contact and/or the
              WELL Reviewer (or
              <a
                class="text-primary-600"
                href="mailto:technical@wellcertified.com"
                >technical@wellcertified.com</a
              >
              if the project is not registered).
            </li>
            <li>
              A formal ruling on the project's AAP proposal will be provided
              within 10 to 15 business days.
            </li>
          </ul>
        </div>
        <LazyAccordiansBase
          label="Alternative Adherence Path"
          class="sm:hidden my-4"
        >
          <template #content>
            <div class="text-sm">
              WELL welcomes projects to meet feature requirements through
              innovative, alternatives, which can be proposed through an
              alternative adherence path (AAP) submission. An AAP is a formal
              request submitted by a project to receive technical guidance and
              approval for an alternatives to comply with a WELL feature, prior
              to full documentation review.
            </div>
            <ul class="mt-5 text-sm list-disc pl-5">
              <li>
                An AAP is appropriate for projects with a unique, nuanced or
                complex element that restricts their ability to comply with
                existing feature requirements.
              </li>
              <li>
                An AAP is appropriate for projects that wish to propose
                alternative methods to meet the feature intent.
              </li>
              <li>
                The AAP proposal must include clear, substantiated evidence of
                how the proposed alternative meets the intent of the feature,
                including any relevant background information or supporting
                documentation.
              </li>
              <li>
                To determine whether submission of an AAP is recommended, a
                project may inquire with the project's coaching contact and/or
                the WELL Reviewer (or
                <a
                  class="text-primary-600"
                  href="mailto:technical@wellcertified.com"
                  >technical@wellcertified.com</a
                >
                if the project is not registered).
              </li>
              <li>
                A formal ruling on the project's AAP proposal will be provided
                within 10 to 15 business days.
              </li>
            </ul>
          </template>
        </LazyAccordiansBase>
      </div>
      <div>
        <FormulateForm class="mt-5 space-y-2" @submit="submitForm">
          <!-- <FormulateInput
            v-if="project && project.hsr_scorecard_version_id !== null"
            v-model="formData.type_internal"
            :options="aapType"
            type="select"
            label="Alternative Version*"
            validation="required"
            :disabled="strategy ? true : false"
            @input="getFeaturesByType()"
          /> -->

          <FormulateInput
            v-model="formData.feature_id"
            :options="featureOptions"
            type="select"
            label="Feature*"
            validation="required"
            :disabled="strategy ? true : false"
            @input="getFeatureOptions()"
          />

          <ClientOnly>
            <FormulateInput
              :key="forceReMount + 2"
              v-model="formData.reason"
              type="richtext"
              label="Reason for Alternative Means and Methods *"
              validation="required"
            >
              <template slot="help">
                <div class="text-sm text-gray-500">
                  Please state why the project cannot comply with the feature
                  requirements as written.
                </div>
              </template>
            </FormulateInput>
          </ClientOnly>
          <ClientOnly>
            <FormulateInput
              :key="forceReMount + 1"
              v-model="formData.proposed"
              type="richtext"
              label="Proposed Alternative Means of Compliance *"
              validation="required"
            >
              <template slot="help">
                <div class="text-sm text-gray-500">
                  Please provide a description of the project's proposed
                  alternative means of compliance. The proposed alternative must
                  meet the intent of this feature, be fully substantiated by
                  existing scientific, medical, and industry research, and be
                  consistent with applicable laws, regulations, and leading
                  practices in building design and management.
                </div>
              </template>
            </FormulateInput>
          </ClientOnly>
          <FormulateInput
            :key="forceReMount"
            v-model="formData.document"
            label="Documents"
            :value="formData.document"
            type="fileupload"
            upload-path="Aap/"
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
                :key="forceReMount + 7"
                v-model="formData.mid_review_comment"
                type="richtext"
                validation="required"
                label="Mid Review Comments*"
              />
            </ClientOnly>
            <FormulateInput
              v-if="formData.status === 'inforequested'"
              :key="forceReMount + 3"
              v-model="formData.mid_review_comment_documents"
              label="Mid-Review Documents"
              :value="formData.mid_review_comment_documents"
              type="fileupload"
              upload-path="Aap/"
              mime-types=""
            />
            <ClientOnly>
              <FormulateInput
                :key="forceReMount + 4"
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
                :key="forceReMount + 5"
                v-model="formData.reviewer_notes"
                type="richtext"
                label="Admin Notes"
              />
            </ClientOnly>
            <ClientOnly>
              <FormulateInput
                :key="forceReMount + 6"
                v-model="formData.iwbi_notes"
                type="richtext"
                label="IWBI Notes"
              />
            </ClientOnly>
          </div>

          <FormulateInput type="submit" label="Submit" />
        </FormulateForm>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Alternative Form...</div>
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
        type: 'aap',
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
      project: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
    }),
    aapType() {
      const label = this.project.type === 'v2' ? 'WELL v2' : 'WELL v2 Pilot'
      return [
        { label, value: this.project.type },
        { label: 'WELL Health-Safety Rating', value: 'v2-hsr' },
      ]
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
          type: 'aap',
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
      if (this.project.type === 'wpr') {
        this.formData.type_internal = 'wpr'
      }
      if (this.project.type === 'v2-hsr') {
        this.formData.type_internal = 'v2-hsr'
      }
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
      } else {
        this.$store.dispatch(
          'features/getAllFeaturesByVersionId',
          this.project.applicable_version_id
        )
      }
      delete this.formData.feature_id
      delete this.formData.part_id
    },
    getFeatureOptions() {
      this.formData.part_id = []
      if (this.formData.feature_id) {
        this.$store.dispatch(
          'features/getFeatureById',
          this.formData.feature_id
        )
      }
    },
    loadForm() {
      this.formData = JSON.parse(JSON.stringify(this.strategy))

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
    clearForm() {
      this.formData = {
        type: 'aap',
        type_internal: this.strategy
          ? this.strategy.type_internal
          : this.project.type,
        sub_type: 0,
        document: [],
        mid_review_comment_documents: [],
      }
    },
    submitForm() {
      if (this.project) {
        this.formData.portfolio_id = this.project.id
      }
      this.formData.mid_review_comment_documents =
        this.formData.mid_review_comment_documents.map(function (file) {
          return { link_s3: file.url }
        })

      this.formData.part_id = this.partOptions[0].value

      // format documents object for laravel controller
      this.formData.document = this.formData.document.map(function (file) {
        return { link_s3: file.url }
      })

      if (!this.strategy) {
        this.$store
          .dispatch('shared/createAAP', this.formData)
          .then(this.clearForm(), (this.$parent.currentScreen = 'landing'))
      } else {
        this.$store.dispatch('shared/updateAAP', this.formData).then(() => {
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
