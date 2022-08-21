<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :class="{ loading: loading }">
      <path d="M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SVGDownload",
  props: { loading: Boolean },
};
</script>

<style scoped>
div {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  fill: var(--medium-blue);
}

.loading {
  animation: 1s cubic-bezier(0.5, 1, 1, 1) alternate-reverse infinite glow;
}

@keyframes glow {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.3;
  }
}
</style>
