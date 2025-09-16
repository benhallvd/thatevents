"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { createBrevoContact } from "@/app/actions"
import { useActionState } from "react"
import { hashData, formatPhoneForMeta } from "@/lib/pixel-utils"
import { useToast } from "@/components/ui/use-toast"
import type { Event } from "@/lib/supabase/types"

// Function to clean and format phone number
function cleanPhoneNumber(phoneNumber: string, countryCode: string): string {
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, "")

  // Remove any existing country codes from the beginning
  const countryCodes = ["+44", "+1", "+33", "+49"]
  for (const code of countryCodes) {
    if (cleaned.startsWith(code)) {
      cleaned = cleaned.substring(code.length)
    }
  }

  // Remove any leading + or 0
  cleaned = cleaned.replace(/^[+0]+/, "")

  // Return the country code + cleaned number
  return countryCode + cleaned
}

export default function EventSignupForm({ event }: { event: Event }) {
  const [state, formAction, isPending] = useActionState(createBrevoContact, null)
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+44")
  const [optIn, setOptIn] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (state) {
      if (state.success && state.redirect) {
        router.push(`/${event.slug}/thank-you`)
      } else if (!state.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: state.message || "Something went wrong. Please try again.",
        })
      }
    }
  }, [state, router, toast, event.slug])

  const handleFormSubmit = async () => {
    if (typeof window !== "undefined" && window.fbq && email && phoneNumber) {
      try {
        const cleanedPhone = cleanPhoneNumber(phoneNumber, countryCode)
        const hashedEmail = await hashData(email)
        const formattedPhone = formatPhoneForMeta(cleanedPhone)
        const hashedPhone = await hashData(formattedPhone)

        window.fbq("track", "Lead", {
          content_name: event.title,
          content_category: "Event Registration",
          em: hashedEmail,
          ph: hashedPhone,
          event_name: event.title,
          event_location: event.location,
          event_time: Math.floor(Date.now() / 1000),
        })
      } catch (error) {
        console.error("Error tracking Meta Pixel event:", error)
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={event.background_image_url || "/images/90s-concert-bg.png"}
          alt={`${event.title} Background`}
          fill
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 md:p-8 space-y-6">
            <div className="w-full mb-6 flex justify-center">
              <div className="w-full max-w-sm">
                <Image
                  src={event.logo_image_url || "/images/90s-event-new-bg.png"}
                  alt={`${event.title} Logo`}
                  width={400}
                  height={200}
                  className="w-full h-auto object-cover rounded-xl"
                  priority
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="md:text-2xl font-bold text-white text-2xl">{event.title}</h1>
              <p className="text-gray-300 md:text-sm leading-relaxed text-sm">{event.description}</p>
            </div>

            <form action={formAction} onSubmit={handleFormSubmit} className="space-y-6">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="phoneNumber" value={cleanPhoneNumber(phoneNumber, countryCode)} />
              <input type="hidden" name="optIn" value={optIn.toString()} />
              <input type="hidden" name="brevoListId" value={event.brevo_list_id.toString()} />

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-0 text-gray-900 placeholder:text-gray-500 h-12 text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="phone" className="text-white text-sm font-medium">
                    Phone Number*
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-cyan-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          Enter your phone number without the country code.
                          <br />
                          Example: 7123456789
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-20 bg-white border-0 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="+44">+44</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+33">+33</SelectItem>
                      <SelectItem value="+49">+49</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex-1 relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="7123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="bg-white border-0 text-gray-900 placeholder:text-gray-500 h-12 text-sm pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">SMS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white text-sm font-medium">Opt-In*</Label>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="opt-in"
                    checked={optIn}
                    onCheckedChange={(checked) => setOptIn(checked as boolean)}
                    className="mt-0.5 border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                  />
                  <Label htmlFor="opt-in" className="leading-relaxed cursor-pointer text-xs text-gray-300 font-light">
                    I agree to receive your newsletters and accept the{" "}
                    <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                      data privacy statement
                    </Link>
                    .
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-md text-sm uppercase tracking-wide h-12 disabled:opacity-50"
                disabled={!email || !phoneNumber || !optIn || isPending}
              >
                {isPending ? "SIGNING UP..." : "SIGN UP"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
