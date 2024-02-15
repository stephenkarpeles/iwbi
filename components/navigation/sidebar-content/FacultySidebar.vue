<template>
  <div class="px-2">
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Orientation'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="map"
      @click.native="$store.commit('settings/setSidebarTab', 'Orientation')"
    >
      <span v-if="expanded">Orientation</span>
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
          Orientation
        </div>
      </div>
    </WButtonsBase>
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Keep Learning'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="academic-cap"
      @click.native="$store.commit('settings/setSidebarTab', 'Keep Learning')"
    >
      <span v-if="expanded">Keep Learning</span>
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
          Keep Learning
        </div>
      </div>
    </WButtonsBase>
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Resources'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="presentation-chart-line"
      @click.native="$store.commit('settings/setSidebarTab', 'Resources')"
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
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Marketing Toolkit'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="desktop-computer"
      @click.native="
        $store.commit('settings/setSidebarTab', 'Marketing Toolkit')
      "
    >
      <span v-if="expanded">Marketing Toolkit</span>
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
          Marketing Toolkit
        </div>
      </div>
    </WButtonsBase>
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Reporting'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="clipboard-list"
      @click.native="$store.commit('settings/setSidebarTab', 'Reporting')"
    >
      <span v-if="expanded">Reporting</span>
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
          Reporting
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
      @click.native="$store.commit('settings/setSidebarTab', 'Billing')"
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
}
</script>
