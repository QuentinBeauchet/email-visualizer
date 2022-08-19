<template>
  <section ref="section" :class="{ filled: mail }">
    <div v-if="mail" id="subject">
      {{ mail.header.subject }}
    </div>
    <div v-if="mail" id="area" ref="area">
      <DisplayAreaSender v-if="loaded" :mail="mail" id="sender" />
      <iframe
        v-if="mail.html"
        v-show="loaded"
        src='javascript:"";'
        :srcdoc="mail.html"
        ref="iframe"
        @load="onLoaded"
        :class="{ resizing }"
      >
      </iframe>
      <Loading v-if="!loaded" :resize-bounds="resizeBounds" />
      <SVGError v-if="loaded && mail.html === null" id="error" />
      <DisplayAreaReply />
    </div>
  </section>
</template>

<script>
import DisplayAreaReply from "./DisplayAreaReply.vue";
import Loading from "../svg/Loading.vue";
import SVGError from "../svg/SVGError.vue";
import DisplayAreaSender from "./DisplayAreaSender.vue";

export default {
  name: "DisplayArea",
  props: {
    mail: Object,
    resizeBounds: Object,
    resizing: Boolean,
  },
  components: {
    DisplayAreaReply,
    Loading,
    SVGError,
    DisplayAreaSender,
  },
  data: function () {
    return {
      loaded: false,
      iframeFlexAlign: "center",
      widthSender: "100%",
      resizeObserver: new ResizeObserver((entries) => {
        this.$refs.iframe.style.height = `${entries[0].contentRect.height}px`;
        this.$refs.iframe.style.width = `${entries[0].contentRect.width}px`;
        this.onResize();
      }),
    };
  },
  mounted: function () {
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    onLoaded: function () {
      this.loaded = true;
    },
    getBoundingClientRect: function () {
      return this.$refs.section.getBoundingClientRect();
    },
    onResize: function () {
      if (this.$refs.iframe) {
        this.iframeFlexAlign =
          this.$refs.iframe.parentNode.getBoundingClientRect().width - 30 <
          this.$refs.iframe.getBoundingClientRect().width
            ? "flex-start"
            : "center";
        this.widthSender = this.$refs.iframe.style.width;
      }
    },
  },
  updated: function () {
    if (this.$refs.iframe) {
      this.$nextTick(() => {
        let parentNode = this.$refs.iframe.contentWindow.document.body?.parentNode;
        if (parentNode) this.resizeObserver.observe(parentNode);
      });
    }
  },
  watch: {
    mail: function () {
      this.resizeObserver.disconnect();
      if (this.$refs.iframe) this.$refs.iframe.style.width = "";

      this.loaded = false;
      if (this.mail.html !== undefined) {
        setTimeout(() => {
          this.loaded = true;
        }, 800);
      }
    },
    resizing: function () {
      this.onResize();
    },
  },
};
</script>

<style scoped>
section {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100% - 2rem);
  min-width: calc(v-bind("resizeBounds.upper") - 2rem);
  background-color: var(--light-txt-color);
}

.filled {
  border: 1px solid var(--medium-shadow-grey);
  border-radius: 2px;
}

#area {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: auto;
  flex-shrink: 1;
  width: 100%;
}

#subject {
  flex-shrink: 0;
  max-width: 100%;
  font-weight: 600;
  font-size: 1rem;
  padding: 1rem 10px 1rem 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

iframe {
  flex-grow: 1;
  width: calc(100% - 20px);
  flex-shrink: 0;
  border: none;
  align-self: v-bind("iframeFlexAlign");
  margin: 0 10px 0 10px;
}

.resizing {
  pointer-events: none;
}

#error {
  width: 30%;
}

#sender {
  padding: 0 10px 1rem 10px;
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
  width: max(v-bind("widthSender"), calc(100% - 20px));
}
</style>
