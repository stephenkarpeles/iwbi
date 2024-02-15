<template>
  <!--
  Tailwind UI components require Tailwind CSS v1.8 and the @tailwindcss/ui plugin.
  Read the documentation to get started: https://tailwindui.com/documentation
-->
  <nav>
    <ul
      class="
        border-2 border-primary-300
        rounded-md
        divide-y divide-primary-300
        md:flex
        justify-around
        md:divide-y-0
      "
    >
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="relative w-full"
        @click="changeStep(step)"
      >
        <!-- Current Step -->
        <div
          class="
            px-2
            py-4
            flex
            md:flex-col
            lg:flex-row
            items-center
            text-sm
            leading-5
            font-medium
            space-x-4
            md:space-x-0
            lg:space-x-4
            text-primary-600
          "
        >
          <div
            v-if="step.status === 'complete'"
            class="
              flex-shrink-0
              w-10
              h-10
              md:w-12 md:h-12
              flex
              items-center
              justify-center
              bg-primary-600
              rounded-full
              group-hover:bg-primary-800
              transition
              ease-in-out
              duration-150
            "
          >
            <svg
              class="w-6 h-6 text-white"
              x-description="Heroicon name: check"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div
            v-else
            :class="[
              step.status === 'current' || step.status === 'complete'
                ? 'flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex justify-center border-primary-600 rounded-full'
                : 'flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex justify-center border-2 rounded-full border-primary-600',
            ]"
          >
            <p
              :class="[
                step.status === 'current'
                  ? 'text-primary-900'
                  : 'my-auto pt-2 text-primary-600',
              ]"
            >
              <span
                v-if="step.status === 'current'"
                class="
                  flex-shrink-0
                  w-10
                  h-10
                  md:w-12 md:h-12
                  flex
                  items-center
                  justify-center
                  bg-primary-600
                  rounded-full
                  group-hover:bg-primary-800
                  transition
                  ease-in-out
                  duration-150
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 md:h-6 md:w-6 text-white"
                  fill="none"
                  viewBox="0 0 22 22"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M12 4v16m8-8H4"
                  /></svg
              ></span>
              <span v-else>0{{ index + 1 }}</span>
            </p>
          </div>
          <p
            :class="{
              'text-primary-900': step.status === 'current',
            }"
            class="
              text-sm
              leading-5
              font-medium
              lg:pr-8
              my-auto
              md:my-0
              lg:my-auto
              md:mt-2
              lg:mt-auto
              text-left
              md:text-center
              lg:text-left
            "
          >
            <span>
              {{ step.name }}
            </span>
            <span v-if="step.caption" class="block">{{ step.caption }}</span>
          </p>
        </div>
        <div
          :class="[
            'absolute top-0 right-0 h-full w-5 hidden md:block',
            { 'md:hidden': index == steps.length - 1 },
          ]"
        >
          <svg
            class="h-full w-full text-primary-600"
            viewBox="0 0 22 80"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 -2L20 40L0 82"
              vector-effect="non-scaling-stroke"
              stroke="currentcolor"
              stroke-linejoin="round"
            />
          </svg>
        </div>
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
  methods: {
    changeStep(step) {
      this.$emit('stepsUpdated', step)
    },
  },
}
</script>
