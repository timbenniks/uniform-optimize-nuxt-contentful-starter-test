<template>
  <div>
    <div class="pt-24">
      <div
        class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center"
        style="height: '548px'"
      >
        <div
          class="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left min-h-500"
        >
          <p class="uppercase tracking-loose w-full"></p>
          <h1 class="my-4 text-5xl font-bold leading-tight"></h1>
          <p class="leading-normal text-2xl mb-8"></p>
        </div>
        <div class="w-full md:w-3/5 py-6 text-center"></div>
      </div>
    </div>
    <Splitter />
  </div>
</template>
<script>
import Splitter from './Splitter';

export default {
  name: 'PersonalizedHeroLoading',
  components: {
    Splitter,
  },
};
</script>
