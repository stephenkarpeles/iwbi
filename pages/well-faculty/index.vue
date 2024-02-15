<template>
  <div>
    <div>
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="WELL Faculty" />
      </NavBreadcrumbs>
      <div class="relative bg-white rounded-lg shadow-md">
        <div class="lg:absolute lg:inset-0">
          <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              class="
                hidden
                lg:block
                h-56
                w-full
                object-cover
                lg:absolute lg:h-full
                rounded-r-lg
              "
              src="/well-faculty/bg-overlay.jpg"
              alt=""
            />
          </div>
        </div>
        <div
          class="
            relative
            py-8
            md:py-12
            px-4
            lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2
            border
            rounded-md
          "
        >
          <div class="lg:pr-8">
            <div class="max-w-sm mx-auto sm:max-w-xl lg:mx-0">
              <ClientOnly>
                <WHeadingsHTwo heading="About">
                  <div class="mt-3 text-base leading-6 text-gray-500">
                    WELL Faculty is a global network of credible, qualified
                    instructors, teachers, facilitators and practitioners with
                    deep expertise on a broad range of topics related to health,
                    wellness and the built environment.
                    <br />
                    <br />
                    WELL Faculty members play a leading role in our movement to
                    transform the places where we live, learn, work, play and
                    heal. Our Faculty possess the depth of knowledge and breadth
                    of experience that make them highly sought after presenters,
                    instructors and facilitators.
                  </div>
                </WHeadingsHTwo>
                <WStepsVertical
                  :steps="[
                    {
                      name: 'REGISTER',
                      status: registeredStatus,
                      link:
                        registeredStatus === 'complete'
                          ? '#'
                          : '/well-faculty/register',
                    },
                    {
                      name: 'SUBMIT FOR REVIEW',
                      status: submitStatus,
                      link:
                        submitStatus === 'current'
                          ? '/well-faculty/register'
                          : '#',
                    },
                    {
                      name: 'REVIEW RESULTS',
                      status: reviewStatus,
                      link:
                        reviewStatus === 'complete'
                          ? '#'
                          : '/well-faculty/register',
                    },
                    {
                      name: 'PAY INVOICE',
                      status: paymentStatus,
                      link:
                        paymentStatus === 'complete'
                          ? '#'
                          : '/well-faculty/invoice',
                    },
                  ]"
                />
                <div
                  class="md:flex flex-row md:space-x-4 space-y-2 md:space-y-0"
                >
                  <WButtonsBase @click.native="gotoNextStep">
                    Continue
                  </WButtonsBase>
                  <WButtonsBase
                    v-if="faculty && faculty.id"
                    type="primaryInverted"
                    icon="download"
                    @click.native="
                      $store.dispatch('faculty/downloadAgreement', {
                        token: $store.state.authentication.token,
                        id: faculty.id,
                      })
                    "
                  >
                    Download Agreement
                  </WButtonsBase>
                </div>
              </ClientOnly>
            </div>
          </div>
          <div class="lg:pl-8 flex">
            <div
              class="
                my-auto
                text-primary-700
                max-w-sm
                mx-auto
                sm:max-w-xl
                lg:mx-0
              "
            >
              <WHeadingsHTwo class="mt-12 lg:mt-0" heading="Eligibility">
                <div class="mt-3 text-base leading-6">
                  To apply as WELL Faculty, applicants must possess:
                </div>

                <ul class="list-disc mt-5 ml-5">
                  <li>
                    Unrivaled passion for delivering top-notch health and
                    wellness education
                  </li>
                  <li>A WELL AP credential, or equivalent</li>
                  <li>
                    Successful experiences delivering education related to human
                    health, wellness and the built environment
                  </li>
                  <li>
                    Excellent skills in public speaking, instruction and
                    facilitation
                  </li>
                </ul>

                <div class="mt-3 text-base leading-6">
                  Should you have questions about the qualifications we seek in
                  our Faculty members, please contact us directly at
                  <WLinksBase
                    target="_blank"
                    link="mailto:education@wellcertified.com"
                  >
                    education@wellcertified.com
                  </WLinksBase>
                  and we will guide you through the application process.
                </div>
              </WHeadingsHTwo>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<router>
{
    alias: [
        {
            path: '/well/faculty'
        }
    ]
}
</router>

<script>
export default {
  async asyncData({ store, redirect }) {
    await Promise.all([store.dispatch('faculty/getFaculty')])

    if (store.state.user.currentUser.well_faculty === 1) {
      redirect('/well-faculty/dashboard')
    }

    return {
      faculty: store.state.faculty.faculty,
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `Faculty`,
    }
  },
  computed: {
    registeredStatus() {
      if (this.faculty && Object.keys(this.faculty).length !== 0) {
        return 'complete'
      }
      return 'current'
    },
    submitStatus() {
      if (!this.faculty || !Object.keys(this.faculty).length) {
        return ''
      }
      if (this.faculty && this.faculty.is_draft === 1) {
        return 'current'
      }

      if (this.faculty && this.faculty.is_draft === 0) {
        return 'complete'
      }

      return 'current'
    },
    reviewStatus() {
      if (
        this.faculty.is_draft === 0 &&
        this.faculty.application_status !== 'approved'
      ) {
        return 'current'
      }

      if (this.faculty.application_status === 'approved') {
        return 'complete'
      }

      return ''
    },
    paymentStatus() {
      if (
        this.faculty.application_status === 'approved' &&
        this.faculty.invoices[0].status !== 'paid'
      ) {
        return 'current'
      }

      if (
        this.faculty.application_status === 'approved' &&
        (this.faculty.invoices[0].status === 'paid' ||
          this.faculty.invoices[0].status === 'waived')
      ) {
        return 'complete'
      }

      return ''
    },
  },
  methods: {
    gotoNextStep() {
      if (this.registeredStatus !== 'complete') {
        this.$router.push('/well-faculty/register')
      } else if (this.submitStatus === 'current') {
        this.$router.push('/well-faculty/register')
      }

      if (this.registeredStatus !== 'complete') {
        this.$router.push('/well-faculty/register')
      } else if (this.submitStatus !== 'complete') {
        this.$router.push('/well-faculty/register')
      } else if (this.reviewStatus !== 'complete') {
        this.$router.push('/well-faculty/register')
      } else if (this.paymentStatus !== 'complete') {
        this.$router.push('/well-faculty/invoice')
      } else {
        this.$router.push('/well-faculty/dashboard')
      }
    },
  },
}
</script>
