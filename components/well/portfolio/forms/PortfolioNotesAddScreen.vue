<template>
  <div>
    <div v-if="features">
      <div v-if="notes">
        <FormulateForm class="space-y-2" name="Noteadd" @submit="addNote">
          <FormulateInput
            v-model="portfolio.name"
            :disabled="disablePortfolioName"
            type="text"
            name="portfolio_name"
            validation="required"
            label="Portfolio Name*"
          />
          <FormulateInput
            v-model="note.communication_type"
            type="select"
            name="communication_type"
            placeholder="Please select"
            :options="communicationType"
            label="Communication Type*"
            validation="required"
          />
          <FormulateInput
            v-if="showMainTopic"
            v-model="note.main_topic"
            type="select"
            name="main_topic"
            placeholder="Please select"
            :options="mainTopic"
            label="Main Topic*"
            validation="required"
          />
          <FormulateInput
            v-model="note.attendees"
            type="text"
            name="attendees"
            validation="required"
            label="Attendees"
          />
          <FormulateInput
            v-model="note.agenda"
            type="textarea"
            name="agenda"
            validation="required"
            label="Agenda"
          />
          <ClientOnly>
            <FormulateInput
              :key="forceReRender"
              v-model="note.description"
              type="richtext"
              name="note"
              label="Note*"
              validation="required"
            />
          </ClientOnly>
          <div v-if="featureOptions">
            <label
              for="applicablePart"
              class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >
              Related Feature
            </label>
            <FormulateInput
              v-model="note.features"
              tag-placeholder="Add a tag"
              placeholder="Select Feature"
              :taggable="true"
              :multiple="true"
              :options="featureOptions"
              type="multi"
              labels="name"
              track-by="id"
            />
          </div>
          <FormulateInput
            v-if="ready"
            :key="forceReRender + 1"
            v-model="note.documents"
            label="Attach Document(s):"
            :value="note.documents"
            type="fileupload"
            :upload-path="`portfolio/${portfolio.portfolio_number}/notes/`"
            mime-types=""
          />
          <FormulateInput
            v-model="note.is_internal"
            type="checkbox"
            label="Is this an internal note?"
          />
          <div>
            <FormulateInput type="submit" label="Submit" />
          </div>
        </FormulateForm>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    notes: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      ready: false,
      forceReRender: 1,
      showMainTopic: false,
      disablePortfolioName: true,
      note: {
        communication_type: '',
        main_topic: '',
        submission: '',
        other: '',
        agenda: '',
        attendees: '',
        description: '',
        is_internal: false,
        documents: [],
        features: [],
      },
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
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      notesList: (state) => state.portfolio.notesList,
      features: (state) => state.features.features,
      concepts: (state) => state.concepts.concepts,
      featureOptions() {
        if (this.concepts) {
          const options = []
          for (const concept in this.concepts) {
            for (const feature in this.concepts[concept].features) {
              const option = {
                name: this.concepts[concept].features[feature]
                  .feature_full_name,
                id: this.concepts[concept].features[feature].id,
              }
              options.push(option)
            }
          }
          return options
        }
        return null
      },
    }),
  },
  watch: {
    'note.communication_type'(newVal, oldVal) {
      if (newVal && (newVal === 'call' || newVal === 'email')) {
        this.showMainTopic = true
      } else {
        this.showMainTopic = false
      }
    },
    notes(newVal) {
      this.note = { ...newVal }
      this.forceReRender++
    },
  },
  mounted() {
    if (this.$parent.note) {
      this.note = JSON.parse(JSON.stringify(this.$parent.note))
    }
    if (this.notes.documents) {
      this.note.documents = this.notes.documents.map(function (file) {
        return { url: file.link_s3, name: file.name }
      })
    }
    this.ready = true
    this.$store.dispatch('concepts/getPortfolioConceptsAndFeatures')
  },
  methods: {
    addNote() {
      if (this.$parent.currentScreen === 'add') {
        const payloadData = JSON.parse(JSON.stringify(this.note))

        payloadData.documents = this.note.documents.map(function (file) {
          return { link_s3: file.url }
        })
        payloadData.is_internal = this.note.is_internal ? 1 : 0
        const features = []
        if (this.note.features.length) {
          this.note.features.map((e) => {
            features.push(e.id)
            return features
          })
        }
        payloadData.features = features
        payloadData.communication_type = this.note.communication_type
        payloadData.main_topic = this.note.main_topic
          ? this.note.main_topic
          : ''
        this.$store
          .dispatch('support/addNote', payloadData)
          .then((response) => {
            this.$parent.currentScreen = 'list'
            this.$store.dispatch('portfolio/getNotesList', {
              id: this.$route.params.id,
            })
          })
      } else {
        const payloadData = JSON.parse(JSON.stringify(this.note))

        payloadData.documents = this.note.documents.map(function (file) {
          return { link_s3: file.url }
        })
        payloadData.is_internal = this.note.is_internal ? 1 : 0
        const features = []
        if (this.note.features.length) {
          this.note.features.map((e) => {
            features.push(e.id)
            return features
          })
        }
        payloadData.features = features
        payloadData.communication_type = this.note.communication_type
        payloadData.main_topic = this.note.main_topic
          ? this.note.main_topic
          : ''
        payloadData.id = this.notes.id
        this.$store
          .dispatch('support/updateNotes', payloadData)
          .then((response) => {
            this.$parent.currentScreen = 'list'
            this.$store.dispatch('portfolio/getNotesList', {
              id: this.$route.params.id,
            })
          })
      }
    },
  },
}
</script>
