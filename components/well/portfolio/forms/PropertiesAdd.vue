<template>
  <div class="w-full">
    <FormulateForm class="my-2" @submit="submitForm">
      <WTabsHorizontal
        v-model="tab"
        alignment="justify-between"
        class="w-full -mb-px"
        :tabs="[
          { name: 'Required', icon: '' },
          { name: 'Owner', icon: '' },
          { name: 'Additional', icon: '' },
        ]"
      />
      <div :class="{ hidden: tab !== 'Required' }">
        <FormulateInput
          v-model="formData.name"
          type="text"
          validation="required"
          label="Project Name*"
        />

        <FormulateInput
          v-if="projectId === null"
          v-model="projectVersion"
          type="select"
          validation="required"
          :options="projectVersions"
          label="Project Version"
        />

        <div class="flex space-x-2">
          <div class="w-full">
            <FormulateInput
              v-if="type === 'sqft'"
              v-model="formData.area"
              type="number"
              validation="required"
              label="Project Area*"
              step="0.01"
              @keyup="calcSqM()"
            />
            <FormulateInput
              v-else
              v-model="formData.area_in_meter"
              type="number"
              validation="required"
              label="Project Area*"
              step="0.01"
              @keyup="calcSqFt()"
            />
          </div>
          <div class="w-48">
            <FormulateInput
              v-if="!editMode"
              v-model="type"
              type="select"
              validation="required"
              :options="[
                { label: 'sqft', value: 'sqft' },
                { label: 'sqm', value: 'sqm' },
              ]"
              label="Type*"
            />
          </div>
        </div>

        <FormulateInput
          v-if="!formData.v1_project"
          v-model="formData.primary_space_type_id"
          type="select"
          validation="required"
          :options="spaceTypes"
          label="Space Type*"
        />
        <FormulateInput
          v-if="
            formData.primary_space_type_id &&
            formData.primary_space_type_id == '16'
          "
          v-model="formData.expedia_id"
          class="mb-5"
          type="text"
          help="Please add the applicable Expedia ID to any location if you would like the WELL Health-Safety Rating achievement to appear on Your Expedia listing in the event of and upon achievement.  By providing Your Expedia ID above, You hereby grant Your consent and permission to IWBI to share with Expedia the fact of Your achievement (if and when the WELL Health-Safety Rating is achieved) and to having IWBI's WELL Health-Safety Rating logo appear among Your location's images with Your Expedia listing."
          name="Expedia Id"
          label="Expedia Id"
        />
        <FormulateInput
          v-if="!formData.v1_project"
          v-model="formData.project_type"
          type="select"
          validation="required"
          :options="projectType"
          label="Ownership Type*"
        />

        <div
          class="shadow-md flex flex-wrap justify-between border rounded-md my-2"
        >
          <div
            class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between"
          >
            <div class="font-bold">Project Address</div>
          </div>
          <div
            class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
          >
            <FormInputsAddressFormulate
              :address="locationAddress"
              :target="locationAddress"
              :required="true"
              class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
            />
          </div>
        </div>

        <FormulateInput
          v-if="formData.v1_project"
          v-model="formData.v1_project_standard"
          type="select"
          validation="required"
          :options="wellStandardList"
          label="WELL Standard*"
        />

        <FormulateInput
          v-model="formData.project_public"
          type="radio"
          :options="[
            { label: 'No, this is a confidential private project', value: 0 },
            { label: 'Yes, this is a public project', value: 1 },
          ]"
          label="Is this project public?*"
        />
      </div>
      <div :class="{ hidden: tab !== 'Owner' }">
        <FormulateInput
          v-model="formData.owner_name"
          type="text"
          label="Name"
        />
        <FormulateInput
          v-model="formData.owner_email"
          type="email"
          label="E-mail"
        />
        <FormulateInput
          v-model="formData.owner_org"
          type="text"
          label="Owner Organization"
        />
        <div
          class="shadow-md flex flex-wrap justify-between border rounded-md my-2"
        >
          <div
            class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between"
          >
            <div class="font-bold">Owner Address</div>
          </div>
          <div
            class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
          >
            <FormInputsAddressFormulate
              :required="true"
              :address="ownerAddress"
              :target="ownerAddress"
              class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
            />
          </div>
        </div>
        <FormulateInput
          v-model="formData.industry"
          type="select"
          :options="industry"
          label="Industry *"
        />
        <FormulateInput
          v-if="formData.industry === 'Hospitality'"
          v-model="formData.expedia_id"
          class="mb-5"
          type="text"
          help="Add Expedia ID to any location, as applicable, if you would like the Health-Safety Rating to appear on your Expedia listing if/once achieved."
          name="Expedia Id"
          label="Expedia Id"
        />
      </div>
      <div :class="{ hidden: tab !== 'Additional' }">
        <div>
          <FormulateInput
            v-model="formData.no_of_occupants"
            type="number"
            label="Estimated number of occupants"
          />
          <div class="text-sm -mt-2 mb-2 text-gray-600">
            Please enter the estimated number of occupants for this property.
            This number is required to accurately calculate your WELL Portfolio
            Score. You can update this number at any time.
          </div>
        </div>
        <FormulateInput
          v-model="formData.other_certification"
          :element-class="['certification-options']"
          :options="otherCertificationList"
          type="checkbox"
          label="Other certifications being pursued:"
        />
        <FormulateInput
          v-model="formData.d_and_o"
          type="radio"
          :options="[
            { label: 'Yes', value: '1' },
            { label: 'No', value: '0' },
          ]"
          label="Is the project targeting WELL Precertification?"
        />
        <FormulateInput
          v-model="formData.well_cert"
          type="radio"
          :options="[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]"
          label="Is the project targeting WELL Certification?"
        />
        <FormulateInput
          v-model="formData.construction_status"
          type="radio"
          :options="[
            { label: 'Yes', value: '1' },
            { label: 'No', value: '0' },
          ]"
          label="Is the project undergoing construction or renovation?"
        />
        <FormulateInput
          v-model="formData.construction_type"
          type="radio"
          :options="[
            { label: 'In design', value: 'In design' },
            { label: 'Under construction', value: 'Under construction' },
            { label: 'Construction complete', value: 'Construction complete' },
          ]"
          label="What is the construction status?"
        />
        <FormulateInput
          v-model="commercial_kitchen"
          type="radio"
          :options="[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]"
          label="Does the project contain commercial kitchen and commercial dining?"
        />
        <FormulateInput
          v-model="outdoor_space"
          type="radio"
          :options="[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]"
          label="Does the project contain outdoor spaces?"
        />

        <FormulateInput
          v-model="retail_space"
          type="radio"
          :options="[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]"
          label="Does the project contain retail spaces under your control?"
        />

        <FormulateInput
          v-model="formData.fund_name"
          type="text"
          placeholder="Fund name"
          name="fund_name"
          label="If project is part of a fund, please provide the fund name"
        />
      </div>
      <div class="flex justify-end">
        <div class="w-48">
          <WButtonsBase v-if="apiLoading">
            <WLoadingSpinner type="button" class="mx-auto" />
          </WButtonsBase>
          <FormulateInput
            v-else
            :disabled="apiLoading"
            class="col-start-6"
            type="submit"
            :label="projectId === null ? 'Submit' : 'Update'"
          />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: Number,
      required: false,
      default: null,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      projectVersion: null,
      apiLoading: false,
      projectData: null,
      commercial_kitchen: 'no',
      retail_space: 'no',
      outdoor_space: 'no',
      formData: {
        name: '',
        area: '',
        area_in_meter: '',
        well_cert: 'No',
        hsr_cert: 'No',
        project_type: '',
        d_and_o: '0',
        construction_type: '',
        retail_space: 'no',
        outdoor_space: 'no',
        commercial_kitchen: 'no',
        no_of_occupants: '',
        industry: '',
        expedia_id: '',
        owner_street: '',
        owner_country_code: '',
        owner_state: '',
        owner_city: '',
        owner_zip: '',
        owner_name: '',
        owner_org: '',
        owner_email: '',
        postal_code: '',
        city: '',
        state: '',
        street: '',
        country_code: '',
        project_version: 'v2-hsr',
        project_public: 1,
      },
      projectVersions: [
        { label: 'WELL v2', value: 'v2' },
        { label: 'WELL v2-Pilot', value: 'v2-pilot' },
      ],
      type: 'sqft',
      tab: 'required',
      locationAddress: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
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
      portfolio: (state) => state.portfolio.portfolio,
      portfolioProjects: (state) => state.portfolio.portfolioProjects,
      otherCertificationList: (state) => state.portfolio.otherCertificationList,
      wellStandardList: (state) => state.shared.wellStandardList,
      projectType: (state) => state.shared.projectType,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      spaceTypes: (state) => state.portfolio.spaceTypes,
      industry: (state) => state.shared.industry,
      project: (state) => state.project.project,
    }),
  },
  async mounted() {
    await this.$store.dispatch('portfolio/fetchSpaceTypes')
    if (this.projectId) {
      await this.$store.dispatch('project/getProject', this.projectId)
      this.formData = JSON.parse(JSON.stringify(this.project))
      this.formData.industry = this.project.industry

      if (!this.formData.owner_org) {
        this.formData.owner_org = this.portfolio.owner_org
      }

      // if the project already has owner addressing assigned to it we will bind that otherwise default to the project primary address
      if (this.formData.owner_country_code) {
        this.ownerAddress = {
          country_code: this.formData.owner_country_code,
          state: this.formData.owner_state,
          street: this.formData.owner_street,
          city: this.formData.owner_city,
          postal_code: this.formData.owner_zip,
        }
      } else {
        // find the owner address from the workspace address list
        const ownerAddress = this.portfolio.addresses.find(
          (a) => a.is_shipping === 1
        )
        // set the according fields fro the owner address
        this.ownerAddress = {
          country_code: ownerAddress.country_code,
          state: ownerAddress.state,
          street: ownerAddress.street,
          city: ownerAddress.city,
          postal_code: ownerAddress.postal_code,
        }
      }
      // find the primary project address
      if (this.project.addresses.length > 0) {
        const projectAddress = this.project.addresses.find(
          (a) => a.is_primary === 1
        )

        // set the according fields fro the location address
        this.locationAddress = {
          country_code: projectAddress.country_code,
          state: projectAddress.state,
          street: projectAddress.street,
          city: projectAddress.city,
          postal_code: projectAddress.postal_code,
        }
      }

      // Check to set values for retail and outdoor
      if (
        this.formData.space_types.find((a) => a.id === 2) &&
        this.formData.space_types.find((a) => a.id === 4)
      ) {
        this.commercial_kitchen = 'yes'
      } else {
        this.commercial_kitchen = 'no'
      }

      if (this.formData.space_types.find((a) => a.id === 6)) {
        this.retail_space = 'yes'
      } else {
        this.retail_space = 'no'
      }

      if (this.formData.space_types.find((a) => a.id === 5)) {
        this.outdoor_space = 'yes'
      } else {
        this.outdoor_space = 'no'
      }

      // Then instanciate the last space type as the space type value
      this.formData.space_types =
        this.formData.space_types[this.formData.space_types.length - 1].id
    } else {
      // find the owner address from the workspace address list
      const ownerAddress = this.portfolio.addresses.find(
        (a) => a.is_shipping === 1
      )
      // set the according fields fro the owner address
      if (ownerAddress) {
        this.ownerAddress = {
          country_code: ownerAddress.country_code,
          state: ownerAddress.state,
          street: ownerAddress.street,
          city: ownerAddress.city,
          postal_code: ownerAddress.postal_code,
        }
      }

      // when creating a new location we will populate additional information
      this.formData.industry = this.portfolio.industry
      this.formData.owner_name = this.portfolio.owner_name
      this.formData.owner_email = this.portfolio.owner_email
      this.formData.owner_org = this.portfolio.owner_org
    }
  },
  methods: {
    calcRecOcc() {
      // calc the rec occupancy size
      if (this.formData.area <= 250) {
        this.formData.no_of_occupants = '1'
      } else {
        this.formData.no_of_occupants = String(
          Math.round(Number(this.formData.area / 250))
        )
      }
    },
    getPayload() {
      const data = {
        ...this.formData,
        owner_country_code: this.ownerAddress.country_code,
        owner_zip: this.ownerAddress.postal_code,
        owner_street: this.ownerAddress.street,
        owner_state: this.ownerAddress.state,
        owner_city: this.ownerAddress.city,
        map_country_code: this.locationAddress.country_code,
        map_postal_code: this.locationAddress.postal_code,
        map_street: this.locationAddress.street,
        map_state: this.locationAddress.state,
        map_city: this.locationAddress.city,
        country_code: this.locationAddress.country_code,
        postal_code: this.locationAddress.postal_code,
        street: this.locationAddress.street,
        state: this.locationAddress.state,
        city: this.locationAddress.city,
      }

      // find the primary project address if updating otherwise ignore this
      if (data.id && data.addresses.length > 0) {
        const primaryAddressIndex = data.addresses.findIndex(
          (a) => a.is_primary === 1
        )

        data.addresses[primaryAddressIndex].country_code =
          this.locationAddress.country_code
        data.addresses[primaryAddressIndex].postal_code =
          this.locationAddress.postal_code
        data.addresses[primaryAddressIndex].street = this.locationAddress.street
        data.addresses[primaryAddressIndex].state = this.locationAddress.state
        data.addresses[primaryAddressIndex].city = this.locationAddress.city
      }

      /*
       Update construction status based off of construction type
       This will allow the value to be updated in the overall listing of locations 
      */
      if (data.construction_type === 'Construction complete') {
        data.construction_status = false
      } else {
        data.construction_status = true
      }

      data.space_types = []

      if (
        this.commercial_kitchen === 'yes' &&
        (!data.space_types.includes('2') || !data.space_types.includes('2'))
      ) {
        data.space_types.push('2')
        data.space_types.push('4')
      } else {
        data.space_types = data.space_types.filter(
          (spaceType) => spaceType !== '2'
        )
        data.space_types = data.space_types.filter(
          (spaceType) => spaceType !== '4'
        )
      }

      if (this.outdoor_space === 'yes' && !data.space_types.includes(5)) {
        data.space_types.push('5')
      } else {
        data.space_types = data.space_types.filter(
          (spaceType) => spaceType !== '5'
        )
      }

      if (this.retail_space === 'yes' && !data.space_types.includes('6')) {
        data.space_types.push('6')
      } else {
        data.space_types = data.space_types.filter(
          (spaceType) => spaceType !== '6'
        )
      }

      if (!data.space_types.includes(String(data.primary_space_type_id))) {
        data.space_types.push(String(data.primary_space_type_id))
      }

      // convert to int
      data.primary_space_type_id = parseInt(data.primary_space_type_id)
      data.space_types = data.space_types.map((el) => parseInt(el))
      data.d_and_o = parseInt(data.d_and_o)

      return data
    },

    async submitForm() {
      this.apiLoading = true
      let message = ''
      const data = this.getPayload()

      const payload = {
        projects: [data],
        unit: this.type,
        type: 'location',
        project_type: this.projectVersion,
      }

      if (this.projectId === null) {
        await this.$store.dispatch('portfolio/createNewProperty', {
          data: payload,
          id: this.portfolio.id,
        })
        message =
          'Location added! If you do not see it appear in the listing, wait a moment and click the refresh button.'
      } else {
        await this.$store.dispatch('portfolio/updateProperty', {
          id: data.id,
          data,
        })

        message =
          'Location updated! If you do not see it appear in the listing, wait a moment and click the refresh button.'
      }

      // setting a manual timeout since the backend is has not made the entry yet
      const self = this
      setTimeout(() => {
        self.$store.dispatch('portfolio/getFilterProjects', {
          paginate: true,
          page: this.currentPage, // Prop passed in from parent
        })
        self.apiLoading = false
        self.$parent.$parent.$refs.location.toggleOpen()
        this.$store.dispatch('notifications/toastMessage', {
          message,
        })
      }, 5500)
    },
    calcSqM() {
      if (this.formData.area) {
        this.formData.area_in_meter = Number.parseFloat(
          this.formData.area * 0.092903
        ).toFixed(2)
      } else {
        this.formData.area_in_meter = 0
      }
      this.calcRecOcc()
    },
    calcSqFt() {
      if (this.formData.area_in_meter) {
        this.formData.area = Number.parseFloat(
          this.formData.area_in_meter * 10.7639
        ).toFixed(2)
      } else {
        this.formData.area = 0
      }
      this.calcRecOcc()
    },
  },
}
</script>

<style>
.certification-options {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(3, minmax(0, 1fr));
}
</style>
