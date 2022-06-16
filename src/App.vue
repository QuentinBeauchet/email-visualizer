<template>
  <Header />
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style>
@import "./assets/styles/variables.css";
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap");
body {
  margin: 0;
}
</style>
