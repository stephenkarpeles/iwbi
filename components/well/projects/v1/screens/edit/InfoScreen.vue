<template>
  <FormulateForm v-if="formData" class="space-y-2" @submit="updateProject">
    <div class="shadow-lg border rounded-lg p-5">
      <WHeadingsHFour heading="Project Information" />
      <hr class="my-5" />

      <FormulateInput
        v-model="formData.name"
        type="text"
        label="Project name"
        class="w-full"
        :disabled="currentUser.role.includes('well-admin') ? false : true"
      />
      <div class="w-full relative">
        <FormulateInput
          v-model="formData.area"
          type="number"
          min="0"
          step=".01"
          label="Project area"
          validation="required|number"
          :disabled="currentUser.role.includes('well-admin') ? false : true"
          @keyup="changeAreaInMeter"
        >
        </FormulateInput>
        <div
          style="height: 40px"
          class="absolute right-0 top-0 mt-6 flex bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
        >
          <div
            v-if="formData.v1_project_standard !== 'community'"
            class="my-auto px-3"
          >
            ft <sup>2</sup>
          </div>
          <div v-else class="my-auto px-3">acres</div>
        </div>
      </div>
      <div class="w-full relative">
        <FormulateInput
          v-model="formData.area_in_meter"
          type="number"
          min="0"
          step=".01"
          validation="required|number"
          :disabled="currentUser.role.includes('well-admin') ? false : true"
          @keyup="changeAreaInFeet"
        >
          <template slot="help">
            <p class="text-sm text-gray-500">
              The registration fees are based on the typology and size of your
              project.
              <a
                target="_blank"
                class="text-primary-500"
                href="https://www.wellcertified.com/en/pricing"
                >View pricing structure.</a
              >
              Please specify the project type and size to view your price.
            </p>
          </template>
        </FormulateInput>
        <div
          style="height: 40px"
          class="absolute right-0 top-0 flex bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
        >
          <div
            v-if="formData.v1_project_standard !== 'community'"
            class="my-auto px-3"
          >
            m <sup>2</sup>
          </div>
          <div v-else class="my-auto px-3">hectares</div>
        </div>
      </div>
      <FormulateInput
        v-if="currentUser.role.includes('well-admin')"
        v-model="formData.v1_project_standard"
        :options="v1ProjectStandardOptions"
        label="WELL Standard"
        type="radio"
      />
      <FormulateInput
        v-if="showSubStandard && currentUser.role.includes('well-admin')"
        v-model="formData.v1_project_type"
        :options="v1ProjectTypeOptions"
        label="Project type"
        type="radio"
        :disabled="currentUser.role.includes('well-admin') ? false : true"
      />
      <FormulateInput
        v-if="
          formData.v1_project_standard === 'allprojectsin' &&
          currentUser.role.includes('well-admin')
        "
        v-model="formData.api_desc"
        label="API Description"
        type="text"
        :disabled="currentUser.role.includes('well-admin') ? false : true"
      >
        <template slot="help">
          <p class="text-sm text-gray-500">
            View the
            <a
              target="_blank"
              class="text-primary-500"
              href="http://www.wellcertified.com/cert-guidebook"
              >WELL Certification Guidebook</a
            >. To learn more about the All Projects In (Pilot),
            <a
              class="text-primary-500"
              href="https://www.wellcertified.com/en/all-projects-in"
              target="_blank"
              >click here</a
            >.
          </p>
        </template>
      </FormulateInput>
      <FormulateInput
        v-if="
          formData.v1_project_standard === 'community' &&
          currentUser.role.includes('well-admin')
        "
        v-model="formData.standard_version"
        :options="[
          { label: 'N/A', value: '_none' },
          { label: 'Pilot', value: 'pilot' },
          { label: 'v1', value: 'v1.0' },
          { label: 'Pilot- All projects in', value: 'pilotApi' },
        ]"
        label="Standard version"
        type="radio"
      />
      <FormulateInput
        v-model="formData.target_cert_level"
        :options="certificationLevels"
        label="Target certification level"
        type="radio"
      />
      <FormulateInput
        v-model="formData.other_certification"
        :options="otherCertificationOptions"
        label="Other certifications being pursued"
        type="checkbox"
      />
      <FormulateInput
        v-model="formData.other_certification_project_id"
        label="Other certification Project ID"
        type="text"
      />
      <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Project address
          </h3>
        </div>
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <FormInputsAddressFormulate
            :address="formData.addresses[0]"
            :target="formData.addresses[0]"
          />
        </div>
      </div>
      <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Project details
          </h3>
        </div>
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <FormulateInput
            v-if="formData.v1_project_standard === 'community'"
            v-model="formData.no_of_buildings_owned"
            type="number"
            min="0"
            label="Number of buildings owned, operated or managed by project owner"
            validation="number"
          />
          <FormulateInput
            v-if="formData.v1_project_standard === 'community'"
            v-model="formData.existing_buildings_number"
            type="number"
            min="0"
            label="Number of existing buildings"
            validation="number"
          />
          <FormulateInput
            v-if="formData.v1_project_standard === 'community'"
            v-model="formData.area_buildings_owned"
            type="number"
            min="0"
            step="0.01"
            label="Gross area (in sq ft) of buildings owned, operated or managed by project owner"
            validation="number"
          />
          <FormulateInput
            v-if="formData.v1_project_standard !== 'community'"
            v-model="formData.no_of_occupants"
            type="number"
            min="0"
            label="Number of occupants"
            validation="number"
          />
          <FormulateInput
            v-model="formData.current_status"
            :options="projectCurrentStatusOptions"
            type="select"
            label="Current status of project"
          />
          <FormulateInput
            v-model="formData.scope_and_premises"
            label="Project scope & premises"
            type="textarea"
          />
          <FormulateInput
            v-model="formData.construction_completion_date"
            type="datetimepicker"
            max="9999-01-01"
            label="Anticipated date of construction completion"
          />
          <FormulateInput
            v-model="formData.doc_sub_date_est"
            type="datetimepicker"
            max="9999-01-01"
            label="Estimated date of document submission"
          />
          <FormulateInput
            v-model="formData.goals_and_vision"
            label="WELL project goals and vision"
            type="textarea"
          />
        </div>
      </div>
      <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Project Directory Listing
          </h3>
        </div>
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <p class="mt-1 text-sm text-gray-500">
            A project may opt-out of the WELL project directory and publicity
            opportunities as a “private project” at the time of registration. A
            “private project” means that the project name, street address, and
            identify of the owner will not appear within the WELL project
            directory. The private status of your project can be changed at any
            time.
          </p>
          <FormulateInput
            v-model="formData.project_public"
            :options="[
              { label: 'No', value: 0 },
              { label: 'Yes', value: 1 },
            ]"
            label="Is this a public project?"
            type="radio"
          />
        </div>
      </div>
      <FormulateInput
        v-model="formData.code"
        type="text"
        label="Registration code"
        class="w-full mb-4"
      >
        <template slot="help">
          <div class="font-light text-sm text-gray-500 -mt-2">
            If you were issued a special code for registration, please enter
            here.
          </div>
        </template>
      </FormulateInput>
      <FormulateInput type="submit" label="Save Changes" />
    </div>
  </FormulateForm>
