<template>
  <article @click.stop="onClick">
    <div id="infos" :class="{ selected: selected == box.name }">
      <SVGCollapse @collapse="onCollapse" :collapsed="collapsed" :hidden="!box.children"></SVGCollapse>
      <span>{{ box.name }}</span>
    </div>
    <div v-if="box.children && collapsed">
      <boxes-selection-article
        v-for="child in Object.keys(box.children)"
        :key="child"
        :box="{ name: child, ...box.children[child] }"
        :depth="depth + 1"
        :selected="selected"
        @load-box="onLoadBox"
      />
    </div>
  </article>
</template>

<script>
import SVGCollapse from "../svg/SVGCollapse.vue";

export default {
  name: "BoxesSelectionArticle",
  emits: ["loadBox"],
  components: { SVGCollapse },
  props: {
    box: Object,
    depth: Number,
    selected: String,
  },
  data: function () {
    return {
      collapsed: false,
    };
  },
  methods: {
    onClick: function () {
      if (this.box.openable) {
        this.$emit("loadBox", { name: this.box.name, path: this.box.name });
      } else {
        this.onCollapse(!this.collapsed);
      }
    },
    onLoadBox: function ({ name, path }) {
      this.$emit("loadBox", { name, path: `${this.box.name}${this.box.delimiter}${path}` });
    },
    onCollapse: function (collapsed) {
      this.collapsed = collapsed;
    },
  },
};
</script>

<style scoped>
#infos {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0.5rem 0.5rem calc(0.5rem * v-bind("depth"));
}

.selected {
  background-color: var(--light-blue);
  color: var(--light-txt-color);
}

.selected:hover {
  background-color: var(--light-blue) !important;
}

#infos:hover {
  background-color: var(--medium-shadow-grey);
}
</style>
