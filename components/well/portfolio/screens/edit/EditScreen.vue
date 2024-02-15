<template>
  <div v-if="formData">
    <WFeedbackAlert ref="alert" class="z-50" />
    <!-- Portfolio Name -->
    <FormulateForm @submit="updateFrom">
      <FormulateInput
        v-model="formData.name"
        type="text"
        label="Portfolio name*"
        validation="required"
      />

      <!-- Area -->
      <div class="mt-5 text-sm font-medium leading-5 text-primary-800">
        Gross Area<sup>*</sup>
      </div>
      <div class="w-full relative">
        <FormulateInput
          v-model="formData.area"
          type="number"
          min="0"
          step=".01"
          placeholder="Area (in sq ft)"
          validation="required|number"
          @keyup="calcSqM()"
        />
        <div
          class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
        >
          <div class="my-auto px-3">ft<sup>2</sup></div>
        </div>
      </div>
      <div class="w-full relative mt-3">
        <FormulateInput
          v-model="formData.area_in_meter"
          type="number"
          min="0"
          step=".01"
          placeholder="Area (in sq m)"
          validation="required|number"
          @keyup="calcSqFt()"
        />
        <div
          class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
        >
          <div class="my-auto px-3">m<sup>2</sup></div>
        </div>
      </div>

      <!-- Number of locations -->
      <FormulateInput
        v-model="formData.no_of_assets"
        type="number"
        label="Approximately how many locations will be in this portfolio?*"
        min="1"
        validation="required"
      />

      <!-- Primary Locations -->
      <div>
        <ClientOnly>
          <FormulateInput
            v-model="formData.location"
            :multiple="true"
            :options="[
              { label: 'Africa', value: 'Africa' },
              {
                label: 'Australia & New Zealand',
                value: 'Australia & New Zealand',
              },
              {
                label: 'China, Northeast Asia,Central Asia & Southeast Asia',
                value: 'China, Northeast Asia,Central Asia & Southeast Asia',
              },
              {
                label: 'India & Middle East',
                value: 'India & Middle East',
              },
              { label: 'Europe', value: 'Europe' },
              { label: 'North America', value: 'North America' },
              { label: 'South America', value: 'South America' },
            ]"
            label="Where is your portfolio primarily located? (Select all that apply)*"
            name="applicablePart"
            validation="required"
            track-by="value"
            type="multi"
          />
        </ClientOnly>
      </div>

      <!-- Portfolio Owner -->
      <div class="shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-md leading-6 font-medium text-gray-900">
            Portfolio Owner
          </h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5">
          <!-- New org input -->
          <FormulateInput
            v-model="company"
            type="companymultisearch"
            name="organization"
            label="Owner organization*"
            validation="required"
            :searchable="true"
            :clearonselect="false"
            :closeonselect="true"
            :optionslimit="10"
          />
          <FormulateInput
            v-model="formData.owner_name"
            type="text"
            label="Owner name*"
            validation="required"
          />
          <FormulateInput
            v-model="formData.owner_email"
            type="email"
            label="Owner email*"
            validation="required"
          />
          <FormulateInput
            v-model="formData.owner_phone"
            type="text"
            label="Owner phone*"
            validation="required"
          />
          <FormulateInput
            v-model="formData.industry"
            label="Industry"
            type="select"
            :options="industryOptions"
          />
          <FormulateInput
            v-model="formData.org_website"
            type="text"
            label="Organization website"
            placeholder="www.example.com"
          />
          <FormulateInput
            v-model="formData.org_overview"
            label="Organization overview"
            placeholder="Description"
            type="textarea"
          />
        </div>
      </div>

      <!-- Owner Address -->
      <div class="shadow overflow-hidden sm:rounded-lg my-4">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-md leading-6 font-medium text-gray-900">
            Owner Address
          </h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5">
          <FormInputsAddressFormulate
            :required="true"
            :address="address"
            :target="address"
          />
        </div>
      </div>

      <!-- Submission Date -->
      <FormulateInput
        v-model="formData.doc_sub_date_est"
        type="datetimepicker"
        max="9999-01-01"
        label="Estimated date of document submission"
      />

      <!-- Scope and premises -->
      <FormulateInput
        v-model="formData.scope_and_premises"
        label="Portfolio scope &amp; premises"
        placeholder="Description"
        type="textarea"
      />

      <!-- Scope and premises -->
      <FormulateInput
        v-model="formData.goals_and_vision"
        label="WELL Portfolio goals and vision"
        placeholder="Description"
        type="textarea"
      />
      <WHeadingsHFour heading="Organizational confidentiality" />
      <div
        class="p-4 rounded-md border border-primary-300 min-h-32 overflow-y-auto"
      >
        <span class="text-sm opacity-50"
          >A portfolio may opt-out publicity opportunities and identifying
          publicly within the WELL organizational directory by electing to be
          considered as a “private portfolio” at the time of enrollment. A
          “private portfolio” means that the organization name, street address,
          and identity of the owner will not appear within the WELL
          organizational directory or in any IWBI materials. Organizations that
          elect to remain private cannot publicly promote their participation in
          the program and any WELL Portfolio ScoreTM earned by the owner cannot
          be displayed while the portfolio remains private. The privacy status
          of your portfolio and any related WELL Portfolio Scores can be changed
          at any time, entirely at the discretion of the owner.</span
        >
      </div>

      <!-- Is this public -->
      <FormulateInput
        v-model="formData.portfolio_public"
        class="mt-4"
        :options="{
          1: 'Yes',
          0: 'No',
        }"
        type="radio"
        label="Is this portfolio public?*"
        validation="required"
      />
      <FormulateInput class="mt-5" type="submit">Save</FormulateInput>
    </FormulateForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      formData: null,
      company: null,
      address: {},
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
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  mounted() {
    this.systemDataInput()
    this.company = {
      id: this.portfolio.company_id,
      name: this.portfolio.owner_org,
    }
    // if (this.formData.location[0].id == null) {
    //   this.formData.location = null
    // }
  },
  methods: {
    updateFrom() {
      const data = { ...this.formData }

      // Format data before submission
      data.owner_org = this.company.name
      data.company_id = this.company.id
      data.owner_country_code = this.address.country_code
      data.owner_state = this.address.state
      data.owner_city = this.address.city
      data.owner_postal_code = this.address.postal_code
      data.owner_street = this.address.street
      data.location = this.formData.location.map((e) => {
        return e.value
      })
      if (data.space_types && data.space_types.length) {
        const spaceTypes = data.space_types.map((e) => {
          return e.id
        })
        data.space_types = spaceTypes
      }
      // Update
      this.$store
        .dispatch('portfolio/updatePortfolio', {
          id: this.portfolio.id,
          data,
        })
        .then((res) => {
          this.$refs.alert.showAlert(
            'success',
            'Changes have been saved successfully.'
          )
          this.$router.push(
            `/portfolio/${this.portfolio.portfolio_number}/dashboard`
          )
        })
    },
    systemDataInput() {
      if (this.portfolio) {
        this.formData = JSON.parse(JSON.stringify(this.portfolio))
        const addressIndex = this.portfolio.addresses.findIndex(
          (a) => a.is_shipping
        )
        this.parseOwnerAddress(addressIndex)
        // take a look at multiselect for locations
        if (
          this.formData &&
          this.formData.location &&
          this.formData.location.length > 0 &&
          !this.formData.location[0]?.id
        ) {
          this.formData.location = this.formData.location.map((el) => {
            return {
              label: el,
              value: el,
            }
          })
        }
      }
    },
    parseOwnerAddress(index) {
      if (index !== -1) {
        this.address = JSON.parse(
          JSON.stringify(this.portfolio.addresses[index])
        )
      }
    },
    calcSqM() {
      if (this.formData.area) {
        this.formData.area_in_meter = Number.parseFloat(
          this.formData.area * 0.092903
        ).toFixed(2)
      } else {
        this.formData.area_in_meter = 0
      }
    },
    calcSqFt() {
      if (this.formData.area_in_meter) {
        this.formData.area = Number.parseFloat(
          this.formData.area_in_meter * 10.7639
        ).toFixed(2)
      } else {
        this.formData.area = 0
      }
    },
  },
}
</script>

<style></style>
