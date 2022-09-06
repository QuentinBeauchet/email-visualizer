<template>
  <EditionArea v-show="editing" @editing="onEditing" :credentials="credentials" />
  <OptionsHeader
    @expansion="onExpansion"
    @pinned="onPinned"
    @editing="onEditing"
    :mail="displayedMail"
    :pinned="pinneds.has(displayedMail?.uid)"
    v-if="credentials"
  />
  <main>
    <BoxesSelection id="menu" v-show="expanded" :credentials="credentials" @load-box="onLoadBox" />
    <Suspense v-if="box">
      <EmailList
        @displaying-mail="ondDisplayingMail"
        :pinneds="pinneds"
        @pinned="onPinned"
        :resize-bounds="resizeBounds"
        @resize="onResize"
        @width-changed="onListWidthChanged"
        :display-right="getDisplayRight()"
        :credentials="credentials"
        :box="box"
      />
      <template #fallback><LoadingBar :resize-bounds="resizeBounds" :width="resizeBounds.listWidth" /></template>
    </Suspense>
    <DisplayArea
      id="displayArea"
      :class="{ extendedDisplayArea: !expanded }"
      :mail="displayedMail"
      ref="display"
      :resize-bounds="resizeBounds"
      :resizing="resizing"
      :credentials="credentials"
      :box="box"
    />
  </main>
</template>

<script>
import EmailList from "./emailList/EmailList.vue";
import DisplayArea from "./displayArea/DisplayArea.vue";
import BoxesSelection from "./boxesSelection/BoxesSelection.vue";
import OptionsHeader from "./optionHeader/OptionsHeader.vue";
import LoadingBar from "./svg/Loading.vue";
import EditionArea from "./EditionArea/EditionArea.vue";

export default {
  name: "MainComponent",
  components: {
    EmailList,
    DisplayArea,
    BoxesSelection,
    OptionsHeader,
    LoadingBar,
    EditionArea,
  },
  emits: ["reset-data"],
  props: {
    credentials: Object,
  },
  data: function () {
    return {
      resizeBounds: {
        lower: "300px",
        upper: "450px",
        listWidth: "25%",
      },
      displayedMail: undefined,
      pinneds: new Set(),
      expanded: true,
      resizing: false,
      box: "INBOX",
      editing: false,
    };
  },
  methods: {
    onExpansion: function () {
      this.expanded = !this.expanded;
    },
    ondDisplayingMail: function (mail) {
      this.displayedMail = mail;
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
    onLoadBox: function (box) {
      this.box = undefined;
      this.$nextTick(() => {
        this.box = box;
      });
      this.$emit("reset-data");
    },
    onListWidthChanged: function (width) {
      this.resizeBounds.listWidth = width;
    },
    onEditing: function ({ state, args }) {
      console.log("EDITING", state, args);
      this.editing = state;
    },
  },
};
</script>

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
