<template>
  <div>
    <div class="flex text-primary-900 opacity-70">
      <span class="font-semibold"
        >{{ part.part_prefix }} {{ option.name }}</span
      >
      <div class="text-primary-800 opacity-100 border-l-2 mx-2"></div>
      <span>{{ option.space_types_included | getSubPartTitle }}</span>
    </div>

    <div class="flex justify-between mt-4">
      <div class="rounded-full bg-gray-100 w-max mb-4">
        <button
          :class="`py-2 px-3 rounded-full ${
            subTab === 'pending' ? 'text-white bg-primary-600' : 'text-gray-500'
          }`"
          @click="subTab = 'pending'"
        >
          Pending ({{ pendingList && pendingList.total }})
        </button>
        <button
          :class="`rounded-full py-2 px-3 ${
            subTab === 'completed'
              ? 'text-white bg-primary-600'
              : 'text-gray-500'
          }`"
          @click=";(subTab = 'completed'), (name = '')"
        >
          Completed ({{ completedList && completedList.total }})
        </button>
      </div>

      <FormulateInput
        v-model="name"
        type="search"
        placeholder="Search"
        @keyup.enter="applyFilter()"
        @input.native="name === '' && applyFilter()"
      />
    </div>

    <div class="max-h-96 overflow-y-auto overflow-x-hidden">
      <PortfolioScorecardPendingListView
        v-if="subTab === 'pending' && pendingList"
        :pending-list="pendingList"
      />
      <PortfolioScorecardUploadedListView
        v-else-if="subTab === 'completed' && completedList"
        :completed-list="completedList"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    option: {
      type: Object,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      subTab: 'pending',
      pendingList: null,
      completedList: null,
      name: '',
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
    scorecardPartId() {
      if (Object.keys(this.part).includes('scorecard_part')) {
        return this.part.scorecard_part.find(
          (el) => el.option_id === this.option.id
        )?.id
      } else if (this.option.scorecard_part_id) {
        return this.option.scorecard_part_id
      } else {
        return ''
      }
    },
  },
  async mounted() {
    await this.getToDoList()
    await this.getToDoList(true)
  },
  methods: {
    async getToDoList(isCompleted = false) {
      let page = '1'
      if (isCompleted) {
        if (this.completedList) page = this.completedList.current_page
      } else if (this.pendingList) page = this.pendingList.current_page
      try {
        const { data } = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/scorecard_part/${
            this.scorecardPartId
          }/${this.option.verification.type}/${
            this.option.verification.id
          }/todo?page=${page}${isCompleted ? '&completed' : ''}${
            this.name !== '' ? `&project_name=${this.name}` : ''
          }`
        )
        isCompleted ? (this.completedList = data) : (this.pendingList = data)
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },
    applyFilter() {
      if (this.subTab === 'pending') {
        this.getToDoList()
      } else {
        this.getToDoList(true)
      }
    },
  },
}
</script>
