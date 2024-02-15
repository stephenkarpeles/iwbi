<template>
  <div>
    <section>
      <div class="container">
        <div class="flex justify-between">
          <a
            v-for="tab in tabs"
            :key="tab.id"
            class="
              border-l border-t border-primary-200
              cursor-auto
              transition-all
              duration-300
              leading-3
              flex
              justify-center
              items-center
              w-full
              h-14
              text-center text-xs
            "
            :class="{
              'bg-primary-100 text-primary-600 font-bold':
                currentTab === tab.id,
              'rounded-tl-lg': tab.id === 1,
              'rounded-tr-lg border-r': tab.id === 5,
            }"
            href="#"
          >
            <span>{{ tab.text }}</span>
          </a>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div
          class="p-4 sm:p-5 border border-primary-200 shadow-box rounded-b-lg"
        >
          <div
            class="flex flex-col-reverse sm:flex-row justify-between h-96 min-h"
          >
            <div class="sm:w-full md:w-9/12 pr-4">
              <p class="leading-5 text-primary-600">
                Project Name:
                <span class="font-semibold text-primary-1000 text-xl">
                  {{ projectName }}
                </span>
              </p>
              <h1
                class="
                  font-bold
                  text-primary-900 text-3xl text-center
                  sm:text-left
                  pt-3
                "
              >
                {{ question.area }}
              </h1>
              <p
                id="hsr-assessment-question"
                class="
                  text-primary-900
                  opacity-50
                  leading-5
                  text-center
                  sm:text-left
                  pt-4
                  overflow-y-auto
                  md:max-h-72
                "
                v-html="question.question_text"
              ></p>
            </div>
            <div class="sm:w-3/12 mb-8 sm:mb-0 sm:invisible md:visible">
              <div class="flex items-start justify-center">
                <div class="max-w-sm">
                  <img
                    class="object-cover max-h-96"
                    :src="`/assessment/categories/${currentTab}.png`"
                    :alt="question.area"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="pt-4 sm:pt-6">
            <div class="sm:-mx-2 flex flex-col sm:flex-row">
              <a
                v-for="answer in answers"
                :key="answer.id"
                href="#"
                class="
                  text-sm
                  md:hover:bg-primary-500
                  border border-primary-200
                  rounded
                  text-center
                  cursor-pointer
                  md:hover:text-primary-50
                  transition-colors
                  duration-300
                  font-black
                  leading-5
                  h-20
                  sm:h-28
                  flex
                  items-center
                  justify-center
                  mb-4
                  sm:mr-2 sm:mb-0
                  w-full
                "
                :class="{
                  'bg-primary-500 text-primary-50':
                    answer.id === question.answer,
                  'bg-primary-50': answer.id !== question.answer,
                }"
                @click.prevent="$emit('answer', answer.id)"
                v-html="answer.text"
              ></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true,
      default: () => {},
    },
    projectName: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      answers: [
        { id: 5, text: 'Cannot be met' },
        { id: 4, text: 'Very difficult to meet' },
        { id: 3, text: 'Some effort/cost required' },
        { id: 2, text: 'Easily met' },
        { id: 1, text: 'Already met <br />(or negligible effort required)' },
      ],
      tabs: [
        { id: 1, text: 'Cleaning and Sanitization Procedures' },
        { id: 2, text: 'Emergency Preparedness Programs' },
        { id: 3, text: 'Health Service Resources' },
        { id: 4, text: 'Air and Water Quality Management' },
        { id: 5, text: 'Stakeholder Engagement and Communication' },
      ],
    }
  },
  computed: {
    currentTab() {
      if (this.question.area === 'Cleaning and Sanitization Procedures') {
        return 1
      }
      if (this.question.area === 'Emergency Preparedness Programs') {
        return 2
      }
      if (this.question.area === 'Health Service Resources') {
        return 3
      }
      if (this.question.area === 'Air and Water Quality Management') {
        return 4
      }
      if (this.question.area === 'Stakeholder Engagement and Communication') {
        return 5
      }

      return 0
    },
  },
}
</script>

<style scoped lang="css">
#hsr-assessment-question >>> ul li {
  list-style-type: disc;
  margin-left: 35px;
}
</style>
