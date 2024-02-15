<template>
  <div>
    <div>
      <div v-if="portfolio.agreement_status" class="flex justify-between">
        <WHeadingsHTwo heading="Documentation" class="text-primary-900" />
        <div class="flex space-x-3 items-center">
          <div class="w-28">
            <WButtonsBase
              icon="plus"
              @click.native="$refs.addSlide.toggleOpen()"
              >Add New</WButtonsBase
            >
          </div>
          <div class="w-42">
            <WButtonsDropdown>
              <WButtonsBase icon="chevron-down" type="primaryInverted"
                >Download</WButtonsBase
              >
              <template #customButtons>
                <WButtonsBase
                  v-if="downloadAccess"
                  type="neutral"
                  @click.native="downloadAll({ include: 'all' })"
                >
                  All documents
                </WButtonsBase>
                <WButtonsBase
                  type="neutral"
                  @click.native="downloadScorecardExcel"
                >
                  Locations scorecard excel
                </WButtonsBase>
              </template>
            </WButtonsDropdown>
          </div>
        </div>
      </div>
      <div class="flex my-5">
        <div class="border border-primary-300 rounded-md">
          <div class="flex justify-between">
            <div class="p-5">
              <div
                class="
                  text-xs
                  tracking-tighter
                  font-semibold
                  text-primary-600
                  leading-5
                  uppercase
                "
              >
                DOCUMENTATION
              </div>
              <div
                class="text-2xl font-bold text-primary-900 whitespace-nowrap"
              >
                Portfolio documentation
              </div>
              <div class="w-40 my-2">
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="$refs.modal.isHidden = false"
                  >Learn More</WButtonsBase
                >
              </div>
            </div>
            <div class="self-end">
              <img
                src="/portfolio/screen/documents/portfolio-documentation.png"
                alt=""
                srcset=""
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="portfolio.agreement_status">
        <WTabsHorizontal
          v-model="currentTab"
          class="w-full -mb-px"
          :tabs="tabs"
        />
        <div
          v-if="currentTab !== 'Summary'"
          class="flex w-full items-start mt-5"
        >
          <div class="w-3/4 max-w-md">
            <FormulateInput
              v-model="documentSearch"
              type="text"
              placeholder="Search document..."
            />
          </div>
          <div class="w-1/4 ml-5 flex">
            <div class="w-32">
              <WButtonsBase icon="search-circle" @click.native="getDocuments">
                Search
              </WButtonsBase>
            </div>
            <div class="w-32">
              <WButtonsBase
                v-if="documentSearch !== ''"
                type="primaryInverted"
                class="ml-5"
                icon="refresh"
                @click.native=";(documentSearch = ''), getDocuments()"
              >
                Clear
              </WButtonsBase>
            </div>
          </div>
        </div>
        <div v-if="currentTab === 'Tasks'">
          <PortfolioDocLibraryScreen />
        </div>
        <div v-if="currentTab === 'Files'">
          <PortfolioDocAuditScreen />
        </div>
        <div v-if="currentTab === 'General'">
          <PortfolioDocGeneralScreen />
        </div>
        <div v-if="currentTab === 'Summary'">
          <PortfolioDocSummaryScreen />
        </div>
      </div>
      <div v-else>
        <div class="bg-primary-300 text-primary-800 text-sm mt-5 rounded p-5">
          <b>The WELL Portfolio Agreement has not been signed.</b><br />
          Documentation features are not available until the portfolio agreement
          has been signed by the portfolio owner.
        </div>
      </div>
    </div>
    <WFeedbackModal ref="modal" class="z-50">
      <div class="max-w-lg mx-5 my-5 h-full">
        <div class="flex justify-between">
          <WHeadingsHThree
            class="text-primary-800"
            heading="Portfolio documentation"
          />
          <WIconsBase
            icon="x"
            type="primary"
            @click.native="$refs.modal.isHidden = true"
          />
        </div>

        <PortfolioDocumentPortfolioScreen />
      </div>
    </WFeedbackModal>
    <WSlideoversOverlay ref="addSlide" title="Upload documents" class="z-50">
      <template #content>
        <div>
          <PortfolioDocumentsAddScreen />
        </div>
      </template>
    </WSlideoversOverlay>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentTab: 'Library',
      documentSearch: '',
      tabs: [
        { name: 'Library', icon: 'support' },
        { name: 'Audit', icon: 'pencil-alt' },
        { name: 'General', icon: 'check-circle' },
        { name: 'Summary', icon: 'check-circle' },
      ],
    }
  },

  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
      portfolioMembers: (state) => state.portfolio.portfolioMembers,
    }),

    downloadAccess() {
      const isTeamMember = this.portfolioMembers.find(
        (el) => el.id === this.currentUser.id
      )

      const isReviewer = this.portfolio.reviewers.find(
        (el) => el.id === this.currentUser.id
      )

      if (this.currentUser.role.includes('well-admin')) {
        return true
      }

      if (
        this.portfolio.members &&
        this.portfolio.members.filter((a) => a.id === this.currentUser.id)
          .length &&
        this.portfolio.members.find((a) => a.id === this.currentUser.id).pivot
          .role === 'portfolio-admin'
      ) {
        return true
      }

      if (isTeamMember && this.currentUser.role.includes('external-reviewer'))
        return false
      if (isReviewer) return true

      return false
    },
  },
  watch: {
    currentTab(newValue) {
      this.documentSearch = ''
      this.getDocuments()
    },
  },
  mounted() {
    this.getDocuments()
    this.getScorcard()
    this.getScorcardAudit()
  },
  methods: {
    getDocuments() {
      const self = this
      if (this.currentTab === 'General') {
        this.$store.dispatch('portfolio/getDocumentsList', {
          id: this.portfolio.id,
          page: 1,
          name: self.documentSearch,
        })
      } else if (this.currentTab === 'Library') {
        this.getScorcard()
      } else if (this.currentTab === 'Audit') {
        this.getScorcardAudit()
      }
    },
    async getScorcard() {
      const self = this
      if (this.currentTab === 'Library' || this.currentTab === 'Audit') {
        if (this.portfolio && this.portfolio.scorecard_id !== null) {
          await this.$store.dispatch('portfolio/getScorecardDocuments', {
            scorecardId: this.portfolio.scorecard_id,
            page: 1,
            filterShared: false,
            name: self.documentSearch,
            type:
              this.currentTab === 'Library'
                ? ['Guideline', 'Portfolio-Scale']
                : ['Individual-Scale', 'Audit-Document'],
          })
        }
      }
    },
    async getScorcardAudit() {
      const self = this
      if (this.currentTab === 'Audit') {
        if (this.portfolio && this.portfolio.scorecard_id !== null) {
          await this.$store.dispatch('portfolio/getScorecardAuditDocuments', {
            scorecardId: this.portfolio.scorecard_id,
            page: 1,
            filterShared: false,
            name: self.documentSearch,
            type: ['Individual-Scale', 'Audit-Document'],
          })
        }
      }
    },
    downloadAll(data) {
      this.$store
        .dispatch('portfolio/downloadAllDocuments', data)
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message:
              'We will notify you by email once we are ready with your file.',
          })
        })
    },
    downloadScorecardExcel() {
      this.$store
        .dispatch('portfolio/downloadScorecardDocuments')
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: response.data.message,
          })
        })
    },
  },
}
</script>
