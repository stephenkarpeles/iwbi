<template>
  <div
    class="max-w-7xl top-25 rounded left-45 shadow-lg bg-white text-black"
    style="width: 50vw"
  >
    <div class="flex justify-between bg-primary-800 text-white p-4">
      <p class="text-xl font-bold">Email Logs</p>
      <WButtonsBase
        icon="x-circle"
        type="blank"
        class="self-start"
        @click.native="$parent.$parent.$refs.modal.isHidden = true"
      />
    </div>
    <div v-if="loading">
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Message Logs...</div>
      </div>
    </div>
    <div v-else>
      <div v-if="logs.length > 0" class="flex flex-col">
        <div class="overflow-auto w-full max-h-72">
          <div class="align-middle inline-block min-w-full">
            <div
              class="
                shadow
                overflow-hidden
                border-b border-gray-200
                sm:rounded-lg
              "
            >
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Projects
                    </th>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Recipients
                    </th>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Sent On
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(project, index) in normalizedSentLogData"
                    :key="index"
                    class="bg-gray-50"
                  >
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      <p>ID: {{ project.id }}</p>
                      <p>Name: {{ project.name }}</p>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <p v-for="(contact, i) in project.recipients" :key="i">
                        {{ contact.email }}
                      </p>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ project.status }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ project.date }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          v-show="logs.length === 0"
          class="bg-yellow-50 border-l-4 border-yellow-400 p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                class="h-5 w-5 text-yellow-400"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">No logs found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    logs: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    loading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      loadingLogs: true,
    }
  },
  computed: {
    normalizedSentLogData() {
      const data = []
      // for each log get receipients
      for (const log of this.logs) {
        for (const project of log.recipients) {
          const obj = {
            name: project.name,
            id: project.number,
            recipients: project.recipients,
            status: log.status.charAt(0).toUpperCase() + log.status.slice(1),
            date: this.$dayjs(log.updated_at).format('MMM DD, YYYY'),
          }
          data.push(obj)
        }
      }
      return data
    },
  },
}
</script>
