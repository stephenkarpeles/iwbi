<template>
  <div class="flex flex-wrap px-10 py-5">
    <div v-if="project.v1_project_standard !== 'allprojectsin'" class="w-full">
      <WHeadingsHThree heading="WELL Project Fee Schedule" />
      <div v-if="estimate" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div
          class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 my-5"
        >
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-md text-semibold text-gray-900">
                      Registration:
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ wellStandardList[project.v1_project_standard] }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="text-md font-medium text-gray-900">
                      ${{ estimate.estimate.reg_fees | currency(0) }} USD
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-md text-semibold text-gray-900">
                      WELL Certification Program and Support
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="text-md font-medium text-gray-900">
                      ${{
                        estimate.estimate.discountedBundlePrice
                          ? estimate.estimate.discountedBundlePrice
                          : estimate.estimate.bundle_fees | currency(0)
                      }}
                      USD
                    </div>
                  </td>
                </tr>
                <tr v-if="project.v1_project_standard !== 'community'">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-medium text-gray-500 pl-4">
                      Due upon submission of documentation for review in WELL
                      Online
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="text-sm font-medium text-gray-500">
                      ${{ estimate.estimate.doc_review_fees | currency(0) }}
                      USD
                    </div>
                  </td>
                </tr>
                <tr v-if="project.v1_project_standard !== 'community'">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-medium text-gray-500 pl-4">
                      Due upon request for Performance Verification scheduling
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="text-sm font-medium text-gray-500">
                      ${{ estimate.estimate.pv_fees | currency(0) }}
                      USD
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-md text-semibold text-gray-900 text-right">
                      Total
                      <span v-if="project.v1_project_standard !== 'community'"
                        >(without precertification)</span
                      >
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right bg-gray-600"
                  >
                    <div class="text-md font-medium text-white">
                      ${{
                        (estimate.estimate.bundle_fees +
                          estimate.estimate.reg_fees)
                          | currency(0)
                      }}
                      USD
                    </div>
                  </td>
                </tr>
                <tr v-if="project.v1_project_standard !== 'community'">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-medium text-gray-500 pl-4">
                      Due upon request for precertification (<i>optional</i>)
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="text-sm font-medium text-gray-500">
                      ${{
                        estimate.estimate.pre_cert_fees
                          ? estimate.estimate.pre_cert_fees
                          : 10000 | currency(0)
                      }}
                      USD
                    </div>
                  </td>
                </tr>
                <tr v-if="project.v1_project_standard !== 'community'">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-md text-semibold text-gray-900 text-right">
                      Total (with precertification)
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right bg-gray-600"
                  >
                    <div class="text-md font-medium text-white">
                      ${{
                        (estimate.estimate.bundle_fees +
                          estimate.estimate.reg_fees +
                          estimate.estimate.pre_cert_fees)
                          | currency(0)
                      }}
                      USD
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="
              currentUser.role.includes('well-admin') &&
              (estimate.sino_dis ||
                estimate.volume_dis ||
                estimate.mbr_dis ||
                estimate.estimate.membership)
            "
            class="rounded-md bg-blue-50 p-4 mt-2"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p
                  v-if="estimate.estimate.membership !== null"
                  class="text-sm text-blue-700"
                >
                  The project pricing above is inclusive of a
                  {{ estimate.estimate.membership }} membership discount ({{
                    estimate.estimate.mem_reg_discount
                  }}%).
                </p>
                <p v-if="estimate.sino_dis" class="text-sm text-blue-700">
                  The project pricing above is inclusive of a Sino Ocean project
                  discount.
                </p>
                <p v-if="estimate.volume_dis" class="text-sm text-blue-700">
                  The project pricing above is inclusive of a volume
                  discount.<br />
                  <strong>Registration Discount: </strong
                  >{{ estimate.volume_dis_reg }}%<br />
                  <strong>Certification Discount: </strong
                  >{{ estimate.volume_dis_cert }}%
                </p>
                <p v-if="estimate.mbr_dis" class="text-sm text-blue-700">
                  The project pricing above is inclusive of a Multiple Buildings
                  Program discount.
                </p>
              </div>
            </div>
          </div>
          <div v-if="isChinaProject" class="flex my-3">
            <WButtonsBase
              type="primary"
              icon="download"
              @click.native="downloadCoA(0)"
            >
              Confirmation Agreement
            </WButtonsBase>
            <WButtonsBase
              class="ml-5"
              type="primary"
              icon="download"
              @click.native="downloadCoA(1)"
            >
              Confirmation Agreement (with precert)
            </WButtonsBase>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="invoices.length === 0"
      class="rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300 w-full"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="mt-3 h-5 w-5 text-yellow-400"
            x-description="Heroicon name: exclamation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
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
            <p>No invoices can be found!</p>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full mb-5">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="Billing" class="mt-5" />
        <template #actions>
          <div v-if="currentUser.role.includes('well-admin')" class="mt-5">
            <WButtonsDropdown
              v-if="project.v1_project_standard !== 'allprojectsin'"
            >
              <WButtonsBase type="primaryInverted" icon="plus">
                Project Invoice
              </WButtonsBase>
              <template #customButtons>
                <WButtonsBase
                  type="neutral"
                  @click.native="createCustomInvoice()"
                >
                  Create New Invoice
                </WButtonsBase>
                <WButtonsBase
                  v-if="!hasInvoiceofType('documentation-submission')"
                  type="neutral"
                  @click.native="
                    $store.dispatch(
                      'project/createV1Invoice',
                      'documentation-submission'
                    )
                  "
                >
                  Documentation Review
                </WButtonsBase>
                <WButtonsBase
                  v-if="
                    !hasInvoiceofType('do-submission') &&
                    !hasInvoiceofType('precertification')
                  "
                  type="neutral"
                  @click.native="
                    $store.dispatch(
                      'project/createV1Invoice',
                      'precertification'
                    )
                  "
                >
                  Precertification Review
                </WButtonsBase>
                <WButtonsBase
                  v-if="
                    !hasInvoiceofType('pv') &&
                    project.v1_project_standard !== 'community'
                  "
                  type="neutral"
                  @click.native="
                    $store.dispatch('project/createV1Invoice', 'pv')
                  "
                >
                  Performance Verification
                </WButtonsBase>
                <WButtonsBase
                  type="neutral"
                  @click.native="
                    $store.dispatch(
                      'project/createReviewInvoice',
                      'curative-action'
                    )
                  "
                >
                  Curative Action
                </WButtonsBase>
                <WButtonsBase
                  type="neutral"
                  @click.native="
                    $store.dispatch(
                      'project/createReviewInvoice',
                      'appeal-review'
                    )
                  "
                >
                  Appeal Review
                </WButtonsBase>
              </template>
            </WButtonsDropdown>
          </div>
        </template>
      </NavBreadcrumbs>
      <div class="space-y-4">
        <div v-for="(invoice, index) in invoices" :key="index">
          <InvoiceCard
            :invoice="invoice"
            :redirect="`/projects/${project.type}/${project.project_number}/billing`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    invoices: {
      type: Array,
      required: true,
    },
    estimate: {
      type: Object,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      wellStandardList: {
        office: 'WELL Building Standard for Commercial & Institutional Office',
        residential:
          'WELL Building Standard for Multifamily Residential (Pilot)',
        retail: 'WELL Building Standard for Retail (Pilot)',
        education: 'WELL Building Standard for Educational Facilities (Pilot)',
        restaurant: 'WELL Building Standard for Restaurants (Pilot)',
        community: 'WELL Community',
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    isChinaProject() {
      for (let i = 0; i < this.project.addresses.length; i++) {
        if (
          this.project.addresses[i].country_code === 'CN' ||
          this.project.addresses[i].country_code === 'HK' ||
          this.project.addresses[i].country_code === 'MO'
        ) {
          return true
        }
      }
      return false
    },
  },
  methods: {
    downloadCoA(val) {
      this.$store
        .dispatch('project/downloadCoA', {
          project_id: this.project.id,
          pre_cert_fees: val,
        })
        .then((res) => {
          window.open(res.data.url, '_blank')
        })
    },
    hasInvoiceofType(type) {
      const index = this.invoices.findIndex(
        (a) => a.invoicable_sub_part === type
      )
      if (index !== -1) {
        return true
      } else {
        return false
      }
    },
    createCustomInvoice() {
      const data = {
        country_code: this.project.addresses[0].country_code,
        state: this.project.addresses[0].state,
        city: this.project.addresses[0].city,
        street: this.project.addresses[0].street,
        postal_code: this.project.addresses[0].postal_code,
        name: this.project.owner_name,
        email: this.project.owner_email,
        organization: this.project.owner_org,
        project_id: this.project.id,
      }
      this.$router.push({ path: `/well-admin/invoices/create`, query: data })
    },
  },
}
</script>
