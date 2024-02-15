<template>
  <div>
    <div class="space-y-6 max-w-4xl mx-auto">
      <WHeadingsHTwo class="mb-2" heading="Start a Project" />
    </div>
    <FormulateForm
      :form-errors="formErrors"
      class="space-y-6 max-w-4xl mx-auto my-10 border rounded-md p-5"
      @submit="createProject"
    >
      <div class="mb-5">
        <FormulateInput
          v-model="projectInfo.name"
          label="Project Name*"
          name="Project Name"
          type="text"
          placeholder="Project name"
          validation="required"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="projectInfo.target_cert_level"
          type="select"
          name="Target Certification level"
          label="Target Certification Level*"
          placeholder="Select option"
          :options="targetCertificationLevel"
          validation="required"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="projectInfo.other_certification"
          :options="otherCertificationList"
          type="checkbox"
          label="Other certifications being pursued"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="projectInfo.other_certification_project_id"
          label="Other Certification Project ID"
          name="otherCertiifcationProjectId"
          type="text"
        />
      </div>
      <div class="mt-5 text-sm font-medium leading-5 text-primary-800">
        Gross Area *
      </div>
      <div class="w-full relative">
        <FormulateInput
          v-model="projectInfo.area"
          type="number"
          min="0"
          step=".01"
          name="Gross area"
          placeholder="Gross Area"
          validation="required|number"
          @keyup="changeAreaInMeter()"
        />
        <div
          class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
        >
          <div class="my-auto px-3">acre</div>
        </div>
      </div>

      <div class="w-full relative mt-3">
        <FormulateInput
          v-model="projectInfo.area_in_meter"
          type="number"
          min="0"
          step=".01"
          name="Gross Area"
          placeholder="Gross Area"
          validation="required|number"
          @keyup="changeAreaInFeet()"
        />
        <div
          class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
        >
          <div class="my-auto px-3">hectare</div>
        </div>
      </div>
      <div class="w-full relative">
        <p class="text-sm">
          The registration fees are based on the typology and size of your
          project.
          <a
            target="_blank"
            class="text-primary-800"
            href="https://www.wellcertified.com/en/pricing"
            >View pricing structure.</a
          >
        </p>
      </div>
      <!-- Address Information -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Project address</div>
        </div>
        <div
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <FormInputsAddressFormulate
            :required="true"
            :address="address"
            :target="address"
            class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
          />
        </div>
      </div>
      <!-- Project Details -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Project details</div>
        </div>
        <div
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="w-full relative">
            <p class="text-sm">
              This section content may appear in the WELL Project Directory, as
              long as your project is marked 'public.')
            </p>
          </div>
          <div class="w-full relative mt-5 mb-5">
            <FormulateInput
              v-model="projectInfo.current_status"
              type="select"
              name="Project status"
              label="Current status of project *"
              placeholder="Select option"
              validation="required"
              :options="projectCurrentStatus"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.no_of_occupants"
              type="number"
              min="1"
              label="Number of occupants"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.scope_and_premises"
              type="textarea"
              label="Project scope & premises"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.goals_and_vision"
              type="textarea"
              placeholder="This field is what will appear in the WELL Project Directory , as long as your project is marked public"
              label="WELL Project Goals and Vision"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.construction_completion_date"
              type="datetimepicker"
              max="9999-01-01"
              label="Anticipated date of construction completion"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.doc_sub_date_est"
              type="datetimepicker"
              max="9999-01-01"
              label="Estimated date of document submission *"
              validation="required"
            />
          </div>
        </div>
      </div>
      <!-- Project Owner -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Project Owner</div>
        </div>
        <div
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="w-full relative">
            <p class="text-sm">
              The project owner is the individual or entity that holds all legal
              right to possess and control project-relevant location + and to
              authorize decisions pertaining to the location.
            </p>
            <p class="text-sm">
              The owner will receive an email with the
              <a
                href="https://wellonline.wellcertified.com/cert-agreement"
                target="_blank"
                >WELL™ Certification Agreement</a
              >
              for their eSignature. The project administrator will have the
              option to send this after completing the project registration
              page.
            </p>
            <hr />
          </div>
          <div class="w-full relative mt-5 mb-5">
            <FormulateInput
              v-model="projectInfo.owner_org"
              type="text"
              name="Owner organization"
              label="Owner organization*"
              placeholder="Organization of the owner"
              validation="required"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.owner_name"
              type="text"
              name="Owner name"
              label="Owner name *"
              placeholder="Primary contact of the owner organization"
              validation="required"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.owner_email"
              type="email"
              name="Owner email"
              label="Owner email *"
              placeholder="Email address of the primary contact"
              validation="required"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.owner_phone"
              type="tel"
              name="Owner phone"
              label="Owner phone *"
              placeholder="Phone Number"
              validation="required"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.industry"
              type="select"
              name="Industry"
              label="Industry*"
              placeholder="Select option"
              :options="industry"
              validation="required"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.org_website"
              type="url"
              label="Organization website"
              placeholder="Organization website"
            />
          </div>
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.org_overview"
              type="textarea"
              placeholder="Description"
              label="Organization overview"
            />
          </div>
        </div>
      </div>
      <!-- Applicant information -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Applicant information</div>
        </div>
        <div
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="w-full relative mb-5">
            <FormulateInput
              v-model="projectInfo.applicant_role"
              type="select"
              label="Applicant's role on the project *"
              validation="required"
              :options="applicantList"
            />
          </div>
        </div>
      </div>
      <!-- Project Directory listing -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Project Directory listing</div>
        </div>
        <div
          class="flex flex-wrap px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="w-full relative">
            <p class="text-sm">
              A project may opt-out of the WELL project directory and publicity
              opportunities as a “private project” at the time of registration.
              A “private project” means that the project name, street address,
              and identify of the owner will not appear within the WELL project
              directory. The private status of your project can be changed at
              any time.
            </p>
          </div>
          <div class="w-full relative mt-5 mb-5">
            <FormulateInput
              v-model="projectInfo.project_public"
              type="select"
              label="Is this a public project? *"
              :options="[
                { label: 'No', value: 0 },
                { label: 'Yes', value: 1 },
              ]"
            />
          </div>
        </div>
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="projectInfo.v1_registration_code"
          label="Registration code"
          type="text"
          help="If you were issued a special code for registration, please enter here"
        />
      </div>
      <div class="flex justify-end">
        <div class="w-32">
          <WButtonsBase v-if="submitting" :type="'primaryInverted'">
            <span>
              <WLoadingSpinner type="button" class="mx-auto" />
            </span>
          </WButtonsBase>
          <FormulateInput v-else type="submit" label="Create" />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
