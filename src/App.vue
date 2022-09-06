<template>
  <ConnexionHeader @connected="onConnected" />
  <Suspense v-if="this.credentials">
    <MainComponent @reset-data="resetData" :credentials="credentials" />
    <template #fallback><LoadingBar /></template>
  </Suspense>
</template>

<script>
import ConnexionHeader from "./components/mainHeader/mainHeader.vue";
import MainComponent from "./components/MainComponent.vue";
import LoadingBar from "./components/svg/Loading.vue";

export default {
  name: "App",
  components: {
    ConnexionHeader,
    MainComponent,
    LoadingBar,
  },
  data: function () {
    return {
      credentials: undefined,
    };
  },
  methods: {
    onConnected: function (credentials) {
      this.credentials = undefined;
      this.$nextTick(() => {
        this.credentials = credentials;
      });
      this.resetData();
    },
    resetData: function () {
      this.displayedMail = undefined;
      this.pinneds = new Set();
    },
  },
};
</script>

<style>
@import "./assets/styles/variables.css";
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap");
body {
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  background: var(--medium-grey);
}
</style>

<style scoped>
main {
  flex-grow: 1;
  background: var(--light-grey);
  display: flex;
  overflow: hidden;
}

#menu {
  width: 15%;
  flex-shrink: 0;
  background: var(--medium-grey);
}

#displayArea {
  flex-grow: 1;
}

.extendedDisplayArea {
  width: 75% !important;
}
</style>
