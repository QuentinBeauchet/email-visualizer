<template>
  <SVGError v-if="fetchError" ref="section" />
  <section v-else ref="section">
    <div id="container">
      <header>
        <ArticleSelection
          :is-visible="true"
          selection-type="All"
          :is-selected="this.selected.size == this.mailsInfos.length"
          id="selectorAll"
          @set-selection-state="onSetSelectionState"
        />
        <span> Filter </span>
        <EmailListFetchProgression :current="mailsInfos.length" :max="boxInfos.messages" />
      </header>
      <div id="list" @scroll="onScroll" ref="listContainer">
        <MailArticle
          v-for="mail in mailsList"
          :key="mail.uid"
          ref="list"
          @mouseover="showButtons(mail.uid)"
          @mouseleave="hideButtons"
          @click="displayMail(mail)"
          :is-visible="idVisible == mail.uid"
          :mail="mail"
          :is-displayed="idDisplayed == mail.uid"
          :is-selected="this.selected.has(mail.uid)"
          :is-pinned="this.pinneds.has(mail.uid)"
          @pinned="onPinned"
          @set-selection-state="onSetSelectionState"
        >
        </MailArticle>
        <Loading v-if="mailsInfos.length != boxInfos.messages" :resize-bounds="resizeBounds" :as-article="true" />
      </div>
    </div>
    <div id="resizeBar" ref="resizeBar" @mousedown="onDragStart" :class="{ resizing: resizeInfos }"></div>
  </section>
</template>

<script>
import { ref } from "vue";

import MailArticle from "./Article.vue";
import SVGError from "../svg/SVGError.vue";
import ArticleSelection from "./Selection.vue";
import EmailListFetchProgression from "./emailListFetchProgression.vue";
import Loading from "../svg/Loading.vue";

export default {
  name: "EmailList",
  components: {
    MailArticle,
    SVGError,
    ArticleSelection,
    EmailListFetchProgression,
    Loading,
  },
  emits: ["displayingMail", "pinned", "resize"],
  async setup(props) {
    try {
      sessionStorage.clear();
      const step = 200;
      const from = step;

      let res = await fetch(`${process.env.VUE_APP_API_URL || window.location.href}infos`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          auth: {
            user: props.credentials.email,
            pass: props.credentials.password,
          },
          host: props.credentials.server.imap.host,
          port: props.credentials.server.imap.port,
          box: props.box,
          range: {
            from: 0,
            to: step - 1,
          },
        }),
      });
      let json = await res.json();

      return {
        boxInfos: ref(json.box),
        mailsInfos: ref(json.mails),
        fetchError: false,
        fetchMailsOptions: {
          from,
          step,
          total: json.box.messages,
          canFetch: true,
        },
      };
    } catch (e) {
      console.log(e);
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
    displayRight: Number,
    credentials: Object,
    box: String,
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
          let { html, attachments } = JSON.parse(cache);
          this.$emit("displayingMail", {
            uid,
            flags,
            header,
            date,
            html,
            attachments,
          });
        } else {
          this.$emit("displayingMail", {
            uid,
            flags,
            header,
            date,
            html: undefined,
            attachments: [],
          });
          fetch(`${process.env.VUE_APP_API_URL || window.location.href}mail`, {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              auth: {
                user: this.credentials.email,
                pass: this.credentials.password,
              },
              host: this.credentials.server.imap.host,
              port: this.credentials.server.imap.port,
              box: this.box,
              uid: uid,
            }),
          })
            .then((res) => res.json())
            .then(({ html, attachments }) => {
              sessionStorage.setItem(uid, JSON.stringify({ html, attachments }));
              this.$emit("displayingMail", {
                uid,
                flags,
                header,
                date,
                html,
                attachments,
              });
            })
            .catch(() => {
              this.$emit("displayingMail", {
                uid,
                flags,
                header,
                date,
                html: null,
                attachments: [],
              });
            });
        }

        this.idInSessionStorage.push(uid);
        if (new Set(this.idInSessionStorage).size > 10) {
          let oldUid = this.idInSessionStorage.shift();
          if (!this.idInSessionStorage.includes(oldUid)) sessionStorage.removeItem(oldUid);
        }
      }
    },
    onSetSelectionState: function ({ selected, all, uid }) {
      if (all) {
        if (selected) {
          this.mailsInfos.forEach((mail) => {
            this.selected.add(mail.uid);
          });
        } else {
          this.selected.clear();
        }
      } else {
        if (selected) {
          this.selected.add(uid);
        } else {
          this.selected.delete(uid);
        }
      }
    },
    fetchMoreMailsInfos: async function () {
      let { from, step, total, canFetch } = this.fetchMailsOptions;
      if (canFetch) {
        this.fetchMailsOptions.canFetch = false;
        this.fetchMailsOptions.canFetch = await new Promise((resolve) => {
          if (from < total) {
            let to = from + step - 1;

            fetch(`${process.env.VUE_APP_API_URL || window.location.href}infos`, {
              method: "POST",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              body: JSON.stringify({
                auth: {
                  user: this.credentials.email,
                  pass: this.credentials.password,
                },
                host: this.credentials.server.imap.host,
                port: this.credentials.server.imap.port,
                range: {
                  from,
                  to,
                },
              }),
            })
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
        upper: this.displayRight - this.getValueFromPx(this.resizeBounds.upper),
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
      this.$emit("resize", true);
      window.addEventListener("mousemove", this.onDrag);
      window.addEventListener("mouseup", this.onDragEnd);
    },
    removeResizeEvents: function () {
      this.$emit("resize", false);
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
  color: var(--dark-txt-color);
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-grow: 0;
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
  overflow-y: auto;
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
