<template>
  <div :class="cssClass">
    <div class="absolute bottom-0 left-0 right-0 top-0 bg-white bg-opacity-50"></div>
    <div class="relative">
      <svg
        data-testid="svg"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        class="stroke-current"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".25" cx="18" cy="18" r="18"></circle>
            <path d="M36 18c0-9.94-8.06-18-18-18" transform="rotate(166.645 18 18)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.8s"
                repeatCount="indefinite"
              ></animateTransform>
            </path>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 40,
    },
    height: {
      type: Number,
      default: 40,
    },
  },
  computed: {
    cssClass() {
      return `${
        this.isActive ? 'flex' : 'hidden'
      } absolute bottom-0 left-0 right-0 top-0 items-center justify-center overflow-hidden z-50`;
    },
  },
};
</script>
