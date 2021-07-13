import fs from 'fs';
import { promisify } from 'util';
import { ensureUniformOptimizeContext } from '~/modules/uniform/optimize/utils';

export default async (nuxtContext) => {
  ensureUniformOptimizeContext(nuxtContext);

  const readFileAsync = promisify(fs.readFile);

  // `options.intentManifestPath` is injected via Nuxt "templated" plugin functionality.
  const manifestFilePath = decodeURIComponent('<%= options.intentManifestPath %>');

  try {
    const manifestFile = await readFileAsync(manifestFilePath);
    // NOTE: other $uniform plugins or modules may attach data to the Nuxt $uniform context,
    // so let's play nice and only attach what we're responsible for.
    nuxtContext.$uniformOptimize.intentManifest = JSON.parse(manifestFile);
  } catch (err) {
    throw new Error(
      `Intent manifest fetcher encountered an error reading and parsing file: ${manifestFilePath}. \n${err}`
    );
  }
};
