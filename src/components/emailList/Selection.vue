<template>
  <div>
    <svg
      v-if="svgType == 'tickHidden'"
      @mouseover="showCircleTick"
      @mouseleave="hideCircleTick"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11.998 2c5.517 0 9.997 4.48 9.997 9.998 0 5.517-4.48 9.997-9.997 9.997-5.518 0-9.998-4.48-9.998-9.997 0-5.518 4.48-9.998 9.998-9.998zm0 1.5c-4.69 0-8.498 3.808-8.498 8.498s3.808 8.497 8.498 8.497 8.497-3.807 8.497-8.497-3.807-8.498-8.497-8.498z"
        fill-rule="nonzero"
      />
    </svg>
    <svg
      v-if="svgType == 'tickVisible'"
      @mouseleave="hideCircleTick"
      @click.stop="select"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm0 1.5c-4.69 0-8.498 3.807-8.498 8.497s3.808 8.498 8.498 8.498 8.497-3.808 8.497-8.498-3.807-8.497-8.497-8.497zm-5.049 8.886 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
        fill-rule="nonzero"
      />
    </svg>
    <svg
      v-if="svgType == 'selected'"
      @click.stop="select"
      class="selected"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm-5.049 10.386 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
        fill-rule="nonzero"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "Article-Selection",
  data: function () {
    return {
      isCircleTickVisible: false,
    };
  },
  computed: {
    svgType() {
      if (this.isSelected) return "selected";
      if (this.isVisible) return this.isCircleTickVisible ? "tickVisible" : "tickHidden";
      return "none";
    },
  },
  props: {
    isVisible: Boolean,
    isSelected: Boolean,
    selectionType: String,
  },
  methods: {
    showCircleTick: function () {
      this.isCircleTickVisible = true;
    },
    hideCircleTick: function () {
      this.isCircleTickVisible = false;
    },
    select: function () {
      if (this.selectionType == "All") {
        this.isSelected ? this.$parent.unselectAll() : this.$parent.selectAll();
      } else {
        this.isSelected ? this.$parent.unselect() : this.$parent.select();
      }
    },
  },
};
</script>

<style scoped>
div {
  width: calc(10% - 0.3rem);
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  fill: currentColor;
  opacity: 0.5;
  cursor: pointer;

  clip-rule: evenodd;
  fill-rule: evenodd;
  stroke-linejoin: round;
  stroke-miterlimit: 2;
  width: 27px;
  height: 27px;
}

.selected {
  fill: var(--light-blue);
  opacity: 1;
}
</style>
