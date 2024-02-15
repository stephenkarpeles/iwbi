<template>
  <nav class="mt-5 xl:mt-10">
    <ul class="overflow-hidden">
      <li v-for="(step, index) in steps" :key="index" class="relative pb-10">
        <div
          v-if="index !== steps.length - 1"
          class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
        ></div>
        <nuxt-link
          v-if="!step.link.includes('http')"
          :to="step.link"
          class="relative flex items-start space-x-4 group focus:outline-none"
        >
          <div class="h-9 flex items-center">
            <span
              v-if="step.status === 'complete'"
              class="
                relative
                z-10
                w-8
                h-8
                flex
                items-center
                justify-center
                bg-primary-600
                rounded-full
                group-hover:bg-primary-800
                group-focus:bg-primary-800
                transition
                ease-in-out
                duration-150
              "
            >
              <svg
                class="w-5 h-5 text-white"
                x-description="Heroicon name: check"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <span
              v-else-if="step.status === 'current'"
              class="
                relative
                z-10
                w-8
                h-8
                flex
                items-center
                justify-center
                bg-primary-600
                rounded-full
                group-hover:bg-primary-800
                group-focus:bg-primary-800
                transition
                ease-in-out
                duration-150
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span
              v-else
              class="
                relative
                z-10
                w-8
                h-8
                flex
                items-center
                justify-center
                bg-white
                border-2 border-gray-300
                rounded-full
                group-hover:border-gray-400
                group-focus:border-gray-400
                transition
                ease-in-out
                duration-150
              "
            >
              <span
                class="
                  h-2.5
                  w-2.5
                  bg-transparent
                  rounded-full
                  group-hover:bg-gray-300
                  group-focus:bg-gray-300
                  transition
                  ease-in-out
                  duration-150
                "
              ></span>
            </span>
          </div>
          <div class="min-w-0 my-auto">
            <h3
              :class="[
                step.status === 'current'
                  ? 'text-primary-900'
                  : step.status === 'complete'
                  ? 'text-primary-600'
                  : 'text-primary-300',
                'text-xs leading-4 font-semibold uppercase tracking-wide',
              ]"
            >
              {{ step.name }}
            </h3>
            <p
              v-if="step.description"
              class="text-sm leading-5 text-primary-900 mt-2"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="step.description"></span>
            </p>
          </div>
        </nuxt-link>
        <a
          v-else
          :href="step.link"
          target="_blank"
          class="relative flex items-start space-x-4 group focus:outline-none"
        >
          <div class="h-9 flex items-center">
            <span
              v-if="step.status === 'complete'"
              class="
                relative
                z-10
                w-8
                h-8
                flex
                items-center
                justify-center
                bg-primary-600
                rounded-full
                group-hover:bg-primary-800
                group-focus:bg-primary-800
                transition
                ease-in-out
                duration-150
              "
            >
              <svg
                class="w-5 h-5 text-white"
                x-description="Heroicon name: check"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <span
              v-else-if="step.status === 'current'"
              class="
                relative
                z-10
                w-8
                h-8
                flex
                items-center
                justify-center
                bg-primary-600
                rounded-full
                group-hover:bg-primary-800
                group-focus:bg-primary-800
                transition
                ease-in-out
                duration-150
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span
              v-else
              class="
                relative
                z-10
                w-8
                h-8
                flex
                items-center
                justify-center
                bg-white
                border-2 border-gray-300
                rounded-full
                group-hover:border-gray-400
                group-focus:border-gray-400
                transition
                ease-in-out
                duration-150
              "
            >
              <span
                class="
                  h-2.5
                  w-2.5
                  bg-transparent
                  rounded-full
                  group-hover:bg-gray-300
                  group-focus:bg-gray-300
                  transition
                  ease-in-out
                  duration-150
                "
              ></span>
            </span>
          </div>
          <div class="min-w-0 my-auto">
            <h3
              :class="[
                step.status === 'current'
                  ? 'text-primary-900'
                  : step.status === 'complete'
                  ? 'text-primary-600'
                  : 'text-primary-300',
                'text-xs leading-4 font-semibold uppercase tracking-wide',
              ]"
            >
              {{ step.name }}
            </h3>
            <p
              v-if="step.description"
              class="text-sm leading-5 text-primary-900 mt-2"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="step.description"></span>
            </p>
          </div>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: {
    steps: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>
