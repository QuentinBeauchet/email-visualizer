<template>
  <button @click="onClick" class="options-header-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M8.602 3.7c-1.154 1.937-.635 5.227 1.424 9.025.93 1.712.697 3.02.338 3.815-.982 2.178-3.675 2.799-6.525 3.456-1.964.454-1.839.87-1.839 4.004h-1.995l-.005-1.241c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418-4.733-8.729-1.35-13.678 3.732-13.678 3.321 0 5.97 2.117 5.97 6.167 0 3.555-1.949 6.833-2.383 7.833h-2.115c.392-1.536 2.499-4.366 2.499-7.842 0-5.153-5.867-4.985-7.369-2.458zm15.398 15.8c0 2.485-2.017 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.017-4.5 4.5-4.5 4.5 2.015 4.5 4.5zm-2-.5h-5v1h5v-1z"
      />
    </svg>
    <span>Block Sender</span>
  </button>
</template>

<script>
export default {
  name: "OptionsHeaderBlockSender",
  methods: {
    onClick: function () {
      console.log("Block the Sender");
    },
  },
};
</script>

<style scoped>
svg {
  fill: currentColor;

  width: 15px;
  height: 15px;
}
</style>
