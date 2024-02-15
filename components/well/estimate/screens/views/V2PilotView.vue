<template>
  <div
    class="
      bg-white
      ml-0
      md:ml-10
      pt-5
      md:pt-14 md:pl-10
      mr-0
      md:mr-10
      px-5
      md:px-0
      pb-10
      md:pb-0
    "
  >
    <h2 class="text-2xl md:text-3xl mb-2 font-museo-slab font-semibold">
      YOUR WELL INVESTMENT
    </h2>
    <p class="mb-4 text-lg font-light">
      Health and well-being begins at {{ estimate.projects[0].name }}.
    </p>
    <p class="text-lg mb-4 font-light">
      Join the WELL movement and network of leadership organizations that are
      leveraging WELL to advance human health through better buildings.
    </p>
    <div class="mt-10">
      <div class="mb-4 mt-5 font-light">
        <h3 class="text-2xl">Fee estimate for WELL Certification</h3>
        <div class="font-bold">Your WELL v2 pilot project:</div>
        <div>
          <strong> {{ estimate.projects[0].name }} </strong>
          <span v-if="estimate.projects[0].typeFull">
            ({{ estimate.projects[0].typeFull }})
          </span>
          ({{ estimate.summary.totalArea }} sq ft),
          {{ estimate.countryFullName }}
        </div>
      </div>
    </div>
    <div class="overflow-x-scroll md:overflow-hidden">
      <table class="bg-gray-100 bg-opacity-75 table-auto mr-10">
        <thead>
          <tr>
            <th></th>
            <th class="text-xs py-4 border-b p-4" colspan="3">
              AVAILABLE PRICING OPTIONS
            </th>
          </tr>
          <tr>
            <th
              class="text-left pl-4 font-light text-sm p-4"
              style="width: 50%"
              valign="bottom"
            >
              ITEM
            </th>

            <th class="text-right font-bold text-sm p-4" valign="bottom">
              SINGLE CYCLE
            </th>

            <th class="text-right font-bold text-sm p-4" valign="bottom">
              <small class="font-light">3-YEAR</small>
              <div>SUBSCRIPTION</div>
            </th>

            <th class="text-right font-bold text-sm p-4" valign="bottom">
              <small class="font-light">5-YEAR</small>
              <div>SUBSCRIPTION</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style="width: 40%">
            <td
              class="p-4 bg-gray-100 bg-opacity-75 pl-4"
              style="vertical-align: middle; border: 2px solid #ffffff"
            >
              <strong>Registration</strong>
              <div v-if="estimate.reg_discount !== 0">
                Discount: {{ estimate.reg_discount }}%
              </div>
            </td>
            <td
              class="p-4 bg-white"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div
                v-if="
                  estimate.summary.totalRegistrationAmount !==
                  estimate.summary.totalRegAmountAfterDis
                "
                class="line-through text-sm text-gray-400 text-right"
              >
                ${{ estimate.summary.totalRegistrationAmount }} USD
              </div>
              <div class="text-right">
                ${{ estimate.summary.totalRegAmountAfterDis }} USD
              </div>
            </td>
            <td
              v-if="estimate.summary.subscription['term-3']"
              class="p-4 bg-white"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div
                v-if="
                  estimate.summary.subscription['term-3'].regTotalAmount !==
                  estimate.summary.subscription['term-3'].regTotalAfterDis
                "
                class="line-through text-sm text-gray-400 text-right"
              >
                ${{ estimate.summary.subscription['term-3'].regTotalAmount }}
                USD
              </div>
              <div class="text-right">
                ${{ estimate.summary.subscription['term-3'].regTotalAfterDis }}
                USD
              </div>
            </td>
            <td
              v-if="estimate.summary.subscription['term-5']"
              class="p-4 bg-white"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div
                v-if="
                  estimate.summary.subscription['term-5'].regTotalAmount !==
                  estimate.summary.subscription['term-5'].regTotalAfterDis
                "
                class="line-through text-sm text-gray-400 text-right"
              >
                ${{ estimate.summary.subscription['term-5'].regTotalAmount }}
                USD
              </div>
              <div class="text-right">
                ${{ estimate.summary.subscription['term-5'].regTotalAfterDis }}
                USD
              </div>
            </td>
          </tr>
          <tr>
            <td
              class="p-4 bg-gray-100 bg-opacity-75 pl-4"
              style="vertical-align: middle; border: 2px solid #ffffff"
            >
              <strong>WELL Certification program &amp; support</strong>
              <div v-if="estimate.cert_discount !== 0">
                Discount: {{ estimate.cert_discount }}%
              </div>
            </td>
            <td
              class="p-4 bg-white"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div
                v-if="
                  estimate.summary.totalCertificationAmount !==
                  estimate.summary.totalCertAmountAfterDis
                "
                class="line-through text-sm text-gray-400 text-right"
              >
                ${{ estimate.summary.totalCertificationAmount }} USD
              </div>
              <div class="text-right">
                ${{ estimate.summary.totalCertAmountAfterDis }} USD
              </div>
              <div class="text-right text-xs">
                ${{ estimate.summary.perSqFtAfterDis }} /sq ft
              </div>
            </td>
            <td
              v-if="estimate.summary.subscription['term-3']"
              class="p-4 bg-white"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div
                v-if="
                  estimate.summary.subscription['term-3'].annualTotalAmount !==
                  estimate.summary.subscription['term-3'].annualTotalAfterDis
                "
                class="line-through text-sm text-gray-400 text-right"
              >
                ${{ estimate.summary.subscription['term-3'].annualTotalAmount }}
                USD
              </div>
              <div class="text-right">
                ${{
                  estimate.summary.subscription['term-3'].annualTotalAfterDis
                }}
                USD
              </div>
            </td>
            <td
              v-if="estimate.summary.subscription['term-5']"
              class="p-4 bg-white"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div
                v-if="
                  estimate.summary.subscription['term-5'].annualTotalAmount !==
                  estimate.summary.subscription['term-5'].annualTotalAfterDis
                "
                class="line-through text-sm text-gray-400 text-right"
              >
                ${{ estimate.summary.subscription['term-5'].annualTotalAmount }}
                USD
              </div>
              <div class="text-right">
                ${{
                  estimate.summary.subscription['term-5'].annualTotalAfterDis
                }}
                USD
              </div>
            </td>
          </tr>
          <tr>
            <td class="p-4 bg-gray-100 bg-opacity-75">Total WELL Fees</td>
            <td
              class="p-4 bg-white"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div class="text-right my-auto">
                <div
                  v-if="
                    estimate.summary.subTotalAmount !==
                    estimate.summary.subTotalAmountAfterDis
                  "
                  class="line-through text-sm text-gray-400 text-right"
                >
                  ${{ estimate.summary.subTotalAmount }} USD
                </div>
                <div>${{ estimate.summary.subTotalAmountAfterDis }} USD</div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="bg-white text-xs p-3" colspan="4">
              <div>
                Onsite performance testing &amp; data collection is required for
                all projects. The fees listed below are for GBCI to conduct
                onsite performance testing and data collection. Alternatively,
                projects may elect to contract with local qualified performance
                testing agents to perform this work. A list of qualified WELL
                Performance Testing Organizations may be found
                <a
                  href="https://www.wellcertified.com/performance-testing"
                  target="_blank"
                  >here</a
                >.
              </div>
            </td>
          </tr>
          <tr>
            <td
              class="p-4 bg-gray-100 bg-opacity-75 pl-4"
              style="vertical-align: middle; border: 2px solid #ffffff"
            >
              <strong
                >Onsite performance testing &amp; data collection (GBCI)</strong
              >
            </td>
            <td
              class="p-4 bg-white text-right"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div>
                <div
                  v-if="
                    estimate.summary.totalPvAmount !==
                    estimate.summary.totalPvAmountAfterDis
                  "
                  class="line-through text-sm text-gray-400 text-right"
                >
                  ${{ estimate.summary.totalPvAmount }} US
                </div>
                <div>${{ estimate.summary.totalPvAmountAfterDis }} US</div>
              </div>
            </td>
            <td
              class="p-4 bg-white text-right"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div>
                <div
                  v-if="
                    estimate.summary.totalPvAmount !==
                    estimate.summary.totalPvAmountAfterDis
                  "
                  class="line-through text-sm text-gray-400 text-right"
                >
                  ${{ estimate.summary.totalPvAmount }} US
                </div>
                <div>${{ estimate.summary.totalPvAmountAfterDis }} US</div>
              </div>
            </td>
            <td
              class="p-4 bg-white text-right"
              style="vertical-align: middle; border: 2px solid #f7f8f8"
            >
              <div>
                <div
                  v-if="
                    estimate.summary.totalPvAmount !==
                    estimate.summary.totalPvAmountAfterDis
                  "
                  class="line-through text-sm text-gray-400 text-right"
                >
                  ${{ estimate.summary.totalPvAmount }} US
                </div>
                <div>${{ estimate.summary.totalPvAmountAfterDis }} US</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <h4 class="text-sm mb-2 mt-8">TERMS</h4>
      <ul class="list-disc pl-4 md:pl-5 text-xs mb-2.5 font-light leading-5">
        <li>
          This fee estimate is subject to change and is valid until
          {{ estimate.valid_till }}. Please check the IWBI website for the most
          current
          <a href="https://www.wellcertified.com/certification/v2/pricing"
            >WELL fee schedule.</a
          >
        </li>
        <li>
          In addition to the fees, IWBI will collect applicable sales or use
          taxes, if any, as required by law.
        </li>
        <li>
          The fees listed above do not include fees for recertification of an
          existing WELL Certified project. To the extent you seek certification,
          such fees will be calculated on the dates on which they are<br />
          incurred and invoiced as they are incurred. The fees listed above also
          do not include fees for optional services, such as the review of
          requests for alternative compliance paths or innovation<br />
          features, the review and approval of curative action plans, or the
          undertaking of appeal.
        </li>
      </ul>
    </div>
    <div>
      <div>
        <h2
          class="
            text-2xl
            md:text-3xl
            mb-2
            mt-10
            md:mt-14
            font-museo-slab font-semibold
          "
        >
          YOUR PURSUIT OF WELL
        </h2>
        <p class="text-lg mb-4 font-light">
          A data-driven approach to creating healthy spaces
        </p>
        <p class="text-lg mb-4 font-light">
          <strong>One Mission.</strong> WELL outlines a comprehensive approach
          to creating healthy spaces, leveraging design strategies, operational
          protocols, personnel policies and performance thresholds.
        </p>
        <p class="text-lg mb-4 font-light">
          <strong>One Impact.</strong> WELL enables you to achieve
          evidence-based alternatives that have a positive impact on human
          health.
        </p>
        <p class="text-lg mb-4 font-light">
          <strong>One WELL.</strong> WELL Certified projects meet global
          benchmarks for performance, gaining public recognition for their
          visible and rigorous commitment to human health.
        </p>
      </div>
    </div>

    <div>
      <h2
        class="
          text-2xl
          md:text-3xl
          mb-2
          mt-10
          md:mt-14
          font-museo-slab font-semibold
        "
      >
        BEGIN YOUR WELL JOURNEY
      </h2>
      <p class="text-lg mb-4 font-light">
        To help you achieve these impactful outcomes, the following process has
        been designed to ensure you receive a comprehensive and robust package
        of support services throughout your journey to achieve WELL
        Certification.
      </p>
      <p class="text-lg mb-4 font-light">
        <strong>Register</strong>
        <br />
        Upon Registration, project teams gain access to WELL Online, a
        comprehensive WELL Certification platform. Projects will also gain
        access to a WELL coaching contact who provides individualized support to
        the project team throughout the WELL Certification process.
      </p>
      <p class="text-lg mb-4 font-light">
        <strong>Assess &amp; Implement</strong>
        <br />
        During the assessment and implementation stages, the WELL coaching
        contact will support the project's WELL AP (consultant) through the WELL
        Certification process, brainstorming solutions to overcome challenges,
        inspiring best practices in the implementation of WELL, and providing
        feedback throughout the process.
      </p>
      <p class="text-lg mb-4 font-light">
        <strong>Document</strong>
        <br />
        Once you’ve implemented the WELL features, the next step is to submit
        documentation to demonstrate that you’ve met the mandatory elements of
        WELL (precondition features), as well as optional elements
        (optimizations features) that align with your goals.
      </p>
      <p class="text-lg mb-4 font-light">
        <strong>Verify</strong> <br />
        After your documentation has been approved, the project can schedule the
        onsite evaluation with GBCI or a GBCI trained performance testing agent.
      </p>
      <p class="text-lg mb-4 font-light">
        <strong>Certify &amp; Celebrate</strong>
        <br />
        Upon successful performance, certification is awarded at Silver, Gold or
        Platinum levels. Marketing support is provided to ensure the achievement
        is recognized!
      </p>
      <p class="text-lg mb-4 font-light">
        <strong>Maintain &amp; Recertify</strong>
        <br />
        Recertification ensures that the project maintains the same high level
        of design, maintenance, and operations over time.
      </p>
    </div>
    <div>
      <div class="mt-10 md:mt-14">
        <hr />
        <h6 class="text-lg text-center text-gray-800 font-bold mb-7 mt-6">
          This estimate was generated on
          {{ $dayjs(estimate.created_at).format('MMM DD, YYYY') }} and is valid
          until {{ $dayjs(estimate.exp_date).format('MMM DD, YYYY') }}.
        </h6>
        <small class="text-xs font-light leading-5 pb-10"
          >The WELL Building Standard is administered by the International WELL
          Building Institute™, pbc (IWBI), a public benefit corporation whose
          mission is to improve human health and well-being through the built
          environment. The Green Business Certification Inc. (GBCI) manages and
          administers third-party certification for the WELL Building
          Standard.</small
        >
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
}
</script>
