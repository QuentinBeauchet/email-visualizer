<template>
  <div @click="onClick">
    <svg v-if="isVisible" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "Article-Deletion",
  props: {
    isVisible: Boolean,
  },
  methods: {
    onClick: function () {
      console.log("DELETE");
    },
  },
};
</script>

<style scoped>
div {
  width: 10%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

div:hover {
  background: var(--light-red);
  color: var(--medium-red);
}

svg {
  fill: currentColor;
  opacity: 0.5;
}
</style>
