<template>
  <section ref="section">
    <div v-if="mail" id="subject">{{ mail.header.subject }}</div>
    <div v-if="mail" id="area">
      <iframe v-if="mail.html" v-show="loaded" src='javascript:"";' :srcdoc="mail.html" ref="iframe" @load="onLoaded">
      </iframe>
      <SVGError v-else id="error" />
      <Loading v-if="mail.html && !loaded" />
      <DisplayAreaReply />
    </div>
  </section>
</template>

<script>
import DisplayAreaReply from "./DisplayAreaReply.vue";
import Loading from "../svg/Loading.vue";
import SVGError from "../svg/SVGError.vue";

export default {
  name: "Display-Area",
  props: {
    mail: Object,
    resizeBounds: Object,
  },
  components: {
    DisplayAreaReply,
    Loading,
    SVGError,
  },
  data: function () {
    return {
      loaded: false,
    };
  },
  methods: {
    onLoaded: function () {
      this.loaded = true;
      this.$nextTick(() => {
        let height = `${this.$refs.iframe.contentWindow.document.body.parentNode.getBoundingClientRect().height}px`;
        this.$refs.iframe.style.height = height;
      });
    },
    getBoundingClientRect: function () {
      return this.$refs.section.getBoundingClientRect();
    },
  },
  watch: {
    mail: function () {
      this.loaded = false;
      setTimeout(() => {
        this.loaded = true;
      }, 800);
    },
  },
};
</script>

<style scoped>
section {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100% - 2rem);
  min-width: calc(v-bind("resizeBounds.upper") - 2rem);
}

#area {
  background-color: var(--light-txt-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--medium-shadow-grey);
  border-width: 0 1px 1px 1px;
  border-radius: 2px;
  flex-grow: 1;
  overflow-y: auto;
  flex-shrink: 1;
}

#subject {
  flex-shrink: 0;
  border: 1px solid var(--medium-shadow-grey);
  border-width: 1px 1px 0 1px;
  background-color: var(--light-txt-color);
  max-width: 100%;
  font-weight: 600;
  font-size: 1rem;
  padding: 1rem 10px 1rem 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

iframe {
  flex-grow: 1;
  width: calc(100% - 10px);
  margin-left: 10px;
  flex-shrink: 0;
  border: none;
}

#error {
  width: 30%;
}
</style>
