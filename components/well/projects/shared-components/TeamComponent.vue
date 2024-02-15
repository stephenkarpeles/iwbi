<template>
  <div>
    <WFeedbackAlert ref="alert" class="z-50" />
    <!-- Team Members section -->
    <div class="flex justify-between py-5">
      <div>
        <WHeadingsHTwo class="text-primary-700 mb-2" heading="Team" />
      </div>
      <div
        class="ml-auto flex flex-col space-y-2 md:space-y-0 md:flex md:flex-row md:space-x-2"
      >
        <div class="md:w-36">
          <WButtonsBase
            data-id="add-member-btn"
            v-if="hasAccess && project.type !== 'v2-pilot-upgraded'"
            type="primary"
            @click.native="addMember()"
          >
            + Add Member
          </WButtonsBase>
        </div>
        <div>
          <WButtonsBase
            data-id="change-member-btn"
            v-if="
              (accessLevel === 'well-admin' ||
                accessLevel === 'project-admin') &&
              project.type !== 'v2-pilot-upgraded'
            "
            type="primaryInverted"
            @click.native="changeAdmin()"
          >
            Change Project Administrator
          </WButtonsBase>
        </div>
      </div>
    </div>
    <!-- Header section -->
    <div class="mb-2 border rounded-lg bg-primary-100 text-primary-800">
      <div class="flex flex-col md:flex-row px-6 mt-5">
        <WHeadingsHFour class="md:w-2/3" heading="Project Owner" />
        <div class="md:w-full md:my-auto">
          <FormulateInput
            v-if="project"
            v-model="project.owner_email"
            :disabled="true"
            type="text"
          />
        </div>
      </div>
    </div>

    <!-- Admin Form section -->
    <WFeedbackModal ref="changeAdminModal" :can-manually-close="true">
      <WHeadingsHTwo heading="Change Project Administrator" />
      <div class="md:px-6 pb-4">
        <FormulateForm
          :key="forceReMount"
          name="changeAdmin"
          class="space-y-2"
          @submit="changeAdminForm"
        >
          <FormulateInput
            data-id="admin-email-input"
            v-model="newAdminData.email"
            :disabled="
              accessLevel === 'well-admin' || accessLevel === 'project-admin'
                ? false
                : true
            "
            type="text"
            name="Email Address"
            label="Email Address*"
            validation="required"
          />
          <FormulateInput
            data-id="admin-role-input"
            v-model="newAdminData.position"
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
              { label: 'Facilities Manager', value: 'facilities_manager' },
              { label: 'Interior Designer', value: 'interior_designer' },
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
            type="select"
            placeholder="Select a role"
            label="Project Role"
            validation="required"
          />
          <div class="w-36 ml-auto">
            <FormulateInput
              data-id="admin-update-btn"
              type="submit"
              label="Update"
            />
          </div>
        </FormulateForm>
      </div>
    </WFeedbackModal>

    <!-- Member Form section -->
    <WFeedbackModal ref="addMemberModal" :can-manually-close="true">
      <div class="md:w-96">
        <WHeadingsHTwo v-if="memberFormMode === 'edit'" heading="Edit Member" />
        <WHeadingsHTwo v-else heading="Add Member" />
        <div class="md:px-6 pb-4">
          <FormulateForm
            :key="forceReMount"
            class="space-y-2"
            @submit="addMemberForm"
          >
            <FormulateInput
              data-id="member-email-input"
              v-model="newMemberData.email"
              :disabled="
                accessLevel === 'well-admin' ||
                accessLevel === 'project-admin' ||
                accessLevel === 'project-manager'
                  ? false
                  : true
              "
              type="text"
              name="Email Address"
              label="Email Address*"
              validation="required"
            />
            <FormulateInput
              data-id="member-role-input"
              v-model="newMemberData.role"
              :options="[
                { value: 'project-manager', label: 'Team Manager' },
                { value: 'project-member', label: 'Team Member' },
                {
                  value: 'project-pta',
                  label: 'Performance Testing Agent',
                },
                { value: 'project-pr', label: 'Marketing POC' },
              ]"
              type="radio"
              label="Project Authorization"
              validation="required"
            />
            <FormulateInput
              v-model="newMemberData.position"
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
                { label: 'Facilities Manager', value: 'facilities_manager' },
                { label: 'Interior Designer', value: 'interior_designer' },
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
              type="select"
              placeholder="Select a role"
              label="Project Role"
              validation="required"
            />
            <div class="w-36 ml-auto">
              <FormulateInput
                data-id="member-invite-btn"
                type="submit"
                :label="memberFormMode === 'new' ? 'Invite' : 'Update'"
              />
            </div>
          </FormulateForm>
        </div>
      </div>
    </WFeedbackModal>

    <!-- Main table -->
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200 -mb-0.5">
              <thead class="bg-primary-700 text-white">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider w-72"
                  >
                    Name / Role
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold uppercase w-60 tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Last Accessed
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Authorization
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                v-if="pendingInvites && pendingInvites.length > 0"
                class="bg-white divide-y divide-gray-200"
              >
                <tr v-for="(member, index) in pendingInvites" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center w-60">
                      <div class="flex-shrink-0 h-10 w-10 opacity-50">
                        <img
                          v-if="member.profile_pic"
                          class="h-10 w-10 rounded-full"
                          :src="member.profile_pic"
                          alt="member profile picture"
                          @error="imageUrlAlt"
                        />
                        <img
                          v-else
                          class="h-10 w-10 rounded-full"
                          src="/profile/avatar.jpg"
                          alt="member profile picture"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-semibold text-primary-900">
                          <div>
                            {{ member.full_name }}
                          </div>
                        </div>
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100"
                        >
                          Invite pending
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-primary-900 opacity-50 w-48">
                      <div>
                        {{ member.email }}
                      </div>
                      <div class="italic">
                        Sent:
                        {{ $dayjs(member.created_at).format('MMM DD, YYYY') }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-primary-900 opacity-50 w-48"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-primary-900 opacity-50 w-48"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      v-if="
                        (project.type !== 'v2-pilot-upgraded' &&
                          member.id !== project.user_id &&
                          accessLevel === 'well-admin') ||
                        (project.type !== 'v2-pilot-upgraded' &&
                          member.id !== project.user_id &&
                          accessLevel === 'project-admin')
                      "
                      class="flex space-x-2 justify-end w-52"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-primary-700 text-white opacity-0 h-0">
                <tr>
                  <th
                    scope="col"
                    class="px-6 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    <div class="h-0">Name / Role</div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    <div class="h-0">Email</div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    <div class="h-0">Email</div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    <div class="h-0">Authorization</div>
                  </th>
                  <th
                    scope="col"
                    class="px-6 text-right text-xs font-semibold uppercase tracking-wider"
                  >
                    <div class="h-0">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(member, index) in project.members" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center w-60">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          v-if="member.profile_pic"
                          class="h-10 w-10 rounded-full"
                          :src="member.profile_pic"
                          alt="member profile picture"
                          @error="imageUrlAlt"
                        />
                        <img
                          v-else
                          class="h-10 w-10 rounded-full"
                          src="/profile/avatar.jpg"
                          alt="member profile picture"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-semibold text-primary-900">
                          {{ member.full_name }}
                        </div>
                        <span
                          v-if="member.pivot.role === 'project-admin'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-success-700 border border-green-100"
                        >
                          Project Administrator
                        </span>
                        <span
                          v-if="member.pivot.role === 'project-manager'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Team Manager
                        </span>
                        <span
                          v-if="member.pivot.role === 'project-pr'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Marketing POC
                        </span>
                        <span
                          v-if="member.pivot.role === 'project-member'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Team Member
                        </span>
                        <span
                          v-if="member.pivot.role === 'project-pta'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Performance Testing Agent
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-primary-900 opacity-50 w-48">
                      {{ member.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-primary-900 opacity-50 w-48">
                      <span v-if="member.pivot.last_access_at">
                        {{
                          $dayjs(member.pivot.last_access_at).format(
                            'MMM DD, YYYY'
                          )
                        }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-primary-900 opacity-50 w-48">
                      <span v-if="member.pivot.position === 'acoustician'">
                        Acoustician
                      </span>
                      <span v-if="member.pivot.position === 'architect'">
                        Architect
                      </span>
                      <span
                        v-if="member.pivot.position === 'commissioning_agent'"
                      >
                        Commissioning Agent
                      </span>
                      <span
                        v-if="member.pivot.position === 'construction_manager'"
                      >
                        Construction Manager
                      </span>
                      <span v-if="member.pivot.position === 'contractor'">
                        Contractor
                      </span>
                      <span
                        v-if="member.pivot.position === 'facilities_manager'"
                      >
                        Facilities Manager
                      </span>
                      <span
                        v-if="member.pivot.position === 'interior_designer'"
                      >
                        Interior Designer
                      </span>
                      <span
                        v-if="member.pivot.position === 'lighting_designer'"
                      >
                        Lighting Designer
                      </span>
                      <span v-if="member.pivot.position === 'mep_engineer'">
                        MEP Engineer
                      </span>
                      <span v-if="member.pivot.position === 'Owner'">
                        Owner
                      </span>
                      <span v-if="member.pivot.position === 'hr'">
                        Human Resource
                      </span>
                      <span v-if="member.pivot.position === 'project_manager'">
                        Project Manager
                      </span>
                      <span
                        v-if="
                          member.pivot.position === 'sustainability_consultant'
                        "
                      >
                        Sustainability Consultant
                      </span>
                      <span
                        v-if="member.pivot.position === 'wellness_consultant'"
                      >
                        Wellness Consultant
                      </span>
                      <span v-if="member.pivot.position === 'administrator'">
                        Administrator
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      v-if="
                        (project.type !== 'v2-pilot-upgraded' &&
                          member.id !== project.user_id &&
                          accessLevel === 'well-admin') ||
                        (project.type !== 'v2-pilot-upgraded' &&
                          member.id !== project.user_id &&
                          accessLevel === 'project-admin')
                      "
                      class="flex space-x-2 justify-end w-52"
                    >
                      <div class="w-42">
                        <WButtonsBase
                          type="primaryInverted"
                          icon="pencil"
                          @click.native="editMember(member)"
                        />
                      </div>
                      <div class="w-42">
                        <WButtonsBase
                          type="dangerInverted"
                          icon="trash"
                          @click.native="removeMember(member.id)"
                        />
                      </div>
                    </div>
                    <div v-else class="w-52"></div>
                  </td>
                </tr>
              </tbody>
            </table>
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
      pendingInvites: null,
      forceReMount: 0,
      showAddMemberForm: false,
      showAdminForm: false,
      memberFormMode: 'new',
      newMemberData: {
        email: '',
        position: '',
        role: '',
      },
      newAdminData: {
        email: '',
        position: '',
        role: 'project-admin',
      },
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      project: (state) => state.project.project,
      estimate: (state) => state.project.estimate,
      invoices: (state) => state.project.projectInvoices,
      countries: (state) => state.address.countries,
      currentUser: (state) => state.user.currentUser,
    }),
    hasAccess() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      } else if (
        this.accessLevel === 'project-admin' ||
        this.accessLevel === 'project-manager'
      ) {
        return true
      }
      return false
    },
    accessLevel() {
      if (this.currentUser.role.includes('well-admin')) {
        return 'well-admin'
      }

      if (
        this.project &&
        this.project.members.find((member) => member.id === this.currentUser.id)
      ) {
        return this.project.members.find(
          (member) => member.id === this.currentUser.id
        ).pivot.role
      }
      return false
    },
  },
  async mounted() {
    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )

    await this.$store.dispatch('project/getProjectInvoices', this.project.id)
    await this.$store
      .dispatch('project/getPendingInvites', this.project.id)
      .then((res) => (this.pendingInvites = res.data))
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
  methods: {
    imageUrlAlt(event) {
      event.target.src = '/profile/avatar.jpg'
    },
    changeAdmin() {
      this.$refs.changeAdminModal.isHidden = false
    },
    addMember() {
      this.$refs.addMemberModal.isHidden = false
      this.memberFormMode = 'new'
      this.showAdminForm = false
      this.newMemberData = {
        email: null,
        position: null,
        role: null,
      }
    },
    editMember(member) {
      this.memberFormMode = 'edit'
      this.$refs.addMemberModal.isHidden = false
      this.newMemberData.email = member.email
      this.newMemberData.position = member.pivot.position
      this.newMemberData.role = member.pivot.role
    },
    changeAdminForm() {
      this.$store
        .dispatch('project/inviteMember', this.newAdminData)
        .then((res) => {
          this.newAdminData.email = ''
          this.newAdminData.position = ''
          this.$refs.alert.showAlert('success', 'We have sent an email invite!')
          this.$formulate.resetValidation('changeAdmin')
          this.$refs.changeAdminModal.isHidden = true
        })
    },
    async addMemberForm() {
      if (this.memberFormMode === 'new') {
        await this.$store
          .dispatch('project/inviteMember', this.newMemberData)
          .then(
            (this.newMemberData.role = ''),
            (this.newMemberData.email = ''),
            this.$refs.alert.showAlert(
              'success',
              'We have sent an email invite!'
            ),
            (this.$refs.addMemberModal.isHidden = true)
          )
      } else {
        await this.$store
          .dispatch('project/inviteMember', this.newMemberData)
          .then(
            (this.newMemberData.role = ''),
            (this.newMemberData.email = ''),
            this.$refs.alert.showAlert('success', 'Changes have been saved'),
            (this.$refs.addMemberModal.isHidden = true)
          )
      }
      const self = this
      setTimeout(function () {
        self.$store
          .dispatch('project/getPendingInvites', self.project.id)
          .then((res) => (self.pendingInvites = res.data))
      }, 2000)
      this.forceReMount++
    },
    removeMember(userId) {
      this.$store
        .dispatch('project/removeMember', userId)
        .then(this.$refs.alert.showAlert('success', 'Removed Member'))
    },
  },
}
</script>
