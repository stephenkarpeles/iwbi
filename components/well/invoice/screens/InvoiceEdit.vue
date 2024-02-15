<template>
  <div v-if="formData">
    <WFeedbackAlert ref="alert" />
    <FormulateForm
      :form-errors="formErrors"
      class="space-y-6 px-4 md:px-0 md:max-w-2xl lg:max-w-4xl mx-auto my-6 md:my-10"
      @submit="submitInvoice"
    >
      <!-- General Information -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 sm:px-6 md:px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">General Information</div>
        </div>
        <div
          class="flex flex-wrap px-4 sm:px-6 md:px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="md:grid grid-cols-2 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="formData.addresses[0].first_name"
              label="Name*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.addresses[0].email"
              label="Email Address"
              type="text"
            />
            <FormulateInput
              v-model="company"
              type="companymultisearch"
              name="organization"
              label="Organization*"
              validation="required"
              :searchable="true"
              :clearonselect="false"
              :closeonselect="true"
              :optionslimit="10"
            />
            <FormulateInput
              v-model="formData.note"
              label="Notes"
              type="textarea"
            />
            <FormulateInput
              v-if="
                currentUser.role.includes('admin') ||
                currentUser.role.includes('billing-admin')
              "
              v-model="formData.description"
              label="Description"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-if="
                currentUser.role.includes('admin') ||
                currentUser.role.includes('billing-admin')
              "
              v-model="formData.created_date"
              label="Invoice Date:"
              type="datetimepicker"
              max="9999-01-01"
            />
          </div>
        </div>
      </div>
      <!-- Address Information -->
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 sm:px-6 md:px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Address Information</div>
        </div>
        <div
          class="flex flex-wrap px-4 sm:px-6 md:px-8 py-4 w-full justify-between text-gray-400"
        >
          <FormInputsAddressFormulate
            :address="formData.addresses[0]"
            :target="formData.addresses[0]"
            class-key="md:grid grid-cols-2 gap-x-4 gap-y-4 w-full"
          />
          <div class="md:grid grid-cols-2 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="formData.addresses[0].post_office"
              label="Purchase Order"
              type="text"
            />
          </div>
        </div>
      </div>

      <!-- items information -->
      <div
        v-if="
          currentUser.role.includes('admin') ||
          currentUser.role.includes('billing-admin')
        "
        class="shadow-md flex flex-wrap justify-between border rounded-md"
      >
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 sm:px-6 md:px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Items Information</div>
        </div>
        <div
          v-for="(item, index) in formData.invoice_items"
          :key="index"
          class="flex flex-wrap px-4 sm:px-6 md:px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="md:grid grid-cols-4 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="item.description"
              label="Description"
              type="text"
            />
            <FormulateInput
              v-model="item.quantity"
              label="Quantity"
              min="0"
              type="number"
              validation="required"
            />
            <FormulateInput
              v-model="item.unit_cost"
              label="Unit Cost"
              step=".01"
              type="number"
              validation="required"
            />
            <div class="flex self-end justify-self-start">
              <WButtonsBase
                type="neutral"
                class="text-primary-500"
                icon="plus"
                @click.native="addProject"
              >
              </WButtonsBase>
              <WButtonsBase
                v-if="formData.invoice_items.length > 1"
                type="neutral"
                class="text-danger-500"
                icon="minus"
                @click.native="formData.invoice_items.splice(index, 1)"
              >
              </WButtonsBase>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Information -->
      <div
        v-if="
          currentUser.role.includes('admin') ||
          currentUser.role.includes('billing-admin')
        "
        class="shadow-md flex flex-wrap justify-between border rounded-md"
      >
        <div
          class="w-full bg-primary-50 rounded-t-md border-b px-4 sm:px-6 md:px-8 py-4 text-primary-800 flex justify-between"
        >
          <div class="font-bold">Payment Information</div>
        </div>
        <div
          class="flex flex-wrap px-4 sm:px-6 md:px-8 py-4 w-full justify-between text-gray-400"
        >
          <div class="md:grid grid-cols-2 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="formData.status"
              :options="paymentStatuses"
              type="select"
              label="Payment Status"
            />
            <FormulateInput
              v-model="formData.payment_type"
              :options="paymentTypes"
              type="select"
              :label="
                formData.status === 'waived' || formData.status === 'paid'
                  ? 'Payment Type:*'
                  : 'Payment Type:'
              "
              :disabled="formData.status === 'unpaid' && true"
              :validation="
                formData.status === 'paid' || formData.status === 'waived'
                  ? 'required'
                  : ''
              "
            />
            <FormulateInput
              v-model="formData.payment_reference"
              name="Reference#"
              :label="
                formData.status === 'waived' || formData.status === 'paid'
                  ? 'Reference #:*'
                  : 'Reference #:'
              "
              type="text"
              :disabled="formData.status === 'unpaid' && true"
              :validation="
                formData.status === 'paid' || formData.status === 'waived'
                  ? 'required'
                  : ''
              "
            />
            <FormulateInput
              v-model="formData.payment_date"
              name="Date"
              :label="
                formData.status === 'waived' || formData.status === 'paid'
                  ? 'Invoice Payment Date:*'
                  : 'Invoice Payment Date:'
              "
              type="datetimepicker"
              max="9999-01-01"
              :disabled="formData.status === 'unpaid' && true"
              :validation="
                formData.status === 'paid' || formData.status === 'waived'
                  ? 'required'
                  : ''
              "
            />
          </div>
          <div class="md:grid grid-cols-1 w-full">
            <FormulateInput
              v-model="formData.admin_billing_note"
              type="richtext"
              label="Billing Notes"
            />
          </div>
        </div>
      </div>

      <div class="md:flex justify-between">
        <div>
          <WButtonsBase type="danger" @click.native="resetForm">
            Reset Fields
          </WButtonsBase>
        </div>
        <div class="md:w-32 mt-3 md:mt-0">
          <WButtonsBase v-if="loading" :type="'primaryInverted'">
            <span>
              <WLoadingSpinner type="button" class="mx-auto" />
            </span>
          </WButtonsBase>
          <FormulateInput v-else type="submit" label="Update Invoice" />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    invoiceData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      company: null,
      formData: null,
      formErrors: [],
      paymentStatuses: [
        { label: 'Paid', value: 'paid' },
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Waived', value: 'waived' },
      ],
      paymentTypes: [
        { label: 'Card', value: 'card' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Wire', value: 'wire' },
        { label: 'Other', value: 'other' },
      ],
    }
  },
  computed: {
    ...mapState({ currentUser: (state) => state.user.currentUser }),
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.invoiceData))

    if (
      this.formData.addresses[0].organization &&
      this.formData.addresses[0].organization !== ''
    ) {
      this.company = {
        ...this.company,
        name: this.formData.addresses[0].organization,
      }
    }
    if (this.formData.addresses[0].company_id) {
      this.company = {
        ...this.company,
        id: this.formData.addresses[0].company_id,
      }
    }
  },
  methods: {
    async submitInvoice() {
      this.loading = true
      const data = {
        id: this.formData.id,
        name: this.formData.addresses[0].first_name,
        email: this.formData.addresses[0].email,
        company_id: this.company.id,
        organization: this.company.name,
        post_office: this.formData.addresses[0].post_office,
        description: this.formData.description,
        note: this.formData.note,
        status:
          this.formData.status instanceof Object
            ? this.formData.status.value
            : this.formData.status,
        country_code: this.formData.addresses[0].country_code,
        state: this.formData.addresses[0].state
          ? this.formData.addresses[0].state
          : '',
        postal_code: this.formData.addresses[0].postal_code,
        street: this.formData.addresses[0].street,
        city: this.formData.addresses[0].city,
        items: this.formData.invoice_items,
        admin_billing_note: this.formData.admin_billing_note,
      }
      if (
        this.currentUser.role.includes('admin') ||
        this.currentUser.role.includes('billing-admin')
      ) {
        data.payment_date = this.formData.payment_date
        data.created_date = this.formData.created_date
        data.payment_reference = this.formData.payment_reference
        data.payment_type =
          this.formData.payment_type instanceof Object
            ? this.formData.payment_type.value
            : this.formData.payment_type
        data.items = this.formData.invoice_items
        await this.$store.dispatch('invoice/updateInvoice', data)
      } else {
        await this.$store.dispatch('invoice/updateUserFieldsinInvoice', data)
      }

      await this.$store
        .dispatch('invoice/getInvoiceByNumber', this.invoiceData.invoice_number)
        .then((res) => (this.$parent.invoiceData = res))

      this.loading = false
      this.$parent.editMode = false
    },
    addProject() {
      const newProject = {
        description: '',
        quantity: 0,
        unit_cost: 0,
      }
      this.formData.invoice_items.push(newProject)
    },
    deleteProject() {
      this.formData.invoice_items.shift()
    },
    resetForm() {
      this.formData = JSON.parse(JSON.stringify(this.invoiceData))
    },
  },
}
</script>
