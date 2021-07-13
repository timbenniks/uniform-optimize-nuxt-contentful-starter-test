<template>
  <div>
    <div class="pt-24">
      <div class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div
          class="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left min-h-500"
        >
          <p class="uppercase tracking-loose w-full">Uniform demo</p>
          <h1 class="my-4 text-5xl font-bold leading-tight">{{ fields.title }}</h1>
          <p class="leading-normal text-2xl mb-8">{{ fields.description }}</p>

          <NuxtLink
            :to="fields.buttonLinkSlug || ''"
            class="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg"
          >
            {{ fields.buttonText }}
          </NuxtLink>
        </div>
        <div class="w-full md:w-3/5 py-6 text-center">
          <img
            v-if="imageUrl"
            class="w-full md:w-4/5 z-50 min-h-500 max-h-500"
            height="500"
            :src="imageUrl"
            :alt="fields.buttonText"
          />
        </div>
      </div>
    </div>
    <Splitter />
  </div>
</template>

<script>
import Splitter from './Splitter';

export default {
  name: 'Hero',
  components: {
    Splitter,
  },
  props: {
    fields: {
      type: Object,
      default() {
        return {
          title: '',
          description: '',
          buttonLinkSlug: '',
          buttonText: '',
          image: {},
          unfrmOptIntentTag: undefined,
        };
      },
    },
  },
  computed: {
    imageUrl() {
      return this.fields.image?.fields?.file?.url;
    },
  },
  mounted() {
    this.$uniformOptimize.trackBehavior(this.fields.unfrmOptIntentTag);
  },
};
</script>
