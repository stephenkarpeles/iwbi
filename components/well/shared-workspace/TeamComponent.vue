<template>
  <div>
    <WFeedbackAlert ref="alert" class="z-50" />
    <!-- Team Members section -->
    <div class="flex justify-between px-6 py-5">
      <WHeadingsHTwo class="text-primary-700 mb-2" heading="Team" />
      <div class="ml-auto flex space-x-2">
        <div class="w-36">
          <WButtonsBase
            v-if="
              accessLevel === 'well-admin' ||
              accessLevel === 'portfolio-admin' ||
              accessLevel === 'portfolio-manager'
            "
            type="primaryInverted"
            @click.native="addMember()"
          >
            + Add Member
          </WButtonsBase>
        </div>
        <div>
          <WButtonsBase
            v-if="
              accessLevel === 'well-admin' || accessLevel === 'portfolio-admin'
            "
            type="primaryInverted"
            @click.native="changeAdmin()"
          >
            Change Administrator
          </WButtonsBase>
        </div>
      </div>
    </div>

    <!-- Header section -->
    <div class="mb-2 border rounded-lg bg-primary-100 text-primary-800">
      <div class="flex px-6 mt-5">
        <WHeadingsHFour class="w-2/3" heading="Administrator" />
        <div class="w-full my-auto">
          <FormulateInput
            v-if="
              sharedWorkspace &&
              sharedWorkspace.id &&
              sharedWorkspace.members &&
              sharedWorkspace.members.length > 0
            "
            v-model="sharedWorkspace.owner_email"
            :disabled="true"
            type="text"
          />
        </div>
      </div>
    </div>

    <!-- Admin form section -->
    <WFeedbackModal ref="changeAdminModal" :can-manually-close="true">
      <WHeadingsHTwo heading="Change Project Administrator" />
      <div class="px-6 pb-4">
        <FormulateForm
          name="changeForm"
          class="space-y-2"
          @submit="changeAdminForm"
        >
          <FormulateInput
            v-model="newAdminData.email"
            :disabled="
              accessLevel === 'well-admin' || accessLevel === 'portfolio-admin'
                ? false
                : true
            "
            type="text"
            name="Email Address"
            label="Email Address*"
            validation="required"
          />
          <FormulateInput
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
              { label: 'Team Manager', value: 'portfolio_manager' },
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
            label="Role"
            validation="required"
          />
          <div class="w-36 ml-auto">
            <FormulateInput type="submit" label="Update" />
          </div>
        </FormulateForm>
      </div>
    </WFeedbackModal>

    <!-- Member Form section -->
    <WFeedbackModal ref="addMemberModal" :can-manually-close="true">
      <div class="w-96">
        <WHeadingsHTwo v-if="memberFormMode === 'edit'" heading="Edit Member" />
        <WHeadingsHTwo v-else heading="Add Member" />
        <div class="px-6 pb-4">
          <FormulateForm
            name="addForm"
            class="space-y-2"
            @submit="addMemberForm"
          >
            <FormulateInput
              v-model="newMemberData.email"
              :disabled="
                accessLevel === 'well-admin' ||
                accessLevel === 'portfolio-admin' ||
                accessLevel === 'portfolio-manager'
                  ? false
                  : true
              "
              type="text"
              name="Email Address"
              label="Email Address*"
              validation="required"
            />
            <FormulateInput
              v-model="newMemberData.role"
              :options="[
                { value: 'portfolio-manager', label: 'Team Manager' },
                { value: 'portfolio-member', label: 'Team Member' },
                {
                  value: 'portfolio-pta',
                  label: 'Performance Testing Agent',
                },
                { value: 'portfolio-pr', label: 'Marketing POC' },
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
                {
                  label: 'Project Manager',
                  value: 'sharedWorkspace_manager',
                },
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
              label="Role"
              validation="required"
            />
            <div class="w-36 ml-auto">
              <FormulateInput
                type="submit"
                :label="memberFormMode === 'new' ? 'Invite' : 'Update'"
              />
            </div>
          </FormulateForm>
        </div>
      </div>
    </WFeedbackModal>

    <!-- Main Table -->
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
                    class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Name / Role
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-center w-1/4 text-xs font-semibold uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-center w-1/4 text-xs font-semibold uppercase tracking-wider"
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
                    <div class="w-52"></div>
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
                <tr
                  v-for="(member, index) in sharedWorkspace.members"
                  :key="index"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center w-60">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          v-if="member.profile_pic"
                          class="h-10 w-10 rounded-full"
                          :src="member.profile_pic"
                          alt="member profile picture"
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
                          v-if="member.pivot.role === 'portfolio-admin'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-success-700 border border-green-100"
                        >
                          Portfolio Administrator
                        </span>
                        <span
                          v-if="member.pivot.role === 'portfolio-manager'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Team Manager
                        </span>
                        <span
                          v-if="member.pivot.role === 'portfolio-pr'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Marketing POC
                        </span>
                        <span
                          v-if="member.pivot.role === 'portfolio-member'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Team Member
                        </span>
                        <span
                          v-if="member.pivot.role === 'portfolio-pta'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium text-primary-600 rounded-md bg-primary-100 border border-primary-200"
                        >
                          Performance Testing Agent
                        </span>
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
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-center text-primary-900 opacity-50 w-1/4"
                  >
                    {{ member.email }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-center text-primary-900 w-1/4"
                  >
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
                    <!-- Check for 1. Logged In Access Level 2. Portfolio Admin cannot delete itself  -->
                    <div
                      v-if="
                        (accessLevel === 'well-admin' ||
                          accessLevel === 'portfolio-admin' ||
                          currentUser.id === sharedWorkspace.user_id) &&
                        member.pivot &&
                        member.pivot.role !== 'portfolio-admin'
                      "
                      class="flex space-x-2 justify-end"
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
    <div v-if="renewLocation" class="w-20 ml-auto mt-4 mb-2">
      <WButtonsBase
        type="primary"
        class="mr-4"
        @click.native="
          $store.commit('settings/setSidebarTab', 'TERMS')
          $router.push(
            `/shared-workspaces/${sharedWorkspace.portfolio_number}/recertification`
          )
        "
        >Next</WButtonsBase
      >
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      pendingInvites: null,
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
        role: 'portfolio-admin',
      },
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
      renewLocation: (state) => state.renew.renewLocation,
    }),
    accessLevel() {
      if (this.currentUser.role.includes('well-admin')) {
        return 'well-admin'
      }
      if (this.sharedWorkspace && this.sharedWorkspace.members) {
        return this.sharedWorkspace.members.filter(
          (member) => member.id === this.currentUser.id
        ).length
          ? this.sharedWorkspace.members.find(
              (member) => member.id === this.currentUser.id
            ).pivot.role
          : false
      }
      return false
    },
  },
  async mounted() {
    await this.$store
      .dispatch('portfolio/getPendingInvites', this.sharedWorkspace.id)
      .then((res) => (this.pendingInvites = res.data))
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
  methods: {
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
        .dispatch('shared/inviteMember', this.newAdminData)
        .then((res) => {
          this.newAdminData.email = ''
          this.newAdminData.position = ''
          this.$refs.alert.showAlert('success', 'We have sent an email invite!')
          this.$refs.changeAdminModal.isHidden = true
          this.$formulate.resetValidation('changeForm')
        })
    },
    addMemberForm() {
      if (this.memberFormMode === 'new') {
        this.$store
          .dispatch('shared/inviteMember', this.newMemberData)
          .then((res) => {
            this.newMemberData.role = ''
            this.newMemberData.email = ''
            this.$refs.alert.showAlert(
              'success',
              'We have sent an email invite!'
            )
            this.$refs.addMemberModal.isHidden = true
            this.$formulate.resetValidation('addForm')
          })
      } else {
        this.$store
          .dispatch('shared/inviteMember', this.newMemberData)
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
          .dispatch('portfolio/getPendingInvites', self.sharedWorkspace.id)
          .then((res) => (self.pendingInvites = res.data))
      }, 2000)
      this.forceReMount++
    },
    removeMember(userId) {
      this.$store
        .dispatch('shared/removeMember', userId)
        .then(this.$refs.alert.showAlert('success', 'Removed Member'))
    },
  },
}
</script>
