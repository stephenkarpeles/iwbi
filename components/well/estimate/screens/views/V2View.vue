<template>
  <div>
    <img class="mt-10 md:mt-0" src="/estimates/v2/banner.png" alt="" />
    <div class="p-4 md:p-8">
      <div class="flex justify-between mb-10">
        <div class="text-xl">
          <div class="text-secondary-700">YOUR WELL V2 PROJECT:</div>
          <div class="text-primary-700">
            {{ estimate.projects[0].name }}
            <span v-if="estimate.projects[0].typeFull">
              ({{ estimate.projects[0].typeFull }})
            </span>
          </div>
          <div class="text-primary-700">
            {{ estimate.summary.totalArea }} square feet
          </div>
        </div>
        <div>
          <img class="w-32" src="/logo/full.png" alt="" />
        </div>
      </div>
      <div class="flex flex-wrap border bg-invoice-gray mt-5 bg-gray-200">
        <div
          class="
            border border-gray-300
            text-primary-700
            flex
            w-full
            justify-between
            px-5
            py-5
          "
        >
          <div>ITEM</div>
          <div>PRICING</div>
        </div>
        <div
          class="
            text-primary-700
            flex
            w-full
            justify-between
            px-5
            py-5
            border-b border-l border-r border-gray-300
          "
        >
          <div>
            <div>Enrollment fee</div>
            <div class="text-sm text-gray-400">Intial payment</div>
          </div>
          <div>
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
          </div>
        </div>
        <div
          class="
            text-primary-700
            flex
            w-full
            justify-between
            px-5
            py-5
            border-b border-l border-r border-gray-300
          "
        >
          <div>
            <div>Program fees</div>
            <div class="text-sm text-gray-400">
              Pay on an annual payment plan or at documentation review
            </div>
          </div>
          <div>
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
          </div>
        </div>
        <div
          v-if="estimate.discounts && estimate.discounts.length > 0"
          class="
            text-secondary-700
            flex
            w-full
            justify-between
            px-5
            py-5
            border-b border-l border-r border-gray-300
          "
        >
          <div>
            <div>Discount(s) applied:</div>
            <div
              v-for="(discount, index) in estimate.discounts"
              :key="index"
              class="text-sm"
            >
              {{ discount }}
            </div>
          </div>
          <div>
            <div class="text-right">
              - ${{ estimate.summary.totalDiscount }} USD
            </div>
          </div>
        </div>
        <div
          class="
            text-primary-700
            md:flex
            w-full
            justify-end
            px-5
            py-5
            border-b border-l border-r border-gray-300
          "
        >
          <div class="ml-auto md:w-1/3 flex justify-between">
            <div class="my-auto font-medium">Total WELL Fees</div>

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
          </div>
        </div>
      </div>
      <div class="mx-0 md:mx-8 my-8 text-gray-700">
        Onsite performance testing &amp; data collection is required for all
        projects. The fees listed below are for GBCI to conduct onsite
        performance testing and data collection. Alternatively, projects may
        elect to contract with local qualified performance testing agents to
        perform this work. Explore our global network of
        <a
          class="
            active:text-primary-700
            font-medium
            text-primary-600
            hover:text-primary-800
            transition
            duration-150
            ease-in-out
            h-full
          "
          href="https://www.wellcertified.com/performance-testing"
          target="_blank"
          >WELL Performance Testing Organizations</a
        >
        and request a quote today.
      </div>
      <div
        class="
          bg-invoice-gray
          text-primary-700
          flex
          w-full
          justify-between
          px-5
          py-5
          border border-gray-300
        "
      >
        <div class="flex-1">
          Onsite performance testing &amp; data collection (GBCI)
        </div>
        <div>
          <div
            v-if="
              estimate.summary.totalPvAmount !==
              estimate.summary.totalPvAmountAfterDis
            "
            class="line-through text-sm text-gray-400 text-right"
          >
            ${{ estimate.summary.totalPvAmount }} USD
          </div>
          <div>${{ estimate.summary.totalPvAmountAfterDis }} USD</div>
        </div>
      </div>
      <div class="px-0 md:px-5 mt-8">
        <div class="mx-0 md:mx-3 mt-4 text-gray-700">
          <WHeadingsHThree heading="Optional Services" />
          <ul class="list-disc pl-5 md:pl-8">
            <li>
              A
              <span class="font-bold">WELL Precertification</span>
              designation is an optional early phase review that helps projects
              communicate progress toward achieving WELL Certification and
              provide greater confidence that their designs, operational intents
              and/or existing conditions will meet WELL requirements. This
              interim designation has a fee of $.05/sqft, ranging from $2,500
              and capped at $25,000.
              <u
                >Precertification fees for this project would be ${{
                  estimate.summary.totalPreCertAmountAfterDis
                }}
                USD, and can be credited toward your overall program fees.</u
              >
            </li>
            <li>
              A
              <span class="font-bold">WELL Health-Safety Rating</span>
              is an optional milestone that demonstrates achievement of critical
              facility operations and maintenance alternatives needed to address
              emergency preparedness, resilience and recovery. This annual
              designation is free to earn if submitted with a precertification
              or certification review. If you'd like to pursue sooner, we offer
              our enrolled projects a discounted rate of $2,500.
            </li>
          </ul>
        </div>
        <div class="mx-0 md:mx-3 my-8 text-gray-700">
          <WHeadingsHThree heading="Terms" />
          <ul class="list-disc pl-5 md:pl-8">
            <li>
              This fee estimate was generated on
              <span class="font-bold">{{
                $dayjs(estimate.created_at).format('MMM DD, YYYY')
              }}</span>
              and is valid until
              <span class="font-bold">{{
                $dayjs(estimate.exp_date).format('MMM DD, YYYY')
              }}</span
              >. Please check the IWBI website for the most current
              <a
                class="
                  active:text-primary-700
                  font-medium
                  text-primary-600
                  hover:text-primary-800
                  transition
                  duration-150
                  ease-in-out
                  h-full
                "
                href="https://www.wellcertified.com/certification/v2/pricing"
                target="_blank"
                >WELL fee schedule</a
              >. In addition to the fees, IWBI will collect applicable sales or
              use taxes, if any, as required by law.
            </li>
            <!-- <li>Annual payment plans available upon request.</li> -->
            <li>
              The fees listed above do not include fees for recertification of
              an existing WELL Certified project. When you seek recertification,
              such fees will be calculated on the dates on which they are
              incurred and invoiced as they are incurred. The fees listed above
              also do not include fees for
              <a
                class="
                  active:text-primary-700
                  font-medium
                  text-primary-600
                  hover:text-primary-800
                  transition
                  duration-150
                  ease-in-out
                  h-full
                "
                href="https://www.wellcertified.com/certification/v2/additional-fees"
                target="_blank"
                >optional services</a
              >, such as the review of requests for alternative compliance paths
              or innovation features, the review and approval of curative action
              plans, or the undertaking of appeal.
            </li>
            <li v-if="estimate.projects[0].type === 'cs'">
              This pricing is subject to your project meeting the
              <a
                class="
                  active:text-primary-700
                  font-medium
                  text-primary-600
                  hover:text-primary-800
                  transition
                  duration-150
                  ease-in-out
                  h-full
                "
                href="http://www.wellcertified.com/certification/v2/core"
                target="_blank"
                >additional requirements for WELL Core</a
              >.
            </li>
          </ul>
        </div>
      </div>
      <img src="/estimates/v2/well-being-banner.png" alt="" />
      <div
        class="text-primary mx-auto my-8 md:my-12 tx-medium"
        style="max-width: 500px"
      >
        <div class="mx-auto my-2">
          A personalized health and wellness scorecard to benchmark your
          progress and impact
        </div>
        <div class="mx-auto my-2">
          Cloud-based project management tools for easy team collaboration
        </div>
        <div class="mx-auto my-2">
          A dedicated customer success sponsor to guide you along the way
        </div>
        <div class="mx-auto my-2">
          Exclusive WELL tools and templates to help save you time
        </div>
        <div class="mx-auto my-2">
          A robust external review process to validate your achievements and
          award your certification
        </div>
        <div class="mx-auto my-2">
          A suite of expertly curated marketing and PR content to celebrate and
          promote your success
        </div>
      </div>
      <div
        class="p-5 text-white lg:-mb-4"
        style="background-color: rgb(135, 161, 165)"
      >
        <small class="small tx-center">
          The WELL Building Standard is administered by the International WELL
          Building Institute™, pbc (IWBI), a public benefit corporation whose
          mission is to improve human health and well-being through the built
          environment. The Green Business Certification Inc. (GBCI) manages and
          administers third-party certification for the WELL Building Standard.
        </small>
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

<style scoped>
.bg-invoice-gray {
  background-color: rgb(239, 239, 236);
}
</style>
