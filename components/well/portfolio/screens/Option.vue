<template>
  <div>
    <div
      class="flex justify-between shadow border border-primary-300 rounded px-4 py-2"
    >
      <div class="flex w-full">
        <div class="flex w-64 space-x-12">
          <div class="w-12">
            <WButtonsBase
              type="neutral"
              :class="[
                optionValue === 'yes'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-primary-600',
                'border border-primary-300 rounded-md transition-colors duration-300',
              ]"
              @click.native="sendResponse('yes')"
            >
              <WIconsBase icon="thumb-up" />
            </WButtonsBase>
          </div>
          <div class="w-12">
            <WButtonsBase
              type="neutral"
              :class="[
                optionValue === 'maybe'
                  ? 'bg-secondary-700 text-white'
                  : 'bg-white text-primary-600',
                'border border-primary-300 rounded-md transition-colors duration-300',
              ]"
              @click.native="sendResponse('maybe')"
            >
              <WIconsBase class="w-6 h-6" icon="document-search" />
            </WButtonsBase>
          </div>
          <div class="w-12">
            <WButtonsBase
              type="neutral"
              :class="[
                optionValue === 'no'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-primary-600',
                'border border-primary-300 rounded-md transition-colors duration-300',
              ]"
              @click.native="sendResponse('no')"
            >
              <WIconsBase icon="ban" />
            </WButtonsBase>
          </div>
        </div>
        <div class="w-full flex items-center max-w-2xl mr-auto">
          <div
            v-if="option.question"
            class="text-base leading-6 font-normal text-gray-700 xl:pl-10"
            v-html="option.question"
          ></div>
        </div>
      </div>
      <div class="w-24 flex justify-end">
        <div class="my-auto">
          <div v-for="(part, ind) in option.part_datas" :key="ind">
            <div class="flex space-x-2 text-xs justify-end">
              <Flyout
                v-if="option.description && ind === 0"
                ref="conceptFlyout"
                y="bottom"
                x="left"
                class="h-full"
              >
                <WButtonsBase type="tooltip" icon="check" />
                <template #content>
                  <div class="p-3 w-60" v-html="option.description"></div>
                </template>
              </Flyout>
              <Flyout
                ref="conceptFlyout"
                y="bottom"
                :x="part.type === 'P' ? 'left' : 'right'"
                class="h-full"
              >
                <WButtonsBase type="tooltip">{{
                  part.type === 'P' ? 'P' : option.points
                }}</WButtonsBase>
                <template #content>
                  <div class="p-3 w-60">
                    {{ partLabel(part) }}
                  </div>
                </template>
              </Flyout>
              <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                <WButtonsBase
                  type="tooltip"
                  icon="link"
                  @click.native="openLink(part.part_url)"
                />
                <template #content>
                  <div class="p-3 w-60">
                    {{ part.part }}
                  </div>
                </template>
              </Flyout>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    option: {
      type: Object,
      required: true,
    },
    index: {
      type: [String, Number],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    qIndex: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    optionValue: {
      get() {
        return this.$store.state.survey.categories[this.category].questions[
          this.qIndex
        ].options[this.index].response
      },
    },
  },
  methods: {
    ...mapActions('survey', ['publishOptionUpdate']),
    sendResponse(value) {
      if (value !== this.optionValue) {
        this.$store.commit('survey/updateSurveyOption', {
          id: this.option.id,
          response: value,
          category: this.category,
          questionIndex: this.qIndex,
          optionIndex: this.index,
        })
        this.publishOptionUpdate({
          id: this.option.id,
          response: value,
          category: this.category,
          questionIndex: this.qIndex,
          optionIndex: this.index,
        })
      }
    },
    partLabel(part) {
      if (part && part.type !== 'P') {
        const pts = this.option.points > 1 ? ' points' : ' point'
        return 'Max ' + this.option.points + pts
      }
      return 'Precondition features are not considered a requirement at the portfolio-scale. Individual projects within your portfolio will need to meet precondition features to earn certification and to contribute more than 49 points to the WELL Portfolio Score.'
    },
    openLink(url) {
      window.open(url, '_blank')
    },
  },
}
</script>
