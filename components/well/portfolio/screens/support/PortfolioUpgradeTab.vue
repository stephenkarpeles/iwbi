<template>
  <div>
    <WFeedbackAlert ref="alert" />
    <FormulateForm class="space-y-2" @submit="$refs.modal.isHidden = false">
      <div v-if="standardVersion">
        <label
          for="applicablePart"
          class="
            w-full
            text-sm
            font-bold
            leading-5
            text-gray-700
            sm:mt-px sm:pt-2
          "
        >
          Please select the addenda version you would like to upgrade this
          portfolio to:
        </label>
        <FormulateInput
          v-model="versionSelected"
          tag-placeholder="Add a tag"
          placeholder="Select version"
          :taggable="true"
          :multiple="false"
          :options="versionOptions"
          type="multi"
          labels="name"
          track-by="id"
        />
      </div>
      <FormulateInput
        v-model="upgradeProject"
        type="checkbox"
        label="I would like to upgrade my locations as well."
      />
      <div class="w-24 ml-auto">
        <FormulateInput type="submit"
          ><WIconsBase icon="save-as" class="mr-1" /> Save
        </FormulateInput>
      </div>
    </FormulateForm>
    <WFeedbackModal ref="modal" class="z-40">
      <div class="flex justify-between">
        <WHeadingsHThree
          class="text-primary-800"
          heading="Portfolio Version Update
"
        />
        <WIconsBase
          icon="x"
          type="primary"
          @click.native="$refs.modal.isHidden = true"
        />
      </div>
      <div class="md:w-96">
        <p class="mb-10">
          This action <b>cannot</b> be undone. This will permanently change the
          version of
          <b>#{{ portfolio.portfolio_number }} - {{ portfolio.name }}</b>
          portfolio, scorecard, alternatives.
        </p>
        <WButtonsBase type="primary" @click.native="upgardePortfolio"
          >I understand the consequences, update this portfolio!</WButtonsBase
        >
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      versionSelected: '',
      upgradeProject: false,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      standardVersion: (state) => state.project.standards,
    }),
    versionOptions() {
      const version = this.standardVersion.filter(
        (a) =>
          a.type === this.portfolio.type &&
          a.is_published === 1 &&
          a.language[0].code === 'en' &&
          a.id !== this.portfolio.applicable_version_id
      )
      return version
    },
  },
  mounted() {
    this.$store.dispatch('project/getStandards').then((response) => {
      this.getStandardVersionName()
    })
  },
  methods: {
    getStandardVersionName() {
      this.$axios
        .get('api/versions?version_id=' + this.portfolio.applicable_version_id)
        .then((response) => {
          this.versionSelected = response.data[0]
        })
    },
    async upgardePortfolio() {
      if (this.versionSelected.id === this.portfolio.applicable_version_id) {
        this.$store.dispatch('notifications/toastMessage', {
          message:
            'Portfolio current and requested standard version can not be same.',
        })
      } else {
        const data = {
          upgradeProjects: this.upgradeProject ? 'yes' : 'no',
          id: this.portfolio.id,
          versionSelected: this.versionSelected.id,
        }

        const self = this

        await this.$store
          .dispatch('portfolio/upgardePortfolio', data)
          .then((response) => {
            this.$refs.modal.isHidden = true
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Project version update',
            })
          })
          .catch(function (error) {
            self.$store.dispatch('notifications/toastMessage', {
              message: error.response.data.msg,
            })
          })
        this.$refs.modal.isHidden = true
      }
    },
  },
}
</script>
