<template>
  <div>
    <WFeedbackModal ref="upgradeModal" :can-manually-close="false" class="z-50">
      <div v-if="project" class="max-w-3xl px-4 space-y-2">
        <WHeadingsHThree
          class="mb-5"
          heading="Are you sure you want to upgrade your project to WELL v2?"
        />
        <p class="text-sm text-gray-500 text-light mb-5">
          When you upgrade your project to WELL v2, only certain information
          will be transferred to your new project. You'll need to create a new
          scorecard using WELL v2 and we recommend reviewing the below lists to
          understand what will and will not be transferred. You will be able to
          access an archived version of your project after you upgrade, however
          no actions can be taken within this archived project.
        </p>
        <hr class="border border-primary-200 mb-5" />
        <WHeadingsHFour class="mb-5" heading="Information transferred" />
        <div class="text-sm mb-5 text-primary-600">
          <div
            class="lg:gap-4 lg:grid lg:grid-cols-2 sm:gap-2 sm:grid-cols-2 sm:grid"
          >
            <div
              v-for="list in included"
              :key="list.title"
              class="lg:col-span-1"
            >
              <div class="font-bold flex">
                <div
                  class="my-auto w-2 h-2 bg-secondary-700 rounded-full mr-2"
                ></div>
                {{ list.title }}
              </div>
              <div v-if="list.caption" class="text-sm ml-4">
                ({{ list.caption }})
              </div>
            </div>
          </div>
        </div>
        <hr class="border border-primary-200 mb-5" />
        <WHeadingsHFour class="mb-5" heading="Information not transferred" />
        <div class="text-sm mb-5 text-primary-600">
          <div
            class="lg:gap-4 lg:grid lg:grid-cols-2 sm:gap-2 sm:grid-cols-2 sm:grid"
          >
            <div
              v-for="list in notIncluded"
              :key="list.title"
              class="lg:col-span-1"
            >
              <div class="font-bold flex">
                <div
                  class="my-auto w-2 h-2 bg-secondary-700 rounded-full mr-2"
                ></div>
                {{ list.title }}
              </div>
              <div v-if="list.caption" class="text-sm ml-4">
                ({{ list.caption }})
              </div>
            </div>
          </div>
        </div>
        <hr class="border border-primary-200 mb-5" />
        <div class="flex w-full mt-5">
          <WButtonsBase v-if="loading" class="flex-1 mr-5">
            <span> <WLoadingSpinner type="button" class="mx-auto" /> </span
          ></WButtonsBase>
          <WButtonsBase
            v-if="!loading"
            class="flex-1"
            type="danger"
            @click.native="closeModal"
            >Close</WButtonsBase
          >
          <WButtonsBase
            v-if="
              !loading &&
              (project.members.find(
                (a) =>
                  a.id === $store.state.user.currentUser.id &&
                  a.pivot.role === 'project-admin'
              ) ||
                $store.state.user.currentUser.role.includes('well-admin'))
            "
            class="flex-1 mr-5"
            @click.native="upgradeProjectToV2"
            >Yes, I'd like to upgrade my project</WButtonsBase
          >
        </div>
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    project: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      bannerText:
        'Registrations are now closed for WELL v1 and v2 Pilot projects. You can upgrade your pending registration to WELL v2 now - If you have any questions please reach out to <a href="mailto:info@wellcertified.com" class="font-bold underline">info@wellcertified.com</a>.',
      included: [
        {
          title: 'Project details',
          caption: 'including addresses and space types',
        },
        {
          title: 'WELL Health-Safety checklist and invoices',
          caption: 'if enrolled',
        },
        {
          title: 'Project team',
          caption: '',
        },
        { title: 'General project documents', caption: '' },
        { title: 'Project profile information', caption: '' },
        { title: 'Project invoices', caption: '' },
      ],
      notIncluded: [
        {
          title: 'v2 pilot scorecard',
          caption: 'including documents and notes',
        },
        {
          title: 'Documentation reviews',
          caption: '',
        },
        { title: 'Support tickets', caption: '' },
      ],
    }
  },
  computed: {
    ...mapState({
      bannerActionTriggered: (state) =>
        state.notifications.banner.cta.triggered,
    }),
  },
  watch: {
    bannerActionTriggered(value) {
      if (value) {
        this.$refs.upgradeModal.isHidden = false
      } else {
        this.$refs.upgradeModal.isHidden = true
      }
    },
    project() {
      this.checkIfNeedUpgrade()
    },
  },
  mounted() {
    this.checkIfNeedUpgrade()
  },
  methods: {
    checkIfNeedUpgrade() {
      if (
        (this.project.type === 'v1' || this.project.type === 'v2-pilot') &&
        this.project.v1_project_standard !== 'community' &&
        this.project.reg_payment_status !== 'paid'
      ) {
        const message = `
        <div class="flex py-3 text-sm">
          <div class="mr-3 h-8 w-16 bg-secondary-900 rounded-lg flex">
            <svg class="text-white w-7 my-auto mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>${this.bannerText}</div>
        </div>
        `
        if (this.project.type === 'v2-pilot') {
          this.notIncluded[0].title = 'v2 pilot scorecard'
          this.notIncluded[0].caption = 'including documents and notes'
        } else if (this.project.type === 'v1') {
          this.notIncluded[0].title = 'v1 checklist'
          this.notIncluded[0].caption = ''
        }
        this.$store.dispatch('notifications/showBanner', message)
        this.$store.dispatch('notifications/setBannerActionText', 'Upgrade')
        this.$store.dispatch('notifications/setBannerClose', false)
      }
    },
    closeModal() {
      this.$refs.upgradeModal.isHidden = true
      this.$store.dispatch('notifications/setBannerActionTriggered', false)
    },
    upgradeProjectToV2() {
      this.loading = true
      this.$store
        .dispatch('project/upgradeProject', this.project.id)
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Project upgraded successfully!',
          })
          this.$store.dispatch('notifications/clearBanner')
          this.$refs.upgradeModal.isHidden = true
          this.loading = false

          window.location.href =
            '/projects/v2/' + response.data.project_number + '/dashboard'
        })
        .catch((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'There was a problem in upgrading this project.',
          })
          this.loading = false
        })
    },
  },
}
</script>
