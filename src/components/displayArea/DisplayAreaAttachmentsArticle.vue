<template>
  <article @click="download">
    <SVGDownload class="download" :loading="loading" />
    <div>
      <span>{{ attachment.filename }}</span>
      <span class="size">{{ getFileSize }}</span>
    </div>
  </article>
</template>

<script>
import SVGDownload from "../svg/SVGDownload.vue";
export default {
  name: "DisplayAreaAttachmentsArticle",
  props: { uid: Number, attachment: Object, credentials: Object, box: String },
  data: function () {
    return {
      loading: false,
    };
  },
  computed: {
    getFileSize: function () {
      let size = this.attachment.size / 1.436;
      if (size < 1000) return `${size.toFixed(2)} o`;
      if (size < 1000000) return `${(size / 1000).toFixed(2)} Ko`;
      if (size < 1000000000) return `${(size / 1000000).toFixed(2)} Mo`;
      return `${(size / 1000000000).toFixed(2)} Go`;
    },
    getCursor: function () {
      return this.loading ? "progress" : "pointer";
    },
  },
  methods: {
    download: function () {
      this.loading = true;
      fetch(`${process.env.VUE_APP_API_URL || window.location.href}attachment`, {
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
          uid: this.uid,
          attachment: this.attachment,
        }),
      })
        .then((res) => res.json())
        .then(({ type, subtype, content }) => {
          let a = document.createElement("a");
          a.setAttribute("href", `data:${type}/${subtype};base64,${content}`);
          a.setAttribute("download", this.attachment.filename);
          a.click();
          this.loading = false;
        });
    },
  },
  components: { SVGDownload },
};
</script>

<style scoped>
article {
  width: 10rem;
  display: flex;
  flex-direction: row;
  border: 1px solid var(--dark-grey);
  border-radius: 5px;
  padding: 0.1rem 0.5rem;
  cursor: v-bind("getCursor");
  gap: 0.5rem;
}

article:hover {
  background: var(--medium-shadow-grey);
}

article > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.download {
  flex-grow: 0;
  align-items: center;
  align-self: center;
  width: 18px;
  height: 18px;
}

span {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 12px;
}

.size {
  font-size: 10px;
  color: var(--medium-txt-color);
}

svg {
  width: 18px;
  height: 18px;
}
</style>
