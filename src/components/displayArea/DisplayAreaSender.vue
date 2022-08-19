<template>
  <div>
    <div id="user">
      <img :src="imgUrl" @click="filterBySender" />
      <div id="text">
        <span id="from" @click="filterBySender"
          >{{ mail.header.from.name }} {{ "<" }}{{ mail.header.from.address }}{{ ">" }}</span
        >
        <span id="to" @click="onZoom"
          >To :
          <template v-for="person in mail.header.to">{{ `${person.name} <${person.address}>;` }}</template>
        </span>
      </div>
    </div>
    <div>
      <span id="date">{{ this.getDateString(mail.date) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DisplayAreaSender",
  props: { mail: Object },
  emits: ["filter"],
  data: function () {
    return {
      toStyle: { cursor: "zoom-in", height: "15px" },
      to: [
        "Quentin Beauchet",
        "Ratna Beau",
        "Puabi Iris",
        "Quiteria Gasparo",
        "Laurette Sudarshan",
        "Gerlind Canute",
        "Marina Katelijne",
        "Bahram Sezim",
        "Soraya Pushpa",
        "Milian Ireneus",
        "Orsino Juda",
        "Quiteria Gasparo",
        "Laurette Sudarshan",
        "Gerlind Canute",
        "Marina Katelijne",
        "Bahram Sezim",
        "Soraya Pushpa",
        "Milian Ireneus",
        "Orsino Juda",
        "Quiteria Gasparo",
        "Laurette Sudarshan",
        "Gerlind Canute",
        "Marina Katelijne",
        "Bahram Sezim",
        "Soraya Pushpa",
        "Milian Ireneus",
        "Orsino Juda",
      ],
    };
  },
  computed: {
    imgUrl: function () {
      return `https://avatars.dicebear.com/api/adventurer-neutral/${this.mail.header.from.address}.svg`;
    },
  },
  methods: {
    getDateString: (_date) => {
      let date = new Date(_date);
      const getDayString = {
        0: "Monday",
        1: "Tuesday",
        2: "Wednesday",
        3: "Thursday",
        4: "Friday",
        5: "Saturday",
        6: "Sunday",
      };

      return `${
        getDayString[date.getDay()]
      } ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    },
    onZoom: function () {
      if (this.toStyle.cursor == "zoom-in") {
        this.toStyle = { cursor: "zoom-out", height: "initial" };
      } else {
        this.toStyle = { cursor: "zoom-in", height: "17px" };
      }
    },
    filterBySender: function () {
      this.$emit("filter", this.mail.header.from.email);
    },
  },
};
</script>

<style scoped>
img {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
}

#user {
  display: flex;
  font-size: 12px;
  margin-right: 1rem;
  flex-grow: 1;
}

#text {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  flex-grow: 1;
}

#from,
img {
  cursor: pointer;
}

#to {
  cursor: v-bind("toStyle.cursor");
  overflow: hidden;
  text-overflow: ellipsis;
  height: v-bind("toStyle.height");
}

#date {
  font-size: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
