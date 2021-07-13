<template>
  <section class="bg-white border-b py-8">
    <Personalize
      v-if="Array.isArray(talks) && talks.length > 0"
      name="Personalized Talk List"
      :variations="personalizableTalks"
      :component="talkListItem"
      :count="fields.count"
      :button-text="fields.registerButtonText"
      :tracking-event-name="fields.talkListPersonalized"
      match-filter="any"
    >
      <template #variations="{ personalized, components }">
        <div class="container mx-auto flex flex-wrap pt-4 pb-12">
          <h1 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
            {{ personalized ? fields.p13nTitle : fields.title }}
          </h1>
          <div class="w-full mb-4">
            <div class="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
          </div>
          <template v-for="(component, index) in components">
            <component :is="component" v-if="component" :key="index" />
            <div v-else :key="index"></div>
          </template>
        </div>
      </template>
    </Personalize>
  </section>
</template>
<script>
import { Personalize } from '@uniformdev/optimize-tracker-vue';
import { contentfulOptimizeListReader } from '@uniformdev/optimize-tracker-contentful';
import TalkListItem from './TalkListItem';

export default {
  name: 'TalkList',
  components: {
    Personalize,
  },
  inject: {
    talks: {
      default: () => [],
    },
  },
  props: {
    fields: {
      type: Object,
      default() {
        return {};
      },
    },
    sys: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    personalizableTalks() {
      return contentfulOptimizeListReader(this.talks);
    },
    talkListItem() {
      return TalkListItem;
    },
  },
};
</script>
