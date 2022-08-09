<template>
  <header>
    <h1>{{ email }}</h1>
    <div>
      <button @click="showConnection">Sign In</button>
    </div>
    <Connexion v-show="isConnexionVisible" />
  </header>
</template>

<script>
import Connexion from "./Connexion.vue";

export default {
  name: "Connexion-Header",
  components: {
    Connexion,
  },
  methods: {
    showConnection: function () {
      this.isConnexionVisible = true;
    },
    hideConnection: function () {
      this.isConnexionVisible = false;
    },
  },
  data: function () {
    return {
      email: "quentinbeauchet@free.fr",
      isConnexionVisible: false,
    };
  },
};
</script>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: var(--light-blue);
  color: var(--light-txt-color);
  height: 3rem;
}

h1 {
  margin: 0 0 0.5rem 1rem;
  vertical-align: middle;
  font-weight: bold;
  font-size: 2rem;
  color: var(--light-txt-color);
  text-shadow: 1px 1px 1px var(--light-blue), 1px 2px 1px var(--light-blue), 1px 3px 1px var(--light-blue),
    1px 4px 1px var(--light-blue), 1px 5px 1px var(--light-blue), 1px 6px 1px var(--light-blue),
    1px 10px 5px rgba(16, 16, 16, 0.5), 1px 15px 10px rgba(16, 16, 16, 0.4), 1px 20px 30px rgba(16, 16, 16, 0.3),
    1px 25px 50px rgba(16, 16, 16, 0.2);
  font-family: "Amatic SC", cursive;
}

button {
  padding: 0.2rem 0.7rem;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  background: var(--light-blue);
  border: 3px solid white;
  color: var(--light-txt-color);
  font-weight: bold;
  letter-spacing: 1px;
  margin-right: 1rem;
  transition: transform 0.5s, box-shadow 0.5s;
}

button:hover {
  box-shadow: 3px 3px 0px var(--light-txt-color);
  transform: translate(-3px);
}
</style>
