<template>
  <button @click="onClick(!this.isSeen)" class="options-header-button">
    <SVGStatus @statusChange="onClick" />
    <span v-if="this.isSeen">Mark as not read</span>
    <span v-else>Mark as read</span>
  </button>
</template>

<script>
import SVGStatus from "../svg/SVGStatus.vue";
export default {
  name: "Options-Header-Change-Status",
  props: {
    isSeen: Boolean,
  },
  methods: {
    onClick: function (isSeen) {
      if (isSeen) {
        console.log("MARK AS NOT READ");
      } else {
        console.log("MARK AS READ");
      }
    },
  },
  components: { SVGStatus },
};
</script>

<style scoped>
svg {
  fill: currentColor;
  cursor: pointer;

  width: 15px;
  height: 15px;
}
</style>
