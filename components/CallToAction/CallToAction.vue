<template>
  <div>
    <WaveSplitter />
    <section class="container mx-auto text-center py-6 mb-12">
      <h1 class="w-full my-2 text-5xl font-bold leading-tight text-center text-white">
        {{ fields.heading }}
      </h1>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t" />
      </div>
      <h2 class="my-4 text-3xl leading-tight">{{ fields.subheading }}</h2>
      <br />
      <button
        v-if="fields.buttonLink && fields.buttonImage"
        class="mx-auto mt-3 lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg"
        name="call to action"
        @click="handleButtonClick"
      >
        <img :src="fields.buttonImage.fields.file.url" alt="button image" />
      </button>
      <a
        v-if="fields.buttonLink && !fields.buttonImage"
        :href="fields.buttonLink"
        target="_new"
        class="mx-auto mt-3 lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg"
      >
        {{ fields.buttonText }}
      </a>
    </section>
  </div>
</template>
<script>
import WaveSplitter from './WaveSplitter';

export default {
  name: 'CallToAction',
  components: {
    WaveSplitter,
  },
  props: {
    fields: {
      type: Object,
    },
    sys: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    handleButtonClick() {
      window.open(this.fields.buttonLink);
    },
  },
};
</script>
