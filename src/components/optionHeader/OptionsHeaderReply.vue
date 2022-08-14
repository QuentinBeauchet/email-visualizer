<template>
  <div>
    <Transition name="moreOptions">
      <div
        id="moreOptions"
        v-show="isMoreVisible"
        tabindex="0"
        @focusout="handleFocusOut"
      >
        <ul @keydown.prevent="onKeyDown" ref="listOptions">
          <li @click="reply(0)" tabindex="1">Reply</li>
          <li @click="reply(1)" tabindex="2">Reply to all</li>
          <li @click="reply(2)" tabindex="3">Transfer</li>
        </ul>
      </div>
    </Transition>
    <button @click="reply(1)" class="options-header-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M11 16v-2.048s-7.156-.066-11 4.048c1.806-7.861 11-9.913 11-9.913v-2.087l7.18 5.02-7.18 4.98zm6-10v2.184l3.891 2.836-3.891 2.835v2.145l7-4.98-7-5.02z"
        />
      </svg>
      <span>Reply to all</span>
    </button>
    <div id="bar"></div>
    <button
      id="more"
      @click="onMore"
      ref="moreButton"
      class="options-header-button"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
          fill-rule="nonzero"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "OptionsHeaderReply",
  data: function () {
    return {
      isMoreVisible: false,
    };
  },
  methods: {
    reply: function (type) {
      if (type == 0) {
        console.log("REPLY");
      } else if (type == 1) {
        console.log("REPLY ALL");
      } else {
        console.log("TRANSFER");
      }
      document.activeElement.blur();
      this.handleFocusOut();
    },
    onMore: function () {
      this.isMoreVisible = !this.isMoreVisible;
      if (this.isMoreVisible) {
        this.$nextTick(() => {
          this.$refs.listOptions.firstChild.focus();
        });
      }
    },
    handleFocusOut(e) {
      if (
        !this.$refs.listOptions.contains(
          e?.relatedTarget || document.activeElement
        ) &&
        this.$refs.moreButton != e?.relatedTarget
      ) {
        this.isMoreVisible = false;
      }
    },
    onKeyDown({ key }) {
      if (key == "Enter") {
        document.activeElement.click();
        return;
      }

      let total = this.$refs.listOptions.childNodes.length;
      let index = document.activeElement.tabIndex - 1;

      if (["Tab", "ArrowDown", "ArrowRight"].includes(key)) {
        let newIndex = index + 1;
        this.$refs.listOptions.childNodes[newIndex % total].focus();
      }
      if (["ArrowUp", "ArrowLeft"].includes(key)) {
        let newIndex = index - 1;
        this.$refs.listOptions.childNodes[
          newIndex < 0 ? total - 1 : newIndex
        ].focus();
      }
    },
  },
};
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#more {
  width: 2rem;
  padding: 0;
}

svg {
  fill: currentColor;

  clip-rule: evenodd;
  fill-rule: evenodd;
  stroke-linejoin: round;
  stroke-miterlimit: 2;
  width: 15px;
  height: 15px;
}

#bar {
  width: 1px;
  background-color: var(--dark-grey);
  height: 50%;
}

#moreOptions {
  position: relative;
  width: 0;
  height: 100%;
  top: calc(100% + 0.1rem);
  z-index: 10;
}

.moreOptions-enter-active {
  animation: bounce-in 180ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes bounce-in {
  from {
    transform: translate(0, -0.3rem);
    font-weight: 0;
  }
  to {
    transform: translate(0, 0);
    font-weight: 400;
  }
}

ul {
  position: absolute;
  top: 0;
  left: 0;

  background-color: var(--light-txt-color);
  box-shadow: 1px 1px 10px var(--dark-grey);
  list-style: none;
  padding: 0;
  margin: 0;
  white-space: nowrap;
  width: 10rem;
  user-select: none;
  cursor: pointer;
}

li {
  height: 2rem;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
}

li:hover {
  background-color: var(--medium-shadow-grey);
}
</style>
