<template>
  <div>
    <div v-if="list.data.length">
      <Table>
        <template #header>
          <tr class="text-white uppercase text-sm">
            <th scope="col" class="px-6 py-3 text-left tracking-wider">
              Locations
            </th>
            <th scope="col" class="px-6 py-3 text-left tracking-wider"></th>
          </tr>
        </template>
        <template #body>
          <tr v-for="(el, i) in list.data" :key="i">
            <td
              class="whitespace-nowrap font-medium text-primary-700 px-6 py-4"
            >
              {{ el.name }}
            </td>
            <td
              class="whitespace-nowrap font-medium text-gray-500 text-right px-6 py-4"
            >
              Achieved
            </td>
          </tr>
        </template>
      </Table>
      <FormInputsPagination
        class="border-none"
        :pagination="list"
        :offset="3"
        @paginate="$parent.getToDoList()"
      />
    </div>
    <div v-else class="text-primary-700 flex flex-col items-center my-auto">
      <WIconsBase class="font-semibold w-10 h-10" icon="office-building" />
      <span class="text-lg">No locations to show</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>
