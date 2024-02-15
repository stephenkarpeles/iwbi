export default {
  // eslint-disable-next-line require-await
  async getAdminInvoicesList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '' && payload[key]) {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += (payload[key] ? key + '=' : '') + encodeURIComponent(val)
    }
    return this.$axios.get(`api/admin/invoice?${str}`).then((res) => {
      commit('setAdminInvoicesList', res.data)
    })
  },

  async getInvoiceByNumber({ state }, invoiceNumber) {
    let invoiceData = {}
    await this.$axios
      .get(`api/invoice/${invoiceNumber}/getByNumber`)
      .then((response) => {
        invoiceData = response.data
      })
      .catch((err) => {
        return err
      })

    return invoiceData
  },

  async splitInvoice({ state }, payload) {
    let newInvoicesData = {}
    await this.$axios
      .post(`api/admin/invoice/${payload.invoice_id}/split`, payload)
      .then((response) => {
        newInvoicesData = response.data
      })
      .catch((err) => {
        return err
      })

    return newInvoicesData
  },

  download({ state, rootState }, invoice) {
    const token = rootState.authentication.token

    if (invoice.legacy_id) {
      window.open(
        'https://legacy-wellonline.wellcertified.com/printPdf/' +
          invoice.legacy_id,
        '_blank'
      )
    } else {
      const url =
        this.$axios.defaults.baseURL +
        'api/invoice/' +
        invoice.id +
        '/pdf?token=' +
        token
      window.open(url, '_blank')
    }
  },
  async updateInvoice({ state, dispatch }, payload) {
    return await this.$axios
      .post(`api/admin/invoice/${payload.id}`, payload)
      .then((res) => {})
  },

  async updateUserFieldsinInvoice({ state }, payload) {
    return await this.$axios
      .put(`api/invoice/${payload.id}/update`, payload)
      .then((res) => {})
  },
  verifyDiscountCode({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          'api/coupon/validate/' +
            payload.discountCode +
            '?for=' +
            payload.for +
            '&type=' +
            payload.type
        )
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  async applyDiscount({ state }, payload) {
    await this.$axios.get(
      `api/invoice/${payload.id}/apply-discount/${payload.discountCode}`
    )
  },
  async removeDiscountCode({ state }, payload) {
    await this.$axios.get(`api/invoice/${payload}/remove-discount`)
  },
}