</template>

<script>
import { mapState } from 'vuex'
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

      v1ProjectStandardOptions: [
        {
          label: 'WELL Building Standard for Commercial & Institutional Office',
          value: 'office',
        },
        {
          label: 'WELL Building Standard for Multifamily Residential (Pilot)',
          value: 'residential',
        },
        { label: 'WELL Building Standard for Retail (Pilot)', value: 'retail' },
        {
          label: 'WELL Building Standard for Educational Facilities (Pilot)',
          value: 'education',
        },
        {
          label: 'WELL Building Standard for Restaurants (Pilot)',
          value: 'restaurant',
        },
        { label: 'WELL Community', value: 'community' },
        {
          label: 'WELL All Projects In (Pilot)',
          value: 'allprojectsin',
        },
      ],
      v1ProjectTypeOptions: [
        { value: 'nc', label: 'New and Existing Buildings' },
        { value: 'ci', label: 'New and Existing Interiors' },
        { value: 'cs', label: 'Core & Shell' },
        {
          value: 'cics',
          label:
            'New and Existing Interiors in a Core & Shell Certified Building',
        },
      ],
      certificationLevels: [
        { value: 'Bronze', label: 'Bronze' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
      ],

      otherCertificationOptions: [
        { label: 'BREEAM', value: 'breeam' },
        { label: 'DGNB', value: 'dgnb' },
        { label: 'Green Star', value: 'green_star' },
        { label: 'HQE', value: 'hqe' },
        { label: 'LEED', value: 'leed' },
        {
          label: 'Living Building Challenge',
          value: 'living_building_challenge',
        },
        { label: 'OSMOZ', value: 'osmoz' },
        { label: 'Other', value: 'other' },
      ],
      projectCurrentStatusOptions: [
        { label: 'Concept Design', value: 'concept_design' },
        { label: 'Schematic Design', value: 'schematic_design' },
        { label: 'Design Development', value: 'design_development' },
        {
          label: 'Construction Documentation',
          value: 'construction_documentation',
        },
        { label: 'Under construction', value: 'under_construction' },
        { label: 'Construction complete', value: 'construction_complete' },
        {
          label: 'Existing building or space',
          value: 'existing_building_or_space',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    showSubStandard() {
      if (this.formData && this.formData.v1_project_standard) {
        return this.formData.v1_project_standard === 'office'
      }
      return false
    },
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.inputData))
  },
  methods: {
    changeAreaInMeter(event) {
      if (
        this.formData.v1_project_standard &&
        this.formData.v1_project_standard === 'community'
      ) {
        this.formData.area_in_meter = (this.formData.area / 2.471).toFixed(2)
      } else {
        this.formData.area_in_meter = (this.formData.area / 10.764).toFixed(2)
      }
      if (this.formData.area === 0) {
        this.formData.area = this.formData.area_in_meter = ''
      }
    },
    changeAreaInFeet(event) {
      if (
        this.formData.v1_project_standard &&
        this.formData.v1_project_standard === 'community'
      ) {
        this.formData.area = (this.formData.area_in_meter * 2.471).toFixed(2)
      } else {
        this.formData.area = (this.formData.area_in_meter * 10.764).toFixed(2)
      }
      if (this.formData.area_in_meter === 0) {
        this.formData.area = this.formData.area_in_meter = ''
      }
    },
    async updateProject() {
      const payload = {
        name: null,
        v1_project_standard: null,
        v1_project_type: null,
        api_desc: null,
        target_cert_level: null,
        other_certification: null,
        other_certification_project_id: null,
        other_certification_name: null,
        area: null,
        street: null,
        city: null,
        state: null,
        country_code: null,
        postal_code: null,
        no_of_buildings_owned: null,
        existing_buildings_number: null,
        area_buildings_owned: null,
        no_of_occupants: null,
        current_status: null,
        scope_and_premises: null,
        construction_completion_date: null,
        doc_sub_date_est: null,
        goals_and_vision: null,
        project_public: null,
        v1_registration_code: null,
        final_report_accept_date: null,
        estimate_sector: null,
        addresses: null,
        doc_sub_date_est_confirm: null,
      }

      Object.keys(this.formData).forEach((key) => {
        if (key in payload) payload[key] = this.formData[key]
      })
      payload.country_code = this.formData.addresses[0].country_code
      payload.state = this.formData.addresses[0].state
      payload.street = this.formData.addresses[0].street
      payload.city = this.formData.addresses[0].city
      payload.postal_code = this.formData.addresses[0].postal_code

      try {
        await this.$axios.put(
          `api/project/update/${this.formData.id}/part1v1`,
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
        let errors = ''

        for (const obj of Object.entries(error.response.data.errors)) {
          errors += obj[1] + '<br>'
        }

        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message + '<br>' + errors,
        })
      }
    },
  },
}
</script>
