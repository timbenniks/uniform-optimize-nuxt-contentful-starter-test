/** Ensures that `$uniformOptimize` is defined on the Nuxt context object */
export function ensureUniformOptimizeContext(nuxtContext) {
  if (!nuxtContext.$uniformOptimize) {
    nuxtContext.$uniformOptimize = {};
  }
}
