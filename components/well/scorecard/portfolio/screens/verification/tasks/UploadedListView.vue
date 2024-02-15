<template>
  <div>
    <div v-if="completedList.data.length">
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
          <tr v-for="(loc, index) in completedList.data" :key="index">
            <td class="whitespace-nowrap font-medium px-6 py-4">
              <div class="flex items-center space-x-2">
                <WIconsBase class="text-green-500" icon="check-circle-solid" />
                <span class="text-primary-700"> {{ loc.name }} </span>
              </div>
            </td>
            <td class="whitespace-nowrap font-medium px-6 py-4 flex">
              <span class="text-gray-500"> fulfilled by </span>
              <div class="flex items-center space-x-2">
                <WIconsBase icon="paper-clip" />
                <WLinksBase :link="loc.documents[0].url" target="_blank">
                  {{ loc.documents[0].name }}
                </WLinksBase>
              </div>
            </td>
          </tr>
        </template>
      </Table>
      <FormInputsPagination
        class="border-none"
        :pagination="completedList"
        :offset="3"
        @paginate="$parent.getToDoList(true)"
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
    completedList: {
      type: Object,
      required: true,
    },
  },
}
</script>
