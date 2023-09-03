export const LDAP_IDS = {
  FEUTEN: 'feuten',
  MEMBERS: 'leden',
  SENAAT: 'senaat',
  COLOSSEUM: 'colosseum',
  ADMINS: 'ibs-admins',
  FINANCIE: 'financie'
}

export type UserRoles = {
  [key in Roles]: boolean
}

export enum Roles {
  Feuten = 'feuten',
  Members = 'leden',
  Senaat = 'senaat',
  Colosseum = 'colosseum',
  Admins = 'ibs-admins',
  FinanCie = 'financie'
}

export const UserRolesEmpty = {
  [Roles.Feuten]: false,
  [Roles.Members]: false,
  [Roles.Senaat]: false,
  [Roles.Colosseum]: false,
  [Roles.Admins]: false,
  [Roles.FinanCie]: false
}

export const LEDGER_IDS = {
	SALE_BEER: 4501,
	SALE_FOOD: 4502,
	SALE_OTHER: 4503,
	DECLARATION_GENERIC: 3100,
	DECLARATION_BEER: 3101,
	DECLARATION_FOOD: 3102
};
