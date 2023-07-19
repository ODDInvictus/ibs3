import { createTransport } from 'nodemailer'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
  console.error('Missing required environment variables for emailer')
}

const transporter = createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '465'),
  secure: false,
  tls: {
    ciphers: 'SSLv3'
  },
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD
  }
})

export async function sendEmailNotification(title: string, text: string, receiver: string) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_BACKEND_SENDER,
    to: receiver,
    subject: title,
    text: text
  })

  console.log(`Email sent to ${receiver}: ${info.messageId}`)
}

export async function sendEmailNotificationFrontend(title: string, text: string, receiver: string) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: receiver,
    subject: title,
    text: text
  })

  console.log(`Email sent to ${receiver}: ${info.messageId}`)
}