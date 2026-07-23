'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { submitContactMessage, ContactState } from '@/lib/actions/contact'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"

interface ContactFormProps {
  lang: string;
}

const initialState: ContactState = {
  status: 'idle',
}

export function ContactForm({ lang }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (state.status === 'success') {
      if (formRef.current) formRef.current.reset()
      setShowSuccess(true)
      
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 60000) // 1 minute
      
      return () => clearTimeout(timer)
    }
  }, [state]) // Use the entire state object to re-trigger even if status remains 'success'

  const handleSubmit = (formData: FormData) => {
    setShowSuccess(false) // Hide message immediately when starting a new submission
    formAction(formData)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-8 relative z-10">
      
      {state.status === 'success' && showSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 flex items-center gap-3 transition-opacity duration-500 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm">{state.message}</p>
        </div>
      )}

      {state.status === 'error' && state.message && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
          <p className="text-sm">{state.message}</p>
        </div>
      )}

      {/* Honeypot field (hidden) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input type="text" name="bot_field" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="firstName" className="text-gray-200 text-sm tracking-wide uppercase font-mono">
            {lang === 'en' ? 'First Name' : 'Prénom'}
          </Label>
          <Input 
            id="firstName" 
            name="firstName"
            placeholder="John" 
            required
            className={`bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1 ${state.errors?.firstName ? 'ring-1 ring-red-500' : ''}`} 
          />
          {state.errors?.firstName && <p className="text-xs text-red-500">{state.errors.firstName[0]}</p>}
        </div>
        <div className="space-y-3">
          <Label htmlFor="lastName" className="text-gray-200 text-sm tracking-wide uppercase font-mono">
            {lang === 'en' ? 'Last Name' : 'Nom'}
          </Label>
          <Input 
            id="lastName" 
            name="lastName"
            placeholder="Doe" 
            required
            className={`bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1 ${state.errors?.lastName ? 'ring-1 ring-red-500' : ''}`} 
          />
          {state.errors?.lastName && <p className="text-xs text-red-500">{state.errors.lastName[0]}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-200 text-sm tracking-wide uppercase font-mono">
            {lang === 'en' ? 'Email Address' : 'Adresse e-mail'}
          </Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="john.doe@exemple.com" 
            required
            className={`bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1 ${state.errors?.email ? 'ring-1 ring-red-500' : ''}`} 
          />
          <p className="text-xs text-gray-400 mt-1">
            {lang === 'en' ? 'Double check your email so I can reply.' : 'Vérifiez bien votre adresse pour que je puisse vous recontacter.'}
          </p>
          {state.errors?.email && <p className="text-xs text-red-500">{state.errors.email[0]}</p>}
        </div>
        <div className="space-y-3">
          <Label htmlFor="phone" className="text-gray-200 text-sm tracking-wide uppercase font-mono">
            {lang === 'en' ? 'Phone (optional)' : 'Téléphone (optionnel)'}
          </Label>
          <Input 
            id="phone" 
            name="phone"
            type="tel"
            placeholder={lang === 'en' ? "+1 234 567 890" : "06 12 34 56 78"} 
            className="bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1" 
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="subject" className="text-gray-200 text-sm tracking-wide uppercase font-mono">
          {lang === 'en' ? 'Subject' : 'Sujet'}
        </Label>
        <Input 
          id="subject" 
          name="subject"
          placeholder={lang === 'en' ? "Collaboration proposal..." : "Proposition de collaboration..."} 
          required
          className={`bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 h-12 rounded-xl focus-visible:ring-primary focus-visible:ring-1 ${state.errors?.subject ? 'ring-1 ring-red-500' : ''}`} 
        />
        {state.errors?.subject && <p className="text-xs text-red-500">{state.errors.subject[0]}</p>}
      </div>

      <div className="space-y-3">
        <Label htmlFor="message" className="text-gray-200 text-sm tracking-wide uppercase font-mono">
          {lang === 'en' ? 'Message' : 'Message'}
        </Label>
        <Textarea 
          id="message" 
          name="message"
          placeholder={lang === 'en' ? "Tell me more about your needs..." : "Dites-m'en plus sur votre besoin..."} 
          required
          className={`bg-[#222] border-none text-[#F5F5F7] placeholder:text-gray-500 min-h-[160px] rounded-xl focus-visible:ring-primary focus-visible:ring-1 resize-none ${state.errors?.message ? 'ring-1 ring-red-500' : ''}`}
        />
        {state.errors?.message && <p className="text-xs text-red-500">{state.errors.message[0]}</p>}
      </div>

      <Button 
        type="submit" 
        size="lg" 
        disabled={isPending}
        className="w-full sm:w-auto px-10 h-14 rounded-full text-base font-medium shadow-lg hover:-translate-y-1 transition-transform group disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {lang === 'en' ? 'Sending...' : 'Envoi en cours...'}
          </>
        ) : (
          <>
            {lang === 'en' ? 'Send Message' : 'Envoyer le message'}
            <div className="ml-2 w-2 h-2 rounded-full bg-white group-hover:animate-ping" />
          </>
        )}
      </Button>
    </form>
  )
}
