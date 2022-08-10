<template>
  <SVGError v-if="fetchError" ref="section" />
  <section v-else ref="section">
    <div id="container">
      <header>
        <ArticleSelection
          :is-visible="true"
          selectionType="All"
          :is-selected="this.selected.size == this.mailsInfos.length"
          id="selectorAll"
        />
        <span>Filter</span>
        <span>{{ this.mailsInfos.length }} / {{ this.boxInfos.messages }}</span>
      </header>
      <div id="list" @scroll="onScroll">
        <MailArticle
          v-for="mail in mailsList"
          :key="mail.uid"
          @mouseover="showButtons(mail.uid)"
          @mouseleave="hideButtons"
          @click="displayMail(mail)"
          :is-visible="idVisible == mail.uid"
          :mail="mail"
          :is-displayed="idDisplayed == mail.uid"
          :is-selected="this.selected.has(mail.uid)"
          :is-pinned="this.pinneds.has(mail.uid)"
          @pinned="onPinned"
        >
        </MailArticle>
      </div>
    </div>
    <div id="resizeBar" ref="resizeBar" @mousedown="onDragStart" :class="{ resizing: resizeInfos }"></div>
  </section>
</template>

<script>
import MailArticle from "./Article.vue";
import SVGError from "../svg/SVGError.vue";
import ArticleSelection from "./Selection.vue";

export default {
  name: "Email-List",
  components: {
    MailArticle,
    SVGError,
    ArticleSelection,
  },
  async setup() {
    try {
      console.log("SETUP FETCH");
      sessionStorage.clear();
      const step = 200;
      const from = step;

      let res = await fetch(`http://localhost:3000/infos?from=0&to=${step - 1}`);
      let json = await res.json();
      return {
        boxInfos: json.box,
        mailsInfos: json.mails,
        fetchError: false,
        fetchMailsOptions: {
          from,
          step,
          total: json.box.messages,
          canFetch: true,
        },
      };
    } catch (e) {
      return { fetchError: true };
    }
  },
  data: function () {
    return {
      idVisible: undefined,
      idDisplayed: undefined,
      idInSessionStorage: [],
      selected: new Set(),
      resizeInfos: undefined,
    };
  },
  props: {
    pinneds: Set,
    resizeBounds: Object,
  },
  computed: {
    mailsList: function () {
      let mails = [];
      let pinneds = [];
      for (let mail of this.mailsInfos) {
        this.pinneds.has(mail.uid) ? pinneds.push(mail) : mails.push(mail);
      }
      return pinneds.concat(mails);
    },
  },
  methods: {
    showButtons: function (uid) {
      this.idVisible = uid;
    },
    hideButtons: function () {
      this.idVisible = undefined;
    },
    displayMail: function (mail) {
      let { uid, flags, header, date } = mail;
      if (this.idDisplayed != uid) {
        this.idDisplayed = uid;
        let cache = sessionStorage.getItem(uid);
        if (cache) {
          this.$emit("displayingMail", { uid, flags, header, date, html: cache });
        } else {
          fetch(`http://localhost:3000/mail?uid=${uid}`)
            .then((res) => res.json())
            .then((json) => {
              sessionStorage.setItem(uid, json.html);
              this.$emit("displayingMail", { uid, flags, header, date, html: json.html });
            })
            .catch(() => {
              this.$emit("displayingMail", { uid, flags, header, date, html: undefined });
            });
        }

        this.idInSessionStorage.push(uid);
        if (new Set(this.idInSessionStorage).size > 10) {
          let oldUid = this.idInSessionStorage.shift();
          if (!this.idInSessionStorage.includes(oldUid)) sessionStorage.removeItem(oldUid);
        }
      }
    },
    select: function (uid) {
      this.selected.add(uid);
    },
    unselect: function (uid) {
      this.selected.delete(uid);
    },
    selectAll: function () {
      this.mailsInfos.forEach((mail) => {
        this.selected.add(mail.uid);
      });
    },
    unselectAll: function () {
      this.selected.clear();
    },
    fetchMoreMailsInfos: async function () {
      let { from, step, total, canFetch } = this.fetchMailsOptions;
      if (canFetch) {
        this.fetchMailsOptions.canFetch = false;
        this.fetchMailsOptions.canFetch = await new Promise((resolve) => {
          if (from < total) {
            let to = from + step - 1;
            fetch(`http://localhost:3000/infos?from=${from}&to=${to}`)
              .then((res) => res.json())
              .then((json) => {
                this.fetchMailsOptions.from += step;
                this.mailsInfos = this.mailsInfos.concat(json.mails);
                resolve(true);
              })
              .catch(() => resolve(true));
          } else {
            resolve(false);
          }
        });
      }
    },
    onScroll: function (e) {
      let { scrollTop, scrollHeight, offsetHeight } = e.target;
      if (scrollTop >= scrollHeight - offsetHeight) {
        this.fetchMoreMailsInfos();
      }
    },
    onPinned: function (pinned) {
      this.$emit("pinned", pinned);
    },
    onDrag: function (e) {
      let { initLeft, lower, upper, width } = this.resizeInfos;
      let newLeft = Math.max(Math.min(e.clientX, upper - 1), lower + 1) - initLeft;
      if (upper - initLeft > width || newLeft < 0 || initLeft - lower > width || newLeft > 0)
        this.$refs.resizeBar.style.left = `${newLeft}px`;
    },
    onDragStart: function () {
      this.resizeInfos = {
        initLeft: Math.round(this.$refs.resizeBar.getBoundingClientRect().left),
        width: this.$refs.resizeBar.getBoundingClientRect().width,
        lower: this.$refs.section.getBoundingClientRect().left + this.getValueFromPx(this.resizeBounds.lower),
        upper: this.$parent.$refs.display.getBoundingClientRect().right - this.getValueFromPx(this.resizeBounds.upper),
      };
      this.addResizeEvents();
    },
    onDragEnd: function () {
      this.$refs.section.style.width = `${
        this.$refs.section.getBoundingClientRect().width +
        this.$refs.resizeBar.getBoundingClientRect().right -
        this.$refs.section.getBoundingClientRect().right
      }px`;
      this.$refs.resizeBar.style.left = "0px";
      this.resizeInfos = undefined;
      this.removeResizeEvents();
    },
    addResizeEvents: function () {
      window.addEventListener("mousemove", this.onDrag);
      window.addEventListener("mouseup", this.onDragEnd);
    },
    removeResizeEvents: function () {
      window.removeEventListener("mousemove", this.onDrag);
      window.removeEventListener("mouseup", this.onDragEnd);
    },
    getValueFromPx: function (px) {
      return parseFloat(px) || 0;
    },
  },
};
</script>

<style scoped>
section {
  flex-grow: 0;
  font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto,
    "Helvetica Neue", sans-serif;
  color: var(--dark-txt-color);
  height: 100%;
  display: flex;
  flex-direction: row;
  min-width: v-bind("resizeBounds.lower");
  max-width: calc(85% - v-bind("resizeBounds.upper"));
  width: 25%;
  flex-shrink: 0;
}

#container {
  flex-grow: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: calc(100% - 4px);
  border-right: 1px solid var(--medium-shadow-grey);
}

#list {
  overflow-y: scroll;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  width: 100%;
  flex-shrink: 0;
  background-color: var(--light-txt-color);
  border: 1px solid var(--medium-grey);
  border-width: 0 0 1px 0;
}

#selectorAll {
  margin-left: 0.2rem;
}

#resizeBar {
  width: 4px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
  z-index: 10;
  position: relative;
  left: 0px;
}

.resizing {
  background-color: var(--medium-shadow-grey);
}
</style>