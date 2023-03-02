import { LDAP_IDS } from "$lib/constants";
import { PrismaClient, type User } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCommitteeMembers(ldapId: string): Promise<User[]> {
  const cm = await prisma.committeeMember.findMany({
    where: {
      committee: {
        ldapId,
      },
    },
    include: {
      member: true,
    },
  });

  return cm.map((c) => c.member);
}

export async function getFeuten(): Promise<User[]> {
  return await getCommitteeMembers(LDAP_IDS.FEUTEN);
}

export async function getMembers(): Promise<User[]> {
  return await getCommitteeMembers(LDAP_IDS.MEMBERS);
}

export async function getSenaat(): Promise<User[]> {
  return await getCommitteeMembers(LDAP_IDS.SENAAT);
}

export default prisma;
