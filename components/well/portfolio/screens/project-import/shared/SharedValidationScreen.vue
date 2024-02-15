<template>
  <div>
    <WHeadingsHFour
      heading="Validation summary for your import"
      class="text-primary-900 font-semibold"
    />

    <!-- Error box -->
    <div class="px-6 py-6 rounded-md border border-primary-200 bg-primary-50">
      <div v-if="errors.length" class="flex justify-around">
        <div class="w-1/2">
          <span
            v-if="validationData.action === 'create'"
            class="text-primary-900 font-semibold leading-8"
          >
            {{ errors.length }} out of {{ validationData.total_rows }} new
            locations uploaded by you have invalid values and cannot be
            imported. <br />
            <br />
            You can preview the error rows with invalid values highlighted in
            the table below. For more information on validation, please refer to
            the template provided on the first step. You can either go back to
            the previous step and edit the information provided by you or
            correct the highlighted errors in your spreadsheet and try importing
            again.
          </span>
          <span v-else class="text-primary-900 font-semibold leading-8">
            {{ errors.length }} out of {{ validationData.total_rows }} existing
            locations uploaded by you have invalid values and cannot be
            imported.<br />
            <br />
            You can preview the error rows with invalid values highlighted in
            the table below. For more information on validation, please refer to
            the template provided on the first step. You can either go back to
            the previous step and edit the information provided by you or
            correct the highlighted errors in your spreadsheet and try importing
            again.
          </span>
        </div>
        <div class="pt-6">
          <img src="/portfolio/import/warning.png" alt="warning icon" />
        </div>
      </div>
      <div v-else class="flex justify-around items-center">
        <div class="w-1/2">
          <span
            v-if="validationData.action === 'create'"
            class="text-primary-900 leading-8"
          >
            All of the {{ validationData.total_rows }} new locations uploaded by
            you have validated correctly and are ready for import. <br />
            <br />
            Once you click "Finish Import", these locations will be added as new
            locations to your
            {{
              recertification && recertification.location_changed === 1
                ? 'Locations tab'
                : 'Portfolio'
            }}
            and can be managed from there. You can preview the information in
            the table below to check how your locations would appear in WELL
            Online once imported.
          </span>
          <span v-else>
            All of the {{ validationData.total_rows }} existing locations
            uploaded by you have validated correctly and are ready for import.
            <br />
            <br />
            Once you click "Finish Import", the fields provided by you will be
            updated for these locations and the changes will be visible in your
            {{
              recertification && recertification.location_changed === 1
                ? 'Locations tab'
                : 'Portfolio'
            }}. You can preview the information in the table below to check how
            your locations would appear in WELL Online once imported.
          </span>
        </div>
        <div class="">
          <img src="/portfolio/import/thumb.png" alt="success icon" />
        </div>
      </div>
    </div>

    <WHeadingsHFour
      sub-heading="Preview the information here:"
      class="text-primary-900 font-semibold mt-6"
    />

    <!-- Project table -->
    <div class="flex flex-col mt-4">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border border-primary-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-primary-200">
              <thead class="bg-primary-100">
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-semibold text-primary-900 uppercase tracking-wide py-4"
                  >
                    <div class="w-60">S. NO</div>
                  </th>
                  <th
                    v-for="(header, index) in tableHeaders"
                    :key="index"
                    scope="col"
                    class="text-sm py-4 font-semibold text-primary-900 uppercase tracking-wider"
                  >
                    <div class="w-60">
                      {{ header }}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(rows, index) in validationData.data_rows"
                  :key="index"
                  :class="`text-primary-900  text-center border-b border-primary-200 ${
                    index % 2 === 0 ? 'bg-gray-200' : 'bg-white'
                  }`"
                >
                  <td
                    class="py-4 whitespace-nowrap text-sm font-medium opacity-50"
                  >
                    {{ index + 1 }}
                  </td>
                  <td
                    v-for="(cols, i) in rows"
                    :key="i"
                    :class="`py-4 whitespace-nowrap text-sm font-medium  ${
                      cols.error === null ? 'opacity-50' : 'text-danger-300'
                    }`"
                  >
                    <Flyout
                      v-if="cols.error"
                      y="bottom"
                      x="center"
                      class="h-full"
                    >
                      {{ cols.value ? cols.value : 'no value' }}
                      <template #content>
                        <div class="text-sm text-center p-2 text-primary-900">
                          {{ cols.error }}
                        </div>
                      </template>
                    </Flyout>
                    <span v-else>{{ cols.value }}</span>
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
import { mapState } from 'vuex'
export default {
  props: {
    validationData: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    ...mapState({
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    tableHeaders() {
      let headers = []
      if (this.validationData.data_rows.length) {
        headers = this.validationData.data_rows[0].map((el) => {
          return el.project_column
        })
        return headers
      }
      return []
    },
    errors() {
      const errors = []
      for (let i = 0; i < this.validationData.data_rows.length; i++) {
        for (let x = 0; x < this.validationData.data_rows[i].length; x++) {
          if (this.validationData.data_rows[i][x].error) {
            errors.push({
              row: i + 1,
              message: this.validationData.data_rows[i][x].error,
            })
          }
        }
      }
      this.$emit('getErrors', errors)
      return errors
    },
    recertification() {
      let recertifiction = ''
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction = this.recertificationList[lastRecertifiction]
      }
      return recertifiction
    },
  },
  async mounted() {
    await this.$store.dispatch('recertification/getHSRRecertification')
  },
}
</script>
