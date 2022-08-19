<template>
  <div @click="onClick" id="parent">
    <form @click.stop id="modal" ref="form">
      <div id="auth">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" autocomplete="on" required />
        <label for="password">Password</label>
        <div id="passwordContainer">
          <input v-model="password" :type="passwordInputType" id="password" autocomplete="on" required />
          <SVGShowPassword :is-visible="isPasswordVisible" @visibility-change="onPasswordVisibilityChange" />
        </div>
      </div>

      <label for="select">Mail Server</label>
      <select v-model="selected" id="select">
        <option v-for="server in Object.keys(this.presets)" :key="server" :value="server">{{ server }}</option>
      </select>

      <div id="server" :class="{ preset: selected != 'Custom' }">
        <section>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M17 13v-13h-2v5h-2v-3h-2v7h-2v-9h-2v13h-6l11 11 11-11z" />
            </svg>
            <h1>imap</h1>
          </div>
          <label for="imapHost">Host</label>
          <input v-model="imapHost" type="text" id="imapHost" autocomplete="on" :tabindex="getTabIndex()" />
          <label for="imapPort">Port</label>
          <input v-model="imapPort" type="number" min="0" id="imapPort" autocomplete="on" :tabindex="getTabIndex()" />
          <SVGServerAuth :status="imapStatus" />
        </section>
        <section>
          <div>
            <h1>smtp</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M7 11v13h2v-5h2v3h2v-7h2v9h2v-13h6l-11-11-11 11z" />
            </svg>
          </div>
          <label for="smtpHost">Host</label>
          <input v-model="smtpHost" type="text" id="smtpHost" autocomplete="on" :tabindex="getTabIndex()" />
          <label for="smtpPort">Port</label>
          <input v-model="smtpPort" type="number" min="0" id="smtpPort" autocomplete="on" :tabindex="getTabIndex()" />
          <SVGServerAuth :status="smtpStatus" />
        </section>
      </div>

      <button @click.prevent="connect">Connect</button>
    </form>
  </div>
</template>

<script>
import SVGServerAuth from "../svg/SVGServerAuth.vue";
import SVGShowPassword from "../svg/SVGShowPassword.vue";
export default {
  name: "ConnexionModal",
  emits: ["hidden", "connected"],
  methods: {
    onClick: function () {
      this.$emit("hidden");
    },
    connect: function () {
      const getFetchOptions = (type) => {
        let { host, port } = this.presets[this.selected][type];
        return {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            auth: {
              user: this.email,
              pass: this.password,
            },
            host,
            port,
          }),
        };
      };

      if (this.$refs.form.reportValidity()) {
        this.imapStatus = -1;
        this.smtpStatus = -1;
        Promise.all([
          fetch("http://localhost:3000/authIMAP", getFetchOptions("imap")),
          fetch("http://localhost:3000/authSMTP", getFetchOptions("smtp")),
        ])
          .then(([{ status: imap }, { status: smtp }]) => {
            this.imapStatus = imap;
            this.smtpStatus = smtp;
            if (this.imapStatus == 200 && this.smtpStatus == 200) {
              this.$emit("connected", {
                email: this.email,
                password: this.password,
                server: this.presets[this.selected],
              });
              setTimeout(() => {
                this.$emit("hidden");
              }, 200);
            }
          })
          .catch(() => {
            this.imapStatus = 500;
            this.smtpStatus = 500;
          });
      }
    },
    getTabIndex: function () {
      return this.selected == "0" ? "0" : "-1";
    },
    onPasswordVisibilityChange: function (visibility) {
      this.isPasswordVisible = visibility;
    },
  },
  data: function () {
    return {
      email: process.env.VUE_APP_USER_MAIL,
      password: process.env.VUE_APP_USER_PASSWORD,
      isPasswordVisible: false,
      selected: "Custom",
      imapHost: "imap.free.fr",
      imapPort: 993,
      imapStatus: 0,
      smtpHost: "smtp.free.fr",
      smtpPort: 587,
      smtpStatus: 0,
    };
  },
  computed: {
    presets: function () {
      return {
        Custom: {
          imap: { host: this.imapHost, port: this.imapPort },
          smtp: { host: this.smtpHost, port: this.smtpPort },
        },
        Gmail: {
          imap: { host: "imap.gmail.com", port: 993 },
          smtp: { host: "smtp.gmail.com", port: 587 },
        },
        Free: {
          imap: { host: "imap.free.fr", port: 993 },
          smtp: { host: "smtp.free.fr", port: 587 },
        },
      };
    },
    passwordInputType: function () {
      return this.isPasswordVisible ? "text" : "password";
    },
  },
  components: { SVGServerAuth, SVGShowPassword },
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
}

#server {
  display: flex;
  gap: 1rem;
}

#passwordContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  translate: calc(15px + 0.2rem);
  gap: 0.4rem;
  margin-bottom: 3rem;
}

#passwordContainer::after {
  content: "";
  position: absolute;
  width: 150%;
  height: 1px;
  top: calc(100% + 1.5rem);
  left: calc(-15px - 0.2rem - 25%);
  background: var(--darker-grey);
}

input {
  height: fit-content;
}

section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

section > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  fill: var(--medium-blue);
}

h1 {
  margin: 0;
  font-family: "Amatic SC", cursive;
  font-size: 2.5rem;
  font-weight: 400;
}

.preset > section > :not(svg) {
  user-select: none;
  pointer-events: none;
  opacity: 0.4;
  filter: grayscale(100%);
}

.preset > section > input::selection {
  background: none;
}

button {
  padding: 0.2rem 0.7rem;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  background: var(--light-blue);
  color: var(--dark-txt-color);
  font-weight: bold;
  letter-spacing: 1px;
  border: 3px solid black;
  border-radius: 5px;
  background: var(--light-txt-color);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
}

button:active {
  box-shadow: 2px 2px rgba(0, 0, 0, 0.2);
  transform: translate(2px, 2px);
}

#auth {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

label {
  font-size: 1.1rem;
}
</style>
