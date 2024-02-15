<template>
  <div>
    <div v-if="sharedWorkspace">
      <div
        v-if="expanded"
        class="m-2 border bg-primary-900 hover:bg-primary-800 border-primary-700 rounded-lg p-2 shadow-inner mb-5"
      >
        <LazyNavWorkspaceSidebarSearch />
      </div>
      <WButtonsExpandable :expanded="true" class="border-b border-primary-700">
        <div class="w-full text-left text-xs font-semibold text-white">
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
              type="subNav"
              :class="[
                currentTab === 'Dashboard'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="user"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/dashboard`
                ),
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
              type="subNav"
              :class="[
                currentTab === 'Checklist'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="clipboard-list"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/scorecard`
                ),
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
              type="subNav"
              :class="[
                currentTab === 'Documents'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="document-add"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/documents`
                ),
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
              type="subNav"
              :class="[
                currentTab === 'Reviews'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="clipboard-check"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/reviews`
                ),
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
      <WButtonsExpandable :expanded="true" class="border-b border-primary-700">
        <div class="w-full text-left text-xs font-semibold text-white">
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
              type="subNav"
              :class="[
                currentTab === 'Profile'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="user-small"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/profile`
                ),
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
                currentTab === 'Promotions'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="speakerphone"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/promotions`
                ),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Promotion</span>
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
                  Promotion
                </div>
              </div>
            </WButtonsBase>
          </div>
        </template>
      </WButtonsExpandable>
      <WButtonsExpandable :expanded="true" class="border-b border-primary-700">
        <div class="w-full text-left text-xs font-semibold text-white">
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
              type="subNav"
              :class="[
                currentTab === 'Team'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="user-groups"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/team`
                ),
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
              type="subNav"
              :class="[
                currentTab === 'Support'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="support"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/support`
                ),
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
              type="subNav"
              :class="[
                currentTab === 'Alternatives'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="view-grid"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/alternatives`
                ),
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
              type="subNav"
              :class="[
                currentTab === 'Locations'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="location-marker"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/locations`
                ),
                  toggleExpand()
              "
            >
              <span v-if="expanded">Locations</span>
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
                  Locations
                </div>
              </div>
            </WButtonsBase>

            <WButtonsBase
              type="subNav"
              :class="[
                currentTab === 'Edit'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="pencil-alt"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/edit`
                ),
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
              type="subNav"
              :class="[
                currentTab === 'Billing'
                  ? 'bg-primary-600 text-white'
                  : 'text-primary-600',
                'mt-2',
              ]"
              icon="credit-card"
              @click.native="
                $router.push(
                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/billing`
                ),
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
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      activeButton: 'none',
    }
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      currentTab: (state) => state.settings.sidebarTab,
      currentUser: (state) => state.user.currentUser,
    }),
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
    logOut() {
      this.$router.push('/user/login')
    },
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
