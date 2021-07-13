<template>
  <div class="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
    <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow space-y-2 pt-2">
      <div class="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden">
        <div class="mt-3 mb-3 flex items-center justify-start">
          <template v-for="(intentId, index) in intents">
            <span
              v-if="intentId"
              :key="index"
              :class="`ml-6 px-6 inline-flex text-xs leading-5 font-semibold rounded-full ${
                getIntentLabel(intentId).css
              }`"
            >
              {{ getIntentLabel(intentId).text }}
            </span>
          </template>
        </div>
      </div>
      <a href="#" class="flex flex-wrap no-underline hover:no-underline">
        <div class="w-full font-bold text-xl text-gray-800 px-6">{{ fields.title }}</div>
      </a>
      <div class="text-gray-800 px-6 pb-6 text-sm" v-html="getDescriptionHtml()"></div>
    </div>
  </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const developersLabel = {
  css: 'bg-green-100 text-green-800',
  text: 'Developers',
};
const marketersLabel = {
  css: 'bg-indigo-100 text-indigo-800',
  text: 'Marketers',
};
const unknownLabel = {
  css: 'bg-indigo-100 text-indigo-800',
  text: 'Unknown',
};

export default {
  name: 'TalkListItem',
  props: {
    fields: {
      type: Object,
      default() {
        return {
          title: '',
          description: '',
        };
      },
    },
  },
  computed: {
    intents() {
      return Object.keys(this.fields.unfrmOptIntentTag?.intents) || [];
    },
  },
  methods: {
    getDescriptionHtml() {
      return documentToHtmlString(this.fields.description);
    },
    getIntentLabel(intentId) {
      if (!intentId) {
        return { css: '', label: '' };
      }

      if (intentId === '72ba66d0-0478-4d62-9ef4-5461c89b1ffc' || intentId === 'dev') {
        return developersLabel;
      }

      if (intentId === '0d77df8f-a903-4163-befb-008bd061d454' || intentId === 'marketer') {
        return marketersLabel;
      }

      return unknownLabel;
    },
  },
};
</script>
