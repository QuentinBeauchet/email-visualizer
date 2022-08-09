<template>
  <SVGError v-if="fetchError" />
  <section v-else>
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
    };
  },
  props: {
    pinneds: Set,
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
  },
};
</script>

<style scoped>
section {
  flex-grow: 0;
  font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto,
    "Helvetica Neue", sans-serif;
  color: var(--dark-txt-color);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
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
}

#selectorAll {
  margin-left: 0.2rem;
}
</style>
