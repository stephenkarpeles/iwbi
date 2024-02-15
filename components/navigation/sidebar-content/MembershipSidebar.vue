<template>
  <div class="px-2">
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Promotion'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="speakerphone"
      @click.native="
        $store.commit('settings/setSidebarTab', 'Promotion'),
          ($parent.$parent.$refs.content.scrollTop = 0)
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
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Education'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="academic-cap"
      @click.native="
        $store.commit('settings/setSidebarTab', 'Education'),
          ($parent.$parent.$refs.content.scrollTop = 0)
      "
    >
      <span v-if="expanded">Education</span>
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
          Education
        </div>
      </div>
    </WButtonsBase>
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Benefits'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="gift"
      @click.native="
        $store.commit('settings/setSidebarTab', 'Benefits'),
          ($parent.$parent.$refs.content.scrollTop = 0)
      "
    >
      <span v-if="expanded">Benefits</span>
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
          Benefits
        </div>
      </div>
    </WButtonsBase>
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
        $store.commit('settings/setSidebarTab', 'Profile'),
          ($parent.$parent.$refs.content.scrollTop = 0)
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
        currentTab === 'Billing'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="credit-card"
      @click.native="
        $store.commit('settings/setSidebarTab', 'Billing'),
          ($parent.$parent.$refs.content.scrollTop = 0)
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
    <WButtonsBase
      type="subNav"
      :class="[
        currentTab === 'Team'
          ? 'bg-primary-600 text-white'
          : 'text-primary-600',
        'mt-2',
      ]"
      icon="speakerphone"
      @click.native="
        $store.commit('settings/setSidebarTab', 'Team'),
          ($parent.$parent.$refs.content.scrollTop = 0)
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
