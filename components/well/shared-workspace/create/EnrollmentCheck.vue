<template>
  <div>
    <div v-if="sharedWorkspace" class="px-4 md:px-8 py-6">
      <WHeadingsHTwo
        heading="Thank you for enrolling!"
        class="text-primary-900"
      />
      A copy of your invoice, including payment instructions, has been emailed
      to the address you provided (<a
        class="text-primary-600"
        :href="`mailto:${currentUser.email}`"
        >{{ currentUser.email }}</a
      >).
      <WHeadingsHFour heading="PROJECT CHECKLIST" class="uppercase mt-10" />
      <p class="-mt-2">
        Your project account will be opened as soon as your payment has cleared
        our system. Until then, we encourage you to prepare by diving into the
        details of the
        <a
          href="https://v2.wellcertified.com/health-safety/en/overview"
          target="_blank"
          class="text-primary-600"
          >WELL Health-Safety Rating</a
        >. You will receive an email confirmation once payment has cleared and
        your project checklist is available. Additionally, you can always check
        the status of your enrollent via your
        <WLinksBase link="/shared-workspaces" class="inline-flex"
          >WELL Health-Safety project list</WLinksBase
        >
      </p>
      <SharedProjectList />
      <WHeadingsHFour heading="PAY BY CREDIT CARD" class="uppercase mt-10" />
      <p class="-mt-2">
        If at any time you would like to open your project checklist
        immediately, please click below to revise your payment method to credit
        card.
      </p>
      <div
        class="md:flex justify-between md:mx-10 mt-10 space-y-2 md:space-y-0"
      >
        <div class="md:w-44">
          <WButtonsBase
            type="primaryInverted"
            :class="isChinaInvoice ? 'py-4' : ''"
            @click.native="setUserPreference"
            >Pay by credit card</WButtonsBase
          >
        </div>
        <div class="md:w-44">
          <WButtonsBase
            type="primary"
            :class="isChinaInvoice ? 'py-4' : ''"
            @click.native="$router.push('/shared-workspaces')"
            >My account</WButtonsBase
          >
        </div>
        <div v-if="isChinaInvoice" class="md:w-44">
          <WButtonsBase
            type="primaryInverted"
            icon="download"
            @click.native="downloadCoA(0)"
            >Confirmation Agreement</WButtonsBase
          >
        </div>
        <div class="md:w-44">
          <WButtonsBase
            type="primaryInverted"
            icon="download"
            :class="isChinaInvoice ? 'py-4' : ''"
            @click.native="$store.dispatch('invoice/download', invoice)"
            >Invoice</WButtonsBase
          >
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center pb-10">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Invoice...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    invoice: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
    }),
    isChinaInvoice() {
      for (let i = 0; i < this.invoice.addresses.length; i++) {
        if (
          this.invoice.addresses[i].country_code === 'CN' ||
          this.invoice.addresses[i].country_code === 'HK' ||
          this.invoice.addresses[i].country_code === 'MO'
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
        .dispatch('portfolio/downloadCoA', {
          id: this.sharedWorkspace.id,
          pre_cert_fees: val,
        })
        .then((res) => {
          window.open(res.data.url, '_blank')
        })
    },
    async setUserPreference() {
      await this.$store.dispatch('invoice/updateUserFieldsinInvoice', {
        id: this.invoice.id,
        country_code: this.sharedWorkspace.addresses.find(
          (address) => address.is_shipping === 1
        ).country_code,
        description: this.invoice.description,
        email: this.invoice.user_email,
        name: this.currentUser.full_name,
        organization: this.currentUser.organization,
        user_preference: '',
      })
      await this.$parent.getInvoiceData()
    },
  },
}
</script>
