<template>
  <div class="flex flex-col md:flex-row" style="max-height: 88vh">
    <div class="md:w-2/3 bg-white px-6">
      <div v-if="message != null" class="w-2/3">
        <WHeadingsHFour heading="Subject" />
        <p class="mx-1">{{ message.subject }}</p>
        <WHeadingsHFour heading="Message" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="message.content"></div>
      </div>
      <div v-else class="w-2/3">
        <WHeadingsHFour heading="Subject" />
        <p class="mx-1">{{ messageData.subject }}</p>
        <WHeadingsHFour heading="Message" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="messageData.content"></div>
      </div>
    </div>
    <div class="md:w-1/3 bg-primary-100 p-4 space-y-2 mt-4 md:mt-0">
      <div class="text-sm font-bold">Recipients</div>
      <div class="overflow-y-auto h-1/2 space-y-2.5 pr-3">
        <div
          v-for="(project, index) in selectedProjects"
          :key="index"
          class="text-black p-2 bg-white shadow rounded-md select-none"
        >
          <ul class="mt-0 mx-2">
            <li class="mt-2">
              <p class="font-bold text-primary-700">
                {{ project.name }}
              </p>
              <p
                v-if="
                  project.include_owner &&
                  project.owner_email !== project.user.email
                "
                class="text-sm py-2 text-primary-700"
              >
                {{ project.owner_name }} (Owner)
              </p>
            </li>
            <li class="mt-0 text-primary-600">
              <div v-for="member in project.members" :key="member.id">
                <div v-if="member.include_member" class="text-sm">
                  {{ member.name }} {{ member.last_name }} ({{
                    member.pivot.role.split('-').join(' ')
                  }})
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="pt-10 space-y-2">
        <div class="mr-2">
          <WButtonsBase
            type="primary"
            @click.native="
              ;($parent.$parent.modalScreen = 'compose'),
                ($parent.$parent.editMessageData = messageData)
            "
            >Edit Message</WButtonsBase
          >
        </div>
        <div class="mr-2">
          <WButtonsBase
            type="primary"
            @click.native="
              ;($parent.$parent.modalScreen = 'pfilter'),
                ($parent.$parent.messageData = messageData)
            "
            >Select Recipients</WButtonsBase
          >
        </div>
        <div class="mr-2">
          <WButtonsBase type="primary" @click.native="sendMail()"
            >Send Mail</WButtonsBase
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    message: {
      type: Object,
      required: false,
      default: null,
    },
    messageData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    paginate() {
      if (this.projectsinfo.total) {
        return {
          total: this.projectsinfo.total,
          per_page: this.projectsinfo.per_page,
          current_page: this.projectsinfo.current_page,
          last_page: this.projectsinfo.last_page,
          from: this.projectsinfo.from,
          to: this.projectsinfo.to,
        }
      }
      return {}
    },
    ...mapState({
      projects: (state) => state.message.projects,
      selectedProjects: (state) => state.message.selectedProjects,
      projectsinfo: (state) => state.message.projectsinfo,
    }),
  },
  methods: {
    updatePagination() {
      // this.messageTable.current_page = this.paginate.current_page
      // this.showCoachMessages()
    },
    sendMail() {
      const recipient = this.getSendMailRecipients()
      const payload = {
        recipient_role: 'custom',
        include_owner: this.includeOwners,
        content: this.message.content,
        subject: this.message.subject,
        include_signature: false,
        recipient_lists: recipient,
      }
      this.$store
        .dispatch('message/getSendMail', {
          recipData: payload,
          Id: this.message.id,
        })
        .then(this.$parent.toggleOpen())
    },
    getSendMailRecipients() {
      const data = []
      this.selectedProjects.map((element) => {
        const recipients = []
        if (element.selected) {
          if (element.include_owner) {
            recipients.push({
              name: element.owner_name,
              email: element.owner_email,
              role: 'project-owner',
            })
          }
          element.members.map((member) => {
            if (member.include_member) {
              recipients.push({
                name: member.last_name
                  ? member.name + ' ' + member.last_name
                  : member.name,
                email: member.email,
                role: member.pivot.role,
              })
            }
            return recipients
          })
          if (recipients.length) {
            data.push({
              type: 'Project',
              number: element.project_number,
              name: element.name,
              recipients,
            })
          }
        }
        return recipients
      })
      return data
    },
  },
}
</script>
