<template>
  <FormulateForm @submit="submit()">
    <div v-if="formType !== 'beta'">
      <div>
        The project submits a proposal that meets the following requirements:
      </div>
      <ul v-if="moduleType === 'hsr'">
        <li>
          a. Positively impacts project occupants by relating to acute health
          and safety in a novel way that is not covered in the WELL Health -
          Safety Rating.
        </li>
        <li>
          b. Substantiated by existing scientific, medical and/or industry
          research.
        </li>
        <li>
          c. Consistent with applicable laws and regulations and leading
          practices in building design and operations.
        </li>
      </ul>
      <ul v-if="moduleType === 'project' && module.type === 'v2'">
        <li>
          a. Positively impacts project occupants by supporting health and well
          - being in a novel way that is not covered in WELL v2.
        </li>
        <li>
          b. Substantiated by existing scientific, medical and/or industry
          research.
        </li>
        <li>
          c. Consistent with applicable laws and regulations and leading
          practices in building design and operations.
        </li>
      </ul>
      <ul v-if="moduleType === 'project' && module.type === 'v2-pilot'">
        <li>
          a. Consistent with applicable laws and regulations and leading
          practices in building design and operations.
        </li>
        <li>
          b. Positively impacts project occupants or the general public through
          one of the below:
          <ol class="pl-5">
            <li>
              1. Goes above and beyond the current requirements of an existing
              WELL v2 feature.
            </li>
            <li>
              2. Relates to health and wellness in a novel way that is not
              covered in WELL v2.
            </li>
          </ol>
        </li>
        <li>
          c. Substantiated by existing scientific, medical and/or industry
          research.
        </li>
      </ul>
    </div>
    <div class="text-lg mt-4 font-semibold">
      Fill all parts of this form. Attach documents as needed
    </div>
    <div class="space-y-3 mt-4">
      <ClientOnly>
        <FormulateInput
          v-model="formData.description"
          type="richtext"
          validation="required"
        >
          <template slot="label">
            <div v-if="formType === 'beta'" class="text-sm">
              1. In a few sentences, please tell us why you chose to pursue this
              beta part.
            </div>
            <div v-else>
              <div v-if="moduleType === 'project'" class="text-sm">
                1. Describe the innovation proposal, the health outcome the
                innovation seeks to impact, and how the proposal is applicable
                to the project (e.g., project’s space type, typical occupant
                population, geographical setting).
              </div>
              <div v-if="moduleType === 'hsr'" class="text-sm">
                1. Describe the innovation proposal, the acute health and safety
                concern the innovation seeks to address, and how the proposal is
                applicable to the project (e.g., project’s space type, typical
                occupant population, geographical setting).
              </div>
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-model="formData.why_not_covered"
          type="richtext"
          validation="required"
        >
          <template slot="label">
            <div v-if="formType === 'beta'" class="text-sm">
              2. Please share with us any barriers you experienced while
              implementing or documenting this beta part.
            </div>
            <div v-else>
              <div
                v-if="moduleType === 'project' && module.type === 'v2'"
                class="text-sm"
              >
                2. Explain how the proposal supports occupant health and
                well-being in a novel way that is not already covered in WELL
                v2.
              </div>

              <div
                v-if="moduleType === 'project' && module.type === 'v2-pilot'"
                class="text-sm"
              >
                2. Explain how the proposal: 1) goes above and beyond current
                requirements of an existing WELL v2 pilot feature, or 2) relates
                to health and wellness in a novel way that is not already
                covered in the WELL v2 pilot.
              </div>

              <div v-if="moduleType === 'hsr'" class="text-sm">
                2. Explain how the proposal relates to acute health and safety
                in a novel way that is not already covered in a WELL
                Health-Safety Rating feature.
              </div>
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-model="formData.research_desc"
          type="richtext"
          validation="required"
        >
          <template slot="label">
            <div v-if="formType === 'beta'" class="text-sm">
              3. Do you have any additional comments or suggestions on how to
              improve this beta feature?
            </div>
            <div v-else>
              <div
                v-if="moduleType === 'project' && module.type === 'v2'"
                class="text-sm"
              >
                3. Describe the scientific, medical and/or industry research
                that supports the proposal, including references. Relevant
                documentation on the research listed must be submitted during
                documentation review.
              </div>
              <div
                v-if="moduleType === 'project' && module.type === 'v2-pilot'"
                class="text-sm"
              >
                3. Describe the scientific, medical and/or industry research
                that supports the proposal, including references. Relevant
                documentation on the research listed must be submitted during
                documentation review.
              </div>

              <div v-if="moduleType === 'hsr'" class="text-sm">
                3. Describe the scientific, medical and/or industry research
                that supports the proposal, including references. Relevant
                documentation on the research listed must be submitted during
                documentation review.
              </div>
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-model="formData.implementation_plan"
          type="richtext"
          validation="required"
        >
          <template slot="label">
            <div v-if="formType === 'beta'" class="text-sm">
              4. Do you have any additional comments or suggestions about WELL
              beta features overall?
            </div>
            <div v-else>
              <div
                v-if="moduleType === 'project' && module.type === 'v2'"
                class="text-sm"
              >
                4. Explain the implementation plan for the innovation, along
                with relevant operations schedule, policy document or program
                details.
              </div>
              <div
                v-if="moduleType === 'project' && module.type === 'v2-pilot'"
                class="text-sm"
              >
                4. Describe the scientific, medical and/or industry research
                that supports the proposal, including references. Relevant
                documentation on the research listed must be submitted during
                documentation review.
              </div>

              <div v-if="moduleType === 'hsr'" class="text-sm">
                4. Explain the implementation plan for the innovation, along
                with relevant operations schedule, policy document or program
                details.
              </div>
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-model="formData.additional_info"
          type="richtext"
          validation="required"
        >
          <template slot="label">
            <div v-if="formType === 'beta'" class="text-sm">
              5. Please add any additional information your WELL Reviewer should
              know regarding the beta proposal. Additional annotated
              documentation for consideration may also be uploaded here.
            </div>
            <div v-else>
              <div v-if="moduleType === 'hsr'" class="text-sm">
                5. Please add any additional information your WELL Reviewer
                should know regarding the innovation proposal. Additional
                annotated documentation for consideration may also be uploaded
                here.
              </div>
              <div
                v-if="moduleType === 'project' && module.type === 'v2'"
                class="text-sm"
              >
                5. Please add any additional information your WELL Reviewer
                should know regarding the innovation proposal. Additional
                annotated documentation for consideration may also be uploaded
                here.
              </div>
              <div
                v-if="moduleType === 'project' && module.type === 'v2-pilot'"
                class="text-sm"
              >
                5. Please add any additional information your WELL Reviewer
                should know regarding the innovation proposal. Additional
                annotated documentation for consideration may also be uploaded
                here.
              </div>
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-if="formType === 'beta'"
          v-model="formData.statement_1"
          type="select"
          :options="[
            {
              label: 'Strongly Agree',
              value: 5,
            },
            {
              label: 'Agree',
              value: 4,
            },
            {
              label: 'Neutral',
              value: 3,
            },
            {
              label: 'Disagree',
              value: 2,
            },
            {
              label: 'Strongly Disagree',
              value: 1,
            },
          ]"
          validation="required"
        >
          <template slot="label">
            <div class="text-sm">
              6. The expectations and requirements for this beta feature were
              clear.
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-if="formType === 'beta'"
          v-model="formData.statement_2"
          type="select"
          :options="[
            {
              label: 'Strongly Agree',
              value: 5,
            },
            {
              label: 'Agree',
              value: 4,
            },
            {
              label: 'Neutral',
              value: 3,
            },
            {
              label: 'Disagree',
              value: 2,
            },
            {
              label: 'Strongly Disagree',
              value: 1,
            },
          ]"
          validation="required"
        >
          <template slot="label">
            <div class="text-sm">
              7. All components of this beta feature were applicable to my
              project (e.g., relevant to our space type, population, health and
              wellness goals).
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-if="formType === 'beta'"
          v-model="formData.statement_3"
          type="select"
          :options="[
            {
              label: 'Strongly Agree',
              value: 5,
            },
            {
              label: 'Agree',
              value: 4,
            },
            {
              label: 'Neutral',
              value: 3,
            },
            {
              label: 'Disagree',
              value: 2,
            },
            {
              label: 'Strongly Disagree',
              value: 1,
            },
          ]"
          validation="required"
        >
          <template slot="label">
            <div class="text-sm">
              8. The resources required to implement this beta feature were
              reasonable (e.g., cost, time).
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-if="formType === 'beta'"
          v-model="formData.statement_4"
          type="select"
          :options="[
            {
              label: 'Strongly Agree',
              value: 5,
            },
            {
              label: 'Agree',
              value: 4,
            },
            {
              label: 'Neutral',
              value: 3,
            },
            {
              label: 'Disagree',
              value: 2,
            },
            {
              label: 'Strongly Disagree',
              value: 1,
            },
          ]"
          validation="required"
        >
          <template slot="label">
            <div class="text-sm">
              9. The resources required to document this beta feature were
              reasonable (e.g., cost, time).
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-if="formType === 'beta'"
          v-model="formData.statement_5"
          type="select"
          :options="[
            {
              label: 'Strongly Agree',
              value: 5,
            },
            {
              label: 'Agree',
              value: 4,
            },
            {
              label: 'Neutral',
              value: 3,
            },
            {
              label: 'Disagree',
              value: 2,
            },
            {
              label: 'Strongly Disagree',
              value: 1,
            },
          ]"
          validation="required"
        >
          <template slot="label">
            <div class="text-sm">
              10. I would recommend this beta feature to other WELL projects.
            </div>
          </template>
        </FormulateInput>
        <FormulateInput
          v-if="formType === 'beta'"
          v-model="formData.statement_6"
          type="select"
          :options="[
            {
              label: 'Strongly Agree',
              value: 5,
            },
            {
              label: 'Agree',
              value: 4,
            },
            {
              label: 'Neutral',
              value: 3,
            },
            {
              label: 'Disagree',
              value: 2,
            },
            {
              label: 'Strongly Disagree',
              value: 1,
            },
          ]"
          validation="required"
        >
          <template slot="label">
            <div class="text-sm">
              11. I believe this beta feature should become a part of the
              permanent WELL feature library.
            </div>
          </template>
        </FormulateInput>
      </ClientOnly>
      <FormulateInput
        v-model="formData.documents"
        label="Documents"
        :value="formData.documents"
        type="fileupload"
        upload-path="Innovation/"
        mime-types=""
      />
      <div>
        <WButtonsBase v-if="submitting" :type="'primaryInverted'">
          <span>
            <WLoadingSpinner type="button" class="mx-auto" />
          </span>
        </WButtonsBase>
        <FormulateInput v-else type="submit" />
      </div>
    </div>
  </FormulateForm>
