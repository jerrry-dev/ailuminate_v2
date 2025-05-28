import { MailerSend, EmailParams, Sender, Recipient } from "mailersend"

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
})

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@ailuminate.com"
const FROM_NAME = "Ailuminate"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function sendVerificationEmail(email: string, username: string, token: string) {
  const verificationLink = `${APP_URL}/auth/verify-email?token=${token}`

  const sentFrom = new Sender(FROM_EMAIL, FROM_NAME)
  const recipients = [new Recipient(email, username)]

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Verify your email address")
    .setHtml(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6d28d9;">Welcome to Ailuminate!</h2>
        <p>Hi ${username},</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Ailuminate Team</p>
      </div>
    `)
    .setText(`
      Welcome to Ailuminate!
      
      Hi ${username},
      
      Thank you for signing up. Please verify your email address by clicking the link below:
      
      ${verificationLink}
      
      If you didn't create an account, you can safely ignore this email.
      
      This link will expire in 24 hours.
      
      Best regards,
      The Ailuminate Team
    `)

  try {
    await mailerSend.email.send(emailParams)
    return true
  } catch (error) {
    console.error("Error sending verification email:", error)
    return false
  }
}

export async function sendPasswordResetEmail(email: string, username: string, token: string) {
  const resetLink = `${APP_URL}/auth/reset-password?token=${token}`

  const sentFrom = new Sender(FROM_EMAIL, FROM_NAME)
  const recipients = [new Recipient(email, username)]

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Reset your password")
    .setHtml(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6d28d9;">Reset Your Password</h2>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Ailuminate Team</p>
      </div>
    `)
    .setText(`
      Reset Your Password
      
      Hi ${username},
      
      We received a request to reset your password. Click the link below to create a new password:
      
      ${resetLink}
      
      If you didn't request a password reset, you can safely ignore this email.
      
      This link will expire in 1 hour.
      
      Best regards,
      The Ailuminate Team
    `)

  try {
    await mailerSend.email.send(emailParams)
    return true
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return false
  }
}

export async function sendWelcomeEmail(email: string, username: string) {
  const sentFrom = new Sender(FROM_EMAIL, FROM_NAME)
  const recipients = [new Recipient(email, username)]

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Welcome to Ailuminate!")
    .setHtml(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6d28d9;">Welcome to Ailuminate!</h2>
        <p>Hi ${username},</p>
        <p>Thank you for verifying your email address. Your account is now fully activated!</p>
        <p>You can now start creating and sharing amazing content with our community.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${APP_URL}/dashboard" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to Dashboard</a>
        </div>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Best regards,<br>The Ailuminate Team</p>
      </div>
    `)
    .setText(`
      Welcome to Ailuminate!
      
      Hi ${username},
      
      Thank you for verifying your email address. Your account is now fully activated!
      
      You can now start creating and sharing amazing content with our community.
      
      Visit your dashboard: ${APP_URL}/dashboard
      
      If you have any questions or need assistance, feel free to contact our support team.
      
      Best regards,
      The Ailuminate Team
    `)

  try {
    await mailerSend.email.send(emailParams)
    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}
