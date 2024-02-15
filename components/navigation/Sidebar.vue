<template>
  <div
    :class="[
      expanded ? 'w-full md:w-auto' : '',
      'flex overflow-auto minimal-scrollbar',
    ]"
  >
    <div
      :class="[
        expanded ? '' : '-ml-8 md:-ml-0',
        'flex md:flex-shrink-0 w-full',
      ]"
    >
      <div
        :class="[
          expanded ? 'w-full md:w-64' : 'w-16 -ml-8 md:-ml-0',
          'flex flex-col transition-width duration-200',
        ]"
      >
        <div
          class="flex flex-col h-0 flex-1 border-r border-gray-200 bg-primary-900"
        >
          <div class="flex-1 flex flex-col">
            <nav class="flex-1 mt-16 space-y-1 bg-primary-1000">
              <NavMembershipSidebar
                v-if="$route.name === 'membership-dashboard'"
              />

              <NavFacultySidebar
                v-if="$route.name === 'well-faculty-dashboard'"
              />

              <NavPortfolioSidebar
                v-if="
                  $route.name.includes('portfolio-id') ||
                  $route.name === 'demo-tableau-two-id'
                "
              />

              <NavProjectSidebar
                v-if="$route.name.includes('projects-projectType-projectId')"
              />

              <NavHsrSidebar
                v-if="$route.name.includes('shared-workspaces-id')"
              />

              <NavWprSidebar v-if="$route.name.includes('wpr-id')" />
            </nav>
          </div>
        </div>
      </div>
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
      if (currentState === 'false' || currentState === null) {
        currentState = false
      }
      if (currentState === 'true') {
        currentState = true
      }
      this.$store.commit('settings/setNavState', !currentState)
    },
  },
}
</script>
