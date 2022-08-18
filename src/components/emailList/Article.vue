<template>
  <article :class="{ selected: isDisplayed || isSelected, pinned: isPinned }">
    <div class="status" :class="{ seen: isSeen }"></div>
    <ArticleSelection
      :is-visible="isVisible || isDisplayed"
      :is-selected="isSelected"
      @set-selection-state="onSetSelectionState"
    />
    <div id="content">
      <div id="L1" v-if="!isPinned">
        <span id="sender">{{ mail.header.from.name || mail.header.from.address }}</span>
        <SVGStatus v-if="isVisible" @pinned="onPinned" @status-change="onStatusChange" />
        <SVGPin v-if="isVisible" :pinned="isPinned" @pinned="onPinned" />
      </div>
      <div id="L2">
        <span id="subject">{{ mail.header.subject }}</span>
        <SVGStatus v-if="isVisible && isPinned" @status-change="onStatusChange" />
        <SVGPin v-if="isPinned" :pinned="isPinned" @pinned="onPinned" />
        <span id="date" v-if="!isPinned">{{ getDateString(mail.date) }}</span>
      </div>
    </div>
    <ArticleDeletion :is-visible="isVisible" />
  </article>
</template>

<script>
import ArticleDeletion from "./Deletion.vue";
import ArticleSelection from "./Selection.vue";
import SVGPin from "../svg/SVGPin.vue";
import SVGStatus from "../svg/SVGStatus.vue";

export default {
  name: "MailArticle",
  data: function () {
    return {
      isCircleTickVisible: false,
    };
  },
  components: { ArticleDeletion, ArticleSelection, SVGPin, SVGStatus },
  props: {
    isVisible: Boolean,
    mail: Object,
    isDisplayed: Boolean,
    isSelected: Boolean,
    isPinned: Boolean,
  },
  emits: ["pinned", "setSelectionState"],
  computed: {
    isSeen() {
      return this.mail.flags.includes("\\Seen");
    },
  },
  methods: {
    getDateString: (_date) => {
      let date = new Date(_date);
      const msSinceThen = new Date().getTime() - date.getTime();

      const getDayInMs = (n) => n * (24 * 60 * 60 * 1000);
      const getDayString = {
        0: "Monday",
        1: "Tuesday",
        2: "Wednesday",
        3: "Thursday",
        4: "Friday",
        5: "Saturday",
        6: "Sunday",
      };

      if (msSinceThen < getDayInMs(1)) return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
      if (msSinceThen < getDayInMs(7))
        return `${getDayString[date.getDay()]} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
      if (msSinceThen < getDayInMs(30)) return `${getDayString[date.getDay()]} ${date.getDate()}/${date.getMonth()}`;
      return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    },
    onPinned: function (pinned) {
      this.$emit("pinned", { pinned, uid: this.mail.uid });
    },
    onStatusChange: function (status) {
      console.log("STATUS CHANGE", status);
    },
    onSetSelectionState: function ({ selected, all }) {
      this.$emit("setSelectionState", { selected, all, uid: this.mail.uid });
    },
  },
};
</script>

<style scoped>
.pinned {
  height: 2.5rem;
  background-color: var(--lightest-blue);
}

.selected {
  background-color: var(--lightest-blue);
}

article {
  background-color: var(--light-txt-color);
  border-bottom: 1px solid var(--medium-grey);
  display: flex;
  height: 4rem;
}

article:hover {
  background-color: var(--light-grey);
}

#content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 80%;
  padding: 0.5rem 0 0.5rem 0;
  height: fit-content;
}

#subject {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
}

#date {
  white-space: nowrap;
  font-size: smaller;
  font-weight: lighter;
  color: var(--light-blue);
  padding: 0 1rem 0 1rem;
}

#L1,
#L2 {
  display: flex;
  height: 1.3rem;
}

#L1 > *:first-child {
  flex-grow: 1;
}

#sender {
  font-size: small;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status {
  width: 0.3rem;
  flex-shrink: 0;
  background-color: var(--light-blue);
}

.seen {
  background-color: inherit;
}
</style>
