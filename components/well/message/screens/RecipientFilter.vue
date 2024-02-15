<template>
  <div class="px-6">
    <WButtonsExpandable :icon="false">
      <WButtonsBase icon="filter" type="primaryInverted" class="ml-auto"
        >Filter</WButtonsBase
      >

      <template #buttons>
        <div
          class="
            grid
            sm:gap-4
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-4
            -mx-2
            mt-5
          "
        >
          <FormulateInput
            v-model="projectFilters.project_id"
            type="text"
            placeholder="Project ID"
            label="Project ID"
            @keyup.enter.native="handleUpdateFilter(null)"
          />
          <FormulateInput
            v-model="projectFilters.project_name"
            type="text"
            placeholder="Project name"
            label="Project name"
            @keyup.enter.native="handleUpdateFilter(null)"
          />
          <FormulateInput
            v-model="projectFilters.v1_project"
            :options="[
              { value: 'all', label: 'All' },
              { value: '1', label: 'V1' },
              { value: '0', label: 'V2' },
            ]"
            type="select"
            placeholder="All"
            label="Project version"
            @input="getByFilters()"
          />
          <FormulateInput
            v-model="projectFilters.city"
            type="text"
            placeholder="Project city"
            label="Project city"
            @keyup.enter.native="handleUpdateFilter(null)"
          />
          <FormulateInput
            v-model="projectFilters.state"
            type="text"
            placeholder="Project state"
            label="Project state"
            @keyup.enter.native="handleUpdateFilter(null)"
          />
          <FormulateInput
            v-model="projectFilters.country_code"
            :options="countryOptions"
            type="select"
            placeholder="Country/Region"
            label="Country/Region"
          />
          <FormulateInput
            v-model="projectFilters.project_phase_internal"
            :options="projectPhaseInternal"
            type="select"
            placeholder="Project phase"
            label="Project Phase"
          />
          <FormulateInput
            v-model="projectFilters.registration_status"
            :options="registrationStatus"
            type="select"
            placeholder="Status"
            label="Registration status"
          />
          <FormulateInput
            v-model="projectFilters.agreement_status"
            :options="agreementOptions"
            type="select"
            placeholder="Status"
            label="Agreement status"
          />
          <FormulateInput
            v-model="projectFilters.space_types"
            :options="spaceTypes"
            type="select"
            placeholder="Space types"
            label="Space types"
          />
          <FormulateInput
            v-model="projectFilters.industry"
            :options="industryOptions"
            type="select"
            placeholder="Select industry"
            label="Industry"
          />
          <FormulateInput
            v-model="projectFilters.admin_email"
            type="text"
            placeholder="Email"
            label="Admin email"
            @keyup.enter.native="handleUpdateFilter(null)"
          />
          <FormulateInput
            v-model="projectFilters.admin_organization"
            type="text"
            label="Admin organization"
            @keyup.enter.native="handleUpdateFilter(null)"
          />
          <FormulateInput
            v-model="projectFilters.owner_organization"
            type="text"
            label="Owner organization"
            @keyup.enter.native="handleUpdateFilter(null)"
          />
          <FormulateInput
            v-model="projectFilters.portfolio"
            :options="[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]"
            type="select"
            placeholder="Select option"
            label="Is portfolio project?"
          />
          <FormulateInput
            v-model="projectFilters.other_certification"
            :options="otherCertificationList"
            type="select"
            placeholder="Select option"
            label="Other certfication"
          />
          <FormulateInput
            v-model="projectFilters.project_public"
            :options="[
              { label: 'No', value: 0 },
              { label: 'Yes', value: 1 },
            ]"
            type="select"
            placeholder="Project phase"
            label="Public project"
          />
          <FormulateInput
            v-model="projectFilters.project_type"
            :options="projectType"
            type="select"
            placeholder="Project type"
            label="Project type"
          />
          <FormulateInput
            v-model="projectFilters.limit"
            :options="[
              { value: '100', label: '100' },
              { value: '200', label: '200' },
              { value: '300', label: '300' },
              { value: '400', label: '400' },
              { value: '500', label: '500' },
            ]"
            type="select"
            placeholder="100"
            label="Projects per page"
          />
          <FormulateInput
            v-model="projectFilters.sort_by"
            type="select"
            placeholder="Sort by"
            label="Sort By"
            :option-groups="{
              'Project Number': {
                'orderBy=project_number&order=asc': 'Ascending',
                'orderBy=project_number&order=desc': 'Descending',
              },
              'Project Name': {
                'orderBy=name&order=asc': 'Ascending',
                'orderBy=name&order=desc': 'Descending',
              },
            }"
            class="primary"
            @input="getByFilters()"
          />
          <FormulateInput
            v-model="projectFilters.coaching_contact_id"
            type="select"
            placeholder="Coaching contact"
            label="Coaching contact"
            :options="coachingUsers"
            class="primary"
            @input="getByFilters()"
          />
        </div>
        <div
          class="
            sm:flex
            justify-between
            sm:max-w-xs sm:ml-auto
            pt-6
            sm:space-x-4
            -mx-2
          "
        >
          <WButtonsBase
            class="mb-4 sm:mb-0"
            type="primaryInverted"
            @click.native="resetFilters()"
            >Reset Filters</WButtonsBase
          >
          <WButtonsBase type="primary" @click.native="handleUpdateFilter(null)"
            >Apply Filters</WButtonsBase
          >
        </div>
      </template>
    </WButtonsExpandable>
    <div>
      <div v-if="loadingResults">
        <div class="mx-auto mt-5 text-center">
          <WLoadingSpinner class="mx-auto" />
          <div class="mt-3 text-primary-600">Loading the results...</div>
        </div>
      </div>
      <div v-else class="space-y-4 mt-4">
        <div v-if="projectList && projectList.length > 0">
          <div class="choose-filter mb-4">
            <p class="my-2 text-bold">Choose selection type</p>
            <div class="md:grid grid-cols-3 gap-4">
              <FormulateInput
                v-model="selectionType"
                type="radio"
                name="templatetype"
                :options="selectionTypeOptions"
              />
            </div>
          </div>
          <div class="filter-list-wrapper h-96 overflow-y-scroll">
            <div v-for="(project, index) in projectList" :key="index">
              <WButtonsExpandable class="py-4 border-t-2">
                <FormulateInput
                  v-model="projectList[index].selected"
                  type="checkbox"
                  :label="project.project_number + '-' + project.name"
                  @click="changeProjectCheck(index)"
                />
                <template #buttons>
                  <div class="px-3">
                    <FormulateInput
                      v-if="
                        project.owner_email !== project.user.email &&
                        project.owner_email !== null &&
                        project.owner_name !== null
                      "
                      v-model="projectList[index].include_owner"
                      type="checkbox"
                      :label="project.owner_name + ' ' + '(PROJECT-OWNER)'"
                      @click="changeProjectOwnerCheck(index)"
                    />
                  </div>
                  <br
                    v-if="
                      project.owner_email !== project.user.email &&
                      project.owner_email !== null &&
                      project.owner_name !== null
                    "
                  />

                  <div
                    v-for="(member, memberIndex) in project.members"
                    :key="member.id"
                    class="px-3"
                  >
                    <FormulateInput
                      v-model="
                        projectList[index].members[memberIndex].include_member
                      "
                      type="checkbox"
                      :label="addProjectMember(member)"
                      @click="changeProjectMemberCheck(index, memberIndex)"
                    />
                  </div>
                </template>
              </WButtonsExpandable>
            </div>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="updatePagination()"
          />
        </div>
        <div v-else>No results were found</div>
      </div>
    </div>

    <div class="my-5">
      <div class="sm:flex justify-end">
        <WButtonsBase
          type="primaryInverted"
          class="mb-4 sm:mb-0"
          @click.native="
            ;($parent.$parent.modalScreen = 'compose'),
              ($parent.$parent.editMessageData = $parent.$parent.messageData)
          "
        >
          Edit Message
        </WButtonsBase>
        <WButtonsBase
          class="sm:ml-2"
          type="primaryInverted"
          @click.native="
            ;($parent.$parent.modalScreen = 'mpreview'),
              getselectedProjects(selectedProjects)
          "
          >Preview Message</WButtonsBase
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      selectedProjects: [],
      loadingResults: false,
      selectionType: 'custom',
      selectionTypeOptions: [
        { label: 'Select All Projects', value: 'all' },
        { label: 'Select All Project Admins', value: 'admin' },
        { label: 'Custom Project Selection', value: 'custom' },
      ],
      projectList: [],
      includeOwners: false,
      projectFilters: {
        currentPage: 1,
        project_id: '',
        name: '',
        limit: 100,
        v1_project: { text: 'All', value: 'all' },
        city: '',
        state: '',
        country_code: '',
        registration_status: '',
        project_phase_internal: '',
        agreement_status: null,
        space_types: null,
        industry: null,
        admin_email: '',
        admin_organization: '',
        owner_organization: '',
        sort_by: null,
      },
      projectPhaseInternal: [
        { value: 'na', label: 'N/A' },
        {
          value: 'D&O Preliminary Documentation Review',
          label: 'D&O Preliminary Documentation Review',
        },
        { value: 'D&O Final application', label: 'D&O Final application' },
        {
          value: 'D&O Final Documentation Review',
          label: 'D&O Final Documentation Review',
        },
        { value: 'D&O Decision', label: 'D&O Decision' },
        {
          value: 'Preliminary Precertification Review',
          label: 'Preliminary Precertification Review',
        },
        {
          value: 'Final Precertification Application',
          label: 'Final Precertification Application',
        },
        {
          value: 'Final Precertification Review',
          label: 'Final Precertification Review',
        },
        {
          value: 'Precertification Decision',
          label: 'Precertification Decision',
        },
        {
          value: 'Preliminary Documentation Application',
          label: 'Preliminary Documentation Application',
        },
        {
          value: 'Preliminary Documentation Review',
          label: 'Preliminary Documentation Review',
        },
        {
          value: 'Final Documentation Application',
          label: 'Final Documentation Application',
        },
        {
          value: 'Final Documentation Review',
          label: 'Final Documentation Review',
        },
        {
          value: 'Performance Verification Appeal Application',
          label: 'Performance Verification Appeal Application',
        },
        {
          value: 'Performance Verification Appeal Review',
          label: 'Performance Verification Appeal Review',
        },
        {
          value: 'Documentation Appeal Application',
          label: 'Documentation Appeal Application',
        },
        {
          value: 'Documentation Appeal Review',
          label: 'Documentation Appeal Review',
        },
        {
          value: 'Performance Verification Scheduling In Progress',
          label: 'Performance Verification Scheduling In Progress',
        },
        {
          value: 'Performance Verification Scheduled',
          label: 'Performance Verification Scheduled',
        },
        {
          value: 'Final WELL Report',
          label: 'Final WELL Report',
        },
        {
          value: 'Curative Action Plan Application',
          label: 'Curative Action Plan Application',
        },
        {
          value: 'Curative Action Plan Review',
          label: 'Curative Action Plan Review',
        },
        { value: 'Certification Decision', label: 'Certification Decision' },
      ],
      registrationStatus: [
        { label: 'N/A', value: '_none' },
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Registered - Inactive', value: 'reginactive' },
        { label: 'Registered - Not pursuing', value: 'regclosed' },
        { label: 'Registered - Moved to v2', value: 'regmovedv2' },
      ],
      agreementOptions: [
        { label: 'Signed', value: '1' },
        { label: 'Pending', value: '0' },
      ],
      coachingUsers: [],
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
      projectType: [
        { value: 'new-existing', label: 'A building that I own & occupy' },
        { value: 'non-cs', label: 'A building I own and lease out/sell' },
        { value: 'cics', label: 'A space I lease' },
        { value: 'cs', label: 'WELL Core' },
      ],
      sortOptions: [
        {
          groupLabel: 'Project Number',
          groupValues: [
            {
              label: 'Ascending',
              value: 'orderBy=project_number&order=asc',
            },
            {
              label: 'Descending',
              value: 'orderBy=project_number&order=desc',
            },
          ],
        },
        {
          groupLabel: 'Project Name',
          groupValues: [
            {
              label: 'Ascending',
              value: 'orderBy=name&order=asc',
            },
            {
              label: 'Descending',
              value: 'orderBy=name&order=desc',
            },
          ],
        },
      ],
      moduleOptions: [{ value: 'Project', name: 'Project' }],
      moduleValue: { value: 'Project', name: 'Project' },
      subModuleOptions: [
        { value: 'Review', name: 'Review' },
        { value: 'AAP', name: 'AAP' },
      ],
      subModule: '',
    }
  },
  computed: {
    messageTagsoption() {
      const options = []

      for (let i = 0; i < this.messageTags.length; i++) {
        const option = {
          value: this.messageTags[i].id,
          label: this.messageTags[i].name,
        }
        options.push(option)
      }

      return options
    },
    paginate() {
      if (this.projectsinfo.total) {
        return {
          total: this.projectsinfo.total,
          per_page: this.projectsinfo.per_page,
          current_page: this.projectsinfo.current_page,
          last_page: this.projectsinfo.last_page,
          from: this.projectsinfo.from,
          to: this.projectsinfo.to,
        }
      }
      return {}
    },
    ...mapState({
      projects: (state) => state.message.projects,
      projectsinfo: (state) => state.message.projectsinfo,
      countries: (state) => state.address.countries,
      spaceTypes: (state) =>
        JSON.parse(JSON.stringify(state.shared.spaceTypes)),
    }),
    countryOptions() {
      const options = []
      this.countries.forEach(function (country) {
        options.push({ value: country.code, label: country.name })
      })
      return options
    },
  },
  watch: {
    // watch for page number changes and call selection filter
    paginate: {
      deep: true,
      handler() {
        this.changeSelectionType(this.selectionType)
      },
    },
    projects(oldValue, newValue) {
      this.projectList = [
        ...this.projects.map((project) => {
          let p = JSON.parse(JSON.stringify(project))
          const found = this.selectedProjects.findIndex((sp) => sp.id === p.id)
          if (found > -1) {
            p = this.selectedProjects[found]
          } else {
            if (this.selectionType === 'custom') {
              p.selected = false
              p.include_admin = false
              p.include_owner = false
            }
            p.selected = false
            p.include_admin = false
            p.include_owner = this.selectionType === 'all'
          }
          return p
        }),
      ]
    },
    selectionType(newValue) {
      this.changeSelectionType(newValue)
    },
  },

  async mounted() {
    this.getProjects()
    this.resetSelection()
    await this.$store.dispatch('shared/fetchSpaceTypes')
    await this.$store
      .dispatch('shared/getAdminUsersByRole', 'project-coach')
      .then((res) => (this.coachingUsers = JSON.parse(JSON.stringify(res))))
  },

  methods: {
    changeSelectionType(newValue) {
      switch (newValue) {
        case 'all':
          this.resetSelection()
          this.selectedProjects = this.projectList.map((project) => {
            project.selected = true
            project.members.map((element) => {
              return (element.include_member = true)
            })
            project.include_owner = true
            return project
          })
          break
        case 'admin':
          this.resetSelection()
          this.selectedProjects = this.projectList.map((project) => {
            project.selected = true
            project.members.map((element) => {
              if (element.pivot.role === 'project-admin') {
                return (element.include_member = true)
              }
              return (element.include_member = false)
            })
            project.include_owner = false
            return project
          })
          break
        default:
          this.resetSelection()
          this.selectedProjects = []
          break
      }
    },
    ...mapActions('message/', ['getselectedProjects']),
    updatePagination() {
      this.loadingResults = true
      const newFilters = { ...this.projectFilters }
      // assign or update the value that you're trying to change
      newFilters.currentPage = this.paginate.current_page

      this.$store
        .dispatch('message/getshowCoachProjects', {
          projectFilters: newFilters,
        })
        .then((res) => {
          this.loadingResults = false
        })
    },
    resetSelection() {
      this.projectList = this.projects.map((project) => {
        const p = JSON.parse(JSON.stringify(project))
        if (this.selectionType === 'custom') {
          p.selected = false
          p.include_admin = false
          p.members.map((member) => {
            return (member.include_member = false)
          })
        } else if (this.selectionType === 'admin') {
          p.selected = true
          p.members.map((member) => {
            if (member.pivot.role === 'project-admin') {
              member.include_member = true
            }
            return (member.include_member = true)
          })
        } else {
          p.selected = true
          p.members.map((member) => {
            return (member.include_member = true)
          })
          p.include_owner = this.selectionType === 'all'
        }
        return p
      })
    },
    changeProjectOwnerCheck(index) {
      this.projectList[index].include_owner =
        !this.projectList[index].include_owner
      this.updateSelectedProjects(index)
    },
    changeProjectMemberCheck(index, memberIndex) {
      this.projectList[index].members[memberIndex].include_member =
        !this.projectList[index].members[memberIndex].include_member
      this.updateSelectedProjects(index)
    },
    updateSelectedProjects(index) {
      const found = this.selectedProjects.findIndex(
        (sp) => sp.id === this.projectList[index].id
      )
      if (found > -1) {
        let flag = 0
        this.projectList[index].members.map((element) => {
          if (element.include_member) {
            flag = 1
          }
          return flag
        })
        if (!flag) {
          if (this.projectList[index].include_owner) {
            flag = 1
          }
        }
        if (flag) {
          this.projectList[index].selected = true
          this.selectedProjects[found] = this.projectList[index]
        } else {
          this.projectList[index].selected = false
          this.selectedProjects[found] = this.projectList[index]
        }
      } else {
        this.projectList[index].selected = true
        this.selectedProjects.push(this.projectList[index])
      }
    },

    changeProjectCheck(index) {
      setTimeout(() => {
        if (this.projectList[index].selected) {
          if (
            this.projectList[index].owner_email !== null &&
            this.projectList[index].owner_name !== null
          ) {
            this.projectList[index].include_owner = true
          }
          this.projectList[index].members.map((element) => {
            return (element.include_member = true)
          })
          this.selectedProjects.push(this.projectList[index])
        } else {
          this.projectList[index].include_owner = false
          this.projectList[index].members.map((element) => {
            return (element.include_member = false)
          })
          this.selectedProjects = this.selectedProjects.filter(
            (p) => p.id !== this.projectList[index].id
          )
        }
      }, 50)
    },
    resetFilters() {
      this.loadingResults = true
      this.projectFilters = {
        currentPage: 1,
        project_id: '',
        name: '',
        limit: 100,
        v1_project: { text: 'All', value: 'all' },
        city: '',
        state: '',
        country_code: '',
        registration_status: '',
        project_phase_internal: '',
        agreement_status: null,
        space_types: null,
        industry: null,
        admin_email: '',
        admin_organization: '',
        owner_organization: '',
        sort_by: null,
      }

      this.$store
        .dispatch('message/getshowCoachProjects', {
          projectFilters: this.projectFilters,
        })
        .then((res) => {
          this.loadingResults = false
        })
    },
    getProjects() {
      this.loadingResults = true

      this.$store
        .dispatch('message/getshowCoachProjects', {
          projectFilters: this.projectFilters,
        })
        .then((res) => {
          this.loadingResults = false
        })
    },

    handleUpdateFilter(page) {
      if (page) {
        this.updateProjectFilter({ ...this.projectFilters, currentPage: page })
      } else {
        this.updateProjectFilter({ ...this.projectFilters })
      }
    },
    updateProjectFilter(filterData) {
      this.loadingResults = true
      this.projectFilters = filterData

      this.$store
        .dispatch('message/getshowCoachProjects', {
          projectFilters: this.projectFilters,
        })
        .then((res) => {
          this.loadingResults = false
        })
    },
    getByFilters() {
      setTimeout(() => {
        this.updateProjectFilter({ ...this.projectFilters })
      }, 50)
    },
    openSlideover(mode) {
      this.$refs.slideOver.open = true
      this.slideOverMode = mode
    },
    addTags(newTag) {
      const tag = {
        name: newTag,
        id: newTag,
      }
      this.messageTags.push(tag)
      this.tagsSelected.push(tag)
    },
    addProjectMember(member) {
      return `${member.full_name} (${member.pivot.role.toUpperCase()})`
    },
  },
}
</script>
