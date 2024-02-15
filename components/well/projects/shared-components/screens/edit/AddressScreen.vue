<template>
  <FormulateForm v-if="formData" @submit="updateProject">
    <div class="shadow-lg border rounded-lg p-5 mb-5">
      <WHeadingsHFour heading="Project Address" />
      <FormInputsAddressFormulate
        :address="formData.addresses[0]"
        :target="formData.addresses[0]"
      />

      <hr class="my-8" />

      <WHeadingsHFour heading="Billing Address" />
      <FormulateInput
        v-model="formData.billing_name"
        type="text"
        label="Billing Name*"
        class="w-full"
        validation="required"
      />
      <FormulateInput
        v-model="formData.billing_org"
        type="text"
        label="Billing Organization*"
        class="w-full"
        validation="required"
      />
      <FormInputsAddressFormulate
        :address="formData.addresses[1]"
        :target="formData.addresses[1]"
      />
      <FormulateInput
        v-if="formData.type !== 'v2-pilot-upgraded'"
        class="mt-5"
        type="submit"
        label="Save Changes"
      />
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
      formData: {
        addresses: [],
        billing_org: '',
        billing_name: '',
      },
    }
  },

  mounted() {
    let billingName = ''
    let organization = ''
    if (this.inputData.addresses.length > 1) {
      if (this.inputData.addresses[1].first_name)
        billingName = JSON.parse(
          JSON.stringify(this.inputData.addresses[1].first_name)
        )
      organization = this.inputData.addresses[1].organization
    }

    this.formData = {
      ...JSON.parse(JSON.stringify(this.inputData)),
      billing_org: organization,
      billing_name: billingName,
    }
    if (this.formData.addresses.length === 1) {
      this.formData.addresses.push({
        country_code: '',
        city: '',
        state: '',
        street: '',
        postal_code: '',
      })
    }
  },
  methods: {
    async updateProject() {
      const payload = {
        // project
        street: this.formData.addresses[0].street,
        state: this.formData.addresses[0].state,
        country_code: this.formData.addresses[0].country_code,
        postal_code: this.formData.addresses[0].postal_code,
        city: this.formData.addresses[0].city,
        lat: this.formData.lat,
        lng: this.formData.lng,

        // billing
        billing_name: this.formData.billing_name,
        billing_org: this.formData.billing_org,
        billing_street: this.formData.addresses[1].street,
        billing_city: this.formData.addresses[1].city,
        billing_state: this.formData.addresses[1].state,
        billing_country_code: this.formData.addresses[1].country_code,
        billing_postal_code: this.formData.addresses[1].postal_code,

        addresses: this.formData.addresses,
      }
      try {
        await this.$axios.put(
          `api/project/update/${this.formData.id}/part3`,
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
