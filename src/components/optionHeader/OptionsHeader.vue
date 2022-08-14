<template>
  <header>
    <OptionsHeaderExpend @expansion="onExpansion" id="expend" />
    <OptionsHeaderNew />
    <OptionsHeaderReply v-if="mail" />
    <OptionsHeaderDeletion v-if="mail" />
    <OptionsHeaderSpam v-if="mail" />
    <OptionsHeaderBlockSender v-if="mail" />
    <OptionsHeaderPin
      v-if="mail"
      @pinned="onPinned"
      :pinned="pinned"
      :key="mail.uid"
    />
    <OptionsHeaderChangeStatus :is-seen="isSeen" />
  </header>
</template>

<script>
import OptionsHeaderExpend from "./OptionsHeaderExpend.vue";
import OptionsHeaderNew from "./OptionsHeaderNew.vue";
import OptionsHeaderReply from "./OptionsHeaderReply.vue";
import OptionsHeaderDeletion from "./OptionsHeaderDeletion.vue";
import OptionsHeaderSpam from "./OptionsHeaderSpam.vue";
import OptionsHeaderBlockSender from "./OptionsHeaderBlockSender.vue";
import OptionsHeaderPin from "./OptionsHeaderPin.vue";
import OptionsHeaderChangeStatus from "./OptionsHeaderChangeStatus.vue";

export default {
  name: "OptionsHeader",
  components: {
    OptionsHeaderExpend,
    OptionsHeaderNew,
    OptionsHeaderReply,
    OptionsHeaderDeletion,
    OptionsHeaderSpam,
    OptionsHeaderBlockSender,
    OptionsHeaderPin,
    OptionsHeaderChangeStatus,
  },
  props: {
    mail: Object,
    pinned: Boolean,
  },
  emits: ["expansion", "pinned"],
  data: function () {
    return {
      iframeContent: undefined,
    };
  },
  computed: {
    isSeen() {
      return this.mail?.flags.includes("\\Seen");
    },
  },
  methods: {
    onExpansion: function () {
      this.$emit("expansion");
    },
    onPinned: function (pinned) {
      this.$emit("pinned", { pinned, uid: this.mail.uid });
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 0.1rem;
  background-color: var(--medium-grey);
  gap: 0.2rem;
}

#expend {
  margin-right: 1rem;
}
</style>