export default {
  data() {
    return {
      submitting: false,
      formErrors: [],
      v1_project_standard: 'community',
      v1_project_type: '',
      areaLabel: 'sq ft',
      subAreaLabel: 'sq m',
      projectInfo: {
        area: '',
        area_in_meter: '',
        doc_sub_date_est: '',
        construction_completion_date: '',
        project_public: 1,
        applicant_role: [],
        industry: [],
        current_status: [],
        target_cert_level: [],
      },
      address: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
      projectAreaInMeter: '',
      wellStandardList: [
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
      projectCertStatus: [
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Pilot', label: 'Pilot' },
      ],
      targetCertificationLevel: [
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
      ],
      projectCurrentStatus: [
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
      otherCertificationList: [
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
      projectTypes: [
        { value: 'nc', label: 'New and Existing Buildings' },
        { value: 'ci', label: 'New and Existing Interiors' },
        { value: 'cs', label: 'Core & Shell' },
        {
          value: 'cics',
          label:
            'New and Existing Interiors in a Core & Shell Certified Building',
        },
      ],
      applicantList: [
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
        { label: 'Facilities Manager', value: 'facilities_manager' },
        { label: 'Interior Designer', value: 'interior_designer' },
        { label: 'Lighting Designer', value: 'lighting_designer' },
        { label: 'MEP Engineer', value: 'mep_engineer' },
        { label: 'Owner', value: 'Owner' },
        { label: 'Project Manager', value: 'project_manager' },
        {
          label: 'Sustainability Consultant',
          value: 'sustainability_consultant',
        },
        { label: 'Wellness Consultant', value: 'wellness_consultant' },
        { label: 'Administrator', value: 'administrator' },
      ],
      applicantRole: '',
    }
  },
  head() {
    return {
      title: `Create a Community Project`,
    }
  },
  methods: {
    createProject() {
      this.submitting = true
      const data = this.projectInfo
      data.v1_project_type = this.v1_project_type
      data.v1_project_standard = 'community'
      data.country_code = this.address.country_code
      data.state = this.address.state
      data.city = this.address.city
      data.postal_code = this.address.postal_code
      data.street = this.address.street
      this.$axios.post('api/well-v1/project/store', data).then((response) => {
        this.$router.push(
          `/projects/v1/${response.data.project_number}/dashboard/`
        )
      })
    },
    changeAreaInMeter(event) {
      if (this.projectInfo.area) {
        this.projectInfo.area_in_meter = Number.parseFloat(
          this.projectInfo.area / 2.471
        ).toFixed(2)
      } else {
        this.projectInfo.area_in_meter = 0
      }
    },
    changeAreaInFeet(event) {
      if (this.projectInfo.area_in_meter) {
        this.projectInfo.area = Number.parseFloat(
          this.projectInfo.area_in_meter * 2.471
        ).toFixed(2)
      } else {
        this.projectInfo.area = 0
      }
    },
  },
}
</script>
