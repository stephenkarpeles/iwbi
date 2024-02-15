<template>
  <div>
    <FormulateForm @submit="submit()">
      <div>
        The project submits a proposal that meets the following requirements:
      </div>
      <ul>
        <li>
          a. Positively impacts project occupants by supporting health and
          well-being in a novel way that is not covered in WELL v2.
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
      <div>Fill all parts of this form. Attach documents as needed</div>
      <div class="space-y-3 mt-4">
        <ClientOnly>
          <FormulateInput
            v-model="formData.description"
            type="richtext"
            validation="required"
          >
            <template slot="label">
              <div class="text-sm">
                1. Describe the innovation proposal, the health outcome the
                innovation seeks to impact, and how the proposal is applicable
                to the project (e.g., project’s space type, typical occupant
                population, geographical setting).
              </div>
            </template>
          </FormulateInput>
          <FormulateInput
            v-model="formData.why_not_covered"
            type="richtext"
            validation="required"
          >
            <template slot="label">
              <div class="text-sm">
                2. Explain how the proposal supports occupant health and
                well-being in a novel way that is not already covered in WELL
                v2.
              </div>
            </template>
          </FormulateInput>
          <FormulateInput
            v-model="formData.research_desc"
            type="richtext"
            validation="required"
          >
            <template slot="label">
              <div class="text-sm">
                3. Describe the scientific, medical and/or industry research
                that supports the proposal, including references. Relevant
                documentation on the research listed must be attached to this
                proposal.
              </div>
            </template>
          </FormulateInput>
          <FormulateInput
            v-model="formData.implementation_plan"
            type="richtext"
            validation="required"
          >
            <template slot="label">
              <div class="text-sm">
                4. Explain the implementation plan for the innovation, along
                with relevant operations, policy or program details. Annotated
                documentation (e.g., policy document) may be uploaded to support
                this narrative.
              </div>
            </template>
          </FormulateInput>
          <FormulateInput
            v-model="formData.additional_info"
            type="richtext"
            validation="required"
          >
            <template slot="label">
              <div class="text-sm">
                5. Please add any additional information your WELL Reviewer
                should know regarding the innovation proposal.
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      innovationData: null,
      formData: {},
      submitting: false,
    }
  },
  async mounted() {
    await this.$axios
      .get(`api/admin/innovationProposals?id=${this.$route.params.id}`)
      .then((res) => (this.innovationData = res.data.data[0]))
  },
  methods: {
    submit() {},
  },
}
</script>
