// @ts-nocheck
import { LDAP_IDS } from '$lib/constants'
import type { Committee, User } from '.prisma/client'

const FINANCE_COMMITTEES = [LDAP_IDS.ADMINS, LDAP_IDS.FINANCIE]
// const FINANCE_COMMITTEES = [LDAP_IDS.FEUTEN]
const ADMIN_COMMITTEES = [LDAP_IDS.ADMINS, LDAP_IDS.SENAAT]

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