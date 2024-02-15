<template>
  <div class="pr-4 mt-2 mb-5">
    <div class="d-flex w-100 relative">
      <div
        :class="[
          'milestone',
          {
            'active-milestone':
              totalPerc >= bronzeMin && totalPerc <= silverMin,
          },
        ]"
        :style="{ left: bronzeMin + '%' }"
      >
        <div class="label uppercase text-sm">Bronze</div>
      </div>
      <div
        :class="[
          'milestone',
          { 'active-milestone': totalPerc >= silverMin && totalPerc < goldMin },
        ]"
        :style="{ left: silverMin + '%' }"
      >
        <div class="label uppercase text-sm">Silver</div>
      </div>
      <div
        :class="[
          'milestone',
          { 'active-milestone': totalPerc >= goldMin && totalPerc < platMin },
        ]"
        :style="{ left: goldMin + '%' }"
      >
        <div class="label uppercase text-sm">Gold</div>
      </div>
      <div
        :class="['milestone', { 'active-milestone': totalPerc >= platMin }]"
        :style="{ left: platMin + '%' }"
      >
        <div class="label uppercase text-sm">Platinum</div>
      </div>
      <div
        class="rounded absolute"
        style="height: 5px; background-color: rgb(189, 144, 122)"
        :style="{
          width: 'calc(' + totalPerc + '% + 5px)',
          backgroundColor: medalColor,
        }"
      ></div>
      <div
        class="mt-2 rounded w-100"
        style="height: 5px; background-color: rgb(229, 229, 229)"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    totalPerc: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      bronzeMin: 40,
      silverMin: 50,
      goldMin: 60,
      platMin: 80,
    }
  },
  computed: {
    medalColor() {
      if (this.totalPerc < this.silverMin) {
        return '#bd907a'
      }

      if (this.totalPerc > this.silverMin && this.totalPerc < this.goldMin) {
        return '#a5a3a3'
      }

      if (this.totalPerc > this.goldMin && this.totalPerc < this.platMin) {
        return '#d2bd71'
      }

      if (this.totalPerc > 80) {
        return '#909399'
      }

      return null
    },
  },
}
</script>
<style lang="scss" scoped>
.milestone {
  position: absolute;
  background-color: rgb(229, 229, 229);
  height: 18px;
  width: 2px;
  transform: translateY(-35%);
  .label {
    position: absolute;
    bottom: 0;
    font-weight: 100;
    color: #868e96;
    transform: translate(-50%, 100%);
  }
}

.active-milestone {
  background-color: #327584;
  z-index: 10;
  .label {
    color: #327584;
    font-weight: bold;
  }
}
</style>
