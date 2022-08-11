<template>
  <section ref="section" :class="{ filled: mail }">
    <div v-if="mail" id="subject">
      {{ mail.header.subject }}
    </div>
    <div v-if="mail" id="area">
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
    resizing: Boolean,
  },
  components: {
    DisplayAreaReply,
    Loading,
    SVGError,
  },
  data: function () {
    return {
      loaded: false,
      iframeFlexAlign: "center",
      resizeObserver: new ResizeObserver((entries) => {
        this.$refs.iframe.style.height = `${entries[0].contentRect.height}px`;
        this.$refs.iframe.style.width = `${entries[0].contentRect.width}px`;
      }),
    };
  },
  methods: {
    onLoaded: function () {
      this.loaded = true;
    },
    getBoundingClientRect: function () {
      return this.$refs.section.getBoundingClientRect();
    },
  },
  updated: function () {
    if (this.$refs.iframe) {
      this.$nextTick(() => {
        this.resizeObserver.observe(this.$refs.iframe.contentWindow.document.body.parentNode);
      });
    }
  },
  watch: {
    mail: function () {
      this.resizeObserver.disconnect();
      this.loaded = false;
      setTimeout(() => {
        this.loaded = true;
      }, 800);
    },
    resizing: function () {
      if (this.$refs.iframe) {
        this.iframeFlexAlign =
          this.$refs.iframe.parentNode.getBoundingClientRect().width < this.$refs.iframe.getBoundingClientRect().width
            ? "flex-start"
            : "center";
      }
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
  width: calc(100% + 10px);
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
  width: calc(100% - 10px);
  margin-left: 10px;
  flex-shrink: 0;
  border: none;
  align-self: v-bind("iframeFlexAlign");
}

.resizing {
  pointer-events: none;
}

#error {
  width: 30%;
}

::-webkit-scrollbar {
  border-left: 1px solid var(--medium-shadow-grey);
}
</style>
