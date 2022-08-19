<template>
  <ConnexionHeader @connected="onConnected" />
  <OptionsHeader
    @expansion="onExpansion"
    @pinned="onPinned"
    :mail="displayedMail"
    :pinned="pinneds.has(displayedMail?.uid)"
    v-if="credentials"
  />
  <main v-if="credentials">
    <section id="menu" v-if="expanded"></section>
    <Suspense>
      <EmailList
        @displaying-mail="ondDisplayingMail"
        :pinneds="pinneds"
        @pinned="onPinned"
        :resize-bounds="resizeBounds"
        @resize="onResize"
        :display-right="getDisplayRight()"
        :credentials="credentials"
      />
      <template #fallback><LoadingBar :resize-bounds="resizeBounds" /></template>
    </Suspense>
    <DisplayArea
      id="displayArea"
      :class="{ extendedDisplayArea: !expanded }"
      :mail="displayedMail"
      ref="display"
      :resize-bounds="resizeBounds"
      :resizing="resizing"
    />
  </main>
</template>

<script>
import EmailList from "./components/emailList/EmailList.vue";
import LoadingBar from "./components/svg/Loading.vue";
import OptionsHeader from "./components/optionHeader/OptionsHeader.vue";
import ConnexionHeader from "./components/mainHeader/mainHeader.vue";
import DisplayArea from "./components/displayArea/DisplayArea.vue";

export default {
  name: "App",
  components: {
    EmailList,
    LoadingBar,
    OptionsHeader,
    ConnexionHeader,
    DisplayArea,
  },
  data: function () {
    return {
      credentials: undefined,
      displayedMail: undefined,
      expanded: true,
      pinneds: new Set(),
      resizeBounds: {
        lower: "300px",
        upper: "450px",
      },
      resizing: false,
    };
  },
  methods: {
    ondDisplayingMail: function (mail) {
      this.displayedMail = mail;
    },
    onExpansion: function () {
      this.expanded = !this.expanded;
    },
    onPinned: function ({ pinned, uid }) {
      if (pinned) {
        this.pinneds.add(uid);
      } else {
        this.pinneds.delete(uid);
      }
    },
    onResize: function (resizing) {
      this.resizing = resizing;
    },
    getDisplayRight: function () {
      return this.$refs.display?.getBoundingClientRect().right;
    },
    onConnected: function (credentials) {
      this.credentials = undefined;
      this.$nextTick(() => {
        this.credentials = credentials;
      });
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
