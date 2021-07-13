import Vue from 'vue';
import { UniformOptimizePlugin } from '@uniformdev/optimize-tracker-vue';
import { createDefaultTracker } from '@uniformdev/optimize-tracker-browser';
import { cookieScoringStorage } from '@uniformdev/optimize-tracker';
import { indexedDbScopeStorage } from '@uniformdev/optimize-tracker-storage-indexeddb';
import { Analytics } from 'analytics';
import googleAnalyticsPlugin from '@analytics/google-analytics';
import segmentPlugin from '@analytics/segment';
import { addAnalyticsPlugin } from '@uniformdev/optimize-tracker-analytics';

// NOTE: this plugin depends on `cookie-universal-nuxt` module: https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt
export default async (nuxtContext, inject) => {
  // NOTE: `req` is only defined during SSR
  const { $cookies, req, $config, $uniformOptimize } = nuxtContext;

  const intentManifest = $uniformOptimize.intentManifest;

  if (req) {
    // During SSR, Nuxt plugins are invoked for each request/render.
    // Therefore, the following code will run on each request.

    const { trackerInstance: serverTracker } = createLocalTracker({
      intentManifest,
      cookiesApi: $cookies,
      nuxtEnv: $config,
    });
    await serverTracker.initialize();

    const trackerRequestContext = getTrackerRequestContext(req);
    const { signalMatches, scoring } = await serverTracker.reevaluateSignals(trackerRequestContext);

    // Attach `signalMatches` and `scoring` data to the `req` object so those data
    // can be used by other Nuxt hooks.
    // For instance, serializing the data to `__UNIFORM_DATA__` script variable so that
    // the tracker can hydrate after SSR.
    req.uniformData = { matches: signalMatches, scoring };

    // Nuxt appears to re-use the same `Vue` instance in between requests/renders for
    // as long as the SSR server is running (this behavior is a bit unexpected).
    // This means any plugin add via `Vue.use` will _not_ be installed/initialized after
    // the first SSR request/render.
    // However, we need to ensure that the Optimize plugin "context" value is updated
    // on every request.
    // Therefore, we check for whether the Optimize plugin is installed and if so, we update it.
    // Otherwise, we install it via `Vue.use()`.

    const pluginOptions = {
      trackerInstance: serverTracker,
      isServer: true,
      initialIntentScores: scoring,
    };

    const optimizePlugin = Vue._installedPlugins.find((plugin) => plugin.key === UniformOptimizePlugin.key);
    if (optimizePlugin) {
      optimizePlugin.update(Vue, pluginOptions);
    } else {
      Vue.use(UniformOptimizePlugin, pluginOptions);
    }
  } else {
    // On the client, Nuxt plugins are only called on initial page load.
    // i.e. this code will not be called on client-side route change (which is what we want).
    const { trackerInstance: clientTracker, analytics } = createLocalTracker({
      intentManifest,
      cookiesApi: $cookies,
      nuxtEnv: $config,
    });
    await clientTracker.initialize();

    Vue.use(UniformOptimizePlugin, {
      trackerInstance: clientTracker,
      isServer: false,
    });
    inject('uniformOptimizeTrackerAnalytics', analytics);
  }
};

function createNuxtCookieStorage(cookiesApi) {
  const cookieStorage = cookieScoringStorage({
    getCookie: (name) => {
      const cookieValue = cookiesApi.get(name, { parseJSON: false });
      return cookieValue;
    },

    setCookie: (name, value) => {
      if (typeof window === 'undefined') {
        return;
      }

      cookiesApi.set(name, value, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        sameSite: 'strict',
        secure: window.location.protocol === 'https:',
      });
    },
  });

  return cookieStorage;
}

function createLocalTracker({ intentManifest, cookiesApi, nuxtEnv }) {
  const plugins = [];

  const gaId = process.env.GA_UA_ID || nuxtEnv.GA_UA_ID;
  if (gaId) {
    plugins.push(
      googleAnalyticsPlugin({
        trackingId: gaId,
        customDimensions: {
          strongestIntentMatch: 'dimension1',
          allIntentMatches: 'dimension2',
        },
      })
    );
  }

  const segmentId = process.env.SEGMENT_ID || nuxtEnv.SEGMENT_ID;
  if (segmentId) {
    plugins.push(
      segmentPlugin({
        writeKey: segmentId,
      })
    );
  }

  const analytics = Analytics({
    app: 'Uniform Optimize Nuxt.js Example',
    debug: true,
    plugins,
  });

  const trackerInstance = createDefaultTracker({
    intentManifest,
    addPlugins: [addAnalyticsPlugin({ analytics })],
    storage: {
      scopes: indexedDbScopeStorage({
        scoringStorage: createNuxtCookieStorage(cookiesApi),
      }),
    },
    // During static export, we want to prevent the tracker from adding noise to the log (unless there's an error).
    // Otherwise, allow the tracker to be as chatty as you want.
    logLevelThreshold: process.static && !process.client ? 'error' : 'info',
  });
  return { analytics, trackerInstance };
}

function getTrackerRequestContext(req) {
  return {
    url: 'https://' + req.headers.host + req.url,
    cookies: req.headers.cookie,
    userAgent: req.headers['user-agent'],
  };
}
