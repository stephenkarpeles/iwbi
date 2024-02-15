<template>
  <div>
    <div v-if="project">
      <div
        v-if="expanded"
        class="m-2 border bg-primary-900 hover:bg-primary-800 border-primary-700 rounded-lg p-2 shadow-inner mb-5"
      >
        <LazyNavProjectSidebarSearch />
      </div>
      <WButtonsExpandable :expanded="true" class="border-b border-primary-700">
        <div class="w-full text-left text-xs font-semibold text-primary-900">
          <WButtonsBase
            type="nav"
            :icon="!expanded ? 'academic-cap' : null"
            :class="['font-semibold text-primary-200']"
          >
            <span v-if="expanded">ACHIEVE</span>
            <div
              v-remove-class-hover="'opacity-0'"
              :class="[
                {
                  hidden: expanded,
                },
                'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
              ]"
            >
              <div
                class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
              >
                ACHIEVE
              </div>
            </div>
          </WButtonsBase>
        </div>

        <template #buttons>
          <div class="mb-2">
            <WButtonsBase
              data-id="nav-dash-btn"
              type="subNav"
              :class="[
                currentTab === 'Dashboard'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="user"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/dashboard`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Dashboard</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Dashboard
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="project && project.scorecard_id"
              type="subNav"
              :class="[
                currentTab === 'Scorecard'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="clipboard-list"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/scorecard`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">WELL Scorecard</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  WELL Scorecard
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project &&
                project.v1_project === 1 &&
                project.v1_project_standard !== 'community' &&
                project.v1_project_standard !== 'allprojectsin'
              "
              type="subNav"
              :class="[
                currentTab === 'Checklist'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="user-groups"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/checklist`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Checklist</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Checklist
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project &&
                project.reg_status === 1 &&
                project.reg_payment_status === 'paid' &&
                project.v1_project_standard !== 'community' &&
                project.v1_project_standard !== 'allprojectsin' &&
                project.hsr_opt !== null
              "
              type="subNav"
              :class="[
                currentTab === 'HSR'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="user-groups"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/hsr`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Health-Safety Rating</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Health-Safety Rating
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project &&
                project.reg_status === 1 &&
                project.reg_payment_status === 'paid' &&
                project.v1_project_standard !== 'community' &&
                project.v1_project_standard !== 'allprojectsin' &&
                project.wpr_opt !== null
              "
              type="subNav"
              :class="[
                currentTab === 'WPR'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="chart-bar"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/wpr`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Performance Rating</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Performance Rating
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project &&
                project.reg_status === 1 &&
                project.reg_payment_status === 'paid' &&
                project.agreement_status === 1
              "
              type="subNav"
              :class="[
                currentTab === 'Documents'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="document-add"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/documents`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Documents</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Documents
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project &&
                project.reg_status === 1 &&
                project.reg_payment_status === 'paid' &&
                project.agreement_status === 1
              "
              type="subNav"
              :class="[
                currentTab === 'Reviews'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="clipboard-check"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/reviews`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Reviews</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Reviews
                </div>
              </div>
            </WButtonsBase>
          </div>
        </template>
      </WButtonsExpandable>

      <WButtonsExpandable
        v-if="
          project &&
          project.reg_status === 1 &&
          project.reg_payment_status === 'paid' &&
          project.agreement_status === 1 &&
          project.type !== 'v1'
        "
        :expanded="true"
        class="border-b border-primary-700"
      >
        <div class="w-full text-left text-xs font-semibold text-primary-900">
          <WButtonsBase
            type="nav"
            :icon="!expanded ? 'bolt' : null"
            :class="['font-semibold text-primary-200']"
          >
            <span v-if="expanded">ENGAGE</span>
            <div
              v-remove-class-hover="'opacity-0'"
              :class="[
                {
                  hidden: expanded,
                },
                'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
              ]"
            >
              <div
                class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
              >
                ENGAGE
              </div>
            </div>
          </WButtonsBase>
        </div>

        <template #buttons>
          <div class="mb-2">
            <WButtonsBase
              data-id="nav-profile-btn"
              v-if="hasAccess"
              type="subNav"
              :class="[
                currentTab === 'Profile'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="document"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/profile`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Profile</span>

              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Profile
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              type="subNav"
              :class="[
                currentTab === 'Promotion'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="speakerphone"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/promotions`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Promotions</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Promotions
                </div>
              </div>
            </WButtonsBase>
          </div>
        </template>
      </WButtonsExpandable>

      <WButtonsExpandable :expanded="true" class="border-b border-primary-700">
        <div class="w-full text-left text-xs font-semibold text-primary-900">
          <WButtonsBase
            type="nav"
            :icon="!expanded ? 'pencil' : null"
            :class="['font-semibold text-primary-200']"
          >
            <span v-if="expanded">MANAGE</span>
            <div
              v-remove-class-hover="'opacity-0'"
              :class="[
                {
                  hidden: expanded,
                },
                'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
              ]"
            >
              <div
                class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
              >
                MANAGE
              </div>
            </div>
          </WButtonsBase>
        </div>

        <template #buttons>
          <div class="mb-2">
            <WButtonsBase
              v-if="
                hasAccess &&
                (project.type === 'v1' || project.type === 'v1-upgraded')
              "
              type="subNav"
              :class="[
                currentTab === 'Profile'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="document"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/profile`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Profile</span>

              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Profile
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="project.type === 'v1' || project.type === 'v1-upgraded'"
              type="subNav"
              :class="[
                currentTab === 'Promotion'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="speakerphone"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/promotions`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Promotions</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Promotions
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              data-id="nav-team-btn"
              type="subNav"
              :class="[
                currentTab === 'Team'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="user-groups"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/team`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Team</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Team
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              data-id="nav-support-btn"
              v-if="
                project &&
                project.reg_status === 1 &&
                project.reg_payment_status === 'paid'
              "
              type="subNav"
              :class="[
                currentTab === 'Support'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="support"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/support`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Support</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Support
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              data-id="nav-alternatives-btn"
              type="subNav"
              :class="[
                currentTab === 'Alternatives'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="view-grid"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/alternatives`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Alternatives</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Alternatives
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="project.type !== 'v1' && project.type !== 'v1-upgraded'"
              type="subNav"
              :class="[
                currentTab === 'Overview'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="cog"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/overview`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Overview</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Overview
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="hasAccess"
              type="subNav"
              :class="[
                currentTab === 'Edit'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="pencil-alt"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/edit`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Edit</span>

              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Edit
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              v-if="
                project && project.estimates && project.estimates.length > 0
              "
              type="subNav"
              :class="[
                currentTab === 'Pricing'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="user-groups"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/pricing`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Pricing</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Pricing
                </div>
              </div>
            </WButtonsBase>
            <WButtonsBase
              type="subNav"
              :class="[
                currentTab === 'Billing'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="credit-card"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/billing`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Billing</span>

              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Billing
                </div>
              </div>
            </WButtonsBase>
          </div>
        </template>
      </WButtonsExpandable>

      <WButtonsExpandable
        v-if="project && project.type !== 'v1' && project.reg_status !== 1"
        :expanded="true"
        class="border-b border-primary-700"
      >
        <div class="w-full text-left text-xs font-semibold text-primary-900">
          <WButtonsBase
            type="nav"
            :icon="!expanded ? 'chevron-double-right' : null"
            :class="['font-semibold text-primary-200']"
          >
            <span v-if="expanded">NEXT STEPS</span>
            <div
              v-remove-class-hover="'opacity-0'"
              :class="[
                {
                  hidden: expanded,
                },
                'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
              ]"
            >
              <div
                class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
              >
                NEXT STEPS
              </div>
            </div>
          </WButtonsBase>
        </div>

        <template #buttons>
          <div class="mb-2">
            <WButtonsBase
              data-id="dashboard-enroll-btn"
              v-if="
                project && project.reg_status !== 1 && project.type === 'v2'
              "
              type="subNav"
              :class="[
                currentTab === 'Register'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-600',
              ]"
              icon="document"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/register`,
                  query: { ...$route.query },
                }),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Enroll</span>
              <div
                v-remove-class-hover="'opacity-0'"
                :class="[
                  {
                    hidden: expanded,
                  },
                  'opacity-0 absolute pl-13 z-20 -ml-1.5 transitions-opacity duration-150',
                ]"
              >
                <div
                  class="bg-primary-900 shadow-md px-6 text-white py-2 ml-16 rounded-md"
                >
                  Register
                </div>
              </div>
            </WButtonsBase>
          </div>
        </template>
      </WButtonsExpandable>
    </div>
    <div v-else>
      <LoadingList />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      currentTab: (state) => state.settings.sidebarTab,
      currentUser: (state) => state.user.currentUser,
      accessLevel: (state) => state.project.accessLevel,
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
    expanded() {
      if (this.$store.state.settings.navExpanded == null) {
        return true
      }
      if (this.$store.state.settings.navExpanded === 'false') {
        return false
      }
      if (this.$store.state.settings.navExpanded === 'true') {
        return true
      }
      return this.$store.state.settings.navExpanded
    },
  },
  methods: {
    toggleExpand() {
      let currentState = this.$store.state.settings.navExpanded
      if (window.innerWidth <= 767) {
        if (currentState === 'false' || currentState === null) {
          currentState = false
        }
        if (currentState === 'true') {
          currentState = true
        }
        this.$store.commit('settings/setNavState', !currentState)
      }
    },
  },
}
</script>
