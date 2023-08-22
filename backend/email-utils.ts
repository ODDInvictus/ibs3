import { User } from '@prisma/client'
import Email from 'email-templates'
import { Transporter, createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

const { NODE_ENV } = process.env

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
  console.error('Missing required environment variables for emailer')
}

const dev = NODE_ENV === 'development'

function log(...args: any[]) {
  console.log('[EMAILER]', ...args)
}

let emailTransport: Transporter<SMTPTransport.SentMessageInfo>

if (dev) {
  emailTransport = createTransport({
    port: 1025,
  })
} else {
  emailTransport = createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '465'),
    secure: false,
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    },
  })
}

const emailTemplateFrontend = new Email({
  message: {
    from: process.env.EMAIL_SENDER,
    replyTo: process.env.EMAIL_REPLY_TO,
  },
  send: true,
  preview: dev,
  transport: emailTransport,
})

const emailTemplateBackend = new Email({
  message: {
    from: process.env.EMAIL_BACKEND_SENDER,
    replyTo: process.env.ADMIN_EMAIL,
  },
  send: true,
  preview: dev,
  transport: emailTransport,
})


export async function sendEmailNotification(template: string, locals: Record<string, unknown>) {
  const logo = process.env.EMAIL_IBS_LOGO

  if (!logo) throw new Error('Missing EMAIL_IBS_LOGO in env')

  const l = Object.assign(locals, {
    url: process.env.IBS_URL,
    name: 'Admin',
    isAdmin: true,
    logo
  })

  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) throw new Error('Missing ADMIN_EMAIL in env')

  await emailTemplateBackend.send({
    template: template,
    message: {
      to: adminEmail,
    },
    locals: l
  }).then(() => {
    log('Email sent to admin')
  })
}

export async function sendEmailNotificationFrontend(template: string, receiver: User, locals: Record<string, unknown>) {
  const logo = process.env.EMAIL_IBS_LOGO

  if (!logo) {
    log('Missing EMAIL_IBS_LOGO in env, skipping...')
    return
  }

  const l = Object.assign(locals, {
    url: process.env.IBS_URL,
    name: receiver.firstName,
    isMember: receiver.becameMember !== null,
    logo
  })

  await emailTemplateFrontend.send({
    template: template,
    message: {
      to: `${receiver.firstName} ${receiver.lastName} <${receiver.email}>`,
    },
    locals: l
  }).then(() => {
    log('Email sent to user:', receiver.ldapId)
  })
}

type CustomEmail = {
  subject: string
  from: string
  to: string
  toName: string
  text: string
  fromName: string
  senderFirstName: string
}

export async function sendCustomEmail(mail: CustomEmail) {
  const logo = process.env.EMAIL_IBS_LOGO

  if (!logo) throw new Error('Missing EMAIL_IBS_LOGO in env')

  const l = {
    name: mail.toName,
    isCustom: true,
    logo,
    subject: mail.subject,
    content: mail.text,
    sender: mail.fromName,
    senderFirstName: mail.senderFirstName
  }

  const template = new Email({
    message: {
      from: mail.from,
      to: mail.to,
    },
    send: true,
    preview: dev,
    transport: emailTransport,
  })

  template.send({
    template: 'api',
    locals: l,
  }).then(() => {
    log(`Custom email sent from ${mail.from} to ${mail.to}`)
  })
}