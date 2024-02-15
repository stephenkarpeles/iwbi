<template>
  <div class="w-96">
    <WHeadingsHFour
      class="text-primary-600"
      heading="Edit selected locations"
    />
    <div class="-mt-3 italic text-gray-600 text-sm">
      *Bulk editing for all checked locations
    </div>
    <FormulateForm v-if="!loading" class="mt-5" @submit="updateProperties()">
      <FormulateInput
        v-model="targetField"
        type="select"
        :options="fieldOptions"
        label="Field"
        validation="required"
        placeholder="Select a field"
      />
      <div :key="forceReMount">
        <FormulateInput
          v-if="targetField === 'primary_space_type_id'"
          v-model="fieldValue"
          type="select"
          validation="required"
          :options="spaceTypes"
          label="Space Type*"
        />
        <FormulateInput
          v-if="targetField === 'project_type'"
          v-model="fieldValue"
          type="select"
          validation="required"
          :options="projectType"
          label="Ownership Type*"
        />
        <FormulateInput
          v-if="targetField === 'project_public'"
          v-model="fieldValue"
          type="radio"
          :options="[
            { label: 'No, this is a confidential private project', value: 0 },
            { label: 'Yes, this is a public project', value: 1 },
          ]"
          label="Is this project public?*"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'owner_name'"
          v-model="fieldValue"
          type="text"
          label="Owner Name"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'owner_email'"
          v-model="fieldValue"
          type="text"
          label="Owner E-mail"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'owner_org'"
          v-model="fieldValue"
          type="text"
          label="Owner Organization"
          validation="required"
        />
        <FormInputsAddressFormulate
          v-if="targetField === 'owner_address'"
          :required="true"
          :address="ownerAddress"
          :target="ownerAddress"
          class-key="space-y-2"
        />
        <FormulateInput
          v-if="targetField === 'industry'"
          v-model="fieldValue"
          type="select"
          :options="industry"
          label="Industry *"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'no_of_occupants'"
          v-model="fieldValue"
          type="number"
          label="Estimated number of occupants"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'other_certification'"
          v-model="fieldValue"
          :options="otherCertificationList"
          type="checkbox"
          label="Other certifications being pursued:"
          validation="required"
        />

        <FormulateInput
          v-if="targetField === 'd_and_o'"
          v-model="fieldValue"
          type="radio"
          :options="[
            { label: 'Yes', value: '1' },
            { label: 'No', value: '0' },
          ]"
          label="Is the project targeting WELL Precertification?"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'well_cert'"
          v-model="fieldValue"
          type="radio"
          :options="[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]"
          label="Is the project targeting WELL Certification?"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'construction_status'"
          v-model="fieldValue"
          type="radio"
          :options="[
            { label: 'Yes', value: '1' },
            { label: 'No', value: '0' },
          ]"
          label="Is the project undergoing construction or renovation?"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'construction_type'"
          v-model="fieldValue"
          type="radio"
          :options="[
            { label: 'In design', value: 'In design' },
            { label: 'Under construction', value: 'Under construction' },
            { label: 'Construction complete', value: 'Construction complete' },
          ]"
          label="What is the construction status?"
          validation="required"
        />
        <FormulateInput
          v-if="targetField === 'fund_name'"
          v-model="fieldValue"
          type="text"
          placeholder="Fund name"
          name="fund_name"
          label="If project is part of a fund, please provide the fund name"
          validation="required"
        />
      </div>
      <FormulateInput class="mt-5" type="submit" label="Update" />
      <div v-if="currentUser.role.includes('admin')">
        <span class="inline-flex justify-center my-1 text-primary-600 w-full"
          >Or</span
        >
        <WButtonsBase
          type="primaryInverted"
          icon="archive"
          @click.native="archiveLocations()"
          >Archive locations</WButtonsBase
        >
      </div>
    </FormulateForm>
    <div v-else class="mx-auto mt-5 text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Updating...</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    properties: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      forceReMount: 0,
      loading: false,
      fieldOptions: [
        { label: 'Space Types', value: 'primary_space_type_id' },
        { label: 'Ownership Types', value: 'project_type' },
        { label: 'Is this project public?', value: 'project_public' },
        { label: 'Owner Name', value: 'owner_name' },
        { label: 'Owner Email', value: 'owner_email' },
        { label: 'Owner Organization', value: 'owner_org' },
        { label: 'Owner Address', value: 'owner_address' },
        { label: 'Owner Industry', value: 'industry' },
        { label: 'Estimated number of occupants', value: 'no_of_occupants' },
        {
          label: 'Other certifications being persued',
          value: 'other_certification',
        },
        {
          label: 'Is the project targeting WELL Precertification?',
          value: 'd_and_o',
        },
        {
          label: 'Is the project targeting WELL Certification?',
          value: 'well_cert',
        },
        {
          label: 'Is the project undergoing construction or renovation?',
          value: 'construction_status',
        },
        {
          label: 'What is the construction status?',
          value: 'construction_type',
        },
        {
          label:
            'If the project is part of a fund, please provide the fund name',
          value: 'fund_name',
        },
      ],
      targetField: null,
      fieldValue: null,
      ownerAddress: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
    }
  },
  computed: {
    ...mapState({
      otherCertificationList: (state) => state.portfolio.otherCertificationList,
      wellStandardList: (state) => state.shared.wellStandardList,
      spaceTypes: (state) => state.portfolio.spaceTypes,
      industry: (state) => state.shared.industry,
      projectType: (state) => state.shared.projectType,
      currentUser: (state) => state.user.currentUser,
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  watch: {
    targetField(newValue) {
      this.fieldValue = null
      this.forceReMount++
    },
  },
  async mounted() {
    await this.$store.dispatch('portfolio/fetchSpaceTypes')
  },
  methods: {
    async updateProperties() {
      this.loading = true

      await this.$store.dispatch('portfolio/bulkUpdateProperties', {
        project_ids: this.properties,
        data: [
          {
            field: this.targetField,
            value:
              this.targetField === 'owner_address'
                ? this.ownerAddress
                : this.fieldValue,
          },
        ],
      })

      this.$store.dispatch('notifications/toastMessage', {
        message:
          'Updated locations! If you do not see the changes, please refresh the page in couple minutes.',
      })

      this.$parent.isHidden = true
      this.loading = false
    },
    async archiveLocations() {
      try {
        await this.$axios.post(
          `api/portfolio/projects/${this.portfolio.id}/bulkUpdate`,
          {
            project_ids: this.properties,
            data: [
              {
                field: 'deleted_at',
                value: new Date(),
              },
            ],
          }
        )
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Selected projects archived successfully!',
        })

        // call api to get updated list
        await this.$store.dispatch('portfolio/getFilterProjects', {
          paginate: 'Yes',
          page: 1,
        })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message,
        })
      }
      this.$parent.isHidden = true
    },
  },
}
</script>
