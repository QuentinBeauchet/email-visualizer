<template>
  <svg v-if="this.isSeen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" @click.stop="onClick">
    <path
      d="M.026 24l11.974-11.607 11.974 11.607h-23.948zm11.964-23.961l-11.99 8.725v12.476l7.352-7.127-5.653-4.113 10.291-7.488 10.309 7.488-5.655 4.108 7.356 7.132v-12.476l-12.01-8.725z"
    />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" @click.stop="onClick">
    <path
      d="M0 3v18h24v-18h-24zm22 16l-6.526-6.618-3.445 3.483-3.418-3.525-6.611 6.66 5.051-8-5.051-6 10.029 7.446 9.971-7.446-4.998 6.01 4.998 7.99z"
    />
  </svg>
</template>

<script>
export default {
  name: "SVG-Status",
  props: {
    isSeen: Boolean,
  },
  methods: {
    onClick: function () {
      this.$emit("statusChange", !this.isSeen);
    },
  },
};
</script>

<style scoped>
svg {
  fill: currentColor;
  width: 15px;
  height: 15px;
  cursor: pointer;
  padding: 3px;
}

svg:hover {
  background-color: var(--medium-shadow-grey);
}
</style>
