<template>
  <div>
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto my-10 border rounded-md p-5"
      @submit="submitNote"
    >
      <div class="mb-5">
        <FormulateInput
          :value="project.name"
          label="Project *"
          type="text"
          placeholder="Project name"
          validation="required"
          disabled
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.communication_type"
          type="select"
          name="communicationType"
          label="Communication Type *"
          placeholder="Select option"
          validation="required"
          :options="communicationType"
        />
      </div>
      <div v-if="showMainTopic" class="mb-5">
        <FormulateInput
          v-model="formData.main_topic"
          type="select"
          name="mainTopics"
          label="Main Topic*"
          placeholder="Select option"
          :options="mainTopic"
        />
      </div>
      <div v-if="!v1Project">
        <FormulateInput
          v-model="formData.attendees"
          label="Attendees"
          name="note_attendees"
          type="text"
          placeholder="Attendees"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.agenda"
          type="textarea"
          label="Agenda"
          help="You may download the agenda templates for a few topics from the links below-"
        />
        <ul class="list-disc ml-4">
          <li class="text-sm">
            <a
              class="text-primary-600"
              href="https://cdn.wellcertified.com/resources/templates/Agenda%20for%20Call%20Pre-Doc%20Submission.docx"
              target="_blank"
              >Agenda for Pre-Doc submission call</a
            >
          </li>
          <li class="text-sm">
            <a
              class="text-primary-600"
              href="https://cdn.wellcertified.com/resources/templates/Agenda%20for%20Checklist%20Review%20Call.docx"
              target="_blank"
              >Agenda for Checklist Review call</a
            >
          </li>
          <li class="text-sm">
            <a
              class="text-primary-600"
              href="https://cdn.wellcertified.com/resources/templates/Agenda%20for%20Curative%20Action%20Call.docx"
              target="_blank"
              >Agenda for Curative action call</a
            >
          </li>
          <li class="text-sm">
            <a
              class="text-primary-600"
              href="https://cdn.wellcertified.com/resources/templates/Agenda%20for%20Kick%20Off.docx"
              target="_blank"
              >Agenda for Kick-off call</a
            >
          </li>
          <li class="text-sm">
            <a
              class="text-primary-600"
              href="https://cdn.wellcertified.com/resources/templates/Agenda%20for%20Post%20Certification%20Call.docx"
              target="_blank"
              >Agenda for Post certification call</a
            >
          </li>
          <li class="text-sm">
            <a
              class="text-primary-600"
              href="https://cdn.wellcertified.com/resources/templates/Agenda%20for%20Rollout%20lanning%20Template%20Call.docx"
              target="_blank"
              >Agenda for Rollout planning template call</a
            >
          </li>
        </ul>
      </div>
      <div class="mb-5">
        <ClientOnly>
          <FormulateInput
            :key="reRender + 1"
            v-model="formData.description"
            type="richtext"
            label="Note*"
            validation="required"
          />
        </ClientOnly>
      </div>
      <div class="mb-5">
        <FormulateInput
          :key="reRender + 1"
          v-model="formData.featureSelected"
          type="select"
          name="features"
          label="Related Feature"
          placeholder="Select option"
          :options="featuresoption"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-if="formData.documents"
          :key="reRender"
          v-model="formData.document"
          label="Attach Document(s):"
          :value="formData.documents"
          type="fileupload"
          upload-path="Project/"
          mime-types=""
        />
        <FormulateInput
          v-else
          v-model="formData.document"
          :value="formData.document"
          label="Attach Document(s):"
          type="fileupload"
          upload-path="Project/"
          mime-types=""
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.is_internal"
          type="checkbox"
          label="Is this an internal note?"
        />
      </div>
      <div class="flex justify-between">
        <div></div>
        <div>
          <FormulateInput
            type="submit"
            :label="selectedNote ? 'Update' : 'Submit'"
          />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    selectedNote: {
      type: Object,
      required: false,
      default: null,
    },
    notesDetails: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      reRender: 0,
      formData: {
        document: [],
        description: '',
        is_internal: false,
        agenda: '',
        attendees: '',
        communication_type: [],
        featureSelected: null,
        main_topic: null,
      },
      features: [],
      showMainTopic: false,
      mainTopic: [
        { label: 'Kick-off Call', value: 'kickoff-call' },
        { label: 'Pre Documentation', value: 'pre-documentation' },
        {
          label: 'Documentation Submission',
          value: 'documentation-submission',
        },
        { label: 'Rollout Planning', value: 'rollout-planning' },
        { label: 'PV Prep', value: 'pv-prep' },
        { label: 'Curative Action', value: 'curative-action' },
        { label: 'Post Certification', value: 'post-certification' },
        { label: 'AAP/Equivalency/Innovation', value: 'aap-equivalency' },
        { label: 'Other', value: 'other' },
      ],
      communicationType: [
        { label: 'Call', value: 'call' },
        { label: 'Email', value: 'email' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Other', value: 'other' },
      ],
    }
  },
  computed: {
    v1Project() {
      return this.project.type === 'v1'
    },
    featuresoption() {
      const options = []
      this.features.forEach(function (feature) {
        options.push({ value: feature.id, label: feature.name })
      })
      return options
    },
  },
  watch: {
    selectedNote(newValue) {
      if (newValue == null) {
        this.formData = {
          document: [],
          description: '',
          is_internal: false,
          agenda: '',
          attendees: '',
          communication_type: [],
          features: [],
          main_topic: null,
        }
      } else {
        this.formData = { ...this.selectedNote }
        if (this.formData.features.length) {
          this.formData.featureSelected = this.formData.features[0].id
        }
        this.reRender++
      }
    },
    formData: {
      handler(newVal) {
        if (
          newVal.communication_type === 'call' ||
          newVal.communication_type === 'email'
        ) {
          this.showMainTopic = true
        } else {
          this.showMainTopic = false
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getFeatures()
    if (this.project.type === 'v1') {
      this.mainTopic.push({
        label: 'Checklist Review',
        value: 'checklist-review',
      })
    } else {
      this.mainTopic.push({ label: 'General', value: 'general' })
    }
  },
  methods: {
    formResetData() {},
    submitNote() {
      if (this.selectedNote == null) {
        const data = { ...this.formData }
        data.document = this.formData.document.map(function (file) {
          const fileInfo = { link_s3: file.url }
          return fileInfo
        })
        data.communication_type = this.formData.communication_type
        data.project_id = this.project.id
        if (this.formData.featureSelected !== null) {
          data.features = [this.formData.featureSelected]
        }
        this.$axios.post('api/admin/project-note', data).then((response) => {
          this.$parent.isHidden = true
          this.$store.dispatch('notes/getNotes', this.project.id)
        })
      } else {
        const noteData = { ...this.formData }
        noteData.document = this.formData.document.map(function (file) {
          const fileInfo = { link_s3: file.url }
          return fileInfo
        })
        noteData.documents = [...noteData.document]
        noteData.communication_type = this.formData.communication_type
        noteData.project_id = this.project.id
        noteData.features = [this.formData.featureSelected]

        this.$store
          .dispatch('notes/updateNote', noteData)
          .then((this.$parent.isHidden = true))
      }
    },
    getFeatures() {
      if (this.project.type !== 'v1') {
        this.$axios
          .get(`api/${this.project.applicable_version_id}/conceptAndFeature`)
          .then((res) => {
            res.data.forEach((conc) => {
              conc.features.forEach((concFeature) => {
                this.features.push({
                  id: concFeature.id,
                  name:
                    concFeature.feature_order < 10
                      ? `${conc.feature_prefix}0${concFeature.feature_order} ${concFeature.name}`
                      : `${conc.feature_prefix}${concFeature.feature_order} ${concFeature.name}`,
                })
              })
            })
          })
      } else {
        let url = 'api/well-v1/features?is_community='
        if (this.project.v1_project_standard === 'community') {
          url += '1'
        } else {
          url += '0'
        }
        this.$axios.get(url).then((response) => {
          this.features = response.data
        })
      }
    },
  },
}
</script>
