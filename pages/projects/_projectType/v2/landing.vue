<template>
  <div>
    <div class="">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="Start a Project" />
      </NavBreadcrumbs>

      <div
        class="relative bg-white rounded-lg shadow-md border-primary-200 border rounded-lg"
      >
        <div class="bg-white overflow-hidden">
          <div class="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div
              class="hidden lg:block bg-gray-50 absolute top-0 bottom-0 left-3/4 w-screen"
            ></div>
            <div class="mx-auto text-base max-w-prose lg:max-w-none">
              <p
                class="text-base leading-6 text-primary-600 font-semibold tracking-wide uppercase"
              >
                MEET WELL v2
              </p>
              <h1
                class="mt-2 mb-8 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10"
              >
                Dynamic. Resilient. Validated.
              </h1>
            </div>
            <div class="lg:grid lg:grid-cols-2 lg:gap-8">
              <div class="relative mb-8 lg:mb-0 lg:row-start-1 lg:col-start-2">
                <div
                  class="md:-mt-28 relative text-base mx-auto max-w-prose lg:max-w-none"
                >
                  <figure>
                    <div class="relative pb-7/12 lg:pb-0">
                      <img
                        src="/projects/v2/WELLV2-SQUARE.png"
                        alt=""
                        width="1184"
                        height="1376"
                        class="rounded-lg shadow-lg object-cover object-center absolute inset-0 w-full h-full lg:static lg:h-auto"
                      />
                    </div>
                  </figure>
                </div>
              </div>
              <div>
                <div class="text-base max-w-prose mx-auto lg:max-w-none">
                  <p class="leading-7 text-primary-900 mb-5">
                    WELL v2 is the most rigorously tested and vetted version of
                    the WELL Building Standard (WELL) to date, making it the
                    premier framework for advancing health and well-being around
                    the world.
                  </p>
                  <p class="leading-7 text-primary-900 mb-5">
                    The WELL Building Standard is a vehicle for buildings and
                    organizations to deliver more thoughtful and intentional
                    spaces that enhance human health and well-being. Backed by
                    the latest scientific research, WELL includes strategies
                    that aim to advance health by setting performance standards
                    for design interventions, operational protocols and policies
                    and a commitment to fostering a culture of health and
                    wellness. Built on the pioneering foundation of the first
                    version of the WELL Building Standard (WELL v1), WELL v2
                    draws expertise from thousands of WELL users, practitioners,
                    medical professionals, public health experts and building
                    scientists around the world.
                  </p>
                  <WButtonsBase
                    data-id="continue-btn"
                    @click.native="$router.push('/projects/v2/create')"
                    >Continue</WButtonsBase
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: `Certification`,
    }
  },
}
</script>
