import { PrismaClient } from '@prisma/client';
import { newActivitiyNotification } from './notifications';

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === 'Activity' && params.action === 'create') {
    await newActivitiyNotification(params.args.data);
  }

  return await next(params)
})


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
