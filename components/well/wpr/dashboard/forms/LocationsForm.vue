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
          label="Location Name*"
        />

        <div class="flex space-x-2">
          <div class="w-full">
            <FormulateInput
              v-if="type === 'sqft'"
              v-model="formData.area"
              type="number"
              validation="required"
              label="Location Area*"
              step="0.01"
              @keyup="calcSqM()"
            />
            <FormulateInput
              v-else
              v-model="formData.area_in_meter"
              type="number"
              validation="required"
              label="Location Area*"
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
              label="Area Type*"
            />
          </div>
        </div>

        <FormulateInput
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
            <div class="font-bold">Location Address</div>
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
            { label: 'No, this is a confidential private location', value: 0 },
            { label: 'Yes, this is a public location', value: 1 },
          ]"
          label="Is this location public?*"
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
            <FormulateInput
              v-model="formData.industry"
              type="select"
              :options="industry"
              label="Industry"
            />
          </div>
        </div>
      </div>
      <div :class="{ hidden: tab !== 'Additional' }">
        <FormulateInput
          v-model="formData.no_of_occupants"
          type="number"
          label="Estimated number of occupants"
        />
        <label
          class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
        >
          Does the project contain commercial kitchen and commercial dining?
          <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
            <WButtonsBase type="tooltip" icon="question-mark-circle" />
            <template #content>
              <div class="p-3 w-64">
                Project locations who have commercial kitchens and commercial
                dining areas should look for customized requirements for these
                spaces. Otherwise, if not present, these customized requirements
                are not applicable.
              </div>
            </template>
          </Flyout>
        </label>
        <FormulateInput
          v-model="commercial_kitchen"
          type="radio"
          :options="[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]"
        />
        <label
          class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
        >
          Does the project contain outdoor spaces?
          <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
            <WButtonsBase type="tooltip" icon="question-mark-circle" />
            <template #content>
              <div class="p-3 w-64">
                Project locations who have outdoor space under their control
                should look for customized requirements for these spaces.
                Otherwise, if not present, these customized requirements are not
                applicable.
              </div>
            </template>
          </Flyout>
        </label>
        <FormulateInput
          v-model="outdoor_space"
          type="radio"
          :options="[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]"
        />
        <label
          class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
        >
          Does the project contain retail spaces under your control?
          <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
            <WButtonsBase type="tooltip" icon="question-mark-circle" />
            <template #content>
              <div class="p-3 w-64">
                Project locations who have retail space under their control
                should look for customized requirements for these spaces.
                Otherwise, if not present, these customized requirements are not
                applicable.
              </div>
            </template>
          </Flyout>
        </label>
        <FormulateInput
          v-model="retail_space"
          type="radio"
          :options="[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]"
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
            label="Submit"
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
  },
  data() {
    return {
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
      wellStandardList: (state) => state.shared.wellStandardList,
      projectType: (state) => state.shared.projectType,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      spaceTypes: (state) => state.shared.spaceTypes,
      industry: (state) => state.shared.industry,
      project: (state) => state.project.project,
    }),
  },
  async mounted() {
    if (this.projectId) {
      await this.$store.dispatch('project/getProject', this.projectId)
      this.formData = JSON.parse(JSON.stringify(this.project))
      this.formData.industry = this.project.industry

      if (!this.formData.owner_org) {
        this.formData.owner_org = this.sharedWorkspace.owner_org
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
        const ownerAddress = this.sharedWorkspace.addresses.find(
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
      const ownerAddress = this.sharedWorkspace.addresses.find(
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
      this.formData.industry = this.sharedWorkspace.industry
      this.formData.owner_name = this.sharedWorkspace.owner_name
      this.formData.owner_email = this.sharedWorkspace.owner_email
      this.formData.owner_org = this.sharedWorkspace.owner_org
    }
  },
  methods: {
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
      if (data.id) {
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
        data.construction_status = true
      } else {
        data.construction_status = false
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

      return data
    },
    async submitForm() {
      this.apiLoading = true
      const data = this.getPayload()
      const payload = {
        unit: this.type,
        projects: [data],
        type: 'location',
      }
      if (data.id === undefined) {
        await this.$store.dispatch('shared/submitParseProject', payload)
      } else {
        await this.$store.dispatch('shared/updateLocation', data)
      }

      // setting a manual timeout since the backend is has not made the entry yet
      const self = this
      setTimeout(() => {
        self.$store.dispatch('shared/getSharedProjects', {
          paginate: 'Yes',
          page: 1,
        })
        self.apiLoading = false
        self.$parent.$parent.$refs.location.toggleOpen()
        this.$store.dispatch('notifications/toastMessage', {
          message:
            'Location added! If you do not see it appear in the listing, wait a moment and click the refresh button!',
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
