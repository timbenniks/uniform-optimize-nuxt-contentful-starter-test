import { createClient } from 'contentful';

export default ({ $config }, inject) => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID || $config.CONTENTFUL_SPACE_ID;
  if (!spaceId) {
    throw new Error('CONTENTFUL_SPACE_ID env not set.');
  }

  const cdaAccessToken = process.env.CONTENTFUL_CDA_ACCESS_TOKEN || $config.CONTENTFUL_CDA_ACCESS_TOKEN;
  if (!cdaAccessToken) {
    throw new Error('CONTENTFUL_CDA_ACCESS_TOKEN env not set.');
  }

  const environment = process.env.CONTENTFUL_ENVIRONMENT || $config.CONTENTFUL_ENVIRONMENT || 'master';

  const client = createClient({
    space: spaceId,
    accessToken: cdaAccessToken,
    environment,
  });

  const previewClient = createClient({
    space: spaceId,
    accessToken: cdaAccessToken,
    host: 'preview.contentful.com',
    environment,
  });

  const getClient = (preview) => (preview ? previewClient : client);

  const parsePage = (entry) => {
    if (!entry) {
      return null;
    }

    const { fields } = entry;

    return {
      id: entry.sys.id,
      ...fields,
    };
  };

  const getPageBySlug = (preview, slug) => {
    return getClient(preview)
      .getEntries({
        content_type: 'page',
        'fields.slug': slug,
        include: 2,
      })
      .then((entries) => {
        const [first] = entries.items;
        return parsePage(first);
      });
  };

  const getEntriesByContentType = (preview, type) => {
    return getClient(preview)
      .getEntries({
        content_type: type,
      })
      .then((entries) => entries.items);
  };

  // Use the Nuxt-provided `inject` function to inject a value into the Vue instance and Nuxt context.
  // With the following, you can then do `this.$contentful` and/or `context.$contentful` within the Nuxt app
  // and have access to the provided object (i.e. `getPageBySlug` and `getEntriesByContentType`).
  inject('contentful', {
    getPageBySlug,
    getEntriesByContentType,
  });
};
