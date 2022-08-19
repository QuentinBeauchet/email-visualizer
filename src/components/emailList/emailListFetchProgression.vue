<template>
  <div id="wrapper">
    <span>{{ this.current }} / {{ this.max }}</span>
    <div id="bar"></div>
  </div>
</template>

<script>
export default {
  name: "EmailListFetchProgression",
  props: {
    current: Number,
    max: Number,
  },
  computed: {
    percent: function () {
      return `${Math.round(100 - (this.current * 100) / this.max)}%`;
    },
  },
};
</script>

<style scoped>
#wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 15px 0 15px;
}

span {
  font-size: larger;
  font-weight: 500;
}

#bar {
  height: 3px;
  width: 100%;
  border-radius: 3px;
  color: #f4f4f4;
  background-image: linear-gradient(-45deg, var(--medium-grey) v-bind("percent"), var(--dark-grey) 1px);
}
</style>
