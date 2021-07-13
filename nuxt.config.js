const nuxtConfig = {
  // Target (https://go.nuxtjs.dev/config-target)
  // default to `server` unless the `NUXT_BUILD_TARGET` var has been defined.
  target: process.env.NUXT_BUILD_TARGET || 'server',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'UniformConf',
    description: 'UniformConf, a Uniform Optimize demo site',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'UniformConf, a Uniform Optimize demo site' },
      { hid: 'og:description', name: 'og:description', content: 'UniformConf, a Uniform Optimize demo site' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'uniformconf.com' },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'UniformConf',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: '~/plugins/contentful-nuxt-plugin.js',
      // For statically exported sites, we only want the contentful plugin to be loaded
      // during the export process. After export, the plugin should not be available on the client
      // because then we have to expose Contentful access tokens to the client.
      mode: process.env.NUXT_BUILD_TARGET === 'static' ? 'server' : undefined,
    },
    '~/plugins/preview.client.js',
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'cookie-universal-nuxt',
    '~/modules/uniform/optimize/initialize.js',
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  publicRuntimeConfig: {
    GA_UA_ID: process.env.GA_UA_ID,
    SEGMENT_ID: process.env.SEGMENT_ID,
  },
  generate: {
    crawler: false,
    routes: ['/', '/developers', '/marketers', '/registration'],
    fallback: true,
    dir: 'out',
  },
};

// If the build target is _not_ for static export, then add Contentful vars
// to the `publicRuntimeConfig` object. This allows local Nuxt dev to function
// as expected during client-side routing because the Contentful plugin
// will be executing client-side in local dev. Clunky, but it works.
if (process.env.NUXT_BUILD_TARGET !== 'static') {
  nuxtConfig.publicRuntimeConfig = {
    ...nuxtConfig.publicRuntimeConfig,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
  };
}

export default nuxtConfig;
