<template>
  <button @click="onClick">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M0 3v18h24v-18h-24zm22 16l-6.526-6.618-3.445 3.483-3.418-3.525-6.611 6.66 5.051-8-5.051-6 10.029 7.446 9.971-7.446-4.998 6.01 4.998 7.99z"
      />
    </svg>
    <span>New Mail</span>
  </button>
</template>

<script>
export default {
  name: "OptionsHeaderNew",
  emits: ["editing"],
  methods: {
    onClick: function () {
      this.$emit("editing");
    },
  },
};
</script>

<style scoped>
button {
  border: none;
  background-color: var(--light-blue);
  height: 100%;
  border-radius: 0.3rem;
  color: var(--light-txt-color);
  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.8rem 0 0.8rem;
}

button:hover {
  background-color: var(--medium-blue);
}

span {
  font-weight: 600;
}

svg {
  fill: currentColor;

  width: 15px;
  height: 15px;
}
</style>
