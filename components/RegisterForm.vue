<template>
  <div>
    <div class="py-24">
      <div class="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div class="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
          <p class="uppercase tracking-loose w-full">Uniform conf</p>
          <h1 class="my-4 text-5xl font-bold leading-tight">{{ fields.heading }}</h1>

          <form>
            <p v-if="registered">{{ fields.registeredText }}</p>
            <button
              v-else
              type="button"
              class="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg"
              @click="handleRegisterButtonClick"
            >
              {{ fields.buttonText }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <Splitter />
  </div>
</template>

<script>
import Splitter from './Splitter';

export default {
  name: 'RegisterForm',
  components: {
    Splitter,
  },
  props: {
    fields: {
      type: Object,
      default() {
        return {
          heading: '',
          registeredText: '',
          buttonText: '',
        };
      },
    },
    sys: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      registered: typeof document !== 'undefined' && Boolean(document.cookie.match(/unfrmconf_registered/)),
    };
  },
  methods: {
    handleRegisterButtonClick() {
      document.cookie = 'unfrmconf_registered=true; path=/; samesite=lax';
      this.$uniformOptimizeContext.tracker?.reevaluateSignals();
      this.registered = true;
    },
  },
};
</script>
