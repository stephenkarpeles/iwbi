<template>
  <div id="my-app">
    <div v-if="error.statusCode === 404" class="flex">
      <div class="w-1/2 flex">
        <div class="my-auto mx-auto text-center text-primary-800">
          <div class="text-6xl font-black">404</div>
          <div class="text-2xl mt-2">Page Not Found</div>
          <div class="mt-2">
            Sorry, we couldn’t find the page you were looking for.
          </div>
          <div class="mx-auto flex">
            <WLinksBase
              icon-position="right"
              icon="arrow-narrow-right"
              class="mx-auto text-center"
              link="/"
            >
              Return to Home
            </WLinksBase>
          </div>
        </div>
      </div>
      <div class="w-1/2 text-center">
        <img src="/error/404.png" />
      </div>
    </div>
    <div v-else-if="error.statusCode === 403" class="flex">
      <div class="w-1/2 flex">
        <div class="my-auto mx-auto text-center text-primary-800">
          <div class="text-6xl font-black">403</div>
          <div class="text-2xl mt-2">Forbidden</div>
          <div class="mt-2">
            Sorry, it looks like you don’t have permission to access this page.
          </div>
          <div class="mx-auto flex">
            <WLinksBase
              icon-position="right"
              icon="arrow-narrow-right"
              class="mx-auto text-center"
              link="/"
            >
              Return to Home
            </WLinksBase>
          </div>
        </div>
      </div>
      <div class="w-1/2 text-center">
        <img src="/error/403.png" />
      </div>
    </div>
    <div v-else class="flex">
      <div class="w-1/2 flex">
        <div class="my-auto mx-auto text-center text-primary-800">
          <div class="text-6xl font-black">Oops!</div>
          <div class="text-2xl mt-2">Something went wrong</div>
          <div class="mt-2">
            Something unexpected has occured. Please contact support.
          </div>
          <div class="mx-auto flex">
            <WLinksBase
              icon-position="right"
              icon="arrow-narrow-right"
              class="mx-auto text-center"
              link="/"
            >
              Return to Home
            </WLinksBase>
          </div>
        </div>
      </div>
      <div class="w-1/2 text-center">
        <img src="/error/404.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: false,
      default: null,
    },
  },
  layout: 'error',
}
</script>
