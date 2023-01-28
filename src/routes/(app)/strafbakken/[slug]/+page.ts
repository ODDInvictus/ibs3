import type { PageLoad } from './$types';

export const load = (({params}) => {
  return {
    username: params.slug,
  }
}) satisfies PageLoad