<template>
  <div id="wrapper" :class="{ C1: asArticle }">
    <div class="lds-ellipsis" :class="{ C2: asArticle }">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingBar",
  props: {
    resizeBounds: Object,
    asArticle: Boolean,
  },
};
</script>

<style scoped>
#wrapper {
  flex-grow: 0;
  min-width: v-bind("resizeBounds.lower");
  max-width: calc(85% - v-bind("resizeBounds.upper"));
  width: 25%;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.C1 {
  max-width: initial !important;
  width: auto !important;
  height: auto !important;
  background: var(--light-txt-color);
}

.C2 {
  height: 80px !important;
  height: 65px !important;
  top: -7.5px !important;
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--light-blue);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
