<template>
  <button @click="onClick" class="options-header-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 13.456c.76 0 1.377-.604 1.377-1.351 0-.746-.617-1.351-1.377-1.351s-1.377.605-1.377 1.351c0 .747.617 1.351 1.377 1.351zm1.263-3.497l1.741-2.959c1.766 1.002 2.957 2.863 2.996 5h-3.511c-.037-.873-.518-1.623-1.226-2.041zm0 4.293l1.741 2.959c-.883.502-1.91.789-3.004.789s-2.121-.287-3.004-.789l1.741-2.959c.372.219.8.354 1.263.354s.891-.134 1.263-.354zm-3.752-2.252h-3.511c.039-2.137 1.23-3.998 2.996-5l1.741 2.959c-.708.418-1.189 1.169-1.226 2.041z"
      />
    </svg>
    <span>Flag as SPAM</span>
  </button>
</template>

<script>
export default {
  name: "OptionsHeaderSpam",
  methods: {
    onClick: function () {
      console.log("Signal as SPAM");
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
