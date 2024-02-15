export const debounceMixin = {
  methods: {
    /**
     *
     * @param {function you want to debounce} func
     * @param {number -> amount you would like to debounce} delay
     * @returns executes function that you wish to delay/debounce
     * @implementation -> components/well/portfolio/screens/properties/PropertiesOverview.vue
     */
    useDebounce(func, delay = 300) {
      let debounceTimer

      return function () {
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => func.apply(context, args), delay)
      }
    },
  },
}
