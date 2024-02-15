<template>
  <div>
    <div class="flex text-primary-900 opacity-70">
      <span class="font-semibold">
        {{ option ? 'Option ' + option.option.option_order + ':' : '' }}&nbsp;

        {{
          option && option.option.name ? option.option.name + '' : ''
        }}&nbsp;</span
      >
      <span v-if="option">{{
        option.sub_part.space_types_included | getSubPartTitle
      }}</span>
    </div>
    <div class="flex justify-between mt-4">
      <FormulateInput
        v-model="name"
        type="search"
        placeholder="Search"
        @keyup.enter="applyFilter()"
        @input.native="name === '' && applyFilter()"
      />
    </div>
    <div class="max-h-96 overflow-y-auto overflow-x-hidden">
      <PortfolioScorecardAchievedListView v-if="list" :list="list" />
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
      default: () => {
        return {}
      },
    },
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: '',
      list: null,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
    scorecardPartId() {
      if (Object.keys(this.part).includes('scorecard_part')) {
        return this.part.scorecard_part.find(
          (el) => el.option_id === this.option.option_id
        )?.id
      }
      return null
    },
  },
  async mounted() {
    await this.getToDoList()
  },
  methods: {
    async getToDoList(isCompleted = false) {
      const page = '1'

      try {
        const { data } = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/scorecard_part/${
            this.scorecardPartId
          }/projects?pursue_status=achieved&assigned_only=1&per_page=25&page=${page}${
            this.name !== '' ? `&name=${this.name}` : ''
          }`
        )
        this.list = data
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },
    applyFilter() {
      this.getToDoList()
    },
  },
}
</script>
