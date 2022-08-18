<template>
  <svg v-if="status == 200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
    />
  </svg>
  <svg
    v-else-if="status == 0 || status == -1"
    :class="{ rotating: status == -1 }"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"
    />
  </svg>
</template>

<script>
export default {
  name: "SVGStatus",
  props: {
    status: Number,
  },
  computed: {
    color: function () {
      return this.status == 0 || this.status == -1 ? "inherit" : this.status == 200 ? "green" : "red";
    },
  },
};
</script>

<style scoped>
svg {
  fill: v-bind("color") !important;
  width: 20px;
  height: 20px;
  padding: 0.5rem;
  flex-shrink: 0;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotating 2s linear infinite;
}
</style>
