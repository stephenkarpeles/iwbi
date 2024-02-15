<template>
  <div>
    <div class="bg-white px-4 py-5 sm:px-6">
      <div class="flex space-x-3">
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900">
            <img class="w-32" src="/logo/dark.svg" alt="" />
          </p>
          <div
            v-if="$config.supportMessage"
            v-html="$config.supportMessage"
          ></div>
          <div v-else class="text-sm text-gray-800 text-center">
            There are no active support announcements at this time.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  layout: 'blank',
}
</script>
