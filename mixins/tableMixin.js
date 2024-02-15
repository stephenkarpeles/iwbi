export const tableMixin = {
  methods: {
    /**
     *
     * @param {any} value -> value you are checking in the table
     * @param {string} customValue -> Value you want to return, used for cells that have two values in them OR if you would like return a custom set value other than the default 'Not Set'
     * @param {string} customValue -> Styles if you want to override proved styles
     * @returns Checks for empty table value -> if empty return placeholder
     */

    checkValue(value, customValue, customStyles) {
      // For empty values
      if (value === null || value === undefined || !value.length) {
        return `<span class="${
          customStyles ?? 'text-sm leading-5 text-gray-500 italic'
        }">${customValue ?? 'Not Set'}</span>`
      }

      // For non empty values -> Passed customStyles will override defaults if passed in
      return `<span class="${
        customStyles ?? 'text-sm leading-5 text-gray-900'
      }">${value}</span>`
    },
  },
}
