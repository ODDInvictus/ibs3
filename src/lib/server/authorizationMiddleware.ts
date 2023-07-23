import { LDAP_IDS } from '$lib/constants'

const FINANCE_COMMITTEES = [LDAP_IDS.ADMINS, LDAP_IDS.FINANCIE]
const ADMIN_COMMITTEES = [LDAP_IDS.ADMINS, LDAP_IDS.SENAAT]
const USER_COMMITTEES = [LDAP_IDS.FEUTEN, LDAP_IDS.MEMBERS]

export function authFinance(locals: App.Locals): [boolean, string[]] {
  if (!locals.committees) return [false, FINANCE_COMMITTEES]

  for (const committee of locals.committees) {
    if (FINANCE_COMMITTEES.includes(committee.ldapId)) return [true, FINANCE_COMMITTEES]
  }

  return [false, FINANCE_COMMITTEES]
}

export function authAdmin(locals: App.Locals): [boolean, string[]] {
  if (!locals.committees) return [false, ADMIN_COMMITTEES]

  for (const committee of locals.committees) {
    if (ADMIN_COMMITTEES.includes(committee.ldapId)) return [true, ADMIN_COMMITTEES]
  }

  return [false, ADMIN_COMMITTEES]
}

export function authUser(locals: App.Locals): [boolean, string[]] {
  if (!locals.committees) return [false, USER_COMMITTEES]

  for (const committee of locals.committees) {
    if (USER_COMMITTEES.includes(committee.ldapId)) return [true, USER_COMMITTEES]
  }

  return [false, USER_COMMITTEES]
}