<template>
  <div class="pb-4">
    <nav class="hidden sm:flex items-center text-sm leading-5 font-medium">
      <div
        v-for="(link, text, index) in links"
        :key="`${text}-${index}`"
        class="flex"
      >
        <nuxt-link
          :to="link"
          class="
            text-primary-400
            hover:text-primary-600
            transition
            duration-150
            ease-in-out
          "
          >{{ text }}
        </nuxt-link>
        <svg
          class="flex-shrink-0 mx-2 h-5 w-5 text-primary-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </nav>
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <slot />
      </div>
      <div
        v-if="$slots.actions || actions.length > 0"
        class="
          md:justify-end
          mt-4
          flex-shrink-0
          sm:flex sm:mt-0
          md:ml-4
          flex-wrap
        "
      >
        <slot v-if="$slots.actions" name="actions"></slot>
        <div v-else-if="actions.length">
          <div
            v-for="(action, index) in actions"
            :key="index"
            class="shadow-sm rounded-md mr-3"
          >
            <WButtonsBase
              :type="action.type"
              :icon="action.icon"
              @click.native="$router.push(action.link)"
            >
              <span class="ml-2">{{ action.title }}</span>
            </WButtonsBase>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    links: {
      type: Object,
      default: () => {},
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: 'Profile',
    }
  },
}
</script>
