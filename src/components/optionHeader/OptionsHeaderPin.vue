<template>
  <button @click.stop="onPinned(!this.pinned)" class="options-header-button">
    <SVGPin :pinned="pinned" @pinned="onPinned" />
    <span>Pin</span>
  </button>
</template>

<script>
import SVGPin from "../svg/SVGPin.vue";
export default {
  name: "Options-Header-Pin",
  props: {
    pinned: Boolean,
  },
  methods: {
    onPinned: function (pinned) {
      this.$emit("pinned", pinned);
    },
  },
  components: { SVGPin },
};
</script>

<style scoped>
svg {
  fill: currentColor;

  width: 15px;
  height: 15px;
}
</style>
