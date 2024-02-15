<template>
  <div class="row">
    <div v-if="partResponse" class="col-12 d-inline-block">
      <FormulateForm>
        <FormulateInput
          v-model="commentSuggestionsSelected"
          type="select"
          label="Review Comment"
          :options="commentSuggestions"
          placeholder="Search sample comments here..."
          @input="setcomment"
        />

        <FormulateInput
          :id="'commentNote' + partId"
          :key="forceReMount"
          v-model="commentNote"
          type="richtext"
        />

        <div class="mt-2">
          <WButtonsBase v-if="submitting" :type="'primaryInverted'">
            <span>
              <WLoadingSpinner type="button" class="mx-auto" />
            </span>
          </WButtonsBase>
          <FormulateInput
            v-else
            type="submit"
            :label="editMode ? 'Update' : 'Submit'"
            @click="!editMode ? submitComment() : updateComment()"
          />
        </div>
      </FormulateForm>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  props: {
    partId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      submitting: false,
      commentNote: '',
      commentSuggestionsSelected: '',
      editMode: false,
      responseId: '',
      commentId: '',
      forceReMount: 0,
    }
  },
  computed: {
    ...mapState('scorecard', ['adminReviewResponses']),
    ...mapGetters('review', ['pendingReview']),
    commentSuggestions() {
      if (this.pendingReview) {
        if (this.pendingReview.phase.includes('Precertification')) {
          if (this.pendingReview.phase.includes('Preliminary')) {
            return [
              {
                label: 'Implementation-stage has no required documentation.',
                value: 'Implementation-stage has no required documentation.',
              },
              {
                label: 'Implementation-stage documentation has been provided.',
                value: 'Implementation-stage documentation has been provided.',
              },
              {
                label:
                  'Intent-stage documentation has been provided indicating...',
                value:
                  'Intent-stage documentation has been provided indicating that the part requirements will be met.',
              },
              {
                label:
                  'Intent-stage documentation has not been provided indicating...',
                value:
                  'Intent-stage documentation has not been provided indicating that the part requirements will be met. To demonstrate compliance, the following must be addressed.<br/><br/>COMMENTS TO BE ADDRESSED<ol><li></li></ol>',
              },
              {
                label:
                  'Implementation-stage documentation has been provided...',
                value:
                  'Implementation-stage documentation has been provided. However, to demonstrate compliance, the following must be addressed.<br/><br/>COMMENTS TO BE ADDRESSED<ol><li></li></ol>',
              },
              {
                label: 'Intent-stage documentation has been provided...',
                value:
                  'Intent-stage documentation has been provided. However, to demonstrate compliance, the following must be addressed.<br/><br/>COMMENTS TO BE ADDRESSED<ol><li></li></ol>',
              },
            ]
          } else {
            return [
              {
                label: 'Implementation-stage has no required documentation.',
                value: 'Implementation-stage has no required documentation.',
              },
              {
                label: 'Implementation-stage documentation has been provided.',
                value: 'Implementation-stage documentation has been provided.',
              },
              {
                label:
                  'Intent-stage documentation has been provided indicating that...',
                value:
                  'Intent-stage documentation has been provided indicating that the part requirements will be met.',
              },
              {
                label: 'This part has been withdrawn.',
                value: 'This part has been withdrawn.',
              },
            ]
          }
        } else if (this.pendingReview.phase.includes('Documentation')) {
          if (this.pendingReview.phase.includes('Preliminary')) {
            return [
              {
                label:
                  'This part has no required documentation. Requirements of...',
                value:
                  'This part has no required documentation. <br/><br/>Requirements of this part will be verified through on-site assessment during your Performance Verification.',
              },

              {
                label: 'Documentation has been provided.',
                value: 'Documentation has been provided.',
              },
              {
                label: 'This part has not been attempted.',
                value: 'This This has not been attempted.',
              },
              {
                label:
                  'Documentation has been provided. However, to demonstrate...',
                value:
                  'Documentation has been provided. However, to demonstrate compliance, the following must be addressed.<br/><br/>COMMENTS TO BE ADDRESSED<ol><li></li></ol>',
              },
            ]
          } else {
            return [
              {
                label: 'Additional Documentation has been provided.',
                value: 'Additional Documentation has been provided.',
              },
              {
                label: 'This part has been withdrawn.',
                value: 'This part has been withdrawn.',
              },
            ]
          }
        }
      }
      return []
    },
    partResponse() {
      const response = ''
      const index = this.pendingReview
        ? this.adminReviewResponses.findIndex(
            (a) => a.id === this.pendingReview.id
          )
        : -1
      if (index !== -1) {
        if (this.adminReviewResponses[index].responses.length) {
          const result = this.adminReviewResponses[index].responses.filter(
            (a) => a.part_id === this.partId
          )
          if (result.length) {
            return result[0]
          }
        }
      }
      return response
    },
  },
  methods: {
    ...mapActions('scorecard', [
      'updateReviewResponses',
      'submitReviewComment',
      'updateReviewComment',
    ]),
    setcomment(value) {
      this.commentNote = value
      this.forceReMount++
    },
    async submitComment() {
      if (this.commentNote !== '') {
        const data = {
          data: {
            description: this.commentNote !== '' ? this.commentNote : '',
            communication_type: 'other',
            documents: [],
            model_type: this.pendingReview.project_id
              ? 'ProjectReview'
              : 'Review',
          },
          id: this.pendingReview.id,
          part_id: this.partId,
          responseId: this.partResponse.id,
        }
        this.submitting = true
        await this.submitReviewComment(data)

        this.commentNote = ''
        this.commentSuggestionsSelected = ''
        this.submitting = false
        this.forceReMount++
      }
    },
    async updateComment() {
      if (this.commentNote !== '') {
        const data = {
          data: {
            description: this.commentNote !== '' ? this.commentNote : '',
            communication_type: 'other',
            documents: [],
            model_type: this.pendingReview.project_id
              ? 'ProjectReview'
              : 'Review',
          },
          id: this.pendingReview.id,
          part_id: this.partId,
          responseId: this.responseId,
          commentId: this.commentId,
        }
        this.submitting = true
        await this.updateReviewComment(data)

        this.commentNote = ''
        this.submitting = false
        this.commentSuggestionsSelected = ''
        this.editMode = false
        this.responseId = ''
        this.forceReMount++
      }
    },
  },
}
</script>
