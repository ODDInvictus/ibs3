import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function getUsers() {
  return await prisma.user.findMany({
    where: {
      isActive: true
    }
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getCommitteesWithMembers() {
  return await prisma.committee.findMany({
    where: {
      isActive: true
    },
    select: {
      CommitteeMember: true
    }
  });
}
