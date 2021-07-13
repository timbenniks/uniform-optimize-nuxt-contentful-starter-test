import { ensureUniformOptimizeContext } from '~/modules/uniform/optimize/utils';

export default async (nuxtContext) => {
  ensureUniformOptimizeContext(nuxtContext);

  // assumes `fetch` is available in browser
  // `options.intentManifestPath` is injected via Nuxt "templated" plugin functionality.
  const intentManifest = await fetch(
    decodeURIComponent('<%= options.intentManifestUrl %>')
  ).then((response) => response.json());

  // NOTE: other $uniformOptimize plugins or modules may attach data to the Nuxt $uniformOptimize context,
  // so let's play nice and only attach what we're responsible for.
  nuxtContext.$uniformOptimize.intentManifest = intentManifest;
};
