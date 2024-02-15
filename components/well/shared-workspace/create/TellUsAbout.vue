<template>
  <div class="relative bg-white rounded-lg shadow-md">
    <div :class="{ hidden: currentStep !== 0 }">
      <FormulateForm @submit="createSharedWorkspace">
        <div
          class="relative md:pt-8 pb-8 md:pb-16 px-4 sm:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto border rounded-md"
        >
          <div>
            <div class="mx-auto lg:mx-0">
              <ClientOnly>
                <div class="md:flex">
                  <WHeadingsHTwo
                    class="md:w-1/2 mr-5"
                    heading="Tell us about your organization."
                  >
                    <div class="my-3 text-base leading-6 text-gray-500">
                      Please ensure the information submitted is accurate and
                      can be used for billing purposes. Please use English
                      characters only.
                    </div>
                  </WHeadingsHTwo>

                  <div
                    class="font-light text-sm p-2 mb-4 bg-secondary-100 rounded text-secondary-600 border border-secondary-600 md:w-1/2"
                  >
                    <strong
                      >Looking to enroll a previously registered WELL Project or
                      Portfolio?</strong
                    ><br />
                    Visit your associated project account to opt-in for the WELL
                    Health-Safety Rating at a reduced fee.
                  </div>
                </div>
              </ClientOnly>
              <div class="md:flex">
                <FormulateInput
                  v-model="formData.name"
                  type="text"
                  name="organization"
                  label="What shall we call this WELL Health-safety enrollment?*"
                  class="mr-5 md:w-1/2"
                  validation="required"
                />
                <FormulateInput
                  v-model="formData.sector"
                  :value="formData.sector"
                  type="select"
                  :options="sectorList"
                  label="Does your organization qualify for any of the approved sector discounts?"
                  class="md:w-1/2"
                />
              </div>

              <div class="flex">
                <div
                  class="font-bold text-base leading-6 font-bold py-4 md:w-1/2 mr-5"
                >
                  Owner information:
                </div>
                <div
                  v-if="!ownerEqualsBilling"
                  class="font-bold text-base leading-6 font-bold py-4 md:w-1/2"
                >
                  Billing information:
                </div>
              </div>
              <FormulateInput
                v-model="formData.reg"
                type="checkbox"
                name="another organization"
                label="I am registering this project on behalf of another organization."
                class="w-full"
              />
              <div class="flex">
                <div class="md:w-1/2 mr-5">
                  <FormulateInput
                    v-model="formData.owner_org"
                    type="companymultisearch"
                    name="organization"
                    label="Organization*"
                    class="mr-5 mt-5 w-full"
                    validation="required"
                    :searchable="true"
                    :clearonselect="false"
                    :closeonselect="true"
                    :optionslimit="10"
                  />
                  <FormulateInput
                    v-model="formData.industry"
                    type="select"
                    :options="industry"
                    label="Organization Industry*"
                    class="mr-5 w-full"
                    validation="required"
                  />
                  <FormInputsAddressFormulate
                    :address="address"
                    :target="address"
                    :required="true"
                  />
                  <FormulateInput
                    v-model="ownerEqualsBilling"
                    class="mt-2 mb-2"
                    type="checkbox"
                    label="Billing address is same as owner address"
                    @input="handleCopyBilling"
                  />
                </div>
                <div v-if="!ownerEqualsBilling" class="w-1/2">
                  <FormulateInput
                    v-model="formData.billing_name"
                    type="text"
                    name="billing name"
                    label="Billing name*"
                    class="mr-5 mt-5 w-full"
                    validation="required"
                  />
                  <FormulateInput
                    v-model="formData.billing_org"
                    name="billing org"
                    type="text"
                    label="Billing organization*"
                    class="mr-5 w-full"
                    validation="required"
                  />
                  <div>
                    <FormInputsAddressFormulate
                      :address="billingAddress"
                      :target="billingAddress"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="md:flex justify-between space-y-3 md:space-y-0 justify-between py-5 px-1 md:px-8"
        >
          <WButtonsBase
            type="primaryInverted"
            class="md:w-1/2 mr-2"
            @click.native="$router.push('/shared-workspaces')"
          >
            Back to homepage
          </WButtonsBase>

          <FormulateInput type="submit" label="Continue" class="md:w-1/2" />
        </div>
      </FormulateForm>
    </div>
    <div class="relative bg-white rounded-lg shadow-md mt-3">
      <div class="hidden lg:block lg:absolute lg:inset-0">
        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            class="h-56 w-full object-cover lg:absolute lg:h-full rounded-r-lg"
            src="/shared-workspace/tell-us-about.jpg"
            alt=""
          />
        </div>
      </div>
      <div
        :class="{ 'hidden lg:hidden': currentStep !== 1 }"
        class="border rounded-lg relative py-6 px-4 xl:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2"
      >
        <div class="lg:pr-8" style="min-height: 460px">
          <div
            :class="{ hidden: currentStep !== 1 }"
            class="max-w-md mx-auto sm:max-w-lg lg:mx-0"
          >
            <WHeadingsHTwo heading="Registration on behalf of Owner">
            </WHeadingsHTwo>

            <FormulateForm @submit="createSharedWorkspace">
              <FormulateInput
                v-model="formData.on_behalf"
                type="checkbox"
                name="on behalf of owner"
                label="By checking this box, I confirm that I have been granted authority to register this Project and accept the Terms and Conditions on behalf of the Owner. Note that a Confirmation of Agent’s Authority form confirming this authority must be uploaded to the Documents section of your Project Dashboard before you can submit this project for review."
                validation="required"
                class="w-full"
              />
              <FormulateInput
                v-model="formData.owner_member"
                class="mt-5 text-primary-700"
                type="select"
                :options="{
                  1: 'Yes',
                  0: 'No',
                }"
                label="Is the Owner organization an IWBI member?*"
                validation="required"
              />
              <FormulateInput
                v-if="
                  formData.owner_member === 1 || formData.owner_member === '1'
                "
                v-model="formData.organization_id"
                class="mt-5 text-primary-700"
                type="select"
                :options="companies"
                label="Select appropriate IWBI member organization*"
              />
              <div class="flex justify-between mt-24">
                <WButtonsBase
                  type="primaryInverted"
                  class="w-1/2 mr-2"
                  @click.native="currentStep--"
                >
                  Back
                </WButtonsBase>

                <FormulateInput type="submit" label="Continue" class="w-1/2" />
              </div>
            </FormulateForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentStep: 0,
      companies: [],
      formData: {
        sector: null,
        owner_member: false,
        billing_name: '',
        billing_org: '',
      },
      ownerEqualsBilling: false,
      address: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
      billingAddress: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
      sectorList: [
        { value: '', label: 'Not Applicable' },
        {
          value: 'government/municipal-buildings',
          label: 'Government/Municipal Buildings',
        },
        { value: 'healthcare-facilities', label: 'Healthcare Facilities' },
        {
          value: 'low-income/affordable-housing',
          label: 'Low-Income / affordable housing',
        },
        {
          value: 'non-profit-charitable-organizations',
          label: 'Non-Profit, charitable organizations',
        },
        { value: 'assisted-living', label: 'Senior and Assisted Living' },
        { value: 'small-business', label: 'Small Business' },
        { value: 'schools', label: 'Schools' },
      ],
      industry: [
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
  computed: {
    ...mapState('shared', ['sharedWorkspace']),
  },
  created() {
    if (this.$route.params.id) {
      this.formData = {
        owner_org: this.sharedWorkspace.owner_org,
        industry: this.sharedWorkspace.industry,
        sector: this.sharedWorkspace.estimate_sector
          ? this.sharedWorkspace.estimate_sector
          : null,
        name: this.sharedWorkspace.name,
        billing_name: this.$store.state.shared.sharedWorkspace.billing_name,
        billing_org: this.$store.state.shared.sharedWorkspace.billing_org,
      }
      if (this.sharedWorkspace.company_id) {
        this.formData.owner_org = {
          id: this.sharedWorkspace.company_id,
          name: this.sharedWorkspace.owner_org,
        }
      }
      const address = this.$store.state.shared.sharedWorkspace.addresses.find(
        (a) => a.is_shipping
      )
      if (address) {
        this.address = address
      }
      const billingAddress =
        this.$store.state.shared.sharedWorkspace.addresses.find(
          (a) => a.is_billing
        )
      if (billingAddress) {
        this.billingAddress = billingAddress
      }

      if (this.sharedWorkspace.billing_org === this.sharedWorkspace.owner_org) {
        this.ownerEqualsBilling = true
        this.handleCopyBilling(true)
      }

      if (
        this.$store.state.shared.sharedWorkspace &&
        this.$store.state.shared.sharedWorkspace.organization_id
      ) {
        this.formData.reg =
          this.$store.state.shared.sharedWorkspace.registration_on_behalf_organization
        this.formData.on_behalf = true
        this.formData.owner_member = 1
        this.formData.organization_id =
          this.$store.state.shared.sharedWorkspace.organization_id
      }
    } else {
      this.$store.dispatch('shared/storeSharedDetails', {})
      this.ownerEqualsBilling = true
    }
    this.$store.dispatch('shared/getCompanies').then((res) => {
      if (res.data) {
        this.companies = res.data.map((e) => {
          return { label: e.name, value: e.id }
        })
      }
    })
  },
  methods: {
    async createSharedWorkspace() {
      if (this.currentStep === 0 && this.formData.reg) {
        this.currentStep++
      } else {
        if (!this.$route.params.id && this.ownerEqualsBilling) {
          await this.handleCopyBilling(true)
        }
        const sharedWorkspace = {
          ...this.$store.state.shared.sharedWorkspace,
          name: this.formData.name,
          company_id: this.formData.owner_org.id,
          industry: this.formData.industry,
          owner_org: this.formData.owner_org.name,
          estimate_sector: this.formData.sector,
          type: 'v2-hsr',
          organization_id: this.formData.organization_id
            ? parseInt(this.formData.organization_id)
            : '',
          owner_country_code: this.address.country_code,
          owner_street: this.address.street,
          owner_city: this.address.city,
          owner_state: this.address.state,
          owner_postal_code: this.address.postal_code,

          billing_country_code: this.billingAddress.country_code,
          billing_street: this.billingAddress.street,
          billing_city: this.billingAddress.city,
          billing_state: this.billingAddress.state,
          billing_postal_code: this.billingAddress.postal_code,
          billing_name: this.formData.billing_name,
          billing_org: this.formData.billing_org,
          space_types: this.$store.state.shared.sharedWorkspace.space_types
            ? this.$store.state.shared.sharedWorkspace.space_types.map((e) => {
                return e.id
              })
            : [],
          registration_on_behalf_organization: this.formData.reg ? 1 : 0,
        }
        if (!this.formData.reg) {
          sharedWorkspace.organization_id = ''
          sharedWorkspace.registration_on_behalf_organization = 0
        }
        if (!this.$route.params.id) {
          sharedWorkspace.space_types = []
          sharedWorkspace.no_of_assets = 1
          await this.$store.dispatch(
            'shared/storeSharedDetails',
            sharedWorkspace
          )
          await this.$store.dispatch('shared/createSharedWorkspace')
          this.$router.push(
            `/shared-workspaces/create/${this.$store.state.shared.sharedWorkspace.portfolio_number}`
          )
        } else {
          await this.$store.dispatch(
            'shared/updateSharedWorkspace',
            sharedWorkspace
          )
          this.$store.dispatch('shared/setActiveTab', 'ENROLLMENT TYPE')
        }
      }
    },
    handleCopyBilling(boxValue) {
      if (boxValue) {
        this.billingAddress = this.address
        this.formData.billing_org =
          this.$store.state.shared.sharedWorkspace.owner_org

        this.formData.billing_name =
          this.$store.state.shared.sharedWorkspace.owner_name
      } else {
        this.billingAddress = {
          country_code: this.sharedWorkspace.billing_country_code,
          state: this.sharedWorkspace.billing_state,
          street: this.sharedWorkspace.billing_street,
          city: this.sharedWorkspace.billing_city,
          postal_code: this.sharedWorkspace.billing_postal_code,
        }
        this.formData.billing_org = ''
        this.formData.billing_name = ''
      }
    },
  },
}
</script>
