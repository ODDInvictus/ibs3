import { sendEmailNotificationFrontend } from '../email-utils';
import { prisma } from '../prisma';

export async function testEmailTemplate() {
  console.log('Testing email template')

  const u = await prisma.user.findFirstOrThrow({
    where: {
      id: 1
    }
  })

  await sendEmailNotificationFrontend('strafbakken-doubled', u, {
    bakken: 44
  })
}