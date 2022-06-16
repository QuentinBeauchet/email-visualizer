<template>
  <label>
    {{ label }}
    <input :type="type" v-model="inputValue" />
  </label>
</template>

<script>
export default {
  name: "Custom-Input",
  props: {
    label: String,
    type: String,
    value: String,
  },
  data: () => {
    return {
      inputValue: "",
    };
  },
};
</script>

<style scoped>
label {
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
