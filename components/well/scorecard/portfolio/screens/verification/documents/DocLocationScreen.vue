<template>
  <div
    class="lg:max-h-96 lg:h-[600px] overflow-x-auto overflow-y-auto pr-2 mb-8"
  >
    <Table>
      <template #header>
        <tr class="text-white uppercase text-sm">
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            Locations
          </th>
        </tr>
      </template>
      <template #body>
        <tr v-for="(el, i) in locations" :key="i">
          <td class="whitespace-nowrap font-medium text-primary-900 px-6 py-4">
            {{ el.name }}
          </td>
        </tr>
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  props: {
    locations: {
      type: Array,
      required: true,
    },
  },
}
</script>
