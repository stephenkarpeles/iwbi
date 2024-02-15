<template>
  <div>
    <WHeadingsHTwo
      class="mt-6"
      heading="WELL Performance Testing Training Modules"
    />

    <div
      v-if="currentUser.role.includes('well-pta')"
      class="md:flex content-center flex-wrap -mx-2 sm: mt-6 md:mt-8"
    >
      <div
        v-for="(ptAgent, index) in ptAgents"
        :key="index"
        class="md:flex md:w-1/2 lg:w-1/3 px-2 md:px-4 py-2 md:py-4"
      >
        <WCardsBase
          class="cursor-pointer"
          :thumbnail="ptAgent.thumbnail"
          :heading="ptAgent.heading"
          discription=""
          @click.native="setActiveCourse(ptAgent)"
        >
          <hr class="pb-3" />

          <div class="text-xs md:text-sm" v-html="ptAgent.discription"></div>
        </WCardsBase>
      </div>
    </div>

    <WFeedbackModal ref="modal" class="ml-0">
      <div v-if="activeCourse !== null">
        <div class="flex justify-between bg-white text-gray-700">
          <div class="p-4">
            <p class="text-sm font-bold">{{ activeCourse.heading }}</p>
          </div>
          <div class="p-4">
            <WButtonsBase
              icon="x-circle"
              type="blank"
              @click.native="$refs.modal.isHidden = true"
            />
          </div>
        </div>
        <iframe
          :src="iframeLink"
          class="w-full"
          style="height: calc(100vh - 60px)"
        ></iframe>
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeCourse: null,
      ptAgents: [
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/1.jpg',
          heading:
            'WELL Performance Testing Training – Module 1: Certification Overview',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-1-tincan-l5vA7DZI/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 1 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/2.jpg',
          heading:
            'WELL Performance Testing Training – Module 2: Performance Testing Overview',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-2-tincan-IhNTnxOo/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 2 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/3.jpg',
          heading:
            'WELL Performance Testing Training – Module 3: Performance testing Protocols - Air',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-3-air-tincan-VS1p-T8n/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 3 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/4.jpg',
          heading:
            'WELL Performance Testing Training – Module 4: Performance testing Protocols - Water',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-4-water-tincan-IKNM53dq/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 4 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/5.jpg',
          heading:
            'WELL Performance Testing Training – Module 5: Performance testing Protocols - Light',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-5-light-tincan-ukdr0WJh/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 5 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/6.jpg',
          heading:
            'WELL Performance Testing Training – Module 6: Performance testing Protocols - Acoustics',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-6-acoustics-tincan-FqCh8eqM/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 6 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/7.jpg',
          heading:
            'WELL Performance Testing Training – Module 7: Performance testing Protocols – Thermal comfort',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-7-thermal-comfort-tincan-bN05RDZO/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 7 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/8.jpg',
          heading:
            'WELL Performance Testing Training – Module 8: What to Submit to GBCI',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-training-module-8-tincan-mLUcJbSt/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 8 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course.</p></div>',
        },
        {
          thumbnail:
            'https://cdn.wellcertified.com/ptagent-modules/images/9.jpg',
          heading:
            'WELL Performance Testing Training – Module 9: Becoming a WELL PerformanceTesting Organization',
          link: 'https://cdn.wellcertified.com/ptagent-modules/well-performance-testing-agent-training-module-9-tincan-5zSVxNe1/index.html?endpoint=https://lrs.well.support/data/xAPI&auth=Basic YjkxY2VmMzc3YjNhM2Q1ZTRmYzg1NjJlZjkyZjRmOTU2YzQyNDYzMjozNzE5ZWFhNmIyNmM4MDRlMDJkNDA2MjY4ZGViODhmMGYxODJiODBm',
          discription:
            '<div><p>Module 9 of the WELL Performance Testing Training. This training will help WELL Performance Testing Agent candidates learn how to complete performance testing for WELL projects and submit information to GBCI for review. It includes details on the WELL Certification process, GBCI quality expectations and standards and the specifics of WELL performance testing.</p><p>This course is part of GBCI Course ID: 0920022285 and is eligible for continuing education hours upon completion of the entire course. Upon completion of this module please complete the following quiz. Once the quiz has been completed you can submit for continuing education credit for this course.</p></div>',
        },
      ],
    }
  },
  head() {
    return {
      title: `Performance Testing`,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    fullname() {
      let name = ''
      if (this.currentUser.name) {
        name += this.currentUser.name
      } else {
        return ''
      }
      if (this.currentUser.last_name) {
        name += ' ' + this.currentUser.last_name
      }
      return name
    },
    iframeLink() {
      if (this.activeCourse) {
        return (
          this.activeCourse.link +
          '&actor={"name":"' +
          this.fullname +
          '","openid":"http://' +
          this.currentUser.id +
          '"}'
        )
      }
      return null
    },
  },

  methods: {
    setActiveCourse(content) {
      this.activeCourse = JSON.parse(JSON.stringify(content))
      this.$refs.modal.isHidden = false
    },
  },
}
</script>
