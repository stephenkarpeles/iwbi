<template>
  <div
    class="rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <svg
          x-description="Heroicon name: exclamation"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="mt-2 h-5 w-5 text-yellow-400"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <div class="ml-3">
        <div class="mt-2 text-sm leading-5 text-yellow-700">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
