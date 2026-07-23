'use server'

import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'adresse e-mail est invalide"),
  subject: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  phone: z.string().optional(),
  bot_field: z.string().optional(),
})

export type ContactState = {
  status: 'idle' | 'loading' | 'success' | 'error'
  message?: string
  errors?: Record<string, string[]>
}

export async function submitContactMessage(prevState: ContactState, formData: FormData): Promise<ContactState> {
  const data = Object.fromEntries(formData.entries())
  
  const validatedFields = contactSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs dans le formulaire."
    }
  }

  // Honeypot check for bots
  if (validatedFields.data.bot_field) {
    // Silently succeed
    return {
      status: 'success',
      message: "Votre message a bien été envoyé !"
    }
  }

  const { firstName, lastName, email, subject, message, phone } = validatedFields.data

  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'marcienbalouboula@gmail.com', // Must be the verified email on Resend for free tier
      replyTo: email,
      subject: `Nouveau message de ${firstName} ${lastName} : ${subject}`,
      html: `
        <h2>Nouveau message depuis le Portfolio</h2>
        <p><strong>De:</strong> ${firstName} ${lastName} (${email})</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
        <p><strong>Sujet:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `
    })

    if (error) {
      console.error("Resend error:", error)
      return {
        status: 'error',
        message: "Une erreur est survenue lors de l'envoi de l'email."
      }
    }

    return {
      status: 'success',
      message: "Votre message a bien été envoyé !"
    }
  } catch (error) {
    console.error("Failed to send email:", error)
    return {
      status: 'error',
      message: "Une erreur inattendue est survenue."
    }
  }
}
