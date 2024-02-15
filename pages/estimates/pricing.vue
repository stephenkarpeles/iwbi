<template>
  <div>
    <WHeadingsHTwo
      class="text-center text-primary-800"
      heading="Choose the best standard for your project"
    />
    <div class="space-y-4 mt-12">
      <div
        class="text-gray-600 border border-primary-500 rounded-lg max-w-lg mx-auto bg-gray-50 px-4 py-2 shadow-md"
      >
        <WHeadingsHThree
          class="text-center text-primary-800"
          heading="WELL v2"
        />
        <div>
          Launced in 2020, the latest version of the WELL Building Standard -
          WELL v2. The newly graduated standard is the most resilient and
          responsive version of IWBI's rating system to date.
        </div>

        <WButtonsBase
          type="primary"
          class="mt-5 mb-2"
          @click.native="$router.push('/estimates/create/v2')"
        >
          Get WELL v2 Quote
        </WButtonsBase>
      </div>
      <div
        class="text-gray-600 border border-primary-200 rounded-lg max-w-lg mx-auto bg-gray-50 px-4 py-2 shadow-md"
      >
        <WHeadingsHThree
          class="text-center text-primary-800"
          heading="WELL Community"
        />
        <div>
          Launced in 2014, our original version of the WELL Building Standard
          helped the global community apply the principles of health to their
          spaces.
        </div>
        <WButtonsBase
          type="primaryInverted"
          class="mt-5 mb-2"
          @click.native="$router.push('/estimates/create/v1')"
        >
          Get WELL Community Quote
        </WButtonsBase>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
}
</script>
