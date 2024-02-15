<template>
  <FormulateForm v-if="formData" @submit="updateProject">
    <div class="shadow-lg border rounded-lg p-5">
      <WHeadingsHFour heading="Project Owner" />
      <div class="text-sm text-primary-600 mb-2">
        The project owner is the individual or entity that holds all legal right
        to possess and control project-relevant location + and to authorize
        decisions pertaining to the location.
      </div>
      <div class="text-sm text-primary-600">
        The owner will receive an email with the WELL™ Certification Agreement
        for their eSignature. The project administrator will have the option to
        send this after completing the project registration page.
      </div>
      <hr class="my-5" />
      <div class="space-y-2">
        <FormulateInput
          data-id="owner-org-input"
          v-model="company"
          class="w-full"
          type="companymultisearch"
          name="organization"
          label="Owner Organization*"
          required="true"
          :searchable="true"
          :clearonselect="false"
          :closeonselect="true"
          :optionslimit="10"
        />

        <FormulateInput
          data-id="owner-name-input"
          v-model="formData.owner_name"
          type="text"
          label="Owner name*"
          class="w-full"
          required="true"
        />
        <FormulateInput
          data-id="owner-email-input"
          v-model="formData.owner_email"
          type="text"
          label="Owner email"
          class="w-full"
          required="true"
        />
        <FormulateInput
          v-model="formData.owner_phone"
          type="text"
          label="Owner phone"
          class="w-full"
        />
        <FormulateInput
          data-id="owner-industry-input"
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
        <WHeadingsHFour heading="Owner Address" />
        <FormInputsAddressFormulate
          :address="formData.owner_address"
          :target="formData.owner_address"
          :required="true"
        />
        <FormulateInput
          v-if="formData.type !== 'v2-pilot-upgraded'"
          class="mt-4"
          type="submit"
          label="Save Changes"
        />
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
      company: null,
      formData: null,
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
    this.formData.owner_address = {
      street: this.inputData.owner_street,
      city: this.inputData.owner_city,
      country_code: this.inputData.owner_country_code,
      state: this.inputData.owner_state,
      postal_code: this.inputData.owner_zip,
    }
    // Bind CompanyMultiSearch state to existing company_id and name
    if (this.formData.owner_org && this.formData.owner_org !== '') {
      this.company = {
        ...this.company,
        name: this.formData.owner_org,
      }
    }
    if (this.formData.company_id) {
      this.company = {
        ...this.company,
        id: this.formData.company_id,
      }
    }
  },
  methods: {
    async updateProject() {
      const payload = {
        company_id: null,
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
      // Bind company_id and name to CompanyMultiSearch state
      if (this.company.name && this.company.id && this.company.name !== '') {
        payload.company_id = this.company.id
        payload.owner_org = this.company.name
      }
      payload.owner_country_code = this.formData.owner_address.country_code
      payload.owner_state = this.formData.owner_address.state
      payload.owner_street = this.formData.owner_address.street
      payload.owner_city = this.formData.owner_address.city
      payload.owner_zip = this.formData.owner_address.postal_code
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
