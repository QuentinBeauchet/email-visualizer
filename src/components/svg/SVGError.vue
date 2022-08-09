<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width="15%" viewBox="0 0 24 24">
      <path
        d="M16.142 2l5.858 5.858v8.284l-5.858 5.858h-8.284l-5.858-5.858v-8.284l5.858-5.858h8.284zm.829-2h-9.942l-7.029 7.029v9.941l7.029 7.03h9.941l7.03-7.029v-9.942l-7.029-7.029zm-8.482 16.992l3.518-3.568 3.554 3.521 1.431-1.43-3.566-3.523 3.535-3.568-1.431-1.432-3.539 3.583-3.581-3.457-1.418 1.418 3.585 3.473-3.507 3.566 1.419 1.417z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "SVG-Error",
};
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  fill: var(--medium-red);
  opacity: 0.5;
}
</style>
