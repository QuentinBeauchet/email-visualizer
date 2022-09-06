<template>
  <div @click="onClick" id="parent">
    <form @click.stop id="modal" ref="form">
      <div id="inputs">
        <input type="email" ref="to" name="to" multiple required placeholder="To" />
        <input type="email" ref="cc" name="cc" multiple placeholder="CC" />
        <input type="email" ref="bcc" name="bcc" multiple placeholder="BCC" />
        <input type="text" ref="subject" name="subject" placeholder="Subject" />
      </div>
      <textarea ref="content" name="content" rows="15" cols="100"></textarea>
      <button class="options-header-button" @click.prevent="send">SEND</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ReplyArea",
  emits: ["editing"],
  props: {
    credentials: Object,
  },
  methods: {
    onClick: function () {
      this.$emit("editing", {
        state: false,
      });
    },
    send: function () {
      if (this.$refs.form.reportValidity()) {
        console.log(this.$refs);
        fetch(`${process.env.VUE_APP_API_URL || window.location.href}send`, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            auth: {
              user: this.credentials.email,
              pass: this.credentials.password,
            },
            mail: {
              to: this.$refs.to.value.split(","),
              cc: this.$refs.cc.value.split(","),
              bcc: this.$refs.bcc.value.split(","),
              subject: this.$refs.subject.value,
              text: this.$refs.content.value,
              html: "",
            },
            host: this.credentials.server.smtp.host,
            port: this.credentials.server.smtp.port,
          }),
        });
        this.onClick();
      }
    },
  },
};
</script>

<style scoped>
#parent {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

#modal {
  background: white;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  color: var(--dark-txt-color);
  padding: 1rem;
  border: 3px solid black;
  border-radius: 5px;
  background: var(--light-txt-color);
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  max-width: 90vw;
}

input[type="email"],
input[type="text"] {
  border-width: 0 0 1px 0;
  font-size: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

input[type="email"]:focus,
input[type="text"]:focus {
  outline: none;
}

textarea {
  margin: 2rem 0 1rem 0;
  min-height: 2rem;
  min-width: 18rem;
  max-width: 100%;
  max-height: 100%;
}

#inputs {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

button {
  font-size: 1.5rem;
}
</style>
