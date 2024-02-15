<template>
  <div>
    <div v-if="exam || exam === ''">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="WELL AP" />
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
              src="/well-ap/person.jpg"
              alt=""
            />
          </div>
        </div>
        <div
          class="
            relative
            py-4
            px-4
            xl:py-14
            lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2
            border
            rounded-md
          "
        >
          <div class="lg:pr-8">
            <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
              <WHeadingsHTwo
                heading="Take the leap"
                sub-heading="In just a few short months, the WELL AP credential will arm you
              with the skills and knowledge you need to tap into a rapidly
              expanding market - wellness."
              >
              </WHeadingsHTwo>
              <ClientOnly>
                <WStepsVertical
                  :steps="[
                    {
                      name: 'REGISTER HERE',
                      status: registeredStatus,
                      link: dashboardStatus ? '#' : '/well-ap/register',
                    },
                    {
                      name: 'MAKE THE COMMITMENT',
                      status: paymentStatus,
                      link: exam === '' ? '#' : '/well-ap/invoice',
                    },
                    {
                      name: 'EXAM DASHBOARD',
                      status: dashboardStatus,
                      link: dashboardStatus ? '/well-ap/dashboard' : '#',
                    },
                  ]"
                />
              </ClientOnly>
              <WButtonsBase @click.native="gotoNextStep">
                Continue
              </WButtonsBase>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading WELL AP...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState: mapExamState, mapActions: mapExamActions } =
  createNamespacedHelpers('exam')

export default {
  asyncData({ store, redirect }) {
    if (store.state.user.currentUser.well_ap === 1) {
      redirect('/well-ap/credentials')
    }
    return {
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `WELL AP`,
    }
  },
  computed: {
    ...mapExamState(['exam', 'allExams']),
    registeredStatus() {
      if (this.exam !== '' && this.exam != null) {
        return 'complete'
      }
      return 'current'
    },
    examStatus() {
      if (this.exam !== '' && this.exam.created_at) {
        return 'complete'
      }
      if (this.exam !== '' && !this.exam.created_at) {
        return 'current'
      }
      return ''
    },
    paymentStatus() {
      if (this.exam && this.exam.invoices.length > 0) {
        if (
          this.exam.invoices &&
          (this.exam.invoices[0].status === 'paid' ||
            this.exam.invoices[0].status === 'waived')
        ) {
          return 'complete'
        }
        if (
          this.exam.invoices &&
          this.exam.invoices[0].status === 'unpaid' &&
          this.registeredStatus === 'complete'
        ) {
          return 'current'
        }
      }
      return ''
    },
    dashboardStatus() {
      if (this.exam && this.exam.invoices.length > 0) {
        if (
          this.exam.invoices &&
          (this.exam.invoices[0].status === 'paid' ||
            this.exam.invoices[0].status === 'waived')
        ) {
          return 'current'
        }
      }
      return ''
    },
    examType() {
      if (this.exam.bought_in_bundle === 0) {
        return 'WELL AP exam'
      }
      if (this.exam.bought_in_bundle === 1) {
        return 'WELL AP exam preparation bundle'
      }
      return ''
    },
  },
  async created() {
    return await this.getExams().catch((error) => (this.error = error))
  },
  methods: {
    ...mapExamActions(['getExams']),
    gotoNextStep() {
      if (this.registeredStatus !== 'complete') {
        this.$router.push('/well-ap/register')
      } else if (this.paymentStatus !== 'complete') {
        if (this.allExams[0].invoices.length > 0) {
          this.$router.push('/well-ap/invoice')
        } else {
          this.$router.push('/well-ap/register')
        }
      } else {
        this.$router.push('/well-ap/dashboard')
      }
    },
  },
}
</script>
