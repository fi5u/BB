import * as nodemailer from 'nodemailer'
import { log } from '../../../utils/logging'

export function send({ subject, text, to }) {
  log.info('Sending email', { subject, to })

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      log.error('Error sending email', { error: error.message, info })
    } else {
      log.info('Email sent', { info })
    }
  })
}
