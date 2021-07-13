const nodePath = require('path');

module.exports = initialize;

function initialize(moduleOptions) {
  const { intentManifestPath, intentManifestUrl } = moduleOptions;

  // In Nuxt modules, the current Nuxt instance is available via `this.nuxt`.
  const nuxtApp = this.nuxt;

  // In Nuxt modules, Nuxt config (nuxt.config.js) is available via `this.options`.
  const nuxtConfig = this.options;

  // Add Uniform Optimize intent manifest fetcher plugins (used by the Optimize Nuxt plugin)
  addIntentManifestFetcherPlugins({
    nuxtConfig,
    intentManifestPath,
    intentManifestUrl,
    moduleContainer: this,
  });

  // Add Uniform Optimize Nuxt plugin
  this.addPlugin(nodePath.resolve(__dirname, 'uniform-optimize-nuxt-plugin.js'));

  addUniformDataHook({ nuxtApp });

  ensurePluginOrder({ nuxtApp });
}

// This function adds a `client` and `server` version of the intent manifest fetcher plugin.
// We can then fetch intent manifest data during SSR/SSG and during CSR from the downloaded
// intent manifest file instead of bundling the file into the JS artifacts.
// However, "fetching" a file during SSR/SSG requires file system reading, whereas fetching
// during CSR involves a HTTP request. That is why we need separate plugins, otherwise the
// build will fail when we try to incorporate server (node) code into the client bundle.
function addIntentManifestFetcherPlugins({
  nuxtConfig,
  intentManifestPath,
  intentManifestUrl,
  moduleContainer,
}) {
  // NOTE: by default,the intentManifest file is downloaded to `/static/intentManifest.json`
  const resolvedIntentManifestPath =
    intentManifestPath || nodePath.resolve(nuxtConfig.srcDir, nuxtConfig.dir.static, 'intentManifest.json');

  moduleContainer.addPlugin({
    src: nodePath.resolve(__dirname, 'intent-manifest-fetcher-plugin.server.js'),
    mode: 'server',
    options: {
      // The plugin `options` object is JSON.stringify'd before being made available
      // to the plugin template, so we URL encode the value to prevent any lost
      // characters during serialization/deserialization. e.g. `\\`
      intentManifestPath: encodeURIComponent(resolvedIntentManifestPath),
    },
  });

  // NOTE: by default, the intentManifest file is downloaded to `/static/intentManifest.json`
  // prior to build/export. When deployed, the file is then available at the site root.
  const resolvedIntentManifestUrl = intentManifestUrl || '/intentManifest.json';
  moduleContainer.addPlugin({
    src: nodePath.resolve(__dirname, 'intent-manifest-fetcher-plugin.client.js'),
    mode: 'client',
    options: {
      // The plugin `options` object is JSON.stringify'd before being made available
      // to the plugin template, so we URL encode the value to prevent any lost
      // characters during serialization/deserialization.
      intentManifestUrl: encodeURIComponent(resolvedIntentManifestUrl),
    },
  });
}

function addUniformDataHook({ nuxtApp }) {
  // The `vue-renderer:ssr:templateParams` hook is called immediately before the app SSR HTML template is rendered.
  // `templateParams` contains the generated template parameter values that will be used when rendering the HTML template:
  // const templateParams = {
  //   HTML_ATTRS: meta ? meta.htmlAttrs.text(renderContext.nuxt.serverRendered /* addSrrAttribute */) : '',
  //   HEAD_ATTRS: meta ? meta.headAttrs.text() : '',
  //   BODY_ATTRS: meta ? meta.bodyAttrs.text() : '',
  //   HEAD,
  //   APP,
  //   ENV: this.options.env
  // }
  nuxtApp.hook('vue-renderer:ssr:templateParams', (templateParams, renderContext) => {
    // NOTE: renderContext.req is undefined during static export and/or when the Nuxt `target` is "static".
    // renderContext.req is _only_ defined during SSR.
    if (!renderContext.req || !renderContext.req.uniformData) {
      return;
    }

    // Add a `__UNIFORM_DATA__` script tag to the outgoing HTML.
    const uniformDataScript = `<script id="__UNIFORM_DATA__" type="application/json">${JSON.stringify(
      renderContext.req.uniformData
    )}</script>`;

    // NOTE: the `APP` parameter is rendered within the `<body />` element, e.g. <body>{APP}</body>
    // So we append the Uniform data script before the closing `</body>` tag.
    templateParams.APP += uniformDataScript;
  });
}

function ensurePluginOrder({ nuxtApp }) {
  // IMPORTANT: The Uniform optimize plugin is dependent on the plugin loaded by the `cookie-universal-nuxt` module
  // and the Uniform intent manifest fetcher plugin.
  // Therefore, we need to ensure that the optimize plugin is installed after the cookie and fetcher plugins.
  // Unfortunately, Nuxt modules do not "push" plugins into the plugins-to-install array.
  // Instead, when calling `this.addPlugin` from a module, a plugin is added
  // to the  "front" of the array, i.e. `unshift`.
  // The current Nuxt-recommended approach for guaranteeing plugin install order is
  // to use the `extendPlugins` hook or `extendPlugins` config option:
  // https://nuxtjs.org/api/configuration-extend-plugins
  nuxtApp.hook('builder:extendPlugins', (plugins) => {
    // find the optimize plugin and push it to the end of the plugins array
    const optimizePluginIndex = plugins.findIndex(
      (plugin) => plugin.src && plugin.src.toLowerCase().includes('uniform-optimize-nuxt-plugin')
    );

    if (optimizePluginIndex !== -1) {
      const optimizePlugin = plugins[optimizePluginIndex];
      plugins.splice(optimizePluginIndex, 1);
      plugins.push(optimizePlugin);
    }
  });
}
