import db from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    committeeAliases: db.emailAliasCommittee.findMany({ include: { committee: true, alias: true } }),
    userAliases: db.emailAliasUser.findMany({ include: { user: true, alias: true } }),
    customAliases: db.emailContact.findMany({ include: { EmailAlias: true } }),
    users: db.user.findMany({ where: { isActive: true }, select: { firstName: true, lastName: true, email: true, ldapId: true, nickname: true } }),
    domain: process.env.EMAIL_DOMAIN,
  };
}) satisfies PageServerLoad;