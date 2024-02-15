<template>
  <div class="">
    <div
      class="p-6 rounded-md bg-success-200 border-2 border-success-600 flex flex-col space-y-2"
    >
      <div class="flex items-center">
        <WIconsBase class="text-success-700" icon="light-bulb" />
        <span class="text-success-700 font-semibold">Success Tip</span>
      </div>
      <span class="text-success-700 px-7"
        >Each column header below should be matched to a Project location in
        WELL Certified. Some of these have already been matched based on their
        names. Anything that hasn't been matched yet can be manually matched to
        a Project location with the dropdown menu. You can always choose "Don't
        import data in unmatched columns". If you don't see the correct headers
        from your file, refer to the template provided in the previous step.
      </span>
      <span class="hidden">{{ unmatchedColumns.length }}</span>
    </div>
    <div
      v-if="Object.keys(errMessage).length !== 0"
      class="mt-2 p-6 rounded-md bg-danger-300 border-2 border-danger-500 bg-opacity-40 flex flex-col"
    >
      <span class="text-primary-900 font-semibold opacity-80"
        >{{ errMessage.msg }}:</span
      >
      <ul v-if="errMessage.reqs" class="list-inside list-disc">
        <li
          v-for="(err, index) in errMessage.reqs"
          :key="index"
          class="text-primary-900 font-semibold opacity-80"
        >
          {{ err.label }}
        </li>
      </ul>
    </div>

    <div class="text-primary-900 font-semibold mt-6">
      Match columns from your file to project fields
    </div>
    <div class="flex flex-col mt-1">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-x-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-primary-700">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-semibold"
                  >
                    MATCHED
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-semibold"
                  >
                    COLUMNS FROM IMPORT
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-semibold"
                  >
                    PROJECT LOCATION
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider text-center font-semibold"
                  >
                    DON'T OVERWRITE EXISTING VALUE
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(mapping, index) in mappings" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap font-medium">
                    <WIconsBase
                      :class="
                        mapping.matched ? 'text-success-400' : 'text-danger-400'
                      "
                      :icon="mapping.matched ? 'check-circle' : 'x-circle'"
                    />
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <div
                      class="bg-primary-100 text-primary-700 w-72 text-center font-bold py-2 px-2 rounded-lg"
                    >
                      {{ mapping.header_from_file }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="py-2 px-2">
                      <FormulateInput
                        v-model="mapping.project_column"
                        placeholder="Choose a location"
                        :options="systemFieldOptions"
                        type="multi"
                        track-by="value"
                        labels="label"
                        :validation="mapping.required ? 'required' : ''"
                        @input="setProjectAttribute(mapping)"
                      />
                      <FormulateInput
                        v-if="mapping.project_column.label === 'Size*'"
                        v-model="mapping.selected_choice"
                        :options="['sqm', 'sqft']"
                        type="radio"
                        label="Units"
                        validation="required"
                      />
                    </div>
                  </td>
                  <td
                    v-if="mappingDataProp.action === 'create'"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-not-allowed"
                  >
                    <div class="flex justify-center">
                      <Flyout y="bottom" x="left" class="h-full">
                        <template #content>
                          <div class="p-3 text-primary-900 text-sm">
                            Overwrite option can only be used for updating
                            existing locations
                          </div>
                        </template>
                        <FormulateInput
                          v-model="mapping.overwrite_value"
                          :disabled="mappingDataProp.action === 'create'"
                          type="checkbox"
                        />
                      </Flyout>
                    </div>
                  </td>
                  <td v-else class="px-6 py-4">
                    <div class="flex justify-center">
                      <FormulateInput
                        v-model="mapping.overwrite_value"
                        type="checkbox"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mappingDataProp: {
      type: Object,
      required: false,
      default: null,
    },
    errMessage: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      mappings: null,
    }
  },
  computed: {
    systemFieldOptions() {
      const self = this
      const options = [{ label: 'None', value: 'none', $isDisabled: false }]
      if (
        this.mappingDataProp?.system_fields &&
        this.mappingDataProp.system_fields.length
      ) {
        this.mappingDataProp.system_fields.forEach(function (field) {
          options.push({
            value: field.label,
            label: field.label,
            $isDisabled: self.isOptionAvaliable(field),
          })
        })
      }
      return options.sort((val) => {
        return val.$isDisabled ? 1 : -1
      })
    },
    unmatchedColumns() {
      if (this.mappings) {
        const unmatched = this.mappings.filter((el) => !el.matched)
        this.$emit('getUnmatchedColumns', unmatched)
        return unmatched
      }

      return []
    },
  },
  async mounted() {
    this.mappings = [...this.mappingDataProp.mappings].map((mapping) => ({
      ...mapping,
      project_column: {
        label: mapping.project_column,
        value: mapping.project_column,
      },
      required: this.isFieldRequired(mapping),
    }))
    await this.$store.dispatch('recertification/getHSRRecertification')
  },
  methods: {
    isFieldRequired(mapping) {
      const req = this.mappingDataProp.system_fields.find(
        (el) => el.key === mapping.key
      )
      if (req) return req.required
      return false
    },
    setProjectAttribute(mapping) {
      if (
        mapping.project_column.value &&
        mapping.project_column.value !== 'none'
      ) {
        mapping.matched = true
      } else {
        mapping.matched = false
        mapping.project_column.value = null
      }
    },
    isOptionAvaliable(field) {
      const proj = this.mappings.find(
        (el) => el.project_column.label === field.label
      )
      if (proj) return true
      return false
    },
  },
}
</script>