</template>
<script>
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    module: {
      type: Object,
      required: true,
    },
    moduleType: {
      type: String,
      required: false,
      default: null,
    },
    formType: {
      type: String,
      required: false,
      default: 'innovation',
    },
  },
  data() {
    return {
      submitting: false,
      computedModuleType: null,
      formData: {
        part_id: null,
        description: null,
        why_not_covered: null,
        research_desc: null,
        implementation_plan: null,
        additional_info: null,
        documents: [],
      },
    }
  },
  async mounted() {
    this.computedModuleType = this.moduleType

    if (this.moduleType === 'hsr') {
      this.computedModuleType = 'portfolio'
    }

    this.formData.part_id = this.part.id
    await this.$store.dispatch('innovation/getInnovation', {
      module_type: this.computedModuleType,
      module_id: this.module.id,
    })
  },
  methods: {
    async submit() {
      const data = {
        ...this.formData,
        module_type: this.computedModuleType,
        module_id: this.module.id,
        type: this.formType,
      }
      data.documents = data.documents.map((element) => {
        return { link_s3: element.url }
      })
      this.submitting = true
      await this.$store.dispatch('innovation/createInnovation', data)
      await this.$emit('getFormSubmissions')
      this.$parent.toggleOpen()
      this.submitting = false

      if (this.formType === 'beta') {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Beta Proposal created!',
        })
      } else {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Innovation created!',
        })
      }
    },
  },
}
</script>
