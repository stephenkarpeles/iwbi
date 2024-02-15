<template>
  <!-- Parent container -->
  <div v-if="portfolio" class="p-3">
    <!-- Modals -->
    <WFeedbackModal
      ref="permissionsModal"
      class="z-50"
      :can-manually-close="true"
    >
      <div class="max-w-xl px-4">
        <WHeadingsHThree
          class="text-primary-900"
          heading="Roles and Permissions"
        />
        <WTabsHorizontal
          v-model="modalTab"
          class="w-full"
          :tabs="[
            { name: 'Roles', icon: 'user' },
            { name: 'Access Permission Levels', icon: 'user' },
          ]"
        />
        <div :class="{ hidden: modalTab !== 'Roles' }">
          <ul class="list-disc p-4">
            <li
              v-for="(role, index) in rolesContent[rolesPageIndex]"
              :key="index"
              class="mt-2"
            >
              <span class="font-bold">{{ role.header }}</span>
              <br />
              <span class="text-sm">{{ role.body }}</span>
            </li>
          </ul>
        </div>
        <div :class="{ hidden: modalTab !== 'Access Permission Levels' }">
          <ul class="list-disc p-4">
            <li
              v-for="(role, index) in permissionLevelsContent[rolesPageIndex]"
              :key="index"
              class="mt-2"
            >
              <span class="font-bold">{{ role.header }}</span>
              <br />
              <span class="text-sm">{{ role.body }}</span>
            </li>
          </ul>
        </div>
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700">{{ rolesPageIndex + 1 }} of 2</p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  @click="
                    () => {
                      rolesPageIndex = 0
                    }
                  "
                >
                  <span class="sr-only">Previous</span>
                  <!-- Heroicon name: solid/chevron-left -->
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  @click="
                    () => {
                      rolesPageIndex = 1
                    }
                  "
                >
                  <span class="sr-only">Next</span>
                  <!-- Heroicon name: solid/chevron-right -->
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
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
              label="Access Permissions"
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
                {
                  label: 'Facilities Manager',
                  value: 'facilities_manager',
                },
                { label: 'Interior Designer', value: 'interior_designer' },
                { label: 'Lighting Designer', value: 'lighting_designer' },
                { label: 'MEP Engineer', value: 'mep_engineer' },
                { label: 'Owner', value: 'Owner' },
                { label: 'Human Resource', value: 'hr' },
                {
                  label: 'Project Manager',
                  value: 'portfolio_manager',
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
              label="Portfolio Role"
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

    <!-- Admin form section -->
    <WFeedbackModal ref="changeAdminModal" :can-manually-close="true">
      <WHeadingsHTwo heading="Change Portfolio Administrator" />
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
              {
                label: 'Facilities Manager',
                value: 'facilities_manager',
              },
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

    <!-- Header -->
    <div class="grid grid-cols-4 justify-between gap-6">
      <WHeadingsHTwo heading="Team" class="text-primary-700 col-span-2" />

      <WButtonsBase
        v-if="
          accessLevel === 'well-admin' ||
          accessLevel === 'portfolio-admin' ||
          accessLevel === 'portfolio-manager' ||
          portfolio.user_id === currentUser.id
        "
        icon="plus"
        class="order-last"
        type="primaryInverted"
        @click.native="
          () => {
            $refs.addMemberModal.isHidden = false
          }
        "
      >
        Add Member
      </WButtonsBase>

      <WButtonsBase
        v-if="
          accessLevel === 'well-admin' ||
          accessLevel === 'portfolio-admin' ||
          portfolio.user_id === currentUser.id
        "
        type="primaryInverted"
        class="whitespace-nowrap"
        @click.native="
          () => {
            $refs.changeAdminModal.isHidden = false
          }
        "
        >Change Administrator</WButtonsBase
      >
      <div v-else></div>
    </div>
    <div class="flex justify-between my-6">
      <div class="w-1/2">
        <div class="text-primary-900 opacity-60">
          Invite team members to collaborate inside your portfolio account to
          centralize communications about your WELL Journey. Control which team
          members can access certain data and receive communications by setting
          access permission levels and track tasks by including professional
          roles.
        </div>
      </div>
      <div
        class="border border-primary-300 rounded-md py-12 px-4 bg-cover bg-center w-2/5"
        :style="{
          backgroundImage: 'url(/projects/v2/dashboard/cards/group-4.png)',
        }"
      >
        <div class="flex flex-col">
          <span class="text-md uppercase text-primary-600 font-semibold"
            >Team management</span
          >
          <span class="text-xl text-primary-900 font-bold"
            >Roles and Permissions</span
          >
          <span class="w-32 mt-2">
            <WButtonsBase
              type="primaryInverted"
              @click.native="() => ($refs.permissionsModal.isHidden = false)"
              >Learn More</WButtonsBase
            >
          </span>
        </div>
      </div>
    </div>

    <!-- Table -->
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
                    class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
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
                <tr v-for="(member, index) in portfolioMembers" :key="index">
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
                        (member.id !== currentUser.id &&
                          member.id !== portfolio.user_id &&
                          accessLevel === 'well-admin') ||
                        (member.id !== portfolio.user_id &&
                          accessLevel === 'portfolio-admin')
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
      modalTab: '',
      rolesPageIndex: 0,
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
      rolesContent: [
        [
          {
            header: 'Project administrator',
            body: 'The project administrator is intended to be the primary point of contact on the project with the WELL coaching contact and WELL Assessor. Typically, the project administrator is the person managing the WELL certification process, including project scorecard management, organization and submission of documentation, and coordination related to the scheduling of performance verification. The project administrator has the ability to edit project registration details and to add more team members. The project administrator will be included in all communication related to WELL.',
          },
          {
            header: 'Team manager',
            body: 'The team manager is intended to be the back-up point of contact for the project administrator. The team manager has the ability to add more team members. The team manager will be sent only major communication related to WELL, such as documentation reports and the final WELL report. Project teams can designate more than one team manager if desired.',
          },
        ],
        [
          {
            header: 'Team member',
            body: 'Team members can include anyone who has a role in helping to implement WELL on the project. Team members will not generally be included in WELL communication unless specifically requested.',
          },
          {
            header: 'Performance testing agent',
            body: 'Performance Testing Agent refers to an external provider who has been trained by GBCI to conduct onsite WELL performance tests. The Performance Testing Agent will not generally be included in WELL communication unless specifically requested.',
          },
        ],
      ],
      permissionLevelsContent: [
        [
          {
            header: 'Portfolio administrator',
            body: 'Oversees the WELL Portfolio program process and coordination of documentation for the defined portfolio. The portfolio administrator is the primary point of contact in working with the WELL coaching contact, and later, the WELL Reviewer.',
          },
          {
            header: 'Portfolio owner',
            body: 'Owners are responsible for authorizing enrollment of the defined portfolio and the projects within it.',
          },
          {
            header: 'Team manager',
            body: 'The team manager is intended to be the back-up point of contact for the portfolio administrator. The team manager has the ability to add more team members. The team manager will be sent only major communication related to WELL, such as documentation reports and the final WELL report. Portfolios can designate more than one team manager if desired.',
          },
        ],
        [
          {
            header: 'Team member',
            body: 'Team members can include anyone who has a role in helping to implement WELL on the project. Team members will not generally be included in WELL communication unless specifically requested.',
          },
          {
            header: 'Performance testing agent',
            body: 'Performance Testing Agent refers to an external provider who has been trained by GBCI to conduct onsite WELL performance tests. The Performance Testing Agent will not generally be included in WELL communication unless specifically requested.',
          },
        ],
      ],
    }
  },

  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
      membership: (state) => state.membership.membership,
      portfolioMembers: (state) => state.portfolio.portfolioMembers,
    }),
    accessLevel() {
      if (this.currentUser.role.includes('well-admin')) {
        return 'well-admin'
      }
      if (this.portfolio && this.portfolio.members) {
        return this.portfolio.members.filter(
          (member) => member.id === this.currentUser.id
        ).length
          ? this.portfolio.members.find(
              (member) => member.id === this.currentUser.id
            ).pivot.role
          : false
      }
      if (this.portfolio && this.portfolioMembers) {
        return this.portfolioMembers.filter(
          (member) => member.id === this.currentUser.id
        ).length
          ? this.portfolioMembers.find(
              (member) => member.id === this.currentUser.id
            ).pivot.role
          : false
      }
      return false
    },
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Team')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('portfolio/getPortfolioMembers')
    await this.$store
      .dispatch('portfolio/getPendingInvites', this.portfolio.id)
      .then((res) => (this.pendingInvites = res.data))
  },
  methods: {
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
        .dispatch('portfolio/inviteMember', this.newAdminData)
        .then((res) => {
          this.$formulate.resetValidation('changeForm')
          this.newAdminData.email = ''
          this.newAdminData.position = ''
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Portfolio admin changed!',
          })
          this.$store.dispatch('portfolio/getPortfolio', {
            id: this.$route.params.id,
          })
          this.$refs.changeAdminModal.isHidden = true
        })
        .catch((err) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: err.message,
          })
        })
    },
    addMemberForm() {
      if (this.memberFormMode === 'new') {
        this.$store
          .dispatch('portfolio/inviteMember', this.newMemberData)
          .then((res) => {
            this.newMemberData.role = ''
            this.newMemberData.email = ''
            this.$store.dispatch('notifications/toastMessage', {
              message: 'We have sent an email invite!',
            })
          })
      } else {
        this.$store
          .dispatch('portfolio/inviteMember', this.newMemberData)
          .then((res) => {
            this.newMemberData.role = ''
            this.newMemberData.email = ''
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Changes have been saved!',
            })
          })
      }
      this.$formulate.resetValidation('addForm')
      this.newMemberData = {}

      this.$refs.addMemberModal.isHidden = true
      const self = this
      setTimeout(function () {
        self.$store
          .dispatch('portfolio/getPendingInvites', self.portfolio.id)
          .then((res) => (self.pendingInvites = res.data))
      }, 2000)
    },
    removeMember(userId) {
      this.$store.dispatch('portfolio/removeMember', userId).then((res) => {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Member removed!',
        })
      })
    },
  },
}
</script>
<style scoped>
li::marker {
  color: #bd907a;
}
</style>
