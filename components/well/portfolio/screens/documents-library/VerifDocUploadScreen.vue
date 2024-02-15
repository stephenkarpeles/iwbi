<template>
  <div>
    <div class="flex w-full border-b justify-between mb-4">
      <WHeadingsHThree class="text-primary-900" heading="Upload a Document" />
      <WIconsBase
        class="text-primary-900 text-lg cursor-pointer"
        icon="x"
        @click.native="closeModal()"
      />
    </div>
    <div
      :style="{
        height: '500px',
      }"
      class="overflow-y-auto overflow-x-hidden"
    >
      <div class="flex space-x-3 items-center">
        <img
          :src="`/scorecard/icons/${part.concept
            .replace(/\s+/g, '-')
            .toLowerCase()}.png`"
          class="rounded-full w-7"
        />
        <span class="text-primary-900 font-semibold text-2xl">{{
          part.prefix
        }}</span>
      </div>

      <div class="space-y-4 mt-6">
        <div>
          <span class="text-primary-900 text-lg font-semibold"
            >1. Select Subpart</span
          >
          <div class="flex space-x-4 mt-2">
            <label
              v-for="(option, index) in verificationOptions"
              :key="index"
              class="
                flex
                items-center
                space-x-4
                py-4
                px-3
                bg-primary-50
                text-primary-800
                rounded-md
                border border-gray-300
              "
            >
              <input
                v-model="formData.verif_method"
                type="radio"
                :value="option.value"
                class="focus:ring-primary-800 text-primary-800"
              />
              <div class="flex flex-col">
                <span class="truncate">{{ option.label }}</span>
                <!-- <span class="text-sm opacity-70">{{ option.subLabel }}</span> -->
              </div>
            </label>
          </div>
        </div>

        <div
          v-if="currentVer.is_auditable"
          class="
            p-4
            flex
            space-x-2
            border border-primary-300
            rounded-sm
            bg-primary-100
            items-center
          "
        >
          <WIconsBase
            class="text-primary-500 w-10 h-10"
            icon="information-circle"
          />
          <span class="text-sm text-primary-900 opacity-90">
            This verification method is subject to an audit. Audit locations are
            randomly selected from your pursued locations shown below. To learn
            more about verification methods and the audit process, click
            <a
              href="https://v2.wellcertified.com/${scorecardVersion.version}/en/overview"
              target="_blank"
              class="
                active:text-primary-700
                font-medium
                text-primary-600
                hover:text-primary-800
                transition
                duration-150
                ease-in-out
              "
            >
              here.
            </a>
          </span>
        </div>
        <div>
          <span class="text-primary-900 text-lg font-semibold"
            >2. Select locations to tag to this document</span
          >
          <Table v-if="tableData.data.length" class="mt-2">
            <template #header>
              <tr>
                <th
                  v-for="(header, i) in tableData.header"
                  :key="i"
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    uppercase
                    tracking-wider
                  "
                >
                  <FormulateInput
                    v-if="header === 'toggle'"
                    type="checkbox"
                    @click.native="toggleAll()"
                  />
                  <span v-else>{{ header }}</span>
                </th>
              </tr>
            </template>
            <template #body>
              <tr
                v-for="(el, i) in tableData.data"
                :key="i"
                class="text-primary-800 text-sm font-medium"
                :class="el.documents.length ? 'opacity-60' : ''"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <FormulateInput
                    v-model="el.selected"
                    :disabled="el.documents.length >= 1"
                    type="checkbox"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ el.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">Assigned</td>
                <td class="px-6 py-4 whitespace-nowrap">Now</td>
                <td
                  v-if="el.documents.length"
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-sm
                    font-medium
                    text-gray-600
                    flex
                    space-x-2
                  "
                >
                  <WIconsBase icon="paper-clip" />
                  <span>Submitted</span>
                </td>
              </tr>
            </template>
          </Table>
          <div v-else class="mx-auto text-center">
            <WLoadingSpinner class="mx-auto" />
            <div class="mt-3 text-primary-600">Loading locations...</div>
          </div>
        </div>
        <div>
          <span class="text-primary-900 text-lg font-semibold"
            >3. Which requirement is the document fulfilling?</span
          >
          <FormulateInput
            v-model="formData.requirements"
            class="mt-2"
            :options="reqOptions"
            type="checkbox"
          />
        </div>
        <div>
          <span class="text-primary-900 text-lg font-semibold"
            >4. Select file to upload</span
          >
          <FileUploader v-model="formData.document" class="mt-2" />
        </div>
      </div>

      <div class="border-t py-4 grid grid-cols-2 items-center mt-4">
        <FormulateInput
          v-model="formData.isIntentStage"
          class="text-primary-900 text-sm"
          label="This is an intent-stage document"
          type="checkbox"
        />
        <WButtonsBase class="w-52 col-start-2 justify-self-end"
          >Submit Technical Document</WButtonsBase
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    currentVer: { type: Object, required: true },
  },
  data() {
    return {
      formData: {},
      verificationOptions: [],
      tableData: {
        header: ['toggle', 'LOCATION', 'STATUS', 'PURSUING', ''],
        data: [],
      },
      reqOptions: [
        {
          label:
            'a) PM2.5 less than or equal to 30% of the 24- or 48-hour average of outdoor levels on the day(s) of performance testing.',
          value: '1',
        },
        {
          label:
            'b) PM10 less than or equal to 30% of the 24- or 48-hour average of outdoor levels on the day(s) of performance testing.',
          value: '2',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
  },
  async mounted() {
    this.verificationOptions = this.part.subparts.map((el) => {
      return {
        label: this.getSubPartTitle(el),
        value: el.id,
      }
    })
    await this.getTodoList()
  },
  methods: {
    closeModal() {
      this.$parent.isHidden = true
    },
    toggleAll() {},
    getSubPartTitle(subpart) {
      let title = ''
      const spaceTypesInc = subpart.included
      if (spaceTypesInc.length !== 0) {
        if (spaceTypesInc.length === 1) {
          title += spaceTypesInc[0].name
        } else {
          title += spaceTypesInc[0].name
          for (let i = 1; i < spaceTypesInc.length; i++) {
            if (i === spaceTypesInc.length - 1) {
              title += ' & ' + spaceTypesInc[i].name
            } else {
              title += ', ' + spaceTypesInc[i].name
            }
          }
        }
      }
      return title + ''
    },
    async getTodoList() {
      try {
        const res = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/part/${this.part.id}/${this.currentVer.type}/${this.currentVer.id}/todo?all`
        )
        res.data.data.forEach((el) => (el.selected = false))
        this.tableData.data = res.data.data
      } catch (error) {}
    },
  },
}
</script>
