<template>
  <div v-if="portfolio">
    <div
      v-if="expanded"
      class="m-2 border bg-primary-900 hover:bg-primary-800 border-primary-700 rounded-lg p-2 shadow-inner mb-5"
    >
      <LazyNavPortfolioSidebarSearch />
    </div>
    <!-- First Section -->
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
          <!-- Dashboard -->
          <WButtonsBase
            type="subNav"
            :class="[
              currentTab === 'Dashboard'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="user"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/dashboard`
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

          <!-- Scorecard -->
          <WButtonsBase
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1 &&
              portfolio.survey_completed === 0
            "
            type="subNav"
            :class="[
              currentTab === 'Scorecard'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="clipboard-list"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/scorecard/survey`
              ),
                toggleExpand()
            "
          >
            <span v-if="expanded">Scorecard</span>
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
                Scorecard
              </div>
            </div>
          </WButtonsBase>
          <WButtonsBase
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1 &&
              portfolio.survey_completed === 1
            "
            type="subNav"
            :class="[
              currentTab === 'Scorecard'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="clipboard-list"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/scorecard`
              ),
                toggleExpand()
            "
          >
            <span v-if="expanded">Scorecard</span>
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
                Scorecard
              </div>
            </div>
          </WButtonsBase>

          <!-- Health-safety -->
          <WButtonsBase
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1
            "
            type="subNav"
            :class="[
              currentTab === 'hsr'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="users"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/hsr`),
                toggleExpand()
            "
          >
            <span v-if="expanded">WELL-Health Safety</span>
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
                WELL-Health Safety
              </div>
            </div>
          </WButtonsBase>

          <!-- Documents -->
          <WButtonsBase
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1 &&
              portfolio.sub_payment_status === 'paid'
            "
            type="subNav"
            :class="[
              currentTab === 'Documents'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="document-add"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/documents?tab=Tasks&sub_tab=pending`
              ),
                toggleExpand()
            "
          >
            <span v-if="expanded">Documents Library</span>
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
                Documents Library
              </div>
            </div>
          </WButtonsBase>

          <!-- HSR Documentation -->
          <WButtonsBase
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1 &&
              portfolio.sub_payment_status === 'paid' &&
              portfolio.hsr_opt === 1
            "
            type="subNav"
            :class="[
              currentTab === 'HSR Documentation'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="document-add"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/hsr-documents`
              ),
                toggleExpand()
            "
          >
            <span v-if="expanded">HSR Documentation</span>
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
                HSR Documentation
              </div>
            </div>
          </WButtonsBase>

          <!-- Reviews -->
          <WButtonsBase
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1 &&
              portfolio.sub_payment_status === 'paid'
            "
            type="subNav"
            :class="[
              currentTab === 'Reviews'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="clipboard-check"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/reviews`),
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

    <!-- Second Section -->
    <WButtonsExpandable :expanded="true" class="border-b border-primary-700">
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
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1
            "
            type="subNav"
            :class="[
              currentTab === 'Profile'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="document"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/profile`),
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
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1 &&
              portfolio.sub_payment_status === 'paid'
            "
            type="subNav"
            :class="[
              currentTab === 'Performance'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="adjustments"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/performance`
              ),
                toggleExpand()
            "
          >
            <span v-if="expanded">Performance</span>
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
                Performance
              </div>
            </div>
          </WButtonsBase>
          <WButtonsBase
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1
            "
            type="subNav"
            :class="[
              currentTab === 'Membership'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="users"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/membership`
              ),
                toggleExpand()
            "
          >
            <span v-if="expanded">Membership</span>
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
                Membership
              </div>
            </div>
          </WButtonsBase>
          <WButtonsBase
            type="subNav"
            :class="[
              currentTab === 'Resources'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="library"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/resources`
              ),
                toggleExpand()
            "
          >
            <span v-if="expanded">Resources</span>
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
                Resources
              </div>
            </div>
          </WButtonsBase>
        </div>
      </template>
    </WButtonsExpandable>

    <!-- Third Section -->
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
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1
            "
            type="subNav"
            :class="[
              currentTab === 'Team'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="user-groups"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/team`),
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
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1
            "
            type="subNav"
            :class="[
              currentTab === 'Support'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="support"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/support`),
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
            v-if="
              portfolio.reg_payment_status === 'paid' &&
              portfolio.reg_status === 1
            "
            type="subNav"
            :class="[
              currentTab === 'Alternatives'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="view-grid"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/alternatives`
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
            v-if="canShowLocations"
            type="subNav"
            :class="[
              currentTab === 'Locations'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="office-building"
            @click.native="
              $router.push(
                `/portfolio/${portfolio.portfolio_number}/properties`
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
            v-if="!currentUser.role.includes('external-reviewer')"
            type="subNav"
            :class="[
              currentTab === 'Edit'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="pencil-alt"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/edit`),
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
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="credit-card"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/billing`),
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

    <!-- Fourth Section -->
    <WButtonsExpandable
      v-if="portfolio.reg_status !== 1"
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
            v-if="
              portfolio.reg_payment_status !== 'paid' &&
              portfolio.sub_payment_status !== 'paid'
            "
            type="subNav"
            :class="[
              currentTab === 'Register'
                ? 'bg-primary-700 text-white'
                : 'text-primary-600',
            ]"
            icon="document"
            @click.native="
              $router.push(`/portfolio/${portfolio.portfolio_number}/register`),
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
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
      currentTab: (state) => state.settings.sidebarTab,
      checkInviteAccess: (state) => state.portfolio.checkInviteAccess,
    }),
    canShowLocations() {
      // Check for paid and registration status
      if (
        this.portfolio.reg_payment_status === 'paid' &&
        this.portfolio.reg_status === 1
      ) {
        // If the user is a well admin they can see locations by default
        if (this.currentUser.role.includes('well-admin')) return true

        const isMember = this.portfolio.members.some(
          (m) => m.id === this.currentUser.id
        )

        // If the current the current user is a member of the portfolio show locations tab
        if (isMember) return true
        // If no conditions are met return a default false for safety guard
        return false
      }
      // This is default return for the case of portfolio not paid and registered
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

    visibilityStatus() {
      if (
        (this.portfolio.reg_payment_status === 'paid' &&
          this.portfolio.reg_status === 1) ||
        this.currentUser.role.includes('well-admin')
      ) {
        return true
      } else if (
        this.portfolio.reg_payment_status === 'paid' &&
        this.portfolio.reg_status === 1 &&
        this.portfolio.agreement_status === 1 &&
        this.portfolio.sub_payment_status === 'paid'
      ) {
        return true
      }
      return false
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
