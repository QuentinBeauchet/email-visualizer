<template>
  <ConnexionHeader />
  <OptionsHeader
    @expansion="onExpansion"
    @pinned="onPinned"
    :mail="displayedMail"
    :pinned="pinneds.has(displayedMail?.uid)"
  />
  <main>
    <section id="menu" v-if="expanded"></section>
    <Suspense>
      <EmailList
        @displayingMail="ondDisplayingMail"
        :pinneds="pinneds"
        @pinned="onPinned"
        :resizeBounds="resizeBounds"
      />
      <template #fallback><LoadingBar /></template>
    </Suspense>
    <DisplayArea
      id="displayArea"
      :class="{ extendedDisplayArea: !expanded }"
      :mail="displayedMail"
      ref="display"
      :resizeBounds="resizeBounds"
    />
  </main>
</template>

<script>
import EmailList from "./components/emailList/EmailList.vue";
import LoadingBar from "./components/svg/Loading.vue";
import OptionsHeader from "./components/optionHeader/OptionsHeader.vue";
import ConnexionHeader from "./components/mainHeader/Header.vue";
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
      displayedMail: undefined,
      expanded: true,
      pinneds: new Set(),
      resizeBounds: {
        lower: "300px",
        upper: "450px",
      },
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
