<template>
  <div @click="hideConnection" id="parent">
    <form @click.stop id="modal">
      <Input v-for="(item, index) in inputs" :key="index" :label="item.label" :type="item.type" v-model="item.value" />
      <button @click.prevent="connect">Connect</button>
    </form>
  </div>
</template>

<script>
import Input from "./Input.vue";

export default {
  name: "Connexion-Modal",
  methods: {
    hideConnection: function () {
      this.$parent.hideConnection();
    },
    connect: function () {
      console.log(this);
    },
  },
  data: function () {
    return {
      inputs: [
        { label: "Email", type: "email", value: "" },
        { label: "Password", type: "password", value: "" },
      ],
    };
  },
  components: { Input },
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
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>
