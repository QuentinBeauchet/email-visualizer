<template>
  <svg
    v-if="this.isVisible"
    xmlns="http://www.w3.org/2000/svg"
    fill-rule="evenodd"
    clip-rule="evenodd"
    @click="onClick"
  >
    <path
      d="M4.81 4l13.243 15.714-1.532 1.286-5.092-6h-2.124l-1.046-1.013-1.302 1.019-1.362-1.075-1.407 1.081-4.188-3.448 3.346-3.564h2.21l-2.278-2.714 1.532-1.286zm8.499 6h-1.504l-1.678-2h2.06c1.145-1.683 3.104-3 5.339-3 3.497 0 6.474 2.866 6.474 6.5 0 3.288-2.444 5.975-5.54 6.431l-1.678-2c.237.045.485.069.744.069 2.412 0 4.474-1.986 4.474-4.5 0-2.498-2.044-4.5-4.479-4.5-2.055 0-3.292 1.433-4.212 3zm5.691-.125c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-10.626 1.484l-1.14-1.359h-3.022l-1.293 1.376 1.312 1.081 1.38-1.061 1.351 1.066 1.412-1.103z"
    />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" @click="onClick">
    <path
      d="M24 11.5c0 3.613-2.951 6.5-6.475 6.5-2.154 0-4.101-1.214-5.338-3h-2.882l-1.046-1.013-1.302 1.019-1.362-1.075-1.407 1.081-4.188-3.448 3.346-3.564h8.841c1.145-1.683 3.104-3 5.339-3 3.497 0 6.474 2.866 6.474 6.5zm-10.691 1.5c.98 1.671 2.277 3 4.217 3 2.412 0 4.474-1.986 4.474-4.5 0-2.498-2.044-4.5-4.479-4.5-2.055 0-3.292 1.433-4.212 3h-9.097l-1.293 1.376 1.312 1.081 1.38-1.061 1.351 1.066 1.437-1.123 1.715 1.661h3.195zm5.691-3.125c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"
    />
  </svg>
</template>

<script>
export default {
  name: "SVGStatus",
  props: {
    isVisible: Boolean,
  },
  emits: ["visibility-change"],
  methods: {
    onClick: function () {
      this.$emit("visibility-change", !this.isVisible);
    },
  },
};
</script>

<style scoped>
svg {
  fill: currentColor;
  width: 24px;
  height: 24px;
  cursor: pointer;
  padding: 3px;
  flex-shrink: 0;
}

svg:hover {
  background-color: var(--medium-shadow-grey);
}
</style>
