<template>
  <FormulateForm v-if="formData" @submit="updateProject">
    <div class="shadow-lg border rounded-lg p-5">
      <WHeadingsHFour heading="Project Owner" />
      <div class="text-sm text-gray-600 mb-2">
        The project owner is the individual or entity that holds all legal right
        to possess and control project-relevant location, and to authorize
        decisions pertaining to the location.
      </div>
      <div class="text-sm text-gray-600">
        The owner will receive an email with the
        <a
          class="text-primary-600"
          href="https://resources.wellcertified.com/tools/well-certification-agreement/"
          target="_blank"
          >WELL™ Certification Agreement</a
        >
        for their eSignature. The project administrator will have the option to
        send this after completing the project registration steps.
      </div>
      <hr class="my-5" />
      <div class="space-y-2">
        <FormulateInput
          v-model="formData.owner_org"
          type="text"
          label="Owner organization"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.owner_name"
          type="text"
          label="Owner name"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.owner_email"
          type="text"
          label="Owner email"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.owner_phone"
          type="text"
          label="Owner phone"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.industry"
          :options="industryOptions"
          type="select"
          label="Industry"
        />
        <FormulateInput
          v-model="formData.org_website"
          type="text"
          label="Organization website"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.org_overview"
          type="textarea"
          label="Organization Overview"
          class="w-full"
        />
      </div>
      <hr class="my-8" />
      <div>
        <WHeadingsHFour heading="Owner Address*" />
        <FormInputsAddressFormulate
          :address="ownerAddress"
          :target="ownerAddress"
          :required="true"
        />
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Applicant information
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.applicant_role"
              :options="[
                { label: 'Acoustician', value: 'acoustician' },
                { label: 'Architect', value: 'architect' },
                {
                  label: 'Commissioning Agent',
                  value: 'commissioning_agent',
                },
                {
                  label: 'Construction Manager',
                  value: 'construction_manager',
                },
                { label: 'Contractor', value: 'contractor' },
                {
                  label: 'Facilities Manager',
                  value: 'facilities_manager',
                },
                {
                  label: 'Interior Designer',
                  value: 'interior_designer',
                },
                { label: 'Lighting Designer', value: 'lighting_designer' },
                { label: 'MEP Engineer', value: 'mep_engineer' },
                { label: 'Owner', value: 'Owner' },
                { label: 'Human Resource', value: 'hr' },
                { label: 'Project Manager', value: 'project_manager' },
                {
                  label: 'Sustainability Consultant',
                  value: 'sustainability_consultant',
                },
                {
                  label: 'Wellness Consultant',
                  value: 'wellness_consultant',
                },
                { label: 'Administrator', value: 'administrator' },
              ]"
              label="Applicant's role on the project"
              type="select"
              validation="required"
            />
          </div>
        </div>
        <FormulateInput class="mt-4" type="submit" label="Save Changes" />
      </div>
    </div>
  </FormulateForm>
</template>

<script>
export default {
  props: {
    inputData: {
      type: Object,
      required: true,
      default: () => null,
    },
  },
  data() {
    return {
      formData: null,
      ownerAddress: {},
      industryOptions: [
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Architecture', label: 'Architecture' },
        { value: 'Banking', label: 'Banking' },
        { value: 'Biotechnology', label: 'Biotechnology' },
        { value: 'Chemicals', label: 'Chemicals' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Construction', label: 'Construction' },
        { value: 'Consulting', label: 'Consulting' },
        { value: 'Education', label: 'Education' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Energy', label: 'Energy' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Environmental', label: 'Environmental' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Food & Beverage', label: 'Food & Beverage' },
        { value: 'Government', label: 'Government' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Legal', label: 'Legal' },
        { value: 'Machinery', label: 'Machinery' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Media', label: 'Media' },
        { value: 'Not For Profit', label: 'Not For Profit' },
        { value: 'Real Estate', label: 'Real Estate' },
        { value: 'Recreation', label: 'Recreation' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Telecommunications', label: 'Telecommunications' },
        { value: 'Transportation', label: 'Transportation' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Other', label: 'Other' },
      ],
    }
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.inputData))
    this.ownerAddress = {
      street: this.inputData.owner_street,
      city: this.inputData.owner_city,
      country_code: this.inputData.owner_country_code,
      state: this.inputData.owner_state,
      postal_code: this.inputData.owner_zip,
    }
  },
  methods: {
    async updateProject() {
      const payload = {
        owner_org: null,
        owner_name: null,
        owner_email: null,
        owner_phone: null,
        industry: null,
        org_website: null,
        org_overview: null,
        owner_street: null,
        owner_city: null,
        owner_state: null,
        owner_country_code: null,
        owner_zip: null,
        applicant_role: null,
      }

      Object.keys(this.formData).forEach((key) => {
        if (key in payload) payload[key] = this.formData[key]
      })

      payload.owner_country_code = this.ownerAddress.country_code
      payload.owner_state = this.ownerAddress.state
      payload.owner_street = this.ownerAddress.street
      payload.owner_city = this.ownerAddress.city
      payload.owner_zip = this.ownerAddress.postal_code

      try {
        await this.$axios.put(
          `api/project/update/${this.formData.id}/part2`,
          payload
        )
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Fields updated sucessfully!',
        })
        this.$router.push({
          path: `/projects/${this.formData.type}/${this.formData.project_number}/dashboard`,
          query: { ...this.$route.query },
        })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message,
        })
      }
    },
  },
}
</script>
