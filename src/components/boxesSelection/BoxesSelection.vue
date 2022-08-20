<template>
  <section>
    <h1>Folders</h1>
    <boxes-selection-article
      v-for="box in Object.keys(boxes)"
      :key="box"
      :box="{ name: box, ...boxes[box] }"
      :depth="1"
      :selected="selected"
      @load-box="onLoadBox"
    />
  </section>
</template>

<script>
import BoxesSelectionArticle from "./BoxesSelectionArticle.vue";
export default {
  components: { BoxesSelectionArticle },
  name: "App",
  emits: ["loadBox"],
  async setup(props) {
    try {
      let res = await fetch(`${process.env.VUE_APP_API_URL || window.location.href}boxes`, {
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
        }),
      });
      return {
        boxes: await res.json(),
      };
    } catch (e) {
      console.log(e);
      return { fetchError: true };
    }
  },
  props: {
    credentials: Object,
  },
  data: function () {
    return {
      selected: "INBOX",
    };
  },
  methods: {
    onLoadBox: function ({ name, path }) {
      this.selected = name;
      this.$emit("loadBox", path);
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0 0.5rem 0;
  overflow: auto;
}

h1 {
  align-self: center;
  font-family: "Amatic SC", cursive;
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}
</style>
