<template>
  <div @click="analytics()">
    <nuxt-link v-if="target === ''" :to="link" :class="classes">
      <slot v-if="iconPosition === 'left'" name="icon"
        ><component :is="svgComponent" if="svgComponent" class="mx-1 w-5 h-5"
      /></slot>
      <slot />
      <slot v-if="iconPosition === 'right'" name="icon"
        ><component :is="svgComponent" if="svgComponent" class="mx-1 w-5 h-5"
      /></slot>
    </nuxt-link>
    <a v-else :href="link" target="_blank" :class="classes">
      <slot v-if="iconPosition === 'left'" name="icon"
        ><component :is="svgComponent" if="svgComponent" class="mx-1 w-5 h-5"
      /></slot>
      <slot />
      <slot v-if="iconPosition === 'right'" name="icon"
        ><component :is="svgComponent" if="svgComponent" class="mx-1 w-5 h-5"
      /></slot>
    </a>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'primary',
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
    iconPosition: {
      type: String,
      required: false,
      default: 'left',
    },
    link: {
      type: String,
      required: false,
      default: '#',
    },
    target: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    classes() {
      return this.$wind.links.base[this.type]
    },
    svgComponent() {
      return this.icon && require(`@/static/icons/${this.icon}.svg?inline`)
    },
  },
  methods: {
    analytics() {
      if (
        process.client &&
        this?.$wind?.analytics &&
        this.$wind.analytics === true
      ) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'windEvent',
          category: 'Link click',
          action: this.$el.textContent,
          label: window.location.pathname,
        })
      }
      if (process.client && this?.$wind?.debug && this.$wind.debug === true) {
        // eslint-disable-next-line no-console
        console.log({
          event: 'windEvent',
          category: 'Link click',
          action: this.$el.textContent,
          label: window.location.pathname,
        })
      }
    },
  },
}
</script>
