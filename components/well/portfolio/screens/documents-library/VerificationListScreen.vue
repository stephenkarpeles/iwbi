<template>
  <div class="mt-4 border-b">
    <div class="flex ml-4 space-x-3 items-center">
      <img
        :src="`/scorecard/icons/${part.concept_name
          .replace(/\s+/g, '-')
          .toLowerCase()}.png`"
        class="rounded-full w-6"
      />
      <span class="text-primary-900 font-semibold text-lg">{{
        part.part_prefix
      }}</span>
    </div>
    <div class="divide-y">
      <PortfolioTasksListView
        ref="taskList"
        :location-type="locationType"
        :part="part"
        :subtab="$attrs.subtab"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    locationType: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
  },
}
</script>
