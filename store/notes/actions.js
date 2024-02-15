export default {
  async getNotes({ commit }, projectId) {
    return await this.$axios
      .get(`api/project-note/${projectId}`)
      .then((res) => {
        commit('setNotes', res.data)
      })
  },

  async updateNote({ dispatch }, note) {
    return await this.$axios
      .put(`api/admin/project-note/${note.id}`, note)
      .then((res) => {
        dispatch('getNotes', note.project_id)
      })
  },
}
