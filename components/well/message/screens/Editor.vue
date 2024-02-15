<template>
  <div>
    <div>
      <div class="flex flex-col md:flex-row -mt-6" style="max-height: 88vh">
        <div class="md:w-2/3 bg-white px-6 mt-4">
          <FormulateForm ref="form" class="space-y-5" @submit="saveTemplate">
            <div v-if="messageData.type === 'automatic'">
              <p class="text-sm font-bold">To*</p>
              <FormulateInput
                v-model="toSelected"
                tag-placeholder="Add a tag"
                placeholder="Search or add an email"
                validation="required"
                type="multi"
                name="To"
                :multiple="true"
                :taggable="true"
                :searchable="true"
                :options="emailOptions"
                track-by="value"
              />
            </div>
            <div v-if="messageData.type === 'automatic'">
              <p class="text-sm font-bold">Cc</p>
              <FormulateInput
                v-model="ccSelected"
                tag-placeholder="Add a tag"
                placeholder="Search or add an email"
                :taggable="true"
                :multiple="true"
                :searchable="true"
                type="multi"
                :options="emailOptions"
                track-by="value"
              />
            </div>
            <div v-if="messageData.type === 'automatic'">
              <p class="text-sm font-bold">Bcc</p>
              <FormulateInput
                v-model="bccSelected"
                tag-placeholder="Add a tag"
                placeholder="Search or add an email"
                :taggable="true"
                :multiple="true"
                :searchable="true"
                :options="emailOptions"
                type="multi"
                track-by="value"
              />
            </div>
            <div v-if="messageData.type === 'automatic'">
              <p class="text-sm font-bold">Description*</p>
              <FormulateInput
                v-model="messageData.description"
                type="text"
                name="Description"
                placeholder="Description"
                validation="required"
              />
            </div>
            <div>
              <!-- Tag needs to retain selected option -->
              <p class="text-sm font-bold">Tags</p>
              <FormulateInput
                v-model="messageData.mc_tags"
                tag-placeholder="Add a tag"
                placeholder="Search or add a tag"
                :taggable="true"
                :multiple="true"
                :options="messageTags"
                type="multi"
                labels="name"
                track-by="id"
              />
            </div>
            <div>
              <p class="text-sm font-bold">Subject*</p>
              <FormulateInput
                v-model="messageData.subject"
                type="text"
                name="Subject"
                placeholder="Subject"
                validation="required"
                @click="setFocus('subject')"
              />
            </div>
            <div>
              <p class="text-sm font-bold">Content*</p>
              <ClientOnly>
                <FormulateInput
                  :key="reRender"
                  ref="messageBody"
                  v-model="messageData.content"
                  name="Content"
                  type="richtext"
                  :cursor-index="cursorIndex"
                  validation="required"
                  @click.native="setFocus('body')"
                  @input.native="setFocus('body')"
                />
              </ClientOnly>
            </div>
            <div v-if="messageData.type === 'automatic'">
              <p class="text-sm font-bold">Slug*</p>
              <FormulateInput
                v-model="messageData.slug"
                type="text"
                name="Slug"
                placeholder="Slug"
                validation="required"
                :disabled="message"
              />
            </div>
            <!-- Should not be visible on "edit" admin -->
            <!-- Should be "private, public" on edit-->
            <!-- Should be "private, public, automatic" on compose -->

            <div
              v-if="
                messageData.type === 'private' ||
                messageData.type === 'public' ||
                (messageData.type === 'automatic' && !message)
              "
            >
              <p class="text-sm font-bold">Template Type*</p>
              <div v-if="!message">
                <FormulateInput
                  v-model="messageData.type"
                  type="radio"
                  name="templatetype"
                  :options="{
                    private: 'Private',
                    public: 'Public',
                    automatic: 'Automatic',
                  }"
                />
              </div>
              <div v-else>
                <FormulateInput
                  v-model="messageData.type"
                  type="radio"
                  name="templatetype"
                  :options="{
                    private: 'Private',
                    public: 'Public',
                  }"
                />
              </div>
            </div>
            <FormulateInput
              type="submit"
              :label="message ? 'Update Template' : 'Save As Template'"
            />
          </FormulateForm>
        </div>
        <div class="md:w-1/3 bg-primary-100 p-4 space-y-2">
          <div class="text-sm font-bold">Variables</div>
          <div class="space-y-2.5">
            <div v-if="messageData.type === 'automatic'">
              <FormulateInput
                v-model="moduleValue"
                validation="required"
                type="select"
                lable="WELL Modules"
                :options="moduleOptions"
              />
            </div>
            <div v-if="messageData.type === 'automatic'">
              <FormulateInput
                v-model="subModule"
                type="select"
                placeholder="WELL Sub Modules"
                :options="subModuleOptions"
              />
            </div>
            <div class="overflow-y-auto max-h-72 md:max-h-96">
              <div
                v-for="(messageVariable, index) in messageVariables"
                :key="index"
                class="
                  cursor-pointer
                  hover:bg-primary-500
                  transition-colors
                  hover:text-primary-100
                  text-primary-700
                  flex
                  bg-white
                  shadow
                  px-6
                  py-3
                  rounded-md
                  select-none
                  mt-1
                "
                @click="insertVariable(messageVariable)"
              >
                <div class="my-auto">
                  <div class="text-base select-none font-bold">
                    {{ messageVariable.description }}
                  </div>
                  <div class="text-sm italic select-none">
                    {{ messageVariable.key }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="messageData.type !== 'automatic'" class="pt-10">
            <FormulateInput
              type="submit"
              label="Select Recipient"
              :disabled="hasErrors"
              @click.native="
                ;($parent.$parent.modalScreen = 'pfilter'),
                  ($parent.$parent.messageData = messageData)
              "
            />
          </div>
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
  },
  data() {
    return {
      cursorIndex: 0,
      reRender: 0,
      lastFocuseArea: null,
      focusOn: '',
      hasErrors: false,
      messageData: {
        content: '',
        module: '',
        mc_tags: [],
        sub_module: '',
        subject: '',
        type: 'private',
      },
      emailOptions: [
        { label: 'Logged User Email', value: 'user.email' },
        { label: 'Project Admin Email', value: 'project.user.email' },
        { label: 'Project Owner Email', value: 'project.owner.email' },
        { label: 'Project Coach Email', value: 'project.coach.email' },
        { label: 'Project Reviewer Email', value: 'project.reviewer.email' },
        {
          label: 'Project External Reviewer Email',
          value: 'project.ext-reviewer.email',
        },
        { label: 'Project PTAs Email', value: 'project.pta.email' },
        { label: 'AAP User Email', value: 'aap.user.email' },
        { label: 'Review User Email', value: 'review.user.email' },
        { label: 'WELL Depot Email', value: 'EMAIL_WELL_DEPOT' },
        { label: 'Gayathri Email', value: 'EMAIL_GAYATHRI' },
        { label: 'Lincina Email', value: 'EMAIL_LINCINA' },
        { label: 'Amiljanic Email', value: 'EMAIL_AMILJANIC' },
        { label: 'Adam Email', value: 'EMAIL_ADAM' },
        { label: 'Shalini Email', value: 'EMAIL_SHALINI' },
        { label: 'Melissa Email', value: 'EMAIL_MELISSA' },
        { label: 'Coaching OPS Email', value: 'EMAIL_V2_COACHING_OPS' },
        { label: 'GBCI OPS Email', value: 'EMAIL_V2_GBCI_OPS' },
        { label: 'GBCI Depot Email', value: 'EMAIL_V2_GBCI_DEPOT' },
        { label: 'Portfolio Email', value: 'EMAIL_PORTFOLIO' },
        { label: 'WELL Conference Email', value: 'EMAIL_WELL_CONFERENCE' },
        { label: 'Message Center Email', value: 'MC_EMAIL' },
        { label: 'Invoice Notification Email', value: 'EMAIL_V2_NOTIFICATION' },
        { label: 'Membership Email', value: 'EMAIL_V2_MEMBERSHIP' },
      ],
      moduleOptions: [{ value: 'Project', label: 'Project' }],
      moduleValue: { value: 'Project', label: 'Project' },
      subModuleOptions: [
        { value: 'Review', label: 'Review' },
        { value: 'AAP', label: 'AAP' },
      ],
      subModule: '',
      messageTags: [],
      tagsSelected: [],
      messageVariables: [],
      toOptions: [],
      ccOptions: [],
      bccOptions: [],
      bccSelected: [],
      ccSelected: [],
      toSelected: [],
    }
  },
  computed: {
    richTextCursorIndex() {
      if (this.$refs.messageBody) {
        return this.$refs.messageBody.$children[0].cursorIndex
      }
      return 0
    },
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
      countries: (state) => state.address.countries,
    }),
    countryOptions() {
      const options = []
      this.countries.forEach(function (country) {
        options.push({ value: country.id, label: country.name })
      })
      return options
    },
  },
  mounted() {
    if (this.message) {
      this.messageData = JSON.parse(JSON.stringify(this.message))
      if (this.message.to_recipients && this.message.to_recipients.length) {
        this.message.to_recipients.map((element) => {
          if (this.emailOptions.filter((a) => a.value === element).length) {
            this.toSelected.push(
              this.emailOptions.filter((a) => a.value === element)[0]
            )
          } else {
            this.toSelected.push({ label: element, value: element })
          }
          return null
        })
      }
      if (this.message.bcc_recipients && this.message.bcc_recipients.length) {
        this.message.bcc_recipients.map((element) => {
          if (this.emailOptions.filter((a) => a.value === element).length) {
            this.bccSelected.push(
              this.emailOptions.filter((a) => a.value === element)[0]
            )
          } else {
            this.bccSelected.push({ label: element, value: element })
          }
          return null
        })
      }
      if (this.message.cc_recipients && this.message.cc_recipients.length) {
        this.message.cc_recipients.map((element) => {
          if (this.emailOptions.filter((a) => a.value === element).length) {
            this.ccSelected.push(
              this.emailOptions.filter((a) => a.value === element)[0]
            )
          } else {
            this.ccSelected.push({ label: element, value: element })
          }
          return null
        })
      }
    }

    this.getVariables()
    this.getTags()
  },
  methods: {
    getVariables() {
      const moduleValue = this.moduleValue.value
      const subModule = this.subModule ? this.subModule.value : 'none'
      const url = `api/coach/coach-message/variables/${moduleValue}/${subModule}`
      this.$axios.get(url).then((response) => {
        this.messageVariables = response.data
      })
    },
    getTags() {
      const url = `api/coach/coach-message/tags`
      this.$axios.get(url).then((response) => {
        this.messageTags = response.data
      })
    },
    resetMessageData() {
      this.messageData.subject = null
      this.messageData.content = ''
      this.filterListBy = null
    },
    setFocus(item) {
      this.focusOn = item
    },
    insertVariable(varObj) {
      const variable = '{' + varObj.key + '}'
      if (this.focusOn) {
        if (this.focusOn === 'subject') {
          this.messageData.subject = this.messageData.subject + variable
        }
        if (this.focusOn === 'body') {
          this.messageData.content = [
            this.messageData.content.slice(0, this.richTextCursorIndex),
            variable,
            this.messageData.content.slice(this.richTextCursorIndex),
          ].join('')

          this.messageData.content = this.messageData.content + variable
          this.reRender++
        }
      }
    },
    formValidate() {
      if (this.messageData.subject !== '' && this.messageData.content !== '') {
        this.hasErrors = true
      }
    },
    saveTemplate() {
      const data = {
        slug: this.messageData.slug,
        description: this.messageData.description,
        bcc_recipients: this.bccSelected.map((email) => email.value),
        cc_recipients: this.ccSelected.map((email) => email.value),
        to_recipients: this.toSelected.map((email) => email.value),
        subject: this.messageData.subject,
        content: this.messageData.content,
        type: this.messageData.type,
        module: this.moduleValue.value
          ? this.moduleValue.value
          : this.moduleValue,
        mc_tags:
          this.messageData.mc_tags.length > 0
            ? this.messageData.mc_tags.map((tag) => tag.name)
            : '',
      }
      if (this.message) {
        this.$store
          .dispatch('message/getUpdateTemplate', {
            msgData: data,
            Id: this.message.id,
          })
          .then(
            this.$parent.toggleOpen(),
            this.$parent.$parent.getMessages(),
            this.resetMessageData()
          )
        this.$store.dispatch('message/getCoachMessages')
      } else {
        this.$store
          .dispatch('message/getSaveAsTemplate', data)
          .then(
            this.$parent.toggleOpen(),
            this.$parent.$parent.getMessages(),
            this.resetMessageData()
          )
        this.$store.dispatch('message/getCoachMessages')
      }
    },
  },
}
</script>
