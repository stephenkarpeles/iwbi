<template>
  <div>
    <div v-if="tickets">
      <div class="overflow-x-scroll">
        <table
          v-if="currentScreen === 'list'"
          class="w-full divide-y divide-gray-200"
        >
          <thead>
            <tr>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                #
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Subject
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Created By
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(ticket, index) in tickets" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  @click="$parent.currentTicket = ticket"
                >
                  {{ ticket.id }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ ticket.subject }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ ticket.submitted_by }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ $dayjs(ticket.created_at).format('MMM DD, YYYY') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ ticket.status }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading submitted tickets...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentTicket: null,
      currentScreen: 'list',
    }
  },
  computed: {
    ...mapState({
      tickets: (state) => state.support.tickets,
      project: (state) => state.project.project,
    }),
  },
  async mounted() {
    if (
      this.$store.state.support.supportToken === null ||
      this.tickets === null
    ) {
      await this.$store.dispatch('support/getToken')
    }
    await this.$store.dispatch('support/getTickets', true)
    await this.$store.dispatch(
      'features/getAllFeaturesByVersionId',
      this.project.applicable_version_id
    )
  },
}
</script>
