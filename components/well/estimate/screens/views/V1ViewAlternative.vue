<template>
  <div class="bg-gray-100 bg-opacity-75 p-8">
    <div class="bg-white px-10">
      <div class="pt-10 flex">
        <div class="w-1/2">
          <h3>
            <small class="text-gray-600"
              >WELL Estimate #{{ estimate.estimate.id }}</small
            >
          </h3>
          <h1 class="font-medium leading-tight">
            <span class="text-xl">{{ estimate.estimate.name }}</span
            ><br />
            <span class="text-2xl">{{ estimate.estimate.organization }}</span
            ><br />
          </h1>
          <span class="text-base font-light pb-12 text-gray-600">
            {{ estimate.estimate.country_name }}
          </span>
        </div>

        <div class="w-1/2">
          <img src="/logo/full.png" alt="" class="w-28 ml-auto" />
          <span class="mt-2.5 float-right text-gray-600 font-light">
            220 Fifth Avenue, Floor #8<br />
            New York, NY 10001, USA<br />
          </span>
        </div>
      </div>
      <div class="my-10">
        <span class="text-gray-600 font-light">
          Thank you for reviewing the customized fees estimate for your WELL
          Community project.
        </span>
      </div>

      <div class="mb-10">
        <div v-if="isCommunity">
          <h3 class="mb-2 text-xl text-gray-600">
            {{ estimate.estimate.projects[0].name }} (WELL Community) -
            {{ formatNumbers(estimate.estimate.total_area) }} acres
          </h3>
          <table class="table-auto mb-7.5 w-full">
            <tr style="border-top: 1px solid #dee2e6">
              <th
                class="text-left p-3 text-gray-600"
                style="border-top: 1px solid #dee2e6"
              >
                Item
              </th>
              <th class="text-right p-3 text-gray-600">Offered price</th>
            </tr>
            <tr style="border-top: 1px solid #dee2e6">
              <td class="p-3 font-light text-base text-gray-600" align="left">
                Registration
              </td>
              <td class="p-3 font-light text-base text-gray-600" align="right">
                ${{ formatNumbers(estimate.estimate.reg_fees) }} USD
              </td>
            </tr>
            <tr style="border-top: 1px solid #dee2e6">
              <td>
                <span class="p-3 font-light text-base text-gray-600">
                  WELL Certification Program and Support
                </span>
              </td>
              <th class="p-3 text-right text-gray-600">
                ${{ formatNumbers(estimate.estimate.bundle_fees) }} USD
              </th>
            </tr>
            <tr style="border-top: 1px solid #dee2e6">
              <th class="p-3 text-gray-600" align="right">Total</th>
              <th
                class="text-right text-white p-3 bg-black"
                align="right"
                style="border-bottom: 1px solid white"
              >
                ${{
                  formatNumbers(
                    estimate.estimate.bundle_fees + estimate.estimate.reg_fees
                  )
                }}
                USD
              </th>
            </tr>
          </table>

          <h5 class="text-xl mb-2 font-medium">Payment terms</h5>

          <ul class="list-disc pl-10 font-light text-gray-600 text-sm">
            <li>
              $20,000 registration fee for WELL Community is due at registration
              with IWBI.
            </li>
            <li>
              Certification fees for buildings follow the same schedule as
              standard pricing as provided on the pricing page of
              wellcertified.com.
            </li>
            <li>
              50% of the fees for WELL Community certification (per acre charges
              for all phases) is due upon submission of documents for Design
              Verification. The remaining 50% is due upon the submission of
              documentation for Performance Verification.
            </li>
            <li>
              This fee estimate is subject to change. Please check the IWBI
              website for the most current WELL fee schedule
            </li>
            <li>
              In addition to the fees, IWBI will collect applicable sales or use
              taxes, if any, as required by law.
            </li>
            <li>
              The fees listed above also do not include fees for optional
              services, such as the review of requests for alternative
              compliance paths or innovation features, the review and approval
              of curative action plans, or the undertaking of appeal.
            </li>

            <li>
              For any further questions, please contact technical solutions
              <a
                class="text-primary-500"
                href="mailto:'WELLCommunity@WELLCertified.com'"
                >WELLCommunity@WELLCertified.com</a
              >
            </li>
            <li>
              WELL Community pricing and the other terms provided herein are
              subject to you accepting and executing a WELL Certification
              agreement governing your projects.
            </li>
            <li>
              <b>Existing communities</b> are required to certify at least one
              building under an approved health and wellness building
              certification. For a list of preapproved health and wellness
              rating systems, see
              <a
                class="text-primary-500"
                href="https://v2.wellcertified.com/resources/preapproved-programs"
                target="_blank"
                >this page</a
              >. Projects interested in pursuing WELL Certification to fulfill
              this requirement may refer to the v2 pricing calculator for a
              building estimate.
            </li>
            <li>
              For <b>new developments</b>, health and wellness certified
              buildings must represent at least 15% of total buildings. For more
              information about this requirement, including the process for
              seeking an exemption, see the WELL Community Standard “Certified
              Buildings” section. For a list of preapproved health and wellness
              rating systems, see
              <a
                class="text-primary-500"
                href="https://v2.wellcertified.com/resources/preapproved-programs"
                target="_blank"
                >this page</a
              >. Projects interested in pursuing WELL Certification to fulfill
              this requirement may refer to the v2 pricing calculator for a
              building estimate.
            </li>
          </ul>
        </div>
        <div v-else>
          <h3 class="mb-2 text-3xl text-gray-600">
            Fee Summary - {{ estimate.estimate.total_area }} sq ft
          </h3>
          <table class="table-auto mb-7.5">
            <thead>
              <tr style="border-top: 1px solid #dee2e6">
                <th
                  class="text-left p-3 text-gray-600"
                  style="border-top: 1px solid #dee2e6"
                >
                  Item
                </th>
                <th class="text-right p-3 text-gray-600">Price</th>
              </tr>
            </thead>
            <tr style="border-top: 1px solid #dee2e6">
              <td class="p-3 font-light text-base text-gray-600" align="left">
                Registration
              </td>
              <td class="p-3 font-light text-base text-gray-600" align="right">
                ${{ formatNumbers(estimate.estimate.reg_fees) }}
                USD
              </td>
            </tr>
            <tr style="border-top: 1px solid #dee2e6">
              <td class="flex flex-col p-3 text-gray-600">
                <span class="font-light text-base">
                  WELL Certification Program and Support
                </span>
                <span class="font-light text-sm mt-2">includes:</span>
                <ul class="list-disc list-inside pl-4 font-light text-sm">
                  <li>WELL coaching contact and support</li>
                  <li>Documentation review</li>
                  <li>On-site evaluation & testing</li>
                  <li>Performance verification* & certification</li>
                  <li>Comprehensive marketing & public relations support</li>
                </ul>
                <span class="font-light text-xs my-2">
                  *Performance verification is not included for the WELL
                  Community Standard. Please contact
                  wellcommunity@wellcertified.com for any questions.
                </span>
              </td>
              <td class="p-3 font-light text-base text-gray-600" align="right">
                <span>
                  ${{ formatNumbers(estimate.estimate.bundle_fees) }} USD
                </span>
              </td>
            </tr>
            <tr style="border-top: 1px solid #dee2e6">
              <td class="p-3 text-gray-600" colspan="1" align="right">
                Total (without precertification)
              </td>
              <td
                class="text-right text-white p-3 bg-black"
                align="right"
                style="border-bottom: 1px solid white"
              >
                ${{
                  formatNumbers(
                    estimate.estimate.reg_fees + estimate.estimate.bundle_fees
                  )
                }}
                USD
              </td>
            </tr>
            <tr style="border-top: 1px solid #dee2e6">
              <td class="p-3 text-gray-600" colspan="1" align="left">
                Due upon request for precertification (optional)
              </td>
              <td
                class="text-right text-white p-3 text-gray-600"
                align="right"
                style="border-bottom: 1px solid white"
              >
                ${{ formatNumbers(estimate.estimate.pre_cert_fees) }}
                USD
              </td>
            </tr>
            <tr style="border-top: 1px solid #dee2e6">
              <td
                class="text-right p-3 text-gray-600"
                colspan="1"
                align="right"
              >
                Total (with precertification)
              </td>
              <td
                class="text-right text-white p-3 bg-gray-700"
                align="right"
                style="border-bottom: 1px solid white"
              >
                ${{
                  formatNumbers(
                    estimate.estimate.reg_fees +
                      estimate.estimate.bundle_fees +
                      estimate.estimate.pre_cert_fees
                  )
                }}
                USD
              </td>
            </tr>
          </table>
        </div>

        <div class="text-center font-bold text-gray-700 mt-8">
          <span
            ><strong
              >This estimate was generated on
              {{ $dayjs(estimate.estimate.created_at).format('MMM DD, YYYY') }}
              and is valid until
              {{ $dayjs(estimate.estimate.exp_date).format('MMM DD, YYYY')
              }}<br /></strong></span
          ><br /><br />
        </div>
        <div class="pl-10 pr-12 pb-8" style="font-size: 12.8px">
          <p class="text-gray-600 leading-6">
            The WELL Building Standard is administered by the International WELL
            Building Institute™, pbc (IWBI), a public benefit corporation whose
            mission is to improve human health and wellbeing through the built
            environment. The Green Business Certification Inc. (GBCI) manages
            and administers third-party certification for the WELL Building
            Standard.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    estimate: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isCommunity() {
      if (this.estimate.estimate.projects[0].type === 'community') return true
      return false
    },
  },

  methods: {
    formatNumbers(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>
