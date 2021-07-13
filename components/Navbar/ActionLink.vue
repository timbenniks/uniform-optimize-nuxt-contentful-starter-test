<template>
  <button id="navAction" :class="cssClass" @click="onClick">
    <div class="flex items-center">
      <div><slot name="icon" /></div>
      <div class="ml-1">{{ label }}</div>
    </div>
  </button>
</template>
<script>
const ActionLink = {
  name: 'ActionLink',
  props: {
    onClick: {
      type: Function,
      default() {
        return () => undefined;
      },
    },
    label: {
      type: String,
    },
    isScrolled: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    cssClass() {
      return `mx-auto lg:mx-0 hover:underline font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 ${
        this.isScrolled ? 'gradient text-white' : 'bg-white text-gray-800'
      }`;
    },
  },
};

export default ActionLink;
</script>
