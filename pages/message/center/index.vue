<template>
  <div>
    <NavBreadcrumbs>
      <WHeadingsHTwo heading="Message Center" />
    </NavBreadcrumbs>
    <WFeedbackModal ref="modal">
      <MessageEmailPreview
        v-if="modalScreen === 'preview' && messageData"
        :message="messageData"
      />
      <MessageLogs
        v-if="modalScreen === 'logs'"
        :loading="loadingLogs"
        :logs="messageLogs"
      />
    </WFeedbackModal>
    <WSlideoversOverlay
      ref="slideOver"
      :title="
        modalScreen === 'compose'
          ? 'Compose Message'
          : 'Select Recipients / Projects'
      "
      description="Create a new message below"
      class="z-50"
    >
      <template #content>
        <MessageEditor
          v-if="modalScreen === 'compose'"
          ref="messageEditor"
          :message="editMessageData"
        />
        <MessageRecipientFilter
          v-if="modalScreen === 'pfilter'"
          :message="editMessageData"
        />
        <MessagePreview
          v-if="modalScreen === 'mpreview'"
          :message="messageData"
          :message-data="messageData"
        />
      </template>
    </WSlideoversOverlay>
    <div class="flex">
      <div class="w-full border border-primary-200 rounded-t-lg rounded-b-lg">
        <div
          class="
            sm:bg-primary-100 sm:flex
            justify-between
            px-6
            mt-6
            sm:px-0 sm:mt-0
          "
        >
          <div>
            <WTabsHorizontal
              ref="tabs"
              v-model="currentTab"
              alignment="justify-around"
              :tabs="[
                { name: 'Private Templates', icon: 'lock-closed-small' },
                { name: 'Public Templates', icon: 'lock-open-small' },
                { name: 'Admin Templates', icon: 'user-small' },
              ]"
            />
          </div>
        </div>
        <div class="md:flex px-5 mt-5 justify-between">
          <div class="md:flex md:w-7/12 md:space-x-2 items-start">
            <FormulateInput
              v-model="searchValue"
              class="flex-grow w-full"
              type="text"
              placeholder="Search"
              @keyup.enter.native="handleSearchMessage"
            />
            <div class="flex flex-row space-x-4">
              <WButtonsBase
                type="primary"
                @click.native="handleSearchMessage()"
              >
                Search
              </WButtonsBase>
              <WButtonsBase
                v-if="searchValue !== ''"
                type="primaryInverted"
                @click.native="clearFilter()"
              >
                Clear
              </WButtonsBase>
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <WButtonsBase
              icon="plus"
              type="primary"
              @click.native="
                ;($refs.slideOver.open = true),
                  (editMessageData = null),
                  (modalScreen = 'compose')
              "
            >
              Compose
            </WButtonsBase>
          </div>
        </div>
        <div class="mt-6 md:mt-0 p-5">
          <LoadingList v-if="!loadedMessageList" />
          <div
            v-else-if="coachMessages.length"
            class="border rounded-lg shadow-lg relative divide-y"
          >
            <MessageListItem
              v-for="(message, index) in coachMessages"
              :key="index"
              :message="message"
            />
            <FormInputsPagination
              :pagination="paginate"
              :offset="3"
              @paginate="updatePagination()"
            />
          </div>
          <div v-else>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    class="h-5 w-5 text-yellow-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700">No templates found</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'FullWidth',
  data() {
    return {
      loadedMessageList: false,
      messageLogs: [],
      messageData: null,
      modalScreen: 'none',
      loadingLogs: true,
      currentTab: 'Private Templates',
      selectedMessage: null,
      editMessageData: null,
      searchValue: '',
    }
  },
  head() {
    return {
      title: `Message Center`,
    }
  },
  computed: {
    ...mapState({
      coachMessages: (state) => state.message.coachMessages,
      projects: (state) => state.message.projects,
      filters: (state) => state.message.filters,
      messageTable: (state) => state.message.messageTable,
      currentUser: (state) => state.user.currentUser,
    }),
    paginate() {
      if (this.messageTable.total !== undefined) {
        return {
          total: this.messageTable.total,
          per_page: this.messageTable.per_page,
          current_page: this.messageTable.current_page,
          last_page: this.messageTable.last_page,
          from: this.messageTable.from,
          to: this.messageTable.to,
        }
      }
      return {}
    },
    normalizedSentLogData() {
      const result = []
      if (this.sentLogData.length) {
        for (const prj of this.sentLogData) {
          for (const sentTo of prj.recipients) {
            let emails = ''
            sentTo.recipients.map((element) => {
              return (emails += element.email + ', ')
            })
            const obj = {
              project: sentTo.number + ' - ' + sentTo.name,
              email: emails.slice(0, -2),
              status: prj.status,
              updated_at: this.$dayjs(sentTo.updated_at).format('MMM DD, YYYY'),
            }
            result.push(obj)
          }
        }
      }
      return result
    },
  },
  watch: {
    coachMessages(newVal) {
      if (newVal != null) {
        this.loadedMessageList = true
      }
    },
    async currentTab(newVal) {
      const filters = { ...this.$store.state.message.filters }

      switch (newVal) {
        case 'Private Templates':
          filters.type = 'private'
          break
        case 'Public Templates':
          filters.type = 'public'
          break
        case 'Admin Templates':
          filters.type = 'automatic'
          break
      }

      await this.$store.dispatch('message/setFilters', filters)
      await this.$store.dispatch('message/getCoachMessages')
    },
  },
  mounted() {
    this.getMessages()
  },
  methods: {
    editMessage(messageData) {
      this.$refs.slideOver.open = true
      this.editMessageData = { ...messageData }
    },
    handleSearchMessage() {
      if (this.messageTable.filter === '') {
        return
      }

      // shallow copy the data from the vuex value
      const newMessageTable = { ...this.messageTable }
      // assign or update the value that you're trying to change
      newMessageTable.currentPage = 1
      newMessageTable.filter = this.searchValue
      // send that new data to replace the old data in messageTable
      this.$store.commit('message/setMessageTable', newMessageTable)
      // sync/refresh all the message based off of the current filters
      this.$store.dispatch('message/getCoachMessages')
    },
    clearFilter() {
      this.searchValue = ''
      this.handleSearchMessage()
    },
    getMessages() {
      this.$store.dispatch('message/getCoachMessages')
    },
    previewMessage(messageData) {
      this.modalScreen = 'preview'
      this.messageData = JSON.parse(JSON.stringify(messageData))
      this.selectedMessage = JSON.parse(JSON.stringify(messageData))
      this.$refs.modal.isHidden = false
    },
    updatePagination() {
      const newFilters = { ...this.filters }
      // assign or update the value that you're trying to change
      newFilters.currentPage = this.paginate.current_page
      // send that new data to replace the old data in messageTable
      this.$store.commit('message/setFilters', newFilters)
      // this.messageTable.current_page = this.paginate.current_page
      this.getMessages()
    },
    async viewLogs(messageId) {
      this.loadingLogs = true
      await this.$store
        .dispatch('message/getEmailLogs', messageId)
        .then((res) => {
          if (res.data) {
            this.messageLogs = res.data
            this.loadingLogs = false
          }
        })
      this.modalScreen = 'logs'
      this.$refs.modal.isHidden = false
    },
  },
}
</script>
