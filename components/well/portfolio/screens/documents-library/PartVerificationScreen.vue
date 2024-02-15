<template>
  <div v-if="tableData.data && tableData.data.data.length">
    <Table>
      <template slot="header">
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
            {{ header }}
          </th>
        </tr>
      </template>
      <template slot="body">
        <tr
          v-for="(el, i) in tableData.data.data"
          :key="i"
          class="text-primary-800 text-sm font-medium"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            {{ el.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ getSubPartTitle(el.sc_part) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ el.sc_part.option_name || '---' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div v-if="el.documents.length" class="flex">
              <WIconsBase icon="check-circle-solid" class="text-green-500" />
              <WLinksBase
                class="underline"
                :link="el.documents[0].url"
                target="_blank"
              >
                {{ el.documents[0].name }}
              </WLinksBase>
            </div>
            <div v-else>---</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ el.documents.length ? el.documents[0].stage : '---' }}
          </td>
        </tr>
      </template>
    </Table>
    <FormInputsPagination
      class="border-none"
      :pagination="tableData.data"
      :offset="3"
      @paginate="getTodoList()"
    />
  </div>
  <div v-else class="w-full p-4 bg-primary-100 rounded-md border mt-2">
    <span class="text-primary-700">No items to display...</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  inject: ['getType'],
  props: {
    verif: {
      type: Object,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tableData: {
        header: [
          'location',
          'sub part',
          'option',
          'document',
          'document stage',
        ],
        data: null,
      },
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
    type() {
      return this.getType()
    },
  },
  watch: {
    async type(newVal) {
      await this.getTodoList()
    },
  },
  async mounted() {
    await this.getTodoList()
  },
  methods: {
    async getTodoList() {
      try {
        const res = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/part/${this.part.id}/${
            this.verif.type
          }/${this.verif.id}/todo?${this.type}&per_page=5&page=${
            this.tableData.data ? this.tableData.data.current_page : '1'
          }`
        )
        this.tableData.data = res.data
      } catch (error) {}
    },
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
  },
}
</script>
