import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    committeeAliases: await db.emailAliasCommittee.findMany({ include: { committee: true, alias: true } }),
    userAliases: await db.emailAliasUser.findMany({ include: { user: true, alias: true } }),
    customAliases: await db.emailContact.findMany({ include: { EmailAlias: true } }),
    domain: process.env.EMAIL_DOMAIN,
  };
}) satisfies PageServerLoad;