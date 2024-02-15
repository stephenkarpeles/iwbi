<template>
  <div>
    <div class="bg-white overflow-hidden px">
      <div class="flex relative max-w-7xl mx-auto py-16 px-4 sm:px-6 px-8">
        <div class="sm:w-full md:w-3/5 md:mr-24">
          <h1
            class="
              my-12
              text-5xl
              leading-8
              font-extrabold
              tracking-tight
              text-gray-900
              sm:text-4xl sm:leading-10
            "
          >
            WELL Health-Safety<br />Pricing Estimator
          </h1>

          <div>
            <div class="text-base max-w-prose mx-auto max-w-none">
              <p class="leading-7 text-primary-900 mb-10 opacity-50">
                Find out the estimated cost of pursuing the WELL Health-Safety
                seal for your building, tenant space or portfolio. For
                high-volume/multi-use locations (major resorts, heavily
                trafficked airports, and large event venues, etc.) and other
                non-standard locations, please
                <a
                  class="text-primary-700"
                  href="mailto:healthsafety@wellcertified.com"
                >
                  contact us
                </a>
                for an estimate.
              </p>
              <p class="leading-7 text-primary-900 mb-10 opacity-50">
                This calculator produces an estimated fee based on your input
                and is for informational purposes only. By using this calculator
                and any tool on this website, you agree to our website
                <a
                  href="https://www.wellcertified.com/terms"
                  class="text-primary-400"
                  >Terms of Use</a
                >
                and
                <a
                  href="https://www.wellcertified.com/privacy"
                  class="text-primary-400"
                  >Privacy Policy</a
                >.
              </p>
              <div class="flex items-center mt-12 justify-center">
                <WButtonsBase
                  class="w-48"
                  @click.native="
                    $router.push('/shared-workspaces/estimator/create')
                  "
                >
                  Get Started
                </WButtonsBase>
              </div>
            </div>
          </div>
        </div>
        <div class="w-2/5 sm:hidden md:block">
          <div class="relative pb-7/12 pb-0">
            <img
              src="/pricing-calculator/brainstorm-meeting.png"
              alt=""
              class="
                object-cover object-center
                inset-0
                w-full
                h-auto
                max-w-full
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  head() {
    return {
      title: 'Pricing calculator',
    }
  },
}
</script>
