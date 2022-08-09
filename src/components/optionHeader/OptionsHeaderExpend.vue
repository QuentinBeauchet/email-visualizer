<template>
  <button @click="onExpansion" class="options-header-button">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m21 17.75c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75z"
        fill-rule="nonzero"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: "Options-Header-Expend",
  methods: {
    onExpansion: function () {
      this.$emit("expansion");
    },
  },
};
</script>

<style scoped>
button {
  padding: 0 0.4rem 0 0.4rem;
}

svg {
  fill: currentColor;
  opacity: 0.5;

  clip-rule: evenodd;
  fill-rule: evenodd;
  stroke-linejoin: round;
  stroke-miterlimit: 2;
  width: 27px;
  height: 27px;
}
</style>
